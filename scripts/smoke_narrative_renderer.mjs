import assert from "node:assert/strict";
import { rm, mkdir, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { createRequire } from "node:module";

const root = process.cwd();
const outDir = path.join(root, ".tmp-narrative-renderer-smoke");

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
      "src/server/scene/renderNarrative.ts"
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
  const mod = require(path.join(outDir, "renderNarrative.js"));

  const input = {
    lang: "fr",
    date: "1968-05-18",
    placeName: "Palais des Festivals",
    fact: "Le 18 mai 1968, le Festival de Cannes est interrompu au Palais des Festivals.",
    beforeState: "Avant le 18 mai 1968, la projection allait a son terme.",
    afterState: "Apres le 18 mai 1968, la projection peut etre arretee en cours de seance.",
    gestureChanged: "A partir de ce jour, tu peux entrer dans la salle de projection.",
    materialAnchor: "Salle de projection et ecran"
  };

  const deterministic = mod.renderNarrativeDeterministic(input);
  assert.match(String(deterministic), /1968/);
  assert.match(String(deterministic), /Palais des Festivals/);
  assert.match(String(deterministic), /(entrer|projection)/i);
  assert.doesNotMatch(String(deterministic), /\bAvant,\b/i);
  assert.doesNotMatch(String(deterministic), /\bApres,\b/i);
  assert.doesNotMatch(String(deterministic), /\bDevant\b/i);

  const accepted = mod.validateNarrativeText({ text: deterministic, input });
  assert.equal(accepted.ok, true);

  const rejectedVague = mod.validateNarrativeText({
    text: "Le 18 mai 1968, dans ce contexte, les usages changent sur place.",
    input
  });
  assert.equal(rejectedVague.ok, false);
  assert.equal(rejectedVague.code, "narrative_vague_language");

  const rejectedDate = mod.validateNarrativeText({
    text: "Le 18 mai 1972, au Palais des Festivals, tu entres en salle.",
    input
  });
  assert.equal(rejectedDate.ok, false);
  assert.match(String(rejectedDate.code || ""), /narrative_missing_date|narrative_unapproved_date/);

  const rejectedLong = mod.validateNarrativeText({
    text: `Le 18 mai 1968, au Palais des Festivals, tu entres en salle. ${"x".repeat(620)}`,
    input
  });
  assert.equal(rejectedLong.ok, false);
  assert.equal(rejectedLong.code, "narrative_too_long");

  console.log("narrative renderer smoke: ok");
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
