/**
 * Rapport de couverture du catalogue éditorial FR (Q142) — pilier (B) du plan produit.
 *
 * Usage:
 *   npx tsx scripts/editorial/catalog_gap_report.ts
 *   npx tsx scripts/editorial/catalog_gap_report.ts --json > gaps.json
 *   npx tsx scripts/editorial/catalog_gap_report.ts --fail-if-any-gap   # exit 1 si une année manque un axe
 *   npx tsx scripts/editorial/catalog_gap_report.ts --by-axis            # comptage et années par axe manquant
 *   npx tsx scripts/editorial/catalog_gap_report.ts --priority           # années triées (plus de trous d'abord)
 *   npx tsx scripts/editorial/catalog_gap_report.ts --only-axis=invention
 *
 * Workflow suggéré : lancer ce script après un ajout de cartes ; prioriser les années listées
 * dans « années avec au moins un trou » ; le repli IA+R2 ((A)) reste documenté dans le code (/api/scene).
 */

import { listCulturalEntries } from "../../src/content/culturalMoments/index.ts";
import { listGestureEntries } from "../../src/content/gestures/index.ts";
import { listInventionEntries } from "../../src/content/inventions/index.ts";
import { listNotableBirthsForYear } from "../../src/content/notableBirths/index.ts";

const START_YEAR = 1925;
/** Plafond catalogue : au-delà (ex. 2026 sans naissances notables), ne pas exiger les 4 axes. */
const END_YEAR = Math.min(2025, new Date().getFullYear());
const COUNTRY = "Q142" as const;
const LANG = "fr" as const;

type Axis = "gesture" | "invention" | "cultural" | "person";

type YearRow = {
  year: number;
  gesture: number;
  invention: number;
  cultural: number;
  person: number;
};

const AXES: Axis[] = ["gesture", "invention", "cultural", "person"];

function parseArgs() {
  const argv = process.argv.slice(2);
  const onlyAxisRaw = argv.find((a) => a.startsWith("--only-axis="))?.split("=", 2)[1];
  const onlyAxis =
    onlyAxisRaw && AXES.includes(onlyAxisRaw as Axis) ? (onlyAxisRaw as Axis) : null;
  return {
    json: argv.includes("--json"),
    byAxis: argv.includes("--by-axis"),
    priority: argv.includes("--priority"),
    onlyAxis,
    failIfAnyGap: argv.includes("--fail-if-any-gap"),
    maxList: (() => {
      const raw = argv.find((a) => a.startsWith("--max-list="));
      if (!raw) return 80;
      const n = Number(raw.split("=")[1]);
      return Number.isFinite(n) && n > 0 ? Math.min(500, n) : 80;
    })()
  };
}

function buildRows(endYear: number): YearRow[] {
  const gestures = listGestureEntries(COUNTRY, LANG);
  const inventions = listInventionEntries(COUNTRY, LANG);
  const cultural = listCulturalEntries(COUNTRY, LANG);

  const rows: YearRow[] = [];
  for (let year = START_YEAR; year <= endYear; year++) {
    rows.push({
      year,
      gesture: gestures.filter((e) => e.ruptureYear === year).length,
      invention: inventions.filter((e) => e.releaseYear === year).length,
      cultural: cultural.filter((e) => e.year === year).length,
      person: listNotableBirthsForYear(year, LANG).length
    });
  }
  return rows;
}

function missingAxes(row: YearRow): Axis[] {
  const out: Axis[] = [];
  if (row.gesture === 0) out.push("gesture");
  if (row.invention === 0) out.push("invention");
  if (row.cultural === 0) out.push("cultural");
  if (row.person === 0) out.push("person");
  return out;
}

function buildByAxis(gaps: Array<{ year: number; missing: Axis[] }>): Record<Axis, number[]> {
  const map: Record<Axis, number[]> = {
    gesture: [],
    invention: [],
    cultural: [],
    person: []
  };
  for (const g of gaps) {
    for (const a of g.missing) {
      map[a].push(g.year);
    }
  }
  for (const a of AXES) {
    map[a].sort((x, y) => x - y);
  }
  return map;
}

