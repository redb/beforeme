import { listNotableBirthsForYear } from "../../src/content/notableBirths";
import type { EditorialTheme } from "../../src/content/editorialTheme";
import { normalizeEditorialTheme, parseSeenThemes } from "../../src/content/editorialTheme";
import { parseCsvList } from "../../src/lib/parseCsv";

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

type NotableBornItem = {
  qid: string;
  label: string;
  birthDate: string;
  deathDate?: string;
  wikipediaUrl: string;
  sitelinks: number;
  theme: EditorialTheme;
  gestureRoot: string;
  editorialScore: number;
  achievement?: string;
};

type NotableBornPayload = {
  year: number;
  lang: "fr" | "en";
  generated_at: string;
  items: NotableBornItem[];
};

const WDQS_ENDPOINT = "https://query.wikidata.org/sparql";
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;
const MEMORY_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const R2_CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;

const rateState = new Map<string, { count: number; resetAt: number }>();
const memoryCache = new Map<string, { ts: number; payload: NotableBornPayload }>();

function headers(contentType = "application/json; charset=utf-8"): HeadersInit {
  return {
    "content-type": contentType,
    "cache-control": "public, max-age=3600",
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

function parseLimit(raw: string | null): number {
  const value = Number(raw);
  if (!Number.isInteger(value)) return 3;
  return Math.min(10, Math.max(1, value));
}

function rateKey(request: Request): string {
  return request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "unknown";
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

function cacheKey(year: number, lang: "fr" | "en", limit: number): string {
  return `${year}|${lang}|${limit}`;
}

function r2CacheKey(year: number, lang: "fr" | "en", limit: number): string {
  return `notable-born/v5/${lang}/${year}/${limit}.json`;
}

function buildSparqlQuery(year: number, lang: "fr" | "en", limit: number): string {
  const wikiHost = lang === "fr" ? "https://fr.wikipedia.org/" : "https://en.wikipedia.org/";
  const fallbackWikiHost = lang === "fr" ? "https://en.wikipedia.org/" : "https://fr.wikipedia.org/";
  return `
SELECT ?item ?itemLabel ?birthDate ?deathDate ?article ?sitelinks WHERE {
  ?item wdt:P31 wd:Q5 ;
        wdt:P569 ?birthDate .
  FILTER(YEAR(?birthDate) = ${year})

  OPTIONAL { ?item wdt:P570 ?deathDate . }

  OPTIONAL {
    ?primaryArticle schema:about ?item ;
                    schema:isPartOf <${wikiHost}> .
  }
  OPTIONAL {
    ?fallbackArticle schema:about ?item ;
                     schema:isPartOf <${fallbackWikiHost}> .
  }
  BIND(COALESCE(?primaryArticle, ?fallbackArticle) AS ?article)
  FILTER(BOUND(?article))

  OPTIONAL { ?item wikibase:sitelinks ?sitelinks . }

  SERVICE wikibase:label { bd:serviceParam wikibase:language "${lang},en". }
}
ORDER BY DESC(COALESCE(?sitelinks, 0))
LIMIT ${limit}
`.trim();
}

async function fetchJsonWithTimeout(url: string, init: RequestInit, timeoutMs: number): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    if (!response.ok) {
      throw new Error(`http_${response.status}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

function parseQidFromUri(uri: string): string {
  const match = String(uri || "").match(/Q\d+$/);
  return match ? match[0] : "";
}

function inferThemeFromLabel(label: string): EditorialTheme {
  const normalized = String(label || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  if (/(acteur|actrice|chanteur|chanteuse|realisateur|realisatrice|ecrivain|auteur|romancier|poete|sportif|sportive|joueur|joueuse|musicien|musicienne)/.test(normalized)) return "loisirs";
  if (/(homme politique|femme politique|president|président|premier ministre|ministre|depute|député|senateur|sénateur|maire|politicien)/.test(normalized)) return "administration";
  if (/(scientifique|ingenieur|ingénieur|physicien|chimiste|mathematicien|mathématicien|inventeur|chercheur)/.test(normalized)) return "travail";
  return "loisirs";
}

function inferCategoryRoot(label: string): string {
  const normalized = String(label || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  if (/(acteur|actrice)/.test(normalized)) return "acteur";
  if (/(chanteur|chanteuse|musicien|musicienne)/.test(normalized)) return "chanteur";
  if (/(realisateur|realisatrice)/.test(normalized)) return "realisateur";
  if (/(sportif|sportive|joueur|joueuse)/.test(normalized)) return "sportif";
  if (/(homme politique|femme politique|president|président|premier ministre|ministre|depute|député|senateur|sénateur|maire|politicien)/.test(normalized)) return "politique";
  if (/(scientifique|physicien|chimiste|chercheur)/.test(normalized)) return "scientifique";
  if (/(ingenieur|ingénieur|inventeur)/.test(normalized)) return "ingenieur";
  if (/(ecrivain|auteur|romancier|poete)/.test(normalized)) return "ecrivain";
  return normalized.replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "personnalite";
}

function parseItems(payload: unknown): NotableBornItem[] {
  const parsed = payload as {
    results?: {
      bindings?: Array<Record<string, { value?: string }>>;
    };
  };
  const bindings = Array.isArray(parsed.results?.bindings) ? parsed.results.bindings : [];
  const items: NotableBornItem[] = [];

  for (const row of bindings) {
    const qid = parseQidFromUri(row.item?.value || "");
    const label = String(row.itemLabel?.value || "").trim();
    const birthDate = String(row.birthDate?.value || "").trim();
    const wikipediaUrl = String(row.article?.value || "").trim();
    const deathDate = String(row.deathDate?.value || "").trim();
    const sitelinks = Number(row.sitelinks?.value || 0);

    if (!qid || !label || !birthDate || !wikipediaUrl) {
      continue;
    }

    items.push({
      qid,
      label,
      birthDate,
      deathDate: deathDate || undefined,
      wikipediaUrl,
      sitelinks: Number.isFinite(sitelinks) ? sitelinks : 0,
      theme: inferThemeFromLabel(label),
      gestureRoot: inferCategoryRoot(label),
      editorialScore: 50
    });
  }

  return items;
}

async function readR2Cache(env: Env, key: string): Promise<NotableBornPayload | null> {
  if (!env.R2) return null;
  try {
    const object = await env.R2.get(key);
    if (!object) return null;
    const parsed = (await object.json()) as NotableBornPayload | null;
    if (!parsed || !Array.isArray(parsed.items)) return null;
    if (!parsed.items.length) return null;
    const ts = Date.parse(String(parsed.generated_at || ""));
    if (!Number.isFinite(ts) || Date.now() - ts > R2_CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

async function writeR2Cache(env: Env, key: string, payload: NotableBornPayload): Promise<void> {
  if (!env.R2) return;
  if (!Array.isArray(payload.items) || !payload.items.length) return;
  await env.R2.put(key, JSON.stringify(payload), {
    httpMetadata: {
      contentType: "application/json; charset=utf-8",
      cacheControl: "public, max-age=2592000"
    }
  });
}

function dedupeByQid(items: NotableBornItem[]): NotableBornItem[] {
  const seen = new Set<string>();
  const output: NotableBornItem[] = [];
  for (const item of items) {
    const key = item.qid || `${item.label}|${item.birthDate}`;
    if (seen.has(key)) continue;
    seen.add(key);
    output.push(item);
  }
  return output;
}

async function buildPayload(year: number, lang: "fr" | "en", limit: number): Promise<NotableBornPayload> {
  const catalog = listNotableBirthsForYear(year, lang).map((entry) => ({
    qid: entry.qid || `CATALOG-${year}-${entry.name}`,
    label: entry.name,
    birthDate: entry.birthDate,
    wikipediaUrl: entry.wikipediaUrl,
    sitelinks: 1_000,
    theme: entry.theme,
    gestureRoot: entry.gestureRoot,
    editorialScore: entry.editorialScore,
    achievement: entry.achievement
  }));

  const remote = catalog.length >= limit
    ? []
    : await fetchJsonWithTimeout(
        `${WDQS_ENDPOINT}?query=${encodeURIComponent(buildSparqlQuery(year, lang, Math.max(limit, 10)))}`,
        {
          method: "GET",
          headers: {
            accept: "application/sparql-results+json",
            "user-agent": "AvantMoi/1.0 (notable-born)"
          }
        },
        20_000
      ).then(parseItems).catch(() => [] as NotableBornItem[]);

  return {
    year,
    lang,
    generated_at: new Date().toISOString(),
    items: dedupeByQid([...catalog, ...remote])
  };
}

function computeScore(params: {
  item: NotableBornItem;
  year: number;
  previousTheme: EditorialTheme | null;
  previousGestureRoot: string | null;
  seenThemes: EditorialTheme[];
  seenGestureRoots: string[];
}): number {
  const baseYearScore = Number(String(params.item.birthDate || "").slice(0, 4)) === params.year ? 100 : 0;
  const diversityBonus = params.previousTheme && params.item.theme !== params.previousTheme ? 20 : 0;
  let repetitionPenalty = 0;
  if (params.previousTheme && params.item.theme === params.previousTheme) repetitionPenalty += 50;
  if (params.previousGestureRoot && params.item.gestureRoot === params.previousGestureRoot) repetitionPenalty += 30;
  if (params.seenThemes.includes(params.item.theme)) repetitionPenalty += 8;
  if (params.seenGestureRoots.includes(params.item.gestureRoot)) repetitionPenalty += 12;
  return baseYearScore + params.item.editorialScore + diversityBonus - repetitionPenalty;
}

function isCatalogItem(item: NotableBornItem): boolean {
  return item.qid.startsWith("CATALOG-") || item.sitelinks >= 1_000;
}

function passesAntiRepetition(item: NotableBornItem, previousTheme: EditorialTheme | null): boolean {
  if (!previousTheme) return true;
  if (item.theme !== previousTheme) return true;
  return item.editorialScore >= 90;
}

function selectItems(params: {
  payload: NotableBornPayload;
  year: number;
  limit: number;
  previousTheme: EditorialTheme | null;
  previousGestureRoot: string | null;
  seenThemes: EditorialTheme[];
  seenGestureRoots: string[];
}): NotableBornPayload {
  const yearItems = [...params.payload.items].filter(
    (item) => Number(String(item.birthDate || "").slice(0, 4)) === params.year
  );
  const localYearItems = yearItems.filter((item) => isCatalogItem(item));
  const remoteYearItems = yearItems.filter((item) => !isCatalogItem(item));

  const sortByScore = (left: NotableBornItem, right: NotableBornItem) => {
    const scoreDiff =
      computeScore({ ...params, item: right }) -
      computeScore({ ...params, item: left });
    if (scoreDiff !== 0) return scoreDiff;
    return right.sitelinks - left.sitelinks;
  };

  const rankedLocal = localYearItems
    .filter((item) => passesAntiRepetition(item, params.previousTheme))
    .sort(sortByScore);
  const fallbackLocal = [...localYearItems].sort(sortByScore);
  const rankedRemote = remoteYearItems
    .filter((item) => passesAntiRepetition(item, params.previousTheme))
    .sort(sortByScore);
  const fallbackRemote = [...remoteYearItems].sort(sortByScore);

  let items: NotableBornItem[] = [];
  if (localYearItems.length) {
    const localKeys = new Set<string>();
    for (const item of [...rankedLocal, ...fallbackLocal]) {
      const key = item.qid || `${item.label}|${item.birthDate}`;
      if (localKeys.has(key)) continue;
      localKeys.add(key);
      items.push(item);
      if (items.length >= params.limit) break;
    }
    if (items.length < params.limit) {
      for (const item of [...rankedRemote, ...fallbackRemote]) {
        const key = item.qid || `${item.label}|${item.birthDate}`;
        if (localKeys.has(key)) continue;
        localKeys.add(key);
        items.push(item);
        if (items.length >= params.limit) break;
      }
    }
  } else {
    items = [...rankedRemote, ...fallbackRemote].slice(0, params.limit);
  }

  if (!items.length && yearItems.length) {
    items = localYearItems.length
      ? [...fallbackLocal, ...fallbackRemote].slice(0, params.limit)
      : fallbackRemote.slice(0, params.limit);
  }

  return {
    year: params.payload.year,
    lang: params.payload.lang,
    generated_at: params.payload.generated_at,
    items
  };
}

/** Reprend les faits d'arme du catalogue quand l'item vient du WDQS ou d'un cache sans achievement. */
function enrichItemsWithCatalogAchievements(
  items: NotableBornItem[],
  year: number,
  lang: "fr" | "en"
): NotableBornItem[] {
  const catalog = listNotableBirthsForYear(year, lang);
  const byQid = new Map<string, (typeof catalog)[0]>();
  const byName = new Map<string, (typeof catalog)[0]>();
  for (const entry of catalog) {
    const q = entry.qid?.trim();
    if (q) {
      byQid.set(q, entry);
    }
    byName.set(entry.name.toLowerCase().trim(), entry);
  }
  return items.map((item) => {
    const achExisting = item.achievement?.trim();
    if (achExisting) return item;
    const fromQid =
      item.qid && !item.qid.startsWith("CATALOG-") ? byQid.get(item.qid) : undefined;
    const fromName = byName.get(item.label.toLowerCase().trim());
    const src = fromQid || fromName;
    const ach = src?.achievement?.trim();
    if (!ach) return item;
    return { ...item, achievement: ach };
  });
}

export async function onRequestOptions(): Promise<Response> {
  return new Response(null, { status: 204, headers: headers("text/plain; charset=utf-8") });
}

export async function onRequestGet(context: { request: Request; env?: Env }): Promise<Response> {
  const requestUrl = new URL(context.request.url);
  const year = parseYear(requestUrl.searchParams.get("year"));
  const lang = parseLang(requestUrl.searchParams.get("lang"));
  const limit = parseLimit(requestUrl.searchParams.get("limit"));
  const previousTheme = normalizeEditorialTheme(requestUrl.searchParams.get("previousTheme"));
  const previousGestureRoot = requestUrl.searchParams.get("previousGestureRoot");
  const seenThemes = parseSeenThemes(requestUrl.searchParams.get("seenThemes"));
  const seenGestureRoots = parseCsvList(requestUrl.searchParams.get("seenGestureRoots"));

  if (!year) {
    return json(400, { error: "invalid_params", message: "Expected valid year." });
  }

  const limiter = checkRateLimit(context.request);
  if (!limiter.allowed) {
    return json(429, { error: "rate_limited", retryAfterMs: limiter.retryAfterMs });
  }

  const key = cacheKey(year, lang, limit);
  const memory = memoryCache.get(key);
  const now = Date.now();
  const env = context.env || {};
  let rawPayload: NotableBornPayload | null = null;
  if (memory && now - memory.ts < MEMORY_CACHE_TTL_MS && Array.isArray(memory.payload.items) && memory.payload.items.length) {
    rawPayload = memory.payload;
  } else {
    const r2Key = r2CacheKey(year, lang, limit);
    rawPayload = await readR2Cache(env, r2Key);
    if (!rawPayload) {
      rawPayload = await buildPayload(year, lang, limit);
      await writeR2Cache(env, r2Key, rawPayload).catch(() => undefined);
    }
    if (Array.isArray(rawPayload.items) && rawPayload.items.length) {
      memoryCache.set(key, { ts: now, payload: rawPayload });
    }
  }

  const payload = selectItems({
    payload: rawPayload,
    year,
    limit,
    previousTheme,
    previousGestureRoot,
    seenThemes,
    seenGestureRoots
  });

  const enriched: NotableBornPayload = {
    ...payload,
    items: enrichItemsWithCatalogAchievements(payload.items, year, lang)
  };

  log("notable_born_served", {
    year,
    lang,
    limit,
    count: enriched.items.length,
    source: memory && now - memory.ts < MEMORY_CACHE_TTL_MS ? "memory" : "upstream"
  });

  return json(200, enriched);
}
