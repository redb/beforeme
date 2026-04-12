import type { Lang } from "./i18n";
import type { CountryCode } from "./locale";
import { countryToQid } from "./locale";
import { fetchNotableBirthMatch } from "./notableBirthApi";

export type AnecdoteScope = "global" | "local";

export interface AnecdoteSlot {
  slot: number;
  narrative: string;
  fact: string;
  url: string;
  eventQid?: string;
  editorialId?: string;  // gesture_id | invention_id | moment_id pour les cartes éditoriales
  beforeState?: string;
  afterState?: string;
  sources?: Array<{ label: string; url: string }>;
  date?: string;
  placeName?: string;
  theme?: string;
  gestureRoot?: string;
  editorialScore?: number;
}

type SlotFamily = "daily_life" | "person" | "invention" | "cultural";

function computeAgeBeforeBirth(mirrorYear: number): number {
  return Math.floor((new Date().getFullYear() - mirrorYear) / 2);
}

interface BatchCandidate {
  qid: string;
}

interface RankedCandidatesResponse {
  items?: Array<{ qid?: string }>;
}

interface HistoryFallbackItem {
  label: string;
  summary: string;
  url: string;
}

function familyForSlot(slot: number): SlotFamily {
  const cycleIndex = (slot - 1) % 4;
  if (cycleIndex === 0) return "daily_life";
  if (cycleIndex === 1) return "person";
  if (cycleIndex === 2) return "invention";
  return "cultural";
}

function rankWithinFamily(slot: number): number {
  return Math.floor((slot - 1) / 4) + 1;
}

interface StableSceneResponse {
  event_qid?: string;
  gesture_id?: string;
  invention_id?: string;
  moment_id?: string;
  fact?: string;
  before_state?: string;
  after_state?: string;
  narrative_text?: string;
  date?: string;
  place?: { name?: string };
  gesture_changed?: string;
  object_changed?: string;
  material_anchor?: string;
  sources?: Array<{ label?: string; url?: string }>;
  theme?: string;
  gesture_root?: string;
  editorial_score?: number;
}

function extractYear(value?: string): number | null {
  const match = String(value || "").trim().match(/^(\d{4})/);
  if (!match) return null;
  const parsed = Number(match[1]);
  return Number.isInteger(parsed) ? parsed : null;
}

const batchCache = new Map<string, BatchCandidate[]>();
const batchPending = new Map<string, Promise<BatchCandidate[]>>();
const sessionMemory = {
  seenThemes: [] as string[],
  seenGestureRoots: [] as string[],
  seenEventKeys: [] as string[],
  seenSceneFingerprints: [] as string[]
};
let sessionMemoryKey = "";
const rememberedSlots = new Set<string>();

export function resetAnecdoteSessionMemory() {
  sessionMemoryKey = "";
  sessionMemory.seenThemes.length = 0;
  sessionMemory.seenGestureRoots.length = 0;
  sessionMemory.seenEventKeys.length = 0;
  sessionMemory.seenSceneFingerprints.length = 0;
  rememberedSlots.clear();
}

function cleanSentence(value: string): string {
  const text = String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;!?])/g, "$1")
    .replace(/([.?!]){2,}/g, "$1");
  if (!text) return "";
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

