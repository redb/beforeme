import { FR_CULTURAL_CATALOG } from "./catalogs/fr/Q142";
import type { CulturalMomentCatalog, CulturalMomentEntry } from "./types";

const CATALOGS: CulturalMomentCatalog[] = [FR_CULTURAL_CATALOG];

export function listCulturalCatalogs(): CulturalMomentCatalog[] {
  return [...CATALOGS];
}

export function getCulturalCatalog(countryQid: string, lang: "fr" | "en"): CulturalMomentCatalog | null {
  return CATALOGS.find((catalog) => catalog.countryQid === countryQid && catalog.supportedLangs.includes(lang)) || null;
}

export function listCulturalEntries(countryQid: string, lang: "fr" | "en"): CulturalMomentEntry[] {
  return getCulturalCatalog(countryQid, lang)?.entries || [];
}

export function findCulturalById(id: string): CulturalMomentEntry | null {
  for (const catalog of CATALOGS) {
    const match = catalog.entries.find((entry) => entry.id === id);
    if (match) return match;
  }
  return null;
}
