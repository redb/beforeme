import { listGestureEntries } from "../../content/gestures";
import type { EditorialTheme } from "../../content/editorialTheme";
import type { GestureRupture } from "../../content/gestures/types";
import { isCatalogPlaceholderGesture } from "../../lib/editorialCatalogPlaceholders";

export type GestureSelection = {
  exact: GestureRupture[];
  nearby: GestureRupture[];
};

/** 0 = premium : aucune carte « année proche », uniquement `ruptureYear === année demandée`. */
export const MAX_GESTURE_NEARBY_YEAR_DISTANCE = 0;

function computeBaseYearScore(entry: GestureRupture, targetYear: number): number {
  return entry.ruptureYear === targetYear ? 100 : 0;
}

function computeDiversityBonus(entry: GestureRupture, previousTheme?: EditorialTheme | null): number {
  if (!previousTheme) return 0;
  return entry.theme !== previousTheme ? 20 : 0;
}

function computeRepetitionPenalty(
  entry: GestureRupture,
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

function passesAntiRepetition(entry: GestureRupture, previousTheme?: EditorialTheme | null): boolean {
  if (!previousTheme) return true;
  if (entry.theme !== previousTheme) return true;
  return entry.editorialScore >= 90;
}

function scoreEntry(
  entry: GestureRupture,
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

export function selectGesturesForYear(params: {
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
}): GestureSelection {
  const entries = listGestureEntries(params.countryQid, params.lang).filter(
    (entry) => !isCatalogPlaceholderGesture(entry)
  );
  const compareEntries = (left: GestureRupture, right: GestureRupture) => {
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

  const rankExact = (input: GestureRupture[]) =>
    [...input]
    .filter((entry) => entry.ruptureYear === params.targetYear)
    .sort(compareEntries)
    .slice(0, params.exactLimit || 5);

  const rankNearby = (input: GestureRupture[]) =>
    [...input]
      .filter((entry) => entry.ruptureYear !== params.targetYear)
      .filter((entry) => Math.abs(entry.ruptureYear - params.targetYear) <= MAX_GESTURE_NEARBY_YEAR_DISTANCE)
      .sort((left, right) => {
        const distanceDiff =
          Math.abs(left.ruptureYear - params.targetYear) -
          Math.abs(right.ruptureYear - params.targetYear);
        if (distanceDiff !== 0) return distanceDiff;
        if (left.ruptureYear !== right.ruptureYear) return left.ruptureYear - right.ruptureYear;
        return compareEntries(left, right);
      })
      .slice(0, params.nearbyLimit || 5);

  const exact = rankExact(entries.filter((entry) => passesAntiRepetition(entry, params.previousTheme)));
  const fallbackExact = exact.length ? exact : rankExact(entries);
  const nearby = rankNearby(entries.filter((entry) => passesAntiRepetition(entry, params.previousTheme)));
  const fallbackNearby = nearby.length ? nearby : rankNearby(entries);
  return { exact: fallbackExact, nearby: fallbackNearby };
}
