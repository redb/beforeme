import assert from "node:assert/strict";
import { rm, mkdir, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { createRequire } from "node:module";

const root = process.cwd();
const outDir = path.join(root, ".tmp-candidates-ranked-smoke");

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
      "functions/api/candidates-ranked.ts",
      "src/server/candidates/types.ts",
      "src/server/candidates/extractCandidates.ts",
      "src/server/candidates/enrichSources.ts",
      "src/server/candidates/rankImpact.ts",
      "src/server/candidates/seedOverrides.ts",
      "src/lib/ruptureTaxonomy.ts"
    ],
    { cwd: root, stdio: "pipe", encoding: "utf-8" }
  );
  if (cmd.status !== 0) {
    throw new Error(cmd.stderr || cmd.stdout || "tsc_failed");
  }
}

function createR2Mock() {
  const store = new Map();
  return {
    store,
    async get(key) {
      const value = store.get(key);
      if (!value) return null;
      return { async json() { return JSON.parse(value); } };
    },
    async put(key, body) {
      store.set(key, String(body));
    }
  };
}

async function run() {
  await compile();
  const require = createRequire(import.meta.url);
  const mod = require(path.join(outDir, "functions/api/candidates-ranked.js"));
  const { onRequestGet } = mod;

  const r2 = createR2Mock();

  globalThis.fetch = async (input) => {
    const url = typeof input === "string" ? input : input.url;
    if (url.includes("/api/batch?") && url.includes("mode=fast")) {
      return new Response(
        JSON.stringify([
          {
            qid: "Q3258153",
            label: "Loi du 31 décembre 1975 relative à l'emploi de la langue française",
            date: "1975-12-31T00:00:00Z",
            wikipediaUrl: "https://fr.wikipedia.org/wiki/Loi_du_31_d%C3%A9cembre_1975_relative_%C3%A0_l%27emploi_de_la_langue_fran%C3%A7aise",
            rupture_type: "LEGAL_REGULATORY",
            confidence: 0.75,
            placeHints: { p131Qid: "Q142", p131Label: "France" }
          }
        ]),
        { status: 200, headers: { "content-type": "application/json" } }
      );
    }
    if (url.includes("/api/batch?") && url.includes("mode=geo")) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    }
    throw new Error(`unexpected_fetch:${url}`);
  };

  const response = await onRequestGet({
    request: new Request("https://example.com/api/candidates-ranked?year=1975&country=Q142&lang=fr&limit=20"),
    env: { R2: r2 }
  });
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.year, 1975);
  assert.equal(body.country_qid, "Q142");
  assert.ok(Array.isArray(body.items) && body.items.length > 0);
  assert.ok(typeof body.items[0].score?.total === "number");
  assert.ok(typeof body.items[0].score?.breakdown?.authority_source === "number");
  assert.ok(Array.isArray(body.items[0].dateCandidates));
  assert.ok(typeof body.items[0].score?.breakdown?.memory_binary_total === "number");

  console.log("candidates ranked smoke: ok");
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
