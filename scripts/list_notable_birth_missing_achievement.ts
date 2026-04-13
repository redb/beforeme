import { FR_NOTABLE_BIRTHS } from "../src/content/notableBirths/catalogs/fr/global";
import { FR_NOTABLE_BIRTH_PERIOD_ENTRIES } from "../src/content/notableBirths/catalogs/fr/periods";
import type { NotableBirthEntry } from "../src/content/notableBirths/types";

const seenKeys = new Set<string>();
const ALL: NotableBirthEntry[] = [];
for (const entry of [...FR_NOTABLE_BIRTH_PERIOD_ENTRIES, ...FR_NOTABLE_BIRTHS.entries]) {
  const key = `${entry.year}|${entry.name.toLowerCase().trim()}`;
  if (seenKeys.has(key)) continue;
  seenKeys.add(key);
  ALL.push(entry);
}

const fr = ALL.filter((e) => e.lang === "fr");
const missing = fr.filter((e) => !e.achievement?.trim());
console.log(`Total FR (après dédup): ${fr.length}`);
console.log(`Sans achievement: ${missing.length}`);
for (const e of missing.sort((a, b) => a.year - b.year || a.name.localeCompare(b.name))) {
  console.log(`${e.year}\t${e.name}`);
}
