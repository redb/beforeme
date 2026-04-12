import { FR_INVENTION_CATALOG } from "./catalogs/fr/Q142";
import type { InventionCatalog, InventionEntry } from "./types";

const CATALOGS: InventionCatalog[] = [FR_INVENTION_CATALOG];

export function listInventionCatalogs(): InventionCatalog[] {
  return [...CATALOGS];
}

export function getInventionCatalog(countryQid: string, lang: "fr" | "en"): InventionCatalog | null {
  return CATALOGS.find((catalog) => catalog.countryQid === countryQid && catalog.supportedLangs.includes(lang)) || null;
}

export function listInventionEntries(countryQid: string, lang: "fr" | "en"): InventionEntry[] {
  return getInventionCatalog(countryQid, lang)?.entries || [];
}

export function findInventionById(id: string): InventionEntry | null {
  for (const catalog of CATALOGS) {
    const match = catalog.entries.find((entry) => entry.id === id);
    if (match) return match;
  }
  return null;
}
