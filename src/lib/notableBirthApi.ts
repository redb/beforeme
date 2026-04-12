import type { EditorialTheme } from "../content/editorialTheme";
import type { Lang } from "./i18n";

export interface NotableBirthMatch {
  qid: string;
  name: string;
  birthDate: string;
  deathDate?: string;
  wikipediaUrl: string;
  theme: EditorialTheme;
  gestureRoot: string;
  editorialScore: number;
  achievement?: string;
}

type ApiPayload = {
  items?: Array<{
    qid?: string;
    label?: string;
    birthDate?: string;
    deathDate?: string;
    wikipediaUrl?: string;
    theme?: EditorialTheme;
    gestureRoot?: string;
    editorialScore?: number;
    achievement?: string;
  }>;
};

const cache = new Map<string, NotableBirthMatch | null>();
const pending = new Map<string, Promise<NotableBirthMatch | null>>();

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    window.clearTimeout(timer);
  }
}

function parseRank(payload: unknown, rank: number): NotableBirthMatch | null {
  const maybeItems = (payload as ApiPayload | null)?.items;
  const items = Array.isArray(maybeItems) ? maybeItems : [];
  const first = items[Math.max(0, rank - 1)];
  if (!first) return null;
  const qid = String(first.qid || "").trim();
  const name = String(first.label || "").trim();
  const birthDate = String(first.birthDate || "").trim();
  const wikipediaUrl = String(first.wikipediaUrl || "").trim();
  const deathDate = String(first.deathDate || "").trim();
  if (!qid || !name || !birthDate || !wikipediaUrl) return null;
  return {
    qid,
    name,
    birthDate,
    deathDate: deathDate || undefined,
    wikipediaUrl,
    theme: first.theme || "loisirs",
    gestureRoot: String(first.gestureRoot || "").trim() || "personnalite",
    editorialScore: typeof first.editorialScore === "number" ? first.editorialScore : 50,
    achievement: typeof first.achievement === "string" && first.achievement.trim() ? first.achievement.trim() : undefined
  };
}

export async function fetchNotableBirthMatch(input: {
  mirrorYear: number;
  lang: Lang;
  rank?: number;
  previousTheme?: string;
  previousGestureRoot?: string;
  seenThemes?: string[];
  seenGestureRoots?: string[];
}): Promise<NotableBirthMatch | null> {
  const rank = Math.max(1, input.rank || 1);
  const key = `${input.mirrorYear}|${input.lang}|${rank}|${input.previousTheme || ""}|${input.previousGestureRoot || ""}|${(input.seenThemes || []).join(",")}|${(input.seenGestureRoots || []).join(",")}`;
  if (cache.has(key)) {
    return cache.get(key) || null;
  }
  const inFlight = pending.get(key);
  if (inFlight) {
    return inFlight;
  }

  const task = (async () => {
    try {
      const params = new URLSearchParams({
        year: String(input.mirrorYear),
        lang: input.lang,
        limit: String(rank)
      });
      if (input.previousTheme) params.set("previousTheme", input.previousTheme);
      if (input.previousGestureRoot) params.set("previousGestureRoot", input.previousGestureRoot);
      if (input.seenThemes?.length) params.set("seenThemes", input.seenThemes.join(","));
      if (input.seenGestureRoots?.length) params.set("seenGestureRoots", input.seenGestureRoots.join(","));
      const response = await fetchWithTimeout(`/api/notable-born?${params.toString()}`, 10_000);
      if (!response.ok) return null;
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.toLowerCase().includes("application/json")) return null;
      const parsed = parseRank((await response.json()) as unknown, rank);
      cache.set(key, parsed);
      return parsed;
    } catch {
      cache.set(key, null);
      return null;
    } finally {
      pending.delete(key);
    }
  })();

  pending.set(key, task);
  return task;
}