function escapeRegExp(value: string): string {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function formatDateLabel(isoDay: string, lang: Lang): string {
  const match = String(isoDay || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return String(isoDay || "").trim();
  const [, year, month, day] = match;
  if (lang === "fr") {
    const months = [
      "janvier",
      "fevrier",
      "mars",
      "avril",
      "mai",
      "juin",
      "juillet",
      "aout",
      "septembre",
      "octobre",
      "novembre",
      "decembre"
    ];
    return `${Number(day)} ${months[Number(month) - 1]} ${year}`;
  }
  return `${year}-${month}-${day}`;
}

function stripPrefix(value: string): string {
  return String(value || "")
    .trim()
    .replace(/^(avant|before|apres|après|after)\s*:?\s*/i, "")
    .replace(/^a partir de ce jour,\s*/i, "")
    .replace(/^a compter de ce jour,\s*/i, "")
    .replace(/^from this day on,\s*/i, "")
    .trim();
}

function buildNarrativeFromStableScene(params: {
  fact: string;
  beforeState: string;
  afterState: string;
  date?: string;
  placeName?: string;
  gestureChanged?: string;
}): string {
  const placeName = String(params.placeName || "").trim();
  const date = String(params.date || "").trim();
  const humanDate = formatDateLabel(date, "fr");

  const compactClause = (value: string) => {
    let text = stripPrefix(value);
    if (humanDate) {
      text = text.replace(new RegExp(`^(le\\s+)?${escapeRegExp(humanDate)}\\s*[,:-]?\\s*`, "i"), "");
    }
    if (date) {
      text = text.replace(new RegExp(`^${escapeRegExp(date)}\\s*[,:-]?\\s*`, "i"), "");
    }
    if (placeName) {
      text = text.replace(new RegExp(`^${escapeRegExp(placeName)}\\s*[,:-]?\\s*`, "i"), "");
    }
    return text
      .replace(/\s+/g, " ")
      .replace(/^[,;:\-–—]\s*/, "")
      .trim();
  };

  const gesture = compactClause(params.gestureChanged || "");
  const afterState = compactClause(params.afterState);
  const fact = compactClause(params.fact);
  const lines = [
    date && placeName ? cleanSentence(`${humanDate}, ${placeName}`) : "",
    cleanSentence(gesture || fact),
    cleanSentence(afterState)
  ].filter(Boolean);

  return lines
    .filter((line, index) => lines.findIndex((other) => other.toLowerCase() === line.toLowerCase()) === index)
    .join(" ");
}

function looksMechanicalNarrative(value: string): boolean {
  const text = String(value || "").trim();
  if (!text) return false;
  return /\b(avant|before|apres|après|after),\b/i.test(text) || /\bdevant\b/i.test(text);
}

function isLowQualityStableScene(data: {
  fact?: string;
  beforeState?: string;
  afterState?: string;
  narrativeText?: string;
  gestureChanged?: string;
}): boolean {
  const corpus = [
    data.fact,
    data.beforeState,
    data.afterState,
    data.narrativeText,
    data.gestureChanged
  ]
    .map((value) => String(value || "").trim().toLowerCase())
    .filter(Boolean)
    .join(" ");

  if (!corpus) return true;

  const genericProcedure =
    /(finaliser la d[ée]marche|la proc[ée]dure impose|pour continuer|tu dois pr[ée]senter)/i.test(corpus);
  const repeatedPlaceholder =
    /\b(quai|guichet|dossier|ticket|papier)\b[\s\S]{0,40}\b(quai|guichet|dossier|ticket|papier)\b/i.test(corpus);
  const velodromePattern = /velodrome d'?hiver/i.test(corpus) && /quai/.test(corpus);

  return (genericProcedure && repeatedPlaceholder) || velodromePattern;
}

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    window.clearTimeout(timer);
  }
}

function parseBatchCandidates(payload: unknown): BatchCandidate[] {
  const response = payload as RankedCandidatesResponse | null;
  const items = Array.isArray(response?.items) ? response.items : [];
  const out: BatchCandidate[] = [];

  for (const item of items) {
    const qid = String(item?.qid || "").toUpperCase();
    if (/^Q\d+$/.test(qid) || /^SEED-[A-Z0-9-]+$/.test(qid)) {
      out.push({ qid });
    }
  }

  return out;
}

