import assert from "node:assert/strict";
import { rm, mkdir, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { createRequire } from "node:module";

const root = process.cwd();
const outDir = path.join(root, ".tmp-place-smoke");

async function compile() {
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, "package.json"), '{"type":"commonjs"}\n', "utf-8");
  const cmd = spawnSync(
    "npx",
    [
      "tsc",
      "--outDir",
      outDir,
      "--module",
      "commonjs",
      "--target",
      "ES2022",
      "--moduleResolution",
      "node",
      "--skipLibCheck",
      "src/server/place/precisePlaceResolver.ts",
      "src/server/place/validateStrictPlace.ts",
      "src/lib/ruptureTaxonomy.ts"
    ],
    { cwd: root, stdio: "pipe", encoding: "utf-8" }
  );
  if (cmd.status !== 0) {
    throw new Error(cmd.stderr || cmd.stdout || "tsc_failed");
  }
}

async function run() {
  await compile();
  const require = createRequire(import.meta.url);
  const resolverMod = require(path.join(outDir, "server/place/precisePlaceResolver.js"));
  const validatorMod = require(path.join(outDir, "server/place/validateStrictPlace.js"));
  const taxonomyMod = require(path.join(outDir, "lib/ruptureTaxonomy.js"));

  const { resolvePrecisePlace } = resolverMod;
  const { acceptsStrictPlace } = validatorMod;
  const { RuptureType } = taxonomyMod;

  const legal = await resolvePrecisePlace({
    eventQid: "Q1",
    ruptureType: RuptureType.LEGAL_REGULATORY,
    year: 1968,
    countryQid: "Q142",
    lang: "fr",
    wikipediaUrl: "https://fr.wikipedia.org/wiki/Test",
    wikipediaLeadText: "La loi est publiée au Journal officiel de la République française.",
    wikipediaInfobox: null,
    wikidataPlace: null
  });
  assert.equal(legal.selected?.type, "institution");
  assert.match(legal.selected?.name || "", /Journal officiel/i);

  const local = await resolvePrecisePlace({
    eventQid: "Q2",
    ruptureType: RuptureType.INFRA_SERVICE,
    year: 1968,
    countryQid: "Q142",
    lang: "fr",
    wikipediaUrl: "https://fr.wikipedia.org/wiki/Test2",
    wikipediaLeadText: "Ouverture locale.",
    wikipediaInfobox: null,
    wikidataPlace: {
      p276Qid: "Q123",
      p276Label: "Palais des Festivals"
    }
  });
  assert.equal(local.selected?.type, "site");

  const cityOk = acceptsStrictPlace({
    selected: {
      id: "city|grenoble|Q1284",
      type: "city",
      name: "Grenoble",
      qid: "Q1284",
      evidence: "wikidata"
    },
    ruptureType: RuptureType.LEGAL_REGULATORY,
    datePrecision: "day",
    sourceUrls: ["https://fr.wikipedia.org/wiki/Test"]
  });
  assert.equal(cityOk, true);

  const institutionOfficialOk = acceptsStrictPlace({
    selected: {
      id: "institution|jorf|",
      type: "institution",
      name: "Journal officiel de la République française (JORF)",
      qid: null,
      evidence: "heuristic",
      sourceUrl: "https://www.legifrance.gouv.fr/"
    },
    ruptureType: RuptureType.LEGAL_REGULATORY,
    datePrecision: "day",
    sourceUrls: ["https://www.legifrance.gouv.fr/"]
  });
  assert.equal(institutionOfficialOk, true);

  console.log("place resolver smoke: ok");
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
