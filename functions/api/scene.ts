import { getPrismaClient } from "../lib/prisma.js";
import { getWikiLead } from "../lib/wiki-lead.js";
import { buildScenePromptInput } from "../../src/lib/openaiPayload";
import { RuptureType, type RuptureType as RuptureTypeValue } from "../../src/lib/ruptureTaxonomy";
import {
  resolvePrecisePlace,
  type PlaceCandidate,
  type PlaceHints
} from "../../src/server/place/precisePlaceResolver";
import { evaluateStrictPlace } from "../../src/server/place/validateStrictPlace";

type R2BucketLike = {
  get(key: string): Promise<{ json(): Promise<unknown> } | null>;
  put(
    key: string,
    value: string,
    options?: { httpMetadata?: { contentType?: string; cacheControl?: string } }
  ): Promise<void>;
};

export type Env = {
  R2: R2BucketLike;
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
  DATABASE_URL?: string;
  PRISMA_ACCELERATE_URL?: string;
};

type BatchItem = {
  qid: string;
  label: string;
  date: string;
  wikipediaUrl: string;
  rupture_type: RuptureTypeValue;
  confidence?: number;
  placeHints?: PlaceHints;
};

type StableSceneJson = {
  schema_version: "1.0";
  country_qid: string;
  year: number;
  lang: "fr" | "en";
  event_qid: string;
  date: string;
  date_precision: "day";
  place: {
    name: string;
    qid: string | null;
    type: "site" | "institution" | "city" | "country";
  };
  rupture_type: string;
  confidence: number;
  fact: string;
  before_state: string;
  after_state: string;
  sources: Array<{ label: string; url: string }>;
  generated_at: string;
  prompt_hash: string;
};

const OPENAI_ENDPOINT = "https://api.openai.com/v1/responses";
const SCHEMA_VERSION = "1.0";
const PENDING_TTL_MS = 90_000;

function parseYear(raw: string | null): number | null {
  const value = Number(raw);
  return Number.isInteger(value) && value >= 1000 && value <= 2100 ? value : null;
}

function parseLang(raw: string | null): "fr" | "en" {
  return String(raw || "fr").toLowerCase().startsWith("fr") ? "fr" : "en";
}