function parseHistoryFallback(payload: unknown): HistoryFallbackItem[] {
  if (!Array.isArray(payload)) return [];
  return payload
    .map((entry) => {
      const label = typeof (entry as any)?.label === "string" ? (entry as any).label.trim() : "";
      const summary = typeof (entry as any)?.summary === "string" ? (entry as any).summary.trim() : "";
      const url = typeof (entry as any)?.url === "string" ? (entry as any).url.trim() : "";
      if (!label || !summary || !url) return null;
      return { label, summary, url };
    })
    .filter((entry): entry is HistoryFallbackItem => entry !== null);
}

function buildHistoryFallbackSlot(input: { slot: number; year: number; lang: Lang; items: HistoryFallbackItem[] }): AnecdoteSlot | null {
  if (!input.items.length) return null;
  const item = input.items[(Math.max(1, input.slot) - 1) % input.items.length];
  const narrative =
    input.lang === "fr"
      ? `En ${input.year}, ${item.summary}`
      : `In ${input.year}, ${item.summary}`;
  const fact =
    input.lang === "fr"
      ? `${item.label} (${input.year}).`
      : `${item.label} (${input.year}).`;

  return {
    slot: input.slot,
    narrative: cleanSentence(narrative),
    fact: cleanSentence(fact),
    url: item.url || "https://avantmoi.com",
    eventQid: `HISTORY-${input.year}-${Math.max(1, input.slot)}`,
    sources: [{ label: item.label || "Source", url: item.url || "https://avantmoi.com" }],
    date: `${input.year}-01-01`,
    placeName: "France",
    theme: "loisirs",
    gestureRoot: "fallback_history",
    editorialScore: 30
  };
}

function parseStableScene(payload: unknown, slot: number): AnecdoteSlot | null {
  if (!payload || typeof payload !== "object") return null;
  const data = payload as StableSceneResponse;
  const fact = typeof data.fact === "string" ? data.fact.trim() : "";
  const beforeState = typeof data.before_state === "string" ? data.before_state.trim() : "";
  const afterState = typeof data.after_state === "string" ? data.after_state.trim() : "";
  const narrativeText = typeof data.narrative_text === "string" ? data.narrative_text.trim() : "";
  const date = typeof data.date === "string" ? data.date.trim() : "";
  const placeName = typeof data.place?.name === "string" ? data.place.name.trim() : "";
  const gestureChanged =
    typeof data.gesture_changed === "string"
      ? data.gesture_changed.trim()
      : typeof data.object_changed === "string"
        ? data.object_changed.trim()
        : "";
  const theme = typeof data.theme === "string" ? data.theme.trim() : "";
  const gestureRoot = typeof data.gesture_root === "string" ? data.gesture_root.trim() : "";
  const editorialScore = typeof data.editorial_score === "number" ? data.editorial_score : 0;
  const eventQid = typeof data.event_qid === "string" ? data.event_qid.trim() : "";
  const editorialId =
    (typeof data.gesture_id === "string" && data.gesture_id.trim()) ||
    (typeof data.invention_id === "string" && data.invention_id.trim()) ||
    (typeof data.moment_id === "string" && data.moment_id.trim()) ||
    undefined;
  const narrative =
    narrativeText && !looksMechanicalNarrative(narrativeText)
      ? narrativeText
      : buildNarrativeFromStableScene({ fact, beforeState, afterState, date, placeName, gestureChanged });

  if (
    !narrative ||
    isLowQualityStableScene({
      fact,
      beforeState,
      afterState,
      narrativeText: narrative,
      gestureChanged
    })
  ) {
    return null;
  }

  const sources = (Array.isArray(data.sources) ? data.sources : [])
    .map((entry) => {
      const url = typeof entry?.url === "string" ? entry.url.trim() : "";
      if (!url) return null;
      const label = typeof entry?.label === "string" && entry.label.trim() ? entry.label.trim() : "Source";
      return { label, url };
    })
    .filter((entry): entry is { label: string; url: string } => entry !== null);

  return {
    slot,
    narrative,
    fact: fact || narrative,
    url: sources[0]?.url || "#",
    eventQid: eventQid || undefined,
    editorialId: editorialId || undefined,
    beforeState: beforeState || undefined,
    afterState: afterState || undefined,
    sources: sources.length ? sources : undefined,
    date: date || undefined,
    placeName: placeName || undefined,
    theme: theme || undefined,
    gestureRoot: gestureRoot || undefined,
    editorialScore: editorialScore || undefined
  };
}

