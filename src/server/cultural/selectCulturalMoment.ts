import type { EditorialTheme } from "../../content/editorialTheme";
import type { CulturalMomentEntry } from "../../content/culturalMoments/types";
import { listCulturalEntries } from "../../content/culturalMoments";
import { isCatalogPlaceholderCultural } from "../../lib/editorialCatalogPlaceholders";
import { passesEditorialClusterFilter } from "../../lib/editorialCluster";

export type CulturalMomentSelectionContext = {
  year: number;
  countryQid: string;
  lang: "fr" | "en";
  entries: CulturalMomentEntry[];
};

export type CulturalMomentSelectionParams = {
  slot: number;
  previousTheme?: EditorialTheme | null;
  previousGestureRoot?: string | null;
  seenThemes?: EditorialTheme[];
  seenGestureRoots?: string[];
  seenClusters?: string[];
  shareBonus?: Map<string, number>;
};

/** 0 = premium : uniquement `year === année demandée`. */
export const MAX_CULTURAL_NEARBY_YEAR_DISTANCE = 0;

export function getCulturalMomentSelectionContext(params: {
  year: number;
  countryQid: string;
  lang: "fr" | "en";
}): CulturalMomentSelectionContext {
  return {
    year: params.year,
    countryQid: params.countryQid,
    lang: params.lang,
    entries: listCulturalEntries(params.countryQid, params.lang).filter(
      (entry) => !isCatalogPlaceholderCultural(entry)
    )
  };
}

function isValid(entry: CulturalMomentEntry): boolean {
  if (!entry.year || !entry.date || !entry.label || !entry.sceneText || !entry.fact) return false;
  if (!entry.category) return false;
  if (!entry.sources || entry.sources.length === 0) return false;

  const corpus = `${entry.label} ${entry.momentLabel} ${entry.fact}`.toLowerCase();
  if (/(^|\s)(naissance|ne le|nee le|ne a|nee a|born on|born in)(\s|$)/i.test(corpus)) return false;
  if (/\b(invention|brevet|prototype|technolog|technique)\b/i.test(corpus)) return false;
  if (/\btu\s+(peux|dois|utilis|payer|acheter|prendre|monter|descendre)\b/i.test(entry.sceneText)) return false;
  return true;
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
  params: Omit<CulturalMomentSelectionParams, "slot">
): number {
  const diversityBonus = params.previousTheme && params.previousTheme !== entry.theme ? 20 : 0;
  const repetitionPenalty = [
    params.previousTheme === entry.theme ? 50 : 0,
    params.previousGestureRoot === entry.gestureRoot ? 30 : 0,
    params.seenThemes?.includes(entry.theme) ? 8 : 0,
    params.seenGestureRoots?.includes(entry.gestureRoot) ? 12 : 0
  ].reduce((sum, value) => sum + value, 0);

  const shareBonus =
    params.shareBonus instanceof Map ? (params.shareBonus.get(entry.id) ?? 0) : 0;
  return baseYearScore(year, entry) + entry.editorialScore + diversityBonus + shareBonus - repetitionPenalty;
}

export function selectCulturalMomentForYear(
  context: CulturalMomentSelectionContext,
  params: CulturalMomentSelectionParams
): CulturalMomentEntry | null {
  const seenClusters = params.seenClusters ?? [];
  const baseEntries = context.entries.filter((entry) => passesEditorialClusterFilter(entry, seenClusters));
  const scoped: CulturalMomentSelectionContext = { ...context, entries: baseEntries };

  const rankExact = (input: CulturalMomentEntry[]) =>
    [...input]
      .filter((entry) => entry.year === scoped.year)
      .filter((entry) => isValid(entry))
      .sort((left, right) => {
        const scoreDiff = scoreEntry(scoped.year, right, params) - scoreEntry(scoped.year, left, params);
        if (scoreDiff !== 0) return scoreDiff;
        return left.id.localeCompare(right.id);
      });

  const rankNearby = (input: CulturalMomentEntry[]) =>
    [...input]
      .filter((entry) => entry.year !== scoped.year)
      .filter((entry) => Math.abs(entry.year - scoped.year) <= MAX_CULTURAL_NEARBY_YEAR_DISTANCE)
      .filter((entry) => isValid(entry))
      .sort((left, right) => {
        const distanceDiff = Math.abs(left.year - scoped.year) - Math.abs(right.year - scoped.year);
        if (distanceDiff !== 0) return distanceDiff;
        if (left.year !== right.year) return left.year - right.year;
        const scoreDiff = scoreEntry(scoped.year, right, params) - scoreEntry(scoped.year, left, params);
        if (scoreDiff !== 0) return scoreDiff;
        return left.id.localeCompare(right.id);
      });

  const ranked = rankExact(scoped.entries.filter((entry) => isAllowed(entry, params.previousTheme)));
  const fallbackRanked = ranked.length ? ranked : rankExact(scoped.entries);
  const nearby = rankNearby(scoped.entries.filter((entry) => isAllowed(entry, params.previousTheme)));
  const fallbackNearby = nearby.length ? nearby : rankNearby(scoped.entries);
  const combined = [...fallbackRanked, ...fallbackNearby];

  const index = Math.max(0, params.slot - 1);
  return combined[index] || null;
}