function parseQid(raw: string | null): string | null {
  const value = String(raw || "").trim().toUpperCase();
  return /^Q\d+$/.test(value) ? value : null;
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

function parseMode(raw: string | null): "fast" | "geo" {
  return raw === "geo" ? "geo" : "fast";
}

function r2Key(countryQid: string, year: number, eventQid: string, lang: "fr" | "en"): string {
  return `v1/${countryQid}/${year}/${eventQid}.${lang}.json`;
}

function noStoreHeaders(): HeadersInit {
  return {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,OPTIONS",
    "access-control-allow-headers": "content-type"
  };
}

function immutableHeaders(): HeadersInit {
  return {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "public, s-maxage=31536000, immutable",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,OPTIONS",
    "access-control-allow-headers": "content-type"
  };
}

function json(status: number, payload: unknown, headers: HeadersInit = noStoreHeaders()): Response {
  return new Response(JSON.stringify(payload), { status, headers });
}

async function getFromR2(env: Env, key: string): Promise<StableSceneJson | null> {
  if (!env.R2) return null;
  const object = await env.R2.get(key);
  if (!object) return null;
  const parsed = (await object.json()) as StableSceneJson;
  if (!parsed || parsed.schema_version !== SCHEMA_VERSION) return null;
  return parsed;
}

async function putToR2(env: Env, key: string, data: StableSceneJson): Promise<void> {
  if (!env.R2) {
    throw new Error("R2 binding missing");
  }
  await env.R2.put(key, JSON.stringify(data), {
    httpMetadata: {
      contentType: "application/json; charset=utf-8",
      cacheControl: "public, s-maxage=31536000, immutable"
    }
  });
}

async function computePromptHash(input: unknown): Promise<string> {
  const bytes = new TextEncoder().encode(JSON.stringify(input));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function fetchJsonWithTimeout(url: string, init: RequestInit, timeoutMs: number): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    if (!response.ok) throw new Error(`http_${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

function dateToIsoDay(raw: string): string | null {
  const match = String(raw || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  return `${match[1]}-${match[2]}-${match[3]}`;
}

function pickPlace(candidates: PlaceCandidate[], selectedId: string | null): PlaceCandidate | null {
  if (!selectedId) return null;
  return candidates.find((item) => item.id === selectedId) || null;
}

function validateStrict(params: {
  date: string | null;
  place: PlaceCandidate | null;
  ruptureType: RuptureTypeValue;
  fact: string;
  beforeState: string;
  afterState: string;
  sources: Array<{ label: string; url: string }>;
  placeFlags: string[];
}): { ok: true; flags: string[] } | { ok: false; code: string; message: string; flags: string[] } {
  const flags = [...params.placeFlags];
  if (!params.date) {
    flags.push("date_precision:unknown", "rejected:missing_precise_date");
    return { ok: false, code: "missing_precise_date", message: "date_precision must be day", flags };
  }
  if (!params.fact.trim()) {
    flags.push("rejected:missing_fact");
    return { ok: false, code: "missing_fact", message: "fact required", flags };
  }
  if (!params.beforeState.trim() || !params.afterState.trim()) {
    flags.push("rejected:missing_structural_delta");
    return { ok: false, code: "missing_structural_delta", message: "before_state and after_state required", flags };
  }
  if (!params.sources.length) {
    flags.push("rejected:missing_sources");
    return { ok: false, code: "missing_sources", message: "sources required", flags };
  }
  const sourceUrls = params.sources.map((item) => item.url);
  const placeEvaluation = evaluateStrictPlace({
    selected: params.place,
    ruptureType: params.ruptureType,
    datePrecision: "day",
    sourceUrls
  });
  flags.push(...placeEvaluation.flags);
  if (!placeEvaluation.ok) {
    return { ok: false, code: "missing_precise_place", message: "place resolver rejected selection", flags };
  }
  return { ok: true, flags };
}

async function acquireLock(
  prisma: any,
  params: { year: number; countryQid: string; lang: "fr" | "en"; eventQid: string }
): Promise<{ acquired: boolean; lockOwner: string | null }> {
  const now = new Date();
  const lockOwner = crypto.randomUUID();
  const lockExpiresAt = new Date(Date.now() + PENDING_TTL_MS);

  try {
    await prisma.eventCache.create({
      data: {
        year: params.year,
        countryQid: params.countryQid,
        lang: params.lang,
        eventQid: params.eventQid,
        title: params.eventQid,
        status: "pending",
        schemaVersion: SCHEMA_VERSION,
        generatedAt: now,
        updatedAt: now,
        lockOwner,
        lockExpiresAt
      }
    });
    return { acquired: true, lockOwner };
  } catch (error) {
    const code = (error as { code?: string } | null)?.code;
    if (code !== "P2002") {
      throw error;
    }
  }

  const updated = await prisma.eventCache.updateMany({
    where: {
      year: params.year,
      countryQid: params.countryQid,
      lang: params.lang,
      eventQid: params.eventQid,
      OR: [
        { lockExpiresAt: null },
        { lockExpiresAt: { lt: now } }
      ]
    },
    data: {
      status: "pending",
      schemaVersion: SCHEMA_VERSION,
      errorCode: null,
      errorMessage: null,
      updatedAt: now,
      lockOwner,
      lockExpiresAt
    }
  });
  return { acquired: updated.count > 0, lockOwner: updated.count > 0 ? lockOwner : null };
}

function isBatchItem(value: unknown): value is BatchItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.qid === "string" &&
    typeof item.label === "string" &&
    typeof item.date === "string" &&
    typeof item.wikipediaUrl === "string" &&
    typeof item.rupture_type === "string"
  );
}

function parseOpenAIOutput(payload: unknown): {
  fact: string;
  before_state: string;
  after_state: string;
  place_selected: string | null;
} | null {
  const parsed = payload as { output_parsed?: unknown };
  const value = parsed.output_parsed as Record<string, unknown> | undefined;
  if (!value) return null;
  const fact = String(value.fact || "").trim();
  const beforeState = String(value.before_state || "").trim();
  const afterState = String(value.after_state || "").trim();
  const placeSelected = value.place_selected === null ? null : String(value.place_selected || "").trim();
  if (!fact || !beforeState || !afterState) return null;
  return {
    fact,
    before_state: beforeState,
    after_state: afterState,
    place_selected: placeSelected || null
  };
}

async function buildStableScene(
  env: Env,
  requestUrl: URL,
  params: { year: number; countryQid: string; lang: "fr" | "en"; eventQid: string; mode: "fast" | "geo" }
): Promise<{ stable: StableSceneJson; validationFlags: string[] }> {
  const modes = params.mode === "fast" ? ["fast", "geo"] : ["geo", "fast"];
  let batchItems: BatchItem[] = [];
  for (const mode of modes) {
    try {
      const payload = await fetchJsonWithTimeout(
        `${requestUrl.protocol}//${requestUrl.host}/api/batch?year=${params.year}&country=${params.countryQid}&mode=${mode}`,
        { method: "GET", headers: { accept: "application/json" } },
        55_000
      );
      if (Array.isArray(payload)) {
        batchItems = payload.filter(isBatchItem);
      }
      if (batchItems.length) break;
    } catch {
      // ignore and try next mode
    }
  }
  if (!batchItems.length) throw Object.assign(new Error("No candidates"), { status: 404, code: "no_candidates" });

  const event = batchItems.find((item) => item.qid.toUpperCase() === params.eventQid.toUpperCase());
  if (!event) throw Object.assign(new Error("Event not found"), { status: 404, code: "event_not_found" });

  const isoDay = dateToIsoDay(event.date);
  const wikiLead = await getWikiLead(event.wikipediaUrl);
  if (!wikiLead) throw Object.assign(new Error("Missing source context"), { status: 422, code: "missing_source_context" });

  const placeResolution = await resolvePrecisePlace({
    eventQid: event.qid,
    ruptureType: event.rupture_type,
    year: params.year,
    countryQid: params.countryQid,
    lang: params.lang,
    wikipediaUrl: event.wikipediaUrl,
    wikipediaLeadText: wikiLead,
    wikipediaInfobox: null,
    wikidataPlace: event.placeHints || null
  });

  const promptInput = buildScenePromptInput(
    {
      qid: event.qid,
      label: event.label,
      date: event.date,
      placeLabel: "",
      cityLabel: "",
      wikipediaUrl: event.wikipediaUrl,
      placeHints: event.placeHints
    },
    event.rupture_type,
    placeResolution.candidates
  );

  const openaiRequestPayload = {
    ...promptInput,
    slot: 1,
    year: params.year,
    country: params.countryQid,
    lang: params.lang,
    source_context: { wikipediaUrl: event.wikipediaUrl, snippets: [wikiLead] },
    output_contract: {
      fact: "string",
      before_state: "string",
      after_state: "string",
      place_selected: "string|null"
    }
  };
  const promptHash = await computePromptHash(openaiRequestPayload);

  const apiKey = String(env.OPENAI_API_KEY || "").trim();
  if (!apiKey) throw Object.assign(new Error("OPENAI_API_KEY missing"), { status: 500, code: "missing_openai_key" });

  const openaiRaw = await fetchJsonWithTimeout(
    OPENAI_ENDPOINT,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: String(env.OPENAI_MODEL || "gpt-4.1-mini"),
        input: [
          {
            role: "system",
            content:
              "Return only structural output. No narration. Select place_selected from provided place_candidates only."
          },
          { role: "user", content: JSON.stringify(openaiRequestPayload) }
        ],
        max_output_tokens: 260,
        text: {
          format: {
            type: "json_schema",
            name: "strict_scene_structural",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                fact: { type: "string" },
                before_state: { type: "string" },
                after_state: { type: "string" },
                place_selected: { type: ["string", "null"] }
              },
              required: ["fact", "before_state", "after_state", "place_selected"]
            }
          }
        }
      })
    },
    18_000
  );

  const structural = parseOpenAIOutput(openaiRaw);
  if (!structural) throw Object.assign(new Error("Invalid model output"), { status: 422, code: "invalid_model_output" });

  const selectedPlace = pickPlace(placeResolution.candidates, structural.place_selected) || placeResolution.selected;
  const sources = [
    { label: "Wikipedia", url: event.wikipediaUrl },
    ...(selectedPlace?.sourceUrl ? [{ label: "Official", url: selectedPlace.sourceUrl }] : [])
  ].filter((entry, index, arr) => arr.findIndex((x) => x.url === entry.url) === index);

  const validation = validateStrict({
    date: isoDay,
    place: selectedPlace,
    ruptureType: event.rupture_type,
    fact: structural.fact,
    beforeState: structural.before_state,
    afterState: structural.after_state,
    sources,
    placeFlags: placeResolution.flags
  });
  if (!validation.ok) {
    const failed = validation as { ok: false; code: string; message: string; flags: string[] };
    throw Object.assign(new Error(failed.message), { status: 422, code: failed.code, validationFlags: failed.flags });
  }

  return {
    stable: {
      schema_version: SCHEMA_VERSION,
      country_qid: params.countryQid,
      year: params.year,
      lang: params.lang,
      event_qid: event.qid,
      date: isoDay as string,
      date_precision: "day",
      place: {
        name: selectedPlace?.name || params.countryQid,
        qid: selectedPlace?.qid || null,
        type: (selectedPlace?.type || "country") as "site" | "institution" | "city" | "country"
      },
      rupture_type: event.rupture_type,
      confidence: Number(event.confidence || 0),
      fact: structural.fact,
      before_state: structural.before_state,
      after_state: structural.after_state,
      sources,
      generated_at: new Date().toISOString(),
      prompt_hash: promptHash
    },
    validationFlags: [...new Set(validation.flags)]
  };
}

