import type { Lang } from "./i18n";
import type { CountryCode } from "./locale";
import { countryToQid } from "./locale";

export type AnecdoteScope = "global" | "local";

export interface AnecdoteSlot {
  slot: number;
  narrative: string;
  fact: string;
  url: string;
}

interface BatchCandidate {
  qid: string;
}

interface SceneApiResponse {
  slot?: number;
  scene?: string;
  fact?: string;
  sourceUrl?: string;
}

interface LegacyAnecdoteResponse {
  slot?: number;
  narrative?: string;
  fact?: string;
  url?: string;
}

const batchCache = new Map<string, BatchCandidate[]>();
const batchPending = new Map<string, Promise<BatchCandidate[]>>();

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    window.clearTimeout(timer);
  }
}

function parseFromSceneApi(payload: unknown): AnecdoteSlot | null {
  if (!payload || typeof payload !== "object") return null;
  const data = payload as SceneApiResponse;
  if (
    typeof data.slot !== "number" ||
    typeof data.scene !== "string" ||
    typeof data.fact !== "string" ||
    typeof data.sourceUrl !== "string"
  ) {
    return null;
  }
  if (!data.scene.trim() || !data.fact.trim() || !data.sourceUrl.trim()) {
    return null;
  }

  return {
    slot: data.slot,
    narrative: data.scene,
    fact: data.fact,
    url: data.sourceUrl
  };
}

function parseFromLegacyApi(payload: unknown): AnecdoteSlot | null {
  if (!payload || typeof payload !== "object") return null;
  const data = payload as LegacyAnecdoteResponse;
  if (
    typeof data.slot !== "number" ||
    typeof data.narrative !== "string" ||
    typeof data.fact !== "string" ||
    typeof data.url !== "string"
  ) {
    return null;
  }
  if (!data.narrative.trim() || !data.fact.trim() || !data.url.trim()) {
    return null;
  }
  return {
    slot: data.slot,
    narrative: data.narrative,
    fact: data.fact,
    url: data.url
  };
}

function parseBatchCandidates(payload: unknown): BatchCandidate[] {
  if (!Array.isArray(payload)) return [];
  const out: BatchCandidate[] = [];
  for (const item of payload) {
    if (!item || typeof item !== "object") continue;
    const qid = String((item as Record<string, unknown>).qid || "").toUpperCase();
    if (/^Q\d+$/.test(qid)) out.push({ qid });
  }
  return out;
}

async function fetchBatchCandidates(input: {
  year: number;
  country: CountryCode;
}): Promise<BatchCandidate[]> {
  const key = `${input.year}|${input.country}|fast`;
  const fromCache = batchCache.get(key);
  if (fromCache) return fromCache;

  const pending = batchPending.get(key);
  if (pending) return pending;

  const task = (async () => {
    const params = new URLSearchParams({
      year: String(input.year),
      country: countryToQid(input.country),
      mode: "fast"
    });
    const response = await fetchWithTimeout(`/api/batch?${params.toString()}`, 70000);
    if (!response.ok) return [];
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("application/json")) return [];
    const payload = (await response.json()) as unknown;
    const candidates = parseBatchCandidates(payload);
    if (candidates.length) batchCache.set(key, candidates);
    return candidates;
  })()
    .catch(() => [])
    .finally(() => {
      batchPending.delete(key);
    });

  batchPending.set(key, task);
  return task;
}

export async function fetchAnecdoteSlot(input: {
  year: number;
  lang: Lang;
  country: CountryCode;
  scope: AnecdoteScope;
  slot: number;
}): Promise<AnecdoteSlot | null> {
  try {
    const candidates = await fetchBatchCandidates({
      year: input.year,
      country: input.country
    });
    const candidate = candidates[(input.slot - 1) % Math.max(candidates.length, 1)];
    if (!candidate?.qid) {
      return null;
    }

    const params = new URLSearchParams({
      year: String(input.year),
      lang: input.lang,
      country: countryToQid(input.country),
      slot: String(input.slot),
      qid: candidate.qid,
      mode: "fast"
    });

    const paths = ["/api/scene", "/api/anecdote"];
    for (const path of paths) {
      const response = await fetchWithTimeout(`${path}?${params.toString()}`, 70000);
      if (!response.ok) continue;

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.toLowerCase().includes("application/json")) continue;

      const payload = (await response.json()) as unknown;
      const fromScene = parseFromSceneApi(payload);
      if (fromScene) {
        return {
          ...fromScene,
          slot: input.slot
        };
      }

      const fromLegacy = parseFromLegacyApi(payload);
      if (fromLegacy) {
        return {
          ...fromLegacy,
          slot: input.slot
        };
      }
    }

    return null;
  } catch {
    return null;
  }
}
