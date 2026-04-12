import assert from "node:assert/strict";
import { rm, mkdir, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { createRequire } from "node:module";

const root = process.cwd();
const outDir = path.join(root, ".tmp-rank-impact-smoke");

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
      "src/server/candidates/rankImpact.ts",
      "src/server/candidates/enrichSources.ts",
      "src/server/candidates/seedOverrides.ts",
      "src/server/candidates/types.ts",
      "src/lib/ruptureTaxonomy.ts"
    ],
    { cwd: root, stdio: "pipe", encoding: "utf-8" }
  );
  if (cmd.status !== 0) throw new Error(cmd.stderr || cmd.stdout || "tsc_failed");
}

async function run() {
  await compile();
  const require = createRequire(import.meta.url);
  let rankImpactMod = null;
  let enrichSourcesMod = null;
  try {
    rankImpactMod = require(path.join(outDir, "src/server/candidates/rankImpact.js"));
    enrichSourcesMod = require(path.join(outDir, "src/server/candidates/enrichSources.js"));
  } catch {
    try {
      rankImpactMod = require(path.join(outDir, "server/candidates/rankImpact.js"));
      enrichSourcesMod = require(path.join(outDir, "server/candidates/enrichSources.js"));
    } catch {
      rankImpactMod = require(path.join(outDir, "rankImpact.js"));
      enrichSourcesMod = require(path.join(outDir, "enrichSources.js"));
    }
  }
  const { rankImpact } = rankImpactMod;
  const { enrichSources } = enrichSourcesMod;

  const candidates = enrichSources([
    {
      qid: "Q1",
      title: "Loi Veil",
      date: "1975-01-17",
      wikipediaUrl: "https://fr.wikipedia.org/wiki/Loi_Veil",
      rupture_type: "LEGAL_REGULATORY",
      confidence: 0.9,
      placeHints: { p276Qid: "Q230472", p276Label: "Journal officiel" }
    },
    {
      qid: "Q2",
      title: "Liste d evenements en France",
      date: "1975",
      wikipediaUrl: "https://fr.wikipedia.org/wiki/1975_en_France",
      rupture_type: "LEGAL_REGULATORY",
      confidence: 0.5,
      placeHints: null
    }
  ]);

  const ranked = rankImpact(candidates);
  assert.ok(ranked[0].score.total > ranked[1].score.total);
  assert.ok(ranked[1].score.breakdown.generic_page_penalty <= -30);
  assert.ok(Array.isArray(ranked[0].dateCandidates));
  assert.ok(typeof ranked[0].score.breakdown.memory_binary_total === "number");

  console.log("rank impact smoke: ok");
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
