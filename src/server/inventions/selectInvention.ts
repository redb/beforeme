import { listInventionEntries } from "../../content/inventions";
import type { EditorialTheme } from "../../content/editorialTheme";
import type { InventionEntry } from "../../content/inventions/types";
import { isCatalogPlaceholderInvention } from "../../lib/editorialCatalogPlaceholders";

export type InventionSelection = {
  exact: InventionEntry[];
  nearby: InventionEntry[];
};

/** 0 = premium : uniquement `releaseYear === année demandée`. */
export const MAX_INVENTION_NEARBY_YEAR_DISTANCE = 0;

function computeBaseYearScore(entry: InventionEntry, targetYear: number): number {
  return entry.releaseYear === targetYear ? 100 : 0;
}

function computeDiversityBonus(entry: InventionEntry, previousTheme?: EditorialTheme | null): number {
  if (!previousTheme) return 0;
  return entry.theme !== previousTheme ? 20 : 0;
}

function computeRepetitionPenalty(
  entry: InventionEntry,
  previousTheme?: EditorialTheme | null,
  previousGestureRoot?: string | null,
  seenThemes: EditorialTheme[] = [],
  seenGestureRoots: string[] = []
): number {
  let penalty = 0;
  if (previousTheme && entry.theme === previousTheme) penalty += 50;
  if (previousGestureRoot && entry.gestureRoot === previousGestureRoot) penalty += 30;
  if (seenThemes.includes(entry.theme)) penalty += 8;
  if (seenGestureRoots.includes(entry.gestureRoot)) penalty += 12;
  return penalty;
}

function passesAntiRepetition(entry: InventionEntry, previousTheme?: EditorialTheme | null): boolean {
  if (!previousTheme) return true;
  if (entry.theme !== previousTheme) return true;
  return entry.editorialScore >= 90;
}

function scoreEntry(
  entry: InventionEntry,
  targetYear: number,
  previousTheme?: EditorialTheme | null,
  previousGestureRoot?: string | null,
  seenThemes: EditorialTheme[] = [],
  seenGestureRoots: string[] = [],
  shareBonus?: Map<string, number>
): number {
  return (
    computeBaseYearScore(entry, targetYear) +
    entry.editorialScore +
    computeDiversityBonus(entry, previousTheme) +
    (shareBonus?.get(entry.id) ?? 0) -
    computeRepetitionPenalty(entry, previousTheme, previousGestureRoot, seenThemes, seenGestureRoots)
  );
}

export function selectInventionsForYear(params: {
  countryQid: string;
  lang: "fr" | "en";
  targetYear: number;
  exactLimit?: number;
  nearbyLimit?: number;
  previousTheme?: EditorialTheme | null;
  previousGestureRoot?: string | null;
  seenThemes?: EditorialTheme[];
  seenGestureRoots?: string[];
  shareBonus?: Map<string, number>;
}): InventionSelection {
  const entries = listInventionEntries(params.countryQid, params.lang).filter(
    (entry) => !isCatalogPlaceholderInvention(entry)
  );
  const compareEntries = (left: InventionEntry, right: InventionEntry) => {
    const scoreDiff =
      scoreEntry(
        right,
        params.targetYear,
        params.previousTheme,
        params.previousGestureRoot,
        params.seenThemes,
        params.seenGestureRoots,
        params.shareBonus
      ) -
      scoreEntry(
        left,
        params.targetYear,
        params.previousTheme,
        params.previousGestureRoot,
        params.seenThemes,
        params.seenGestureRoots,
        params.shareBonus
      );
    if (scoreDiff !== 0) return scoreDiff;
    return left.id.localeCompare(right.id);
  };

  const rankExact = (input: InventionEntry[]) =>
    [...input]
    .filter((entry) => entry.releaseYear === params.targetYear)
    .sort(compareEntries)
    .slice(0, params.exactLimit || 5);

  const rankNearby = (input: InventionEntry[]) =>
    [...input]
      .filter((entry) => entry.releaseYear !== params.targetYear)
      .filter((entry) => Math.abs(entry.releaseYear - params.targetYear) <= MAX_INVENTION_NEARBY_YEAR_DISTANCE)
      .sort((left, right) => {
        const distanceDiff =
          Math.abs(left.releaseYear - params.targetYear) -
          Math.abs(right.releaseYear - params.targetYear);
        if (distanceDiff !== 0) return distanceDiff;
        if (left.releaseYear !== right.releaseYear) return left.releaseYear - right.releaseYear;
        return compareEntries(left, right);
      })
      .slice(0, params.nearbyLimit || 5);

  const exact = rankExact(entries.filter((entry) => passesAntiRepetition(entry, params.previousTheme)));
  const fallbackExact = exact.length ? exact : rankExact(entries);
  const nearby = rankNearby(entries.filter((entry) => passesAntiRepetition(entry, params.previousTheme)));
  const fallbackNearby = nearby.length ? nearby : rankNearby(entries);
  return { exact: fallbackExact, nearby: fallbackNearby };
}
