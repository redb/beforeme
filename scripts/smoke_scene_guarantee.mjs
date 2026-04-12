import assert from "node:assert/strict";
import { rm, mkdir, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { createRequire } from "node:module";

const root = process.cwd();
const outDir = path.join(root, ".tmp-scene-guarantee-smoke");

async function compile() {
  await rm(outDir, { recursive: true, force: true });
  await mkdir(path.join(outDir, "functions/lib"), { recursive: true });
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
      "functions/api/scene.ts",
      "src/lib/openaiPayload.ts",
      "src/lib/ruptureTaxonomy.ts",
      "src/lib/ruptureClassifier.ts",
      "src/server/place/precisePlaceResolver.ts",
      "src/server/place/validateStrictPlace.ts",
      "src/server/validateRuptureImpact.ts",
      "src/server/candidates/seedOverrides.ts"
    ],
    { cwd: root, stdio: "pipe", encoding: "utf-8" }
  );
  if (cmd.status !== 0) {
    throw new Error(cmd.stderr || cmd.stdout || "tsc_failed");
  }

  await writeFile(
    path.join(outDir, "functions/lib/prisma.js"),
    "exports.getPrismaClient = function getPrismaClient(env){ if (env && env.__PRISMA_MOCK) return env.__PRISMA_MOCK; throw new Error('missing_prisma_mock'); };",
    "utf-8"
  );
  await writeFile(
    path.join(outDir, "functions/lib/wiki-lead.js"),
    "exports.getWikiLead = async function getWikiLead(){ return 'Le 17 janvier 1975, la loi est publiee au Journal officiel.'; };",
    "utf-8"
  );
}

function createPrismaMock() {
  const rows = new Map();
  const keyOf = (w) =>
    `${w.year_countryQid_lang_eventQid.year}|${w.year_countryQid_lang_eventQid.countryQid}|${w.year_countryQid_lang_eventQid.lang}|${w.year_countryQid_lang_eventQid.eventQid}`;

  const eventCache = {
    async findUnique({ where }) {
      return rows.get(keyOf(where)) || null;
    },
    async create({ data }) {
      const key = `${data.year}|${data.countryQid}|${data.lang}|${data.eventQid}`;
      if (rows.has(key)) {
        const error = new Error("unique");
        error.code = "P2002";
        throw error;
      }
      const row = { ...data, id: `id_${rows.size + 1}`, createdAt: new Date(), updatedAt: data.updatedAt || new Date() };
      rows.set(key, row);
      return row;
    },
    async updateMany({ where, data }) {
      const key = `${where.year}|${where.countryQid}|${where.lang}|${where.eventQid}`;
      const row = rows.get(key);
      if (!row) return { count: 0 };
      if (typeof where.status === "string" && row.status !== where.status) return { count: 0 };
      if (typeof where.lockOwner === "string" && row.lockOwner !== where.lockOwner) return { count: 0 };
      Object.assign(row, data);
      rows.set(key, row);
      return { count: 1 };
    }
  };
  return { eventCache, rows };
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
  const sceneMod = require(path.join(outDir, "functions/api/scene.js"));
  const { onRequestGet } = sceneMod;

  const prisma = createPrismaMock();
  const r2 = createR2Mock();
  let openaiCalls = 0;

  globalThis.fetch = async (input) => {
    const url = typeof input === "string" ? input : input.url;
    if (url.includes("/api/candidates-ranked?")) {
      return new Response(
        JSON.stringify({
          year: 1975,
          country_qid: "Q142",
          lang: "fr",
          generated_at: new Date().toISOString(),
          items: [
            {
              qid: "Q7001",
              title: "Evenement vague",
              date: "1975-01-01",
              wikipediaUrl: "https://fr.wikipedia.org/wiki/Evenement_vague",
              rupture_type: "LEGAL_REGULATORY",
              confidence: 0.7,
              place: { p276Qid: null, p276Label: null, p131Qid: "Q90", p131Label: "Paris" }
            },
            {
              qid: "Q7002",
              title: "Loi Veil",
              date: "1975-01-17",
              wikipediaUrl: "https://fr.wikipedia.org/wiki/Loi_Veil",
              rupture_type: "LEGAL_REGULATORY",
              confidence: 0.9,
              place: { p276Qid: "Q230472", p276Label: "Journal officiel", p131Qid: "Q90", p131Label: "Paris" }
            }
          ]
        }),
        { status: 200, headers: { "content-type": "application/json" } }
      );
    }
    if (url === "https://api.openai.com/v1/responses") {
      openaiCalls += 1;
      if (openaiCalls <= 2) {
        return new Response(
          JSON.stringify({
            output_parsed: {
              fact: "Le 1 janvier 1975, un changement vague est annonce.",
              before_state: "Les usages restaient inchanges dans ce contexte.",
              after_state: "Adaptation immediate sur place.",
              gesture_changed: "A partir de ce jour, tu adaptes ton geste.",
              material_anchor: "Contexte general",
              evidence: [{ quote: "changement", source_url: "https://fr.wikipedia.org/wiki/Evenement_vague" }],
              rupture_test: { geste_modifie: true, duree_longue: true, impact_quotidien: true },
              place_selected: null
            }
          }),
          { status: 200, headers: { "content-type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({
          output_parsed: {
            fact: "Le 17 janvier 1975, la loi Veil est promulguee au Journal officiel.",
            before_state: "Avant cette date, la demande d IVG n est pas recevable a l hopital dans ce cadre legal.",
            after_state: "Apres cette date, la demande d IVG suit une procedure medicale legalement encadree.",
            gesture_changed: "A partir de ce jour, tu dois presenter un formulaire au guichet hospitalier pour demander une IVG.",
            material_anchor: "Guichet hospitalier et formulaire medical",
            evidence: [{ quote: "Le 17 janvier 1975, la loi est publiee au Journal officiel.", source_url: "https://fr.wikipedia.org/wiki/Loi_Veil" }],
            rupture_test: { geste_modifie: true, duree_longue: true, impact_quotidien: true },
            place_selected: null
          }
        }),
        { status: 200, headers: { "content-type": "application/json" } }
      );
    }
    throw new Error(`unexpected_fetch:${url}`);
  };

  const response = await onRequestGet({
    request: new Request("https://example.com/api/scene?year=1975&country=Q142&qid=Q7001&lang=fr"),
    env: { R2: r2, OPENAI_API_KEY: "test_key", SCENE_MINIMAL_FALLBACK: "false", __PRISMA_MOCK: prisma }
  });
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.event_qid, "Q7002");
  assert.equal(body.validation_mode, "strict");
  assert.ok(openaiCalls >= 3);
  assert.ok(Array.isArray(body.evidence) && body.evidence.length > 0);

  console.log("scene guarantee smoke: ok");
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
