import type { Lang } from './i18n';
import type { CountryCode } from './locale';

export type AnecdoteScope = 'global' | 'local';

export interface AnecdoteSlot {
  slot: number;
  narrative: string;
  fact: string;
  url: string;
}

interface HistoricalItem {
  scene: string;
  fact: string;
  sourceUrl: string;
}

interface HistoricalResponse {
  items?: HistoricalItem[];
}

const historicalCache = new Map<string, HistoricalItem[]>();
const historicalPending = new Map<string, Promise<HistoricalItem[]>>();
const historicalEmptyUntil = new Map<string, number>();
const HISTORICAL_QUICK_WAIT_MS = 350;
const HISTORICAL_EMPTY_COOLDOWN_MS = 10 * 60 * 1000;
const HISTORICAL_FETCH_TIMEOUT_MS = 5000;

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    window.clearTimeout(timer);
  }
}

function isAnecdoteSlot(value: unknown): value is AnecdoteSlot {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.slot === 'number' &&
    typeof candidate.narrative === 'string' &&
    typeof candidate.fact === 'string' &&
    typeof candidate.url === 'string' &&
    candidate.narrative.length > 0 &&
    candidate.fact.length > 0 &&
    candidate.url.length > 0
  );
}

function isHistoricalItem(value: unknown): value is HistoricalItem {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.scene === 'string' &&
    typeof candidate.fact === 'string' &&
    typeof candidate.sourceUrl === 'string' &&
    candidate.scene.length > 0 &&
    candidate.fact.length > 0 &&
    candidate.sourceUrl.length > 0
  );
}

function isHistoricalResponse(value: unknown): value is HistoricalResponse {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const payload = value as HistoricalResponse;
  if (!Array.isArray(payload.items)) {
    return false;
  }

  return payload.items.every(isHistoricalItem);
}

async function fetchHistoricalItems(input: { year: number; lang: Lang; country: CountryCode }): Promise<HistoricalItem[]> {
  const key = `${input.year}|${input.country}|${input.lang}`;
  const fromCache = historicalCache.get(key);
  if (fromCache) {
    return fromCache;
  }
  const emptyUntil = historicalEmptyUntil.get(key) || 0;
  if (Date.now() < emptyUntil) {
    return [];
  }

  const pending = historicalPending.get(key);
  if (pending) {
    return pending;
  }

  const task = (async () => {
    const params = new URLSearchParams({
      year: String(input.year),
      lang: input.lang,
      country: input.country
    });
    const paths = ['/api/anecdotes', '/.netlify/functions/anecdotes'];

    for (const path of paths) {
      let response: Response;
      try {
        response = await fetchWithTimeout(`${path}?${params.toString()}`, HISTORICAL_FETCH_TIMEOUT_MS);
      } catch {
        continue;
      }

      if (!response.ok) {
        continue;
      }

      const payload = (await response.json()) as unknown;
      if (!isHistoricalResponse(payload)) {
        continue;
      }

      const items = payload.items || [];
      if (items.length > 0) {
        historicalCache.set(key, items);
        historicalEmptyUntil.delete(key);
      }
      return items;
    }

    historicalEmptyUntil.set(key, Date.now() + HISTORICAL_EMPTY_COOLDOWN_MS);
    return [];
  })()
    .catch(() => [])
    .finally(() => {
      historicalPending.delete(key);
    });

  historicalPending.set(key, task);
  return task;
}

export async function fetchAnecdoteSlot(input: {
  year: number;
  lang: Lang;
  country: CountryCode;
  scope: AnecdoteScope;
  slot: number;
}): Promise<AnecdoteSlot | null> {
  if (input.slot >= 1 && input.slot <= 3) {
    const quickHistorical = await Promise.race<HistoricalItem[] | null>([
      fetchHistoricalItems({ year: input.year, lang: input.lang, country: input.country }),
      new Promise<null>((resolve) => {
        window.setTimeout(() => resolve(null), HISTORICAL_QUICK_WAIT_MS);
      })
    ]);

    if (quickHistorical) {
      const item = quickHistorical[input.slot - 1];
      if (item) {
        return {
          slot: input.slot,
          narrative: item.scene,
          fact: item.fact,
          url: item.sourceUrl
        };
      }
    }
  }

  const params = new URLSearchParams({
    year: String(input.year),
    lang: input.lang,
    country: input.country,
    scope: input.scope,
    slot: String(input.slot)
  });

  const paths = ['/api/anecdote', '/.netlify/functions/anecdote'];

  try {
    for (const path of paths) {
      const response = await fetch(`${path}?${params.toString()}`);

      if (!response.ok) {
        continue;
      }

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.toLowerCase().includes('application/json')) {
        continue;
      }

      const payload = (await response.json()) as unknown;
      if (isAnecdoteSlot(payload)) {
        return payload;
      }
    }

    return null;
  } catch {
    return null;
  }
}