function slotMatchesYear(slot: Pick<AnecdoteSlot, "date"> | null, targetYear: number): boolean {
  if (!slot?.date) return false;
  return extractYear(slot.date) === targetYear;
}

function buildNotableBirthSlot(input: {
  year: number;
  lang: Lang;
  slot: number;
  match: Awaited<ReturnType<typeof fetchNotableBirthMatch>>;
}): AnecdoteSlot | null {
  if (!input.match) {
    return null;
  }
  const age = computeAgeBeforeBirth(input.year);
  const achievement = input.match.achievement || "";
  const narrative =
    input.lang === "fr"
      ? achievement
        ? `${input.match.name} naît en ${input.year}. ${achievement} ${age} ans plus tard, c'est ton année de naissance.`
        : `${input.match.name} naît en ${input.year}. ${age} ans plus tard, c'est ton année de naissance.`
      : achievement
        ? `${input.match.name} is born in ${input.year}. ${achievement} ${age} years later, that is your birth year.`
        : `${input.match.name} is born in ${input.year}. ${age} years later, that is your birth year.`;
  const fact =
    input.lang === "fr"
      ? achievement
        ? `${input.match.name} naît en ${input.year}. ${achievement}`
        : `${input.match.name} naît le ${input.match.birthDate}.`
      : achievement
        ? `${input.match.name} is born in ${input.year}. ${achievement}`
        : `${input.match.name} is born on ${input.match.birthDate}.`;

  return {
    slot: input.slot,
    narrative: cleanSentence(narrative),
    fact: cleanSentence(fact),
    url: input.match.wikipediaUrl,
    eventQid: input.match.qid,
    sources: [{ label: "Wikipedia", url: input.match.wikipediaUrl }],
    date: input.match.birthDate,
    placeName: input.match.name,
    theme: input.match.theme,
    gestureRoot: input.match.gestureRoot,
    editorialScore: input.match.editorialScore
  };
}

function ensureSessionMemory(input: { year: number; lang: Lang; country: CountryCode }) {
  const nextKey = `${input.year}|${input.country}|${input.lang}`;
  if (sessionMemoryKey === nextKey) return;
  sessionMemoryKey = nextKey;
  sessionMemory.seenThemes.length = 0;
  sessionMemory.seenGestureRoots.length = 0;
  sessionMemory.seenEventKeys.length = 0;
  sessionMemory.seenSceneFingerprints.length = 0;
  rememberedSlots.clear();
}

function slotEventKeys(slot: AnecdoteSlot): string[] {
  const keys: string[] = [];
  const qid = String(slot.eventQid || "").trim().toUpperCase();
  if (qid) keys.push(`qid:${qid}`);
  const primaryUrl = String(slot.sources?.[0]?.url || slot.url || "").trim().toLowerCase();
  if (primaryUrl) keys.push(`url:${primaryUrl}`);
  return keys;
}

