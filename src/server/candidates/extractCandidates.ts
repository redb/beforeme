import type { CandidateCore } from "./types";
import { seedCandidatesForYearCountry } from "./seedOverrides";

type ExtractParams = {
  baseUrl: string;
  year: number;
  countryQid: string;
  timeoutMs: number;
  retries: number;
};

function toIsoDay(raw: string): string | null {
  const value = String(raw || "").trim();
  const direct = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (direct) return `${direct[1]}-${direct[2]}-${direct[3]}`;

  const zulu = value.match(/^(\d{4})-(\d{2})-(\d{2})T/);
  if (zulu) return `${zulu[1]}-${zulu[2]}-${zulu[3]}`;
  return null;
}

function isCandidateLike(value: unknown): value is {
  qid: string;
  label: string;
  date: string;
  wikipediaUrl: string;
  rupture_type: string;
  confidence?: number;
  placeHints?: unknown;
} {
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

async function fetchJsonWithRetry(url: string, timeoutMs: number, retries: number): Promise<unknown> {
  let lastError: unknown = null;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { accept: "application/json" },
        signal: controller.signal
      });
      if (!response.ok) {
        throw new Error(`http_${response.status}`);
      }
      return await response.json();
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 120 * (attempt + 1)));
      }
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError || new Error("upstream_error");
}

function normalizeCandidates(payload: unknown): CandidateCore[] {
  const items = Array.isArray(payload) ? payload : [];
  const out: CandidateCore[] = [];
  for (const raw of items) {
    if (!isCandidateLike(raw)) continue;
    const qid = raw.qid.toUpperCase();
    if (!/^Q\d+$/.test(qid)) continue;
    if (!raw.wikipediaUrl.includes("wikipedia.org/wiki/")) continue;
    const isoDay = toIsoDay(raw.date);
    out.push({
      qid,
      title: raw.label.trim(),
      date: raw.date.trim(),
      dateCandidates: isoDay ? [isoDay] : [],
      wikipediaUrl: raw.wikipediaUrl.trim(),
      rupture_type: raw.rupture_type as CandidateCore["rupture_type"],
      confidence: Number(raw.confidence || 0),
      placeHints: (raw.placeHints as CandidateCore["placeHints"]) || null
    });
  }
  return out;
}

function dedupeByQid(items: CandidateCore[]): CandidateCore[] {
  const seen = new Set<string>();
  const out: CandidateCore[] = [];
  for (const item of items) {
    if (seen.has(item.qid)) continue;
    seen.add(item.qid);
    out.push(item);
  }
  return out;
}

export async function extractCandidates(params: ExtractParams): Promise<{
  items: CandidateCore[];
  sourceMix: { fast: number; geo: number; seeds: number };
}> {
  const localSeeds = seedCandidatesForYearCountry(params.year, params.countryQid);
  if (localSeeds.length >= 1 && (params.year < 1950 || params.timeoutMs <= 12_000)) {
    return {
      items: dedupeByQid(localSeeds),
      sourceMix: { fast: 0, geo: 0, seeds: localSeeds.length }
    };
  }

  const fastUrl = `${params.baseUrl}/api/batch?year=${params.year}&country=${params.countryQid}&mode=fast`;
  const geoUrl = `${params.baseUrl}/api/batch?year=${params.year}&country=${params.countryQid}&mode=geo`;

  const settled = await Promise.allSettled([
    fetchJsonWithRetry(fastUrl, params.timeoutMs, params.retries),
    fetchJsonWithRetry(geoUrl, params.timeoutMs, params.retries)
  ]);

  const fast = settled[0].status === "fulfilled" ? normalizeCandidates(settled[0].value) : [];
  const geo = settled[1].status === "fulfilled" ? normalizeCandidates(settled[1].value) : [];
  let items = dedupeByQid([...fast, ...geo]);

  let seeds: CandidateCore[] = [];
  if (items.length < 8 || settled.every((entry) => entry.status === "rejected")) {
    seeds = seedCandidatesForYearCountry(params.year, params.countryQid);
    items = dedupeByQid([...items, ...seeds]);
  }

  return {
    items,
    sourceMix: { fast: fast.length, geo: geo.length, seeds: seeds.length }
  };
}
