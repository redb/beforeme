import { extractCandidates } from "../../src/server/candidates/extractCandidates";
import { enrichSources } from "../../src/server/candidates/enrichSources";
import { rankImpact } from "../../src/server/candidates/rankImpact";
import type { RankedCandidate } from "../../src/server/candidates/types";

type R2BucketLike = {
  get(key: string): Promise<{ json(): Promise<unknown> } | null>;
  put(
    key: string,
    value: string,
    options?: { httpMetadata?: { contentType?: string; cacheControl?: string } }
  ): Promise<void>;
};

type Env = {
  R2?: R2BucketLike;
};

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;
const MEMORY_CACHE_TTL_MS = 10 * 60 * 1000;
const R2_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const rateState = new Map<string, { count: number; resetAt: number }>();
const memoryCache = new Map<string, { ts: number; payload: RankedPayload }>();

type RankedPayload = {
  year: number;
  country_qid: string;
  lang: "fr" | "en";
  generated_at: string;
  items: RankedCandidate[];
};

function headers(contentType = "application/json; charset=utf-8"): HeadersInit {
  return {
    "content-type": contentType,
    "cache-control": "no-store",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,OPTIONS",
    "access-control-allow-headers": "content-type"
  };
}

function json(status: number, payload: unknown): Response {
  return new Response(JSON.stringify(payload), { status, headers: headers() });
}

function log(event: string, payload: Record<string, unknown>) {
  console.log(JSON.stringify({ level: "info", event, ts: new Date().toISOString(), ...payload }));
}

function parseYear(raw: string | null): number | null {
  const value = Number(raw);
  return Number.isInteger(value) && value >= 1000 && value <= 2100 ? value : null;
}

function parseLang(raw: string | null): "fr" | "en" {
  return String(raw || "fr").toLowerCase().startsWith("fr") ? "fr" : "en";
}

function parseCountryQid(raw: string | null): string | null {
  const value = String(raw || "Q142").trim().toUpperCase();
  if (/^Q\d+$/.test(value)) return value;
  if (value === "FR") return "Q142";
  if (value === "US") return "Q30";
  if (value === "CA") return "Q16";
  if (value === "BR") return "Q155";
  if (value === "MG") return "Q1019";
  if (value === "DE") return "Q183";
  if (value === "ES") return "Q29";
  if (value === "IT") return "Q38";
  if (value === "GB" || value === "UK") return "Q145";
  return null;
}

function parseLimit(raw: string | null): number {
  const value = Number(raw);
  if (!Number.isInteger(value)) return 20;
  return Math.min(50, Math.max(1, value));
}

function parseRefresh(raw: string | null): boolean {
  const value = String(raw || "").trim().toLowerCase();
  return value === "1" || value === "true" || value === "yes";
}

function rateKey(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for") ||
    "unknown"
  );
}

function checkRateLimit(request: Request): { allowed: true } | { allowed: false; retryAfterMs: number } {
  const key = rateKey(request);
  const now = Date.now();
  const current = rateState.get(key);
  if (!current || current.resetAt <= now) {
    rateState.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }
  if (current.count >= RATE_LIMIT_MAX) {
    return { allowed: false, retryAfterMs: current.resetAt - now };
  }
  current.count += 1;
  return { allowed: true };
}

function r2CacheKey(year: number, countryQid: string, lang: "fr" | "en"): string {
  return `candidates/v3/${countryQid}/${year}/${lang}.json`;
}

function cacheKey(year: number, countryQid: string, lang: "fr" | "en", limit: number): string {
  return `${year}|${countryQid}|${lang}|${limit}`;
}

function pickTop(items: RankedCandidate[], limit: number): RankedCandidate[] {
  return items.slice(0, limit);
}

async function readR2Cache(env: Env, key: string, limit: number): Promise<RankedPayload | null> {
  if (!env.R2) return null;
  try {
    const object = await env.R2.get(key);
    if (!object) return null;
    const parsed = (await object.json()) as RankedPayload | null;
    if (!parsed || !Array.isArray(parsed.items)) return null;
    if (parsed.items.length === 0) return null;
    const ts = Date.parse(String(parsed.generated_at || ""));
    if (!Number.isFinite(ts) || Date.now() - ts > R2_CACHE_TTL_MS) return null;
    return { ...parsed, items: pickTop(parsed.items, limit) };
  } catch {
    return null;
  }
}