function slotSceneFingerprint(slot: AnecdoteSlot): string {
  const date = String(slot.date || "").trim().toLowerCase();
  const place = String(slot.placeName || "").trim().toLowerCase();
  const narrative = String(slot.narrative || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
  const key = [date, place, narrative].filter(Boolean).join("|");
  return key.slice(0, 320);
}

function isSlotAlreadySeen(slot: AnecdoteSlot): boolean {
  const keys = slotEventKeys(slot);
  const fingerprint = slotSceneFingerprint(slot);
  const byEvent = keys.length ? keys.some((key) => sessionMemory.seenEventKeys.includes(key)) : false;
  const byContent = fingerprint ? sessionMemory.seenSceneFingerprints.includes(fingerprint) : false;
  return byEvent || byContent;
}

function rememberSlot(input: { year: number; lang: Lang; country: CountryCode; slot: AnecdoteSlot }) {
  const key = `${input.year}|${input.country}|${input.lang}|${input.slot.slot}`;
  if (rememberedSlots.has(key)) return;
  rememberedSlots.add(key);

  if (input.slot.theme) {
    sessionMemory.seenThemes.push(input.slot.theme);
    if (sessionMemory.seenThemes.length > 5) {
      sessionMemory.seenThemes.splice(0, sessionMemory.seenThemes.length - 5);
    }
  }

  if (input.slot.gestureRoot) {
    sessionMemory.seenGestureRoots.push(input.slot.gestureRoot);
    if (sessionMemory.seenGestureRoots.length > 5) {
      sessionMemory.seenGestureRoots.splice(0, sessionMemory.seenGestureRoots.length - 5);
    }
  }

  for (const key of slotEventKeys(input.slot)) {
    if (!sessionMemory.seenEventKeys.includes(key)) {
      sessionMemory.seenEventKeys.push(key);
    }
    if (sessionMemory.seenEventKeys.length > 20) {
      sessionMemory.seenEventKeys.splice(0, sessionMemory.seenEventKeys.length - 20);
    }
  }

  const fingerprint = slotSceneFingerprint(input.slot);
  if (fingerprint && !sessionMemory.seenSceneFingerprints.includes(fingerprint)) {
    sessionMemory.seenSceneFingerprints.push(fingerprint);
    if (sessionMemory.seenSceneFingerprints.length > 20) {
      sessionMemory.seenSceneFingerprints.splice(0, sessionMemory.seenSceneFingerprints.length - 20);
    }
  }
}

async function fetchBatchCandidates(input: {
  year: number;
  country: CountryCode;
  lang: Lang;
}): Promise<BatchCandidate[]> {
  const key = `${input.year}|${input.country}|${input.lang}`;
  const fromCache = batchCache.get(key);
  if (fromCache) return fromCache;

  const pending = batchPending.get(key);
  if (pending) return pending;

  const task = (async () => {
    try {
      const params = new URLSearchParams({
        year: String(input.year),
        country: countryToQid(input.country),
        lang: input.lang,
        limit: "20"
      });
      const response = await fetchWithTimeout(`/api/candidates-ranked?${params.toString()}`, 12_000);
      if (!response.ok) return [];
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.toLowerCase().includes("application/json")) return [];
      const payload = parseBatchCandidates((await response.json()) as unknown);
      if (payload.length) {
        batchCache.set(key, payload);
      }
      return payload;
    } catch {
      return [];
    }
  })()
    .catch(() => [])
    .finally(() => {
      batchPending.delete(key);
    });

  batchPending.set(key, task);
  return task;
}

async function buildHistoryFallback(input: {
  year: number;
  lang: Lang;
  slot: number;
  country: CountryCode;
}): Promise<AnecdoteSlot | null> {
  const historyResponse = await fetchWithTimeout(
    `/api/history?year=${encodeURIComponent(String(input.year))}&lang=${encodeURIComponent(input.lang)}`,
    8_000
  );
  if (!historyResponse.ok) return null;
  const contentType = historyResponse.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) return null;
  const historyItems = parseHistoryFallback((await historyResponse.json()) as unknown);
  const historySlot = buildHistoryFallbackSlot({
    slot: input.slot,
    year: input.year,
    lang: input.lang,
    items: historyItems
  });
  if (!historySlot || isSlotAlreadySeen(historySlot)) return null;
  rememberSlot({ ...input, slot: historySlot });
  return historySlot;
}