async function handler(context: { request: Request; env: Env }): Promise<Response> {
  if (!context.env.R2) {
    return json(500, { error: "missing_r2_binding" });
  }
  const requestUrl = new URL(context.request.url);
  const year = parseYear(requestUrl.searchParams.get("year"));
  const countryQid = parseCountryQid(requestUrl.searchParams.get("country"));
  const lang = parseLang(requestUrl.searchParams.get("lang"));
  const eventQid = parseQid(requestUrl.searchParams.get("qid"));
  const mode = parseMode(requestUrl.searchParams.get("mode"));

  if (!year || !countryQid || !eventQid) {
    return json(400, { error: "Invalid parameters. Expected year,country,qid." });
  }

  const key = r2Key(countryQid, year, eventQid, lang);

  try {
    const fromR2 = await getFromR2(context.env, key);
    if (fromR2) {
      return json(200, fromR2, immutableHeaders());
    }

    const prisma = ((context.env as unknown as { __PRISMA_MOCK?: any }).__PRISMA_MOCK ||
      getPrismaClient(context.env)) as any;
    const dbRow = await prisma.eventCache.findUnique({
      where: { year_countryQid_lang_eventQid: { year, countryQid, lang, eventQid } }
    });

    if (dbRow?.status === "ready" && dbRow?.r2Key) {
      const dbR2 = await getFromR2(context.env, dbRow.r2Key);
      if (dbR2) {
        return json(200, dbR2, immutableHeaders());
      }
    }

    if (dbRow?.status === "pending") {
      const lockExpiresAt = dbRow.lockExpiresAt ? new Date(dbRow.lockExpiresAt).getTime() : 0;
      if (lockExpiresAt > Date.now()) {
        return json(202, { status: "pending", event_qid: eventQid });
      }
    }

    const lock = await acquireLock(prisma, { year, countryQid, lang, eventQid });
    if (!lock.acquired) {
      return json(202, { status: "pending", event_qid: eventQid });
    }

    let stable: StableSceneJson;
    let validationFlags: string[] = [];
    try {
      const result = await buildStableScene(context.env, requestUrl, { year, countryQid, lang, eventQid, mode });
      stable = result.stable;
      validationFlags = result.validationFlags;
    } catch (error) {
      const e = error as { status?: number; code?: string; message?: string; validationFlags?: string[] };
      const status = Number(e?.status || 500);
      const code = String(e?.code || "generation_failed");
      const message = String(e?.message || "generation_failed");
      await prisma.eventCache.update({
        where: { year_countryQid_lang_eventQid: { year, countryQid, lang, eventQid } },
        data: {
          status: "rejected",
          errorCode: code,
          errorMessage: message,
          validationFlags: Array.isArray(e.validationFlags) ? e.validationFlags : null,
          lockOwner: null,
          lockExpiresAt: null,
          updatedAt: new Date()
        }
      });
      if (status === 422) return json(422, { error: code, message });
      if (status === 404) return json(404, { error: code, message });
      throw error;
    }

    await putToR2(context.env, key, stable);
    await prisma.eventCache.update({
      where: { year_countryQid_lang_eventQid: { year, countryQid, lang, eventQid } },
      data: {
        status: "ready",
        date: stable.date,
        datePrecision: stable.date_precision,
        ruptureType: stable.rupture_type,
        confidence: stable.confidence,
        placeName: stable.place.name,
        placeQid: stable.place.qid,
        placeType: stable.place.type,
        r2Key: key,
        schemaVersion: stable.schema_version,
        promptHash: stable.prompt_hash,
        sourceUrls: stable.sources.map((source) => source.url),
        validationFlags: validationFlags.length ? validationFlags : null,
        errorCode: null,
        errorMessage: null,
        generatedAt: new Date(stable.generated_at),
        lockOwner: null,
        lockExpiresAt: null,
        updatedAt: new Date()
      }
    });

    return json(200, stable, immutableHeaders());
  } catch (error) {
    const detail = error instanceof Error ? error.message : "internal_error";
    return json(500, { error: "scene_request_failed", detail });
  }
}

export async function onRequestOptions(): Promise<Response> {
  return new Response(null, { status: 204, headers: noStoreHeaders() });
}

export const onRequestGet = handler;
export default handler;