async function writeR2Cache(env: Env, key: string, payload: RankedPayload): Promise<void> {
  if (!env.R2) return;
  await env.R2.put(key, JSON.stringify(payload), {
    httpMetadata: {
      contentType: "application/json; charset=utf-8",
      cacheControl: "public, max-age=86400"
    }
  });
}

async function computeRankedPayload(params: {
  requestUrl: URL;
  year: number;
  countryQid: string;
  lang: "fr" | "en";
  limit: number;
}): Promise<RankedPayload> {
  const start = Date.now();
  const timeoutMs =
    params.requestUrl.hostname === "127.0.0.1" ||
    params.requestUrl.hostname === "localhost" ||
    params.requestUrl.hostname.endsWith(".local")
      ? 12_000
      : 25_000;

  const extracted = await extractCandidates({
    baseUrl: `${params.requestUrl.protocol}//${params.requestUrl.host}`,
    year: params.year,
    countryQid: params.countryQid,
    timeoutMs,
    retries: 2
  });

  log("candidates_extracted", {
    year: params.year,
    country: params.countryQid,
    count: extracted.items.length,
    source_mix: extracted.sourceMix,
    durationMs: Date.now() - start
  });

  const withSources = enrichSources(extracted.items);
  const ranked = rankImpact(withSources);
  const items = pickTop(ranked, params.limit);

  const totals = items.map((item) => item.score.total);
  log("candidates_ranked", {
    year: params.year,
    country: params.countryQid,
    topQids: items.slice(0, 5).map((item) => item.qid),
    scoreStats: {
      min: totals.length ? Math.min(...totals) : 0,
      max: totals.length ? Math.max(...totals) : 0,
      avg: totals.length ? Math.round(totals.reduce((sum, n) => sum + n, 0) / totals.length) : 0
    }
  });

  return {
    year: params.year,
    country_qid: params.countryQid,
    lang: params.lang,
    generated_at: new Date().toISOString(),
    items
  };
}

export async function onRequestOptions(): Promise<Response> {
  return new Response(null, { status: 204, headers: headers("text/plain; charset=utf-8") });
}

export async function onRequestGet(context: { request: Request; env: Env }): Promise<Response> {
  const requestUrl = new URL(context.request.url);
  const year = parseYear(requestUrl.searchParams.get("year"));
  const countryQid = parseCountryQid(requestUrl.searchParams.get("country"));
  const lang = parseLang(requestUrl.searchParams.get("lang"));
  const limit = parseLimit(requestUrl.searchParams.get("limit"));
  const refresh = parseRefresh(requestUrl.searchParams.get("refresh"));

  if (!year || !countryQid) {
    return json(400, { error: "invalid_params", message: "Expected year and country." });
  }

  const limiter = checkRateLimit(context.request);
  if (!limiter.allowed) {
    const retryAfterMs = "retryAfterMs" in limiter ? limiter.retryAfterMs : RATE_LIMIT_WINDOW_MS;
    return json(429, { error: "rate_limited", retryAfterMs });
  }

  const memKey = cacheKey(year, countryQid, lang, limit);
  const r2Key = r2CacheKey(year, countryQid, lang);

  if (!refresh) {
    const inMemory = memoryCache.get(memKey);
    if (inMemory && Date.now() - inMemory.ts < MEMORY_CACHE_TTL_MS) {
      return json(200, inMemory.payload);
    }
    const inR2 = await readR2Cache(context.env, r2Key, limit);
    if (inR2) {
      memoryCache.set(memKey, { ts: Date.now(), payload: inR2 });
      return json(200, inR2);
    }
  }

  try {
    const payload = await computeRankedPayload({
      requestUrl,
      year,
      countryQid,
      lang,
      limit
    });

    memoryCache.set(memKey, { ts: Date.now(), payload });
    await writeR2Cache(context.env, r2Key, payload);
    return json(200, payload);
  } catch (error) {
    const message = String(error instanceof Error ? error.message : "upstream_error");
    if (message.includes("upstream_timeout")) {
      return json(504, { error: "upstream_timeout" });
    }
    if (message.startsWith("http_")) {
      return json(502, { error: "upstream_failed", detail: message });
    }
    return json(502, { error: "ranked_candidates_failed", detail: message });
  }
}