export async function fetchAnecdoteSlot(input: {
  year: number;
  lang: Lang;
  country: CountryCode;
  scope: AnecdoteScope;
  slot: number;
}): Promise<AnecdoteSlot | null> {
  void input.scope;
  ensureSessionMemory(input);

  try {
    const family = familyForSlot(input.slot);
    const familyRank = rankWithinFamily(input.slot);
    const previousTheme = sessionMemory.seenThemes.at(-1) || "";
    const previousGestureRoot = sessionMemory.seenGestureRoots.at(-1) || "";

    if (family === "person") {
      const notableBirth = await fetchNotableBirthMatch({
        mirrorYear: input.year,
        lang: input.lang,
        rank: familyRank,
        previousTheme,
        previousGestureRoot,
        seenThemes: sessionMemory.seenThemes,
        seenGestureRoots: sessionMemory.seenGestureRoots
      });
      const slotPayload = buildNotableBirthSlot({
        year: input.year,
        lang: input.lang,
        slot: input.slot,
        match: notableBirth
      });
      if (slotPayload && slotMatchesYear(slotPayload, input.year) && !isSlotAlreadySeen(slotPayload)) {
        rememberSlot({ ...input, slot: slotPayload });
        return slotPayload;
      }
      return null;
    }

    const editorialPath =
      family === "invention"
        ? "/api/invention-scene"
        : family === "cultural"
          ? "/api/cultural-scene"
          : "/api/gesture-scene";
    const editorialParams = new URLSearchParams({
      year: String(input.year),
      lang: input.lang,
      country: countryToQid(input.country),
      slot: String(familyRank),
      previousTheme,
      previousGestureRoot,
      seenThemes: sessionMemory.seenThemes.join(","),
      seenGestureRoots: sessionMemory.seenGestureRoots.join(",")
    });
    const editorialResponse = await fetchWithTimeout(`${editorialPath}?${editorialParams.toString()}`, 10_000);
    if (editorialResponse.ok) {
      const contentType = editorialResponse.headers.get("content-type") || "";
      if (contentType.toLowerCase().includes("application/json")) {
        const editorialPayload = parseStableScene((await editorialResponse.json()) as unknown, input.slot);
        if (editorialPayload && slotMatchesYear(editorialPayload, input.year) && !isSlotAlreadySeen(editorialPayload)) {
          rememberSlot({ ...input, slot: editorialPayload });
          return editorialPayload;
        }
      }
    }

    if (familyRank > 1) {
      return null;
    }

    const candidates = await fetchBatchCandidates({
      year: input.year,
      country: input.country,
      lang: input.lang
    });
    if (!candidates.length) {
      return await buildHistoryFallback(input);
    }

    const startIndex = Math.max(0, familyRank - 1);
    const seenSet = new Set(sessionMemory.seenEventKeys);
    const candidateWindow = candidates.slice(startIndex, startIndex + 8);
    const filteredWindow = candidateWindow.filter((candidate) => !seenSet.has(`qid:${candidate.qid.toUpperCase()}`));
    const retryCandidates = filteredWindow.slice(0, 4);
    if (!retryCandidates.length) {
      return await buildHistoryFallback(input);
    }

    const params = new URLSearchParams({
      year: String(input.year),
      lang: input.lang,
      country: countryToQid(input.country),
      mode: "fast"
    });

    for (const candidate of retryCandidates) {
      params.set("qid", candidate.qid);
      const response = await fetchWithTimeout(`/api/scene?${params.toString()}`, 70_000);

      if (response.status === 202 || response.status === 503 || response.status === 504 || response.status === 429) {
        continue;
      }
      if (response.status === 404 || response.status === 422) {
        continue;
      }
      if (!response.ok) {
        continue;
      }

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.toLowerCase().includes("application/json")) {
        continue;
      }

      const payload = parseStableScene((await response.json()) as unknown, input.slot);
      if (payload && slotMatchesYear(payload, input.year) && !isSlotAlreadySeen(payload)) {
        rememberSlot({ ...input, slot: payload });
        return payload;
      }
    }

    return await buildHistoryFallback(input);
  } catch {
    return null;
  }
}
