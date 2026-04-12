import { FR_GESTURE_CATALOG } from "./catalogs/fr/Q142";
import type { GestureCatalog, GestureRupture } from "./types";

const CATALOGS: GestureCatalog[] = [FR_GESTURE_CATALOG];

export function listGestureCatalogs(): GestureCatalog[] {
  return [...CATALOGS];
}

export function getGestureCatalog(countryQid: string, lang: "fr" | "en"): GestureCatalog | null {
  return CATALOGS.find((catalog) => catalog.countryQid === countryQid && catalog.supportedLangs.includes(lang)) || null;
}

export function listGestureEntries(countryQid: string, lang: "fr" | "en"): GestureRupture[] {
  return getGestureCatalog(countryQid, lang)?.entries || [];
}

export function findGestureById(id: string): GestureRupture | null {
  for (const catalog of CATALOGS) {
    const match = catalog.entries.find((entry) => entry.id === id);
    if (match) return match;
  }
  return null;
}
