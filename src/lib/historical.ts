import type { Lang } from './i18n';

export interface HistoricalEvent {
  summary: string;
  label: string;
  url: string;
}

const cache = new Map<string, Promise<HistoricalEvent[]>>();

function isHistoricalEvent(value: unknown): value is HistoricalEvent {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.summary === 'string' &&
    typeof candidate.label === 'string' &&
    typeof candidate.url === 'string' &&
    candidate.summary.length > 0 &&
    candidate.label.length > 0 &&
    candidate.url.length > 0
  );
}

export function fetchHistoricalEvents(year: number, lang: Lang): Promise<HistoricalEvent[]> {
  const key = `${year}|${lang}`;

  if (!cache.has(key)) {
    const request = fetch(`/api/history?year=${encodeURIComponent(String(year))}&lang=${encodeURIComponent(lang)}`)
      .then(async (response) => {
        if (!response.ok) {
          return [] as HistoricalEvent[];
        }

        const payload = (await response.json()) as unknown;
        if (!Array.isArray(payload)) {
          return [] as HistoricalEvent[];
        }

        return payload.filter(isHistoricalEvent).slice(0, 5);
      })
      .catch(() => [] as HistoricalEvent[]);

    cache.set(key, request);
  }

  return cache.get(key)!;
}
