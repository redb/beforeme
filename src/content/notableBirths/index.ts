import { FR_NOTABLE_BIRTHS } from './catalogs/fr/global';
import { FR_NOTABLE_BIRTH_PERIOD_ENTRIES } from './catalogs/fr/periods';
import type { NotableBirthEntry } from './types';

// Priorité : périodes d'abord (contiennent les achievement),
// global en complément pour les années non couvertes par les périodes.
// Dédoublonnage par (year, name) — la première occurrence gagne.
const seenKeys = new Set<string>();
const ALL_ENTRIES: NotableBirthEntry[] = [];

for (const entry of [...FR_NOTABLE_BIRTH_PERIOD_ENTRIES, ...FR_NOTABLE_BIRTHS.entries]) {
  const key = `${entry.year}|${entry.name.toLowerCase().trim()}`;
  if (seenKeys.has(key)) continue;
  seenKeys.add(key);
  ALL_ENTRIES.push(entry);
}

export function listNotableBirthsForYear(year: number, lang: 'fr' | 'en'): NotableBirthEntry[] {
  return ALL_ENTRIES.filter((e) => e.lang === lang && e.year === year);
}

export function getNotableBirthForYear(year: number, lang: 'fr' | 'en'): NotableBirthEntry | null {
  return listNotableBirthsForYear(year, lang)[0] || null;
}
