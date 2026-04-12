import { selectGesturesForYear } from "../../src/server/gestures/selectGesture";
import type { EditorialTheme } from "../../src/content/editorialTheme";
import { normalizeEditorialTheme, parseSeenThemes } from "../../src/content/editorialTheme";
import type { GestureRupture } from "../../src/content/gestures/types";
import { parseCsvList } from "../../src/lib/parseCsv";
import { buildShareBonusMap } from "../lib/shareSignal";
import type { Env as ShareEnv } from "../lib/shareSignal";

type GestureScenePayload = {
  schema_version: "1.0";
  country_qid: string;
  year: number;
  matched_year: number;
  match_type: "exact" | "nearby";
  lang: "fr" | "en";
  slot: number;
  gesture_id: string;
  gesture_label: string;
  theme: EditorialTheme;
  gesture_root: string;
  editorial_score: number;
  direction: "possible_to_impossible" | "impossible_to_possible";
  date: string;
  date_precision: "day" | "month" | "year";
  place: {
    name: string;
    qid: string | null;
    type: "site" | "institution" | "city" | "country";
  };
  fact: string;
  before_state: string;
  after_state: string;
  gesture_changed: string;
  material_anchor: string;
  narrative_text: string;
  sources: Array<{ label: string; url: string }>;
  generated_at: string;
  source_mode: "editorial_gesture_catalog";
};

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 60;
const rateState = new Map<string, { count: number; resetAt: number }>();

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

function parseSlot(raw: string | null): number {
  const value = Number(raw);
  if (!Number.isInteger(value)) return 1;
  return Math.min(20, Math.max(1, value));
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

function pickGesture(
  year: number,
  countryQid: string,
  lang: "fr" | "en",
  slot: number,
  previousTheme: EditorialTheme | null,
  previousGestureRoot: string | null,
  seenThemes: EditorialTheme[],
  seenGestureRoots: string[],
  shareBonus: Map<string, number>
): {
  entry: GestureRupture | null;
  exactCount: number;
  nearbyCount: number;
  rankedLength: number;
} {
  const selection = selectGesturesForYear({
    countryQid,
    lang,
    targetYear: year,
    exactLimit: 20,
    nearbyLimit: 20,
    previousTheme,
    previousGestureRoot,
    seenThemes,
    seenGestureRoots,
    shareBonus
  });
  const ranked = [...selection.exact, ...selection.nearby];
  const entry = ranked[slot - 1] || null;
  return {
    entry,
    exactCount: selection.exact.length,
    nearbyCount: selection.nearby.length,
    rankedLength: ranked.length
  };
}

function buildPayload(entry: GestureRupture, params: { year: number; countryQid: string; lang: "fr" | "en"; slot: number }): GestureScenePayload {
  const matchedYear = entry.ruptureYear;
  return {
    schema_version: "1.0",
    country_qid: params.countryQid,
    year: params.year,
    matched_year: matchedYear,
    match_type: matchedYear === params.year ? "exact" : "nearby",
    lang: params.lang,
    slot: params.slot,
    gesture_id: entry.id,
    gesture_label: entry.gestureLabel,
    theme: entry.theme,
    gesture_root: entry.gestureRoot,
    editorial_score: entry.editorialScore,
    direction: entry.direction,
    date: entry.ruptureDate,
    date_precision: entry.datePrecision,
    place: {
      name: entry.placeName,
      qid: entry.placeQid || null,
      type: entry.placeType
    },
    fact: entry.fact,
    before_state: entry.beforeState,
    after_state: entry.afterState,
    gesture_changed: entry.gestureChanged,
    material_anchor: entry.materialAnchor,
    narrative_text: entry.sceneText,
    sources: entry.sources.map((source) => ({ label: source.label, url: source.url })),
    generated_at: new Date().toISOString(),
    source_mode: "editorial_gesture_catalog"
  };
}

export async function onRequestOptions(): Promise<Response> {
  return new Response(null, { status: 204, headers: headers("text/plain; charset=utf-8") });
}

export async function onRequestGet(context: { request: Request; env?: ShareEnv }): Promise<Response> {
  const requestUrl = new URL(context.request.url);
  const year = parseYear(requestUrl.searchParams.get("year"));
  const countryQid = parseCountryQid(requestUrl.searchParams.get("country"));
  const lang = parseLang(requestUrl.searchParams.get("lang"));
  const slot = parseSlot(requestUrl.searchParams.get("slot"));
  const previousTheme = normalizeEditorialTheme(requestUrl.searchParams.get("previousTheme"));
  const previousGestureRoot = requestUrl.searchParams.get("previousGestureRoot");
  const seenThemes = parseSeenThemes(requestUrl.searchParams.get("seenThemes"));
  const seenGestureRoots = parseCsvList(requestUrl.searchParams.get("seenGestureRoots"));

  if (!year || !countryQid) {
    return json(400, { error: "invalid_params", message: "Expected year and country." });
  }

  const limiter = checkRateLimit(context.request);
  if (!limiter.allowed) {
    return json(429, { error: "rate_limited", retryAfterMs: limiter.retryAfterMs });
  }

  const env = context.env || {};
  const shareBonus = await buildShareBonusMap(env, countryQid, year);
  const { entry, exactCount, nearbyCount, rankedLength } = pickGesture(
    year,
    countryQid,
    lang,
    slot,
    previousTheme,
    previousGestureRoot,
    seenThemes,
    seenGestureRoots,
    shareBonus
  );
  if (!entry) {
    log("gesture_scene_missing", {
      year,
      countryQid,
      lang,
      slot,
      exactCount,
      nearbyCount,
      rankedLength,
      reason:
        rankedLength === 0
          ? "no_exact_or_nearby_gesture"
          : slot > rankedLength
            ? "slot_out_of_range"
            : "slot_filtered_or_empty"
    });
    return json(404, {
      error: "gesture_not_found",
      message: "No editorial gesture scene found."
    });
  }

  const payload = buildPayload(entry, { year, countryQid, lang, slot });
  log("gesture_scene_served", {
    year,
    countryQid,
    lang,
    slot,
    gestureId: entry.id,
    ruptureYear: entry.ruptureYear,
    matchType: payload.match_type
  });
  return json(200, payload);
}
