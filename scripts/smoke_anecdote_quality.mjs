import assert from "node:assert/strict";
import { rm, mkdir, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { createRequire } from "node:module";

const root = process.cwd();
const outDir = path.join(root, ".tmp-anecdote-quality-smoke");

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
      "src/lib/anecdoteApi.ts",
      "src/lib/locale.ts",
      "src/lib/seed.ts",
      "src/lib/i18n.ts"
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
  const api = require(path.join(outDir, "anecdoteApi.js"));
  const { fetchAnecdoteSlot } = api;

  globalThis.window = {
    setTimeout,
    clearTimeout
  };

  globalThis.fetch = async (input) => {
    const url = String(typeof input === "string" ? input : input.url);
    if (url.startsWith("/api/batch?")) {
      return new Response(JSON.stringify([{ qid: "Q123" }]), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    }
    if (url.startsWith("/api/scene?")) {
      return new Response(
        JSON.stringify({
          fact: "Le 18 mai 1968, un decret entre en vigueur et modifie les demarches locales.",
          before_state:
            "Avant cette date, les habitants pouvaient terminer la procedure au guichet sans cette verification.",
          after_state:
            "Apres publication, la verification devient obligatoire et rallonge immediatement la file d attente.",
          date: "1968-05-18",
          place: { name: "Cannes" },
          sources: [{ label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Test_unitaire" }]
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" }
        }
      );
    }
    throw new Error(`unexpected_fetch:${url}`);
  };

  const slot = await fetchAnecdoteSlot({
    year: 1968,
    lang: "fr",
    country: "FR",
    scope: "global",
    slot: 1
  });

  assert.ok(slot, "slot should be returned");
  assert.ok(slot.narrative.includes("Avant:"), "narrative should include before state marker");
  assert.ok(slot.narrative.includes("Apres:"), "narrative should include after state marker");
  assert.match(slot.narrative, /\b1968\b/, "narrative should preserve factual year");
  assert.equal(slot.placeName, "Cannes");
  assert.equal(slot.date, "1968-05-18");
  assert.equal(slot.url, "https://fr.wikipedia.org/wiki/Test_unitaire");

  console.log("anecdote quality smoke: ok");
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