function main() {
  const args = parseArgs();
  const endYear = END_YEAR;
  const rows = buildRows(endYear);

  const withAnyGap = rows.filter((r) => missingAxes(r).length > 0);
  const fullHouse = rows.length - withAnyGap.length;

  const gapRows = withAnyGap.map((r) => ({
    year: r.year,
    counts: {
      gesture: r.gesture,
      invention: r.invention,
      cultural: r.cultural,
      person: r.person
    },
    missing: missingAxes(r)
  }));

  const byAxis = buildByAxis(gapRows);
  const byAxisSummary = Object.fromEntries(
    AXES.map((a) => [a, { missingYearSlots: byAxis[a].length, years: byAxis[a] }])
  ) as Record<Axis, { missingYearSlots: number; years: number[] }>;

  const priorityQueue = [...gapRows]
    .sort((a, b) => b.missing.length - a.missing.length || a.year - b.year)
    .map((g) => ({ year: g.year, missingCount: g.missing.length, missing: g.missing }));

  const gapsFiltered = args.onlyAxis
    ? gapRows.filter((g) => g.missing.includes(args.onlyAxis!))
    : gapRows;

  const payload = {
    meta: {
      country: COUNTRY,
      lang: LANG,
      startYear: START_YEAR,
      endYear,
      totalYears: rows.length
    },
    summary: {
      yearsWithAllFourAxes: fullHouse,
      yearsWithAtLeastOneGap: withAnyGap.length,
      pctComplete: rows.length ? Math.round((fullHouse / rows.length) * 1000) / 10 : 0
    },
    byAxis: byAxisSummary,
    priorityQueue,
    gaps: gapRows,
    ...(args.onlyAxis ? { filter: { onlyAxis: args.onlyAxis }, gapsFiltered } : {})
  };

  if (args.json) {
    console.log(JSON.stringify(payload, null, 2));
  } else if (args.byAxis) {
    console.log("=== Manques par axe (nombre d'années concernées) ===\n");
    for (const a of AXES) {
      const ys = byAxis[a];
      console.log(`${a}: ${ys.length} année(s) — ${ys.join(", ")}`);
    }
    console.log("");
  } else if (args.priority) {
    console.log("=== File de priorité (plus de trous d'abord) ===\n");
    for (const p of priorityQueue.slice(0, args.maxList)) {
      console.log(`${p.year}\t${p.missingCount}\t${p.missing.join(",")}`);
    }
    if (priorityQueue.length > args.maxList) {
      console.log(`\n… ${priorityQueue.length - args.maxList} ligne(s) supplémentaires (voir --json).`);
    }
    console.log("");
  } else {
    console.log("=== Catalogue éditorial FR (Q142) — rapport de couverture ===\n");
    console.log(`Période : ${START_YEAR}–${endYear} (${rows.length} années)`);
    console.log(`Années avec les 4 axes (geste, invention, culturel, naissance) : ${fullHouse}`);
    console.log(`Années avec au moins un trou : ${withAnyGap.length} (${payload.summary.pctComplete}% « complètes »)\n`);

    console.log("Manques par axe (années) :");
    for (const a of AXES) {
      const ys = byAxis[a];
      console.log(`  ${a}: ${ys.length} — ${ys.slice(0, 12).join(", ")}${ys.length > 12 ? " …" : ""}`);
    }
    console.log("");

    const listSource = args.onlyAxis ? gapsFiltered : gapRows;
    const list = listSource.slice(0, args.maxList);
    if (list.length === 0) {
      console.log("Aucun trou : catalogue exact sur toute la plage (par axe).");
    } else {
      if (args.onlyAxis) {
        console.log(`Filtre --only-axis=${args.onlyAxis} : ${listSource.length} année(s).\n`);
      }
      console.log(`Premières ${list.length} années à enrichir (0 = manquant sur cet axe) :\n`);
      console.log(" année | geste inv. cult. pers. | manquants");
      console.log("-------+------------------------+----------");
      for (const r of list) {
        const c = r.counts;
        console.log(
          ` ${r.year} |   ${c.gesture}    ${c.invention}    ${c.cultural}    ${c.person}   | ${r.missing.join(",")}`
        );
      }
      if (listSource.length > list.length) {
        console.log(`\n… et ${listSource.length - list.length} autres (utilise --json ou --max-list=N).`);
      }
    }

    console.log("\n--- Prochaines étapes (B) ---");
    console.log("1. Choisir une année dans la liste ; ouvrir le fichier période dans src/content/*/catalogs/fr/periods/");
    console.log("2. Ajouter une carte validée (types dans src/content/*/types.ts) + sources");
    console.log("3. Relancer : npm run editorial:gap-report");
    console.log("4. Optionnel : npm run test:editorial-fr && npx tsx scripts/audit_france_story_coverage.ts\n");
  }

  if (args.failIfAnyGap && withAnyGap.length > 0) {
    process.exitCode = 1;
  }
}

main();
