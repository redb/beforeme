import type { EditorialTheme } from "../../content/editorialTheme";
import type { CulturalMomentEntry } from "../../content/culturalMoments/types";
import { listCulturalEntries } from "../../content/culturalMoments";
import { isCatalogPlaceholderCultural } from "../../lib/editorialCatalogPlaceholders";

export type CulturalSelectionContext = {
  year: number;
  countryQid: string;
  lang: "fr" | "en";
  entries: CulturalMomentEntry[];
};

export type CulturalSelectionParams = {
  slot: number;
  previousTheme?: EditorialTheme | null;
  previousGestureRoot?: string | null;
  seenThemes?: EditorialTheme[];
  seenGestureRoots?: string[];
};

export function getCulturalSelectionContext(params: {
  year: number;
  countryQid: string;
  lang: "fr" | "en";
}): CulturalSelectionContext {
  return {
    year: params.year,
    countryQid: params.countryQid,
    lang: params.lang,
    entries: listCulturalEntries(params.countryQid, params.lang).filter(
      (entry) => !isCatalogPlaceholderCultural(entry)
    )
  };
}

function baseYearScore(year: number, entry: CulturalMomentEntry): number {
  return entry.year === year ? 100 : 0;
}

function isAllowed(entry: CulturalMomentEntry, previousTheme?: EditorialTheme | null): boolean {
  if (!previousTheme) return true;
  if (entry.theme !== previousTheme) return true;
  return entry.editorialScore >= 90;
}

function scoreEntry(
  year: number,
  entry: CulturalMomentEntry,
  params: Omit<CulturalSelectionParams, "slot">
): number {
  const diversityBonus = params.previousTheme && params.previousTheme !== entry.theme ? 20 : 0;
  const repetitionPenalty = [
    params.previousTheme === entry.theme ? 50 : 0,
    params.previousGestureRoot === entry.gestureRoot ? 30 : 0,
    params.seenThemes?.includes(entry.theme) ? 8 : 0,
    params.seenGestureRoots?.includes(entry.gestureRoot) ? 12 : 0
  ].reduce((sum, value) => sum + value, 0);

  return baseYearScore(year, entry) + entry.editorialScore + diversityBonus - repetitionPenalty;
}

export function selectCulturalForYear(
  context: CulturalSelectionContext,
  params: CulturalSelectionParams
): CulturalMomentEntry | null {
  const rank = (input: CulturalMomentEntry[]) =>
    [...input]
      .filter((entry) => entry.year === context.year)
      .sort((left, right) => {
        const scoreDiff =
          scoreEntry(context.year, right, params) -
          scoreEntry(context.year, left, params);
        if (scoreDiff !== 0) return scoreDiff;
        return left.id.localeCompare(right.id);
      });

  const ranked = rank(context.entries.filter((entry) => isAllowed(entry, params.previousTheme)));
  const fallbackRanked = ranked.length ? ranked : rank(context.entries);

  const index = Math.max(0, params.slot - 1);
  return fallbackRanked[index] || null;
}
