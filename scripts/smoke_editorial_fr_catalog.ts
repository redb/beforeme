import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { listCulturalEntries } from "../src/content/culturalMoments";
import { listGestureEntries } from "../src/content/gestures";
import { listInventionEntries } from "../src/content/inventions";

type EditorialRecord = {
  kind: "cultural" | "gesture" | "invention";
  id: string;
  date: string;
  datePrecision: "day" | "month" | "year";
  placeName: string;
  beforeState: string;
  afterState: string;
  changeDescription: string;
  sceneText: string;
  sourceCount: number;
  sources: Array<{ url: string }>;
};

const COUNTRY_QID = "Q142";
const LANG = "fr";

const PLACEHOLDER_PATTERNS = [
  /prend une forme publique et memorisable/i,
  /Ce n'est pas un simple titre dans une chronologie/i,
  /\b1990-05-50\b/,
  /\bscene\W+parait\W+neuve\b/i
];

const GENERIC_CONTEXT_PATTERNS = [
  /n'existe pas encore comme repere culturel partage/i,
  /devient un point de memoire collective/i,
  /Tu peux dater ce moment culturel a l'annee exacte et le rattacher a une image commune/i
];

const FOREIGN_VIEWPOINT_PATTERNS = [
  /\bNew York\b/i,
  /\bLos Angeles\b/i,
  /\bBerlin\b/i,
  /\bLondres\b/i,
  /\bJapon\b/i,
  /\bBudapest\b/i,
  /\bBell Labs\b/i,
  /\bNew Jersey\b/i,
  /\bPalladium\b/i,
  /\bmonde entier\b/i
];

function isValidDate(date: string, precision: EditorialRecord["datePrecision"]): boolean {
  const isValidYear = (value: string) => /^\d{4}$/.test(value);
  const isValidMonth = (value: string) => {
    if (!/^\d{4}-\d{2}$/.test(value)) return false;
    const [year, month] = value.split("-").map(Number);
    return year >= 1000 && year <= 2100 && month >= 1 && month <= 12;
  };
  const isValidDay = (value: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [year, month, day] = value.split("-").map(Number);
    const candidate = new Date(Date.UTC(year, month - 1, day));
    return (
      candidate.getUTCFullYear() === year &&
      candidate.getUTCMonth() === month - 1 &&
      candidate.getUTCDate() === day
    );
  };

  if (precision === "year") {
    return isValidYear(date) || isValidMonth(date) || isValidDay(date);
  }

  if (precision === "month") {
    return isValidMonth(date) || isValidDay(date);
  }

  return isValidDay(date);
}

function assertRecord(record: EditorialRecord) {
  assert.ok(record.sceneText.trim().length >= 80, `${record.kind}:${record.id} scene too short`);
  assert.ok(record.placeName.trim().length > 0, `${record.kind}:${record.id} place missing`);
  assert.ok(record.sources.length > 0, `${record.kind}:${record.id} sources missing`);
  assert.equal(record.sources.length, record.sourceCount, `${record.kind}:${record.id} sourceCount mismatch`);
  assert.ok(isValidDate(record.date, record.datePrecision), `${record.kind}:${record.id} invalid date ${record.date}`);
  assert.ok(record.beforeState.trim().length >= 40, `${record.kind}:${record.id} beforeState too short`);
  assert.ok(record.afterState.trim().length >= 40, `${record.kind}:${record.id} afterState too short`);
  assert.ok(record.changeDescription.trim().length >= 40, `${record.kind}:${record.id} changeDescription too short`);

  for (const pattern of PLACEHOLDER_PATTERNS) {
    assert.ok(!pattern.test(record.sceneText), `${record.kind}:${record.id} placeholder scene`);
  }

  for (const pattern of GENERIC_CONTEXT_PATTERNS) {
    assert.ok(!pattern.test(record.beforeState), `${record.kind}:${record.id} generic beforeState`);
    assert.ok(!pattern.test(record.afterState), `${record.kind}:${record.id} generic afterState`);
    assert.ok(!pattern.test(record.changeDescription), `${record.kind}:${record.id} generic changeDescription`);
  }

  // Gestes / culturel : éviter une scène centrée sur un lieu étranger sans ancrage français.
  // Inventions : une innovation peut naître à l'étranger tout en concernant la France (adoption, équipements) ;
  // on ne bloque pas Londres, Bell Labs, etc. sur ce type de carte.
  if (record.kind !== "invention") {
    for (const pattern of FOREIGN_VIEWPOINT_PATTERNS) {
      assert.ok(!pattern.test(record.sceneText), `${record.kind}:${record.id} foreign-centered scene`);
      assert.ok(!pattern.test(record.placeName), `${record.kind}:${record.id} foreign-centered place`);
    }
  }
}

export function collectEditorialRecordsForScan(): EditorialRecord[] {
  return [
    ...listGestureEntries(COUNTRY_QID, LANG).map((entry) => ({
      kind: "gesture" as const,
      id: entry.id,
      date: entry.ruptureDate,
      datePrecision: entry.datePrecision,
      placeName: entry.placeName,
      beforeState: entry.beforeState,
      afterState: entry.afterState,
      changeDescription: entry.gestureChanged,
      sceneText: entry.sceneText,
      sourceCount: entry.quality.sourceCount,
      sources: entry.sources
    })),
    ...listInventionEntries(COUNTRY_QID, LANG).map((entry) => ({
      kind: "invention" as const,
      id: entry.id,
      date: entry.releaseDate,
      datePrecision: entry.datePrecision,
      placeName: entry.placeName,
      beforeState: entry.beforeState,
      afterState: entry.afterState,
      changeDescription: entry.objectChanged,
      sceneText: entry.sceneText,
      sourceCount: entry.quality.sourceCount,
      sources: entry.sources
    })),
    ...listCulturalEntries(COUNTRY_QID, LANG).map((entry) => ({
      kind: "cultural" as const,
      id: entry.id,
      date: entry.date,
      datePrecision: entry.datePrecision,
      placeName: entry.placeName,
      beforeState: entry.beforeState,
      afterState: entry.afterState,
      changeDescription: entry.gestureChanged,
      sceneText: entry.sceneText,
      sourceCount: entry.quality.sourceCount,
      sources: entry.sources
    }))
  ];
}

export function assertEditorialRecord(record: EditorialRecord): void {
  assertRecord(record);
}

function main() {
  const records = collectEditorialRecordsForScan();
  assert.ok(records.length > 0, "no editorial records found");
  records.forEach(assertRecord);

  const counts = records.reduce<Record<EditorialRecord["kind"], number>>(
    (acc, record) => {
      acc[record.kind] += 1;
      return acc;
    },
    { cultural: 0, gesture: 0, invention: 0 }
  );

  console.log(JSON.stringify({ ok: true, ...counts, total: records.length }, null, 2));
}

const isDirectRun =
  typeof process.argv[1] === "string" &&
  path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1]);

if (isDirectRun) {
  main();
}
