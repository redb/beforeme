import assert from "node:assert/strict";
import { rm, mkdir, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { createRequire } from "node:module";

const root = process.cwd();
const outDir = path.join(root, ".tmp-quality-gate-smoke");

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
      "src/server/validateRuptureImpact.ts"
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
    "exports.getWikiLead = async function getWikiLead(){ return 'Le 18 mai 1968, le festival de Cannes ouvre ses projections publiques.'; };",
    "utf-8"
  );
}

function createPrismaMock() {
  const rows = new Map();
  const keyOf = (w) =>
    `${w.year_countryQid_lang_eventQid.year}|${w.year_countryQid_lang_eventQid.countryQid}|${w.year_countryQid_lang_eventQid.lang}|${w.year_countryQid_lang_eventQid.eventQid}`;

  const eventCache = {
    async findUnique({ where }) {
      const key = keyOf(where);
      return rows.get(key) || null;
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
      const raw = store.get(key);
      if (!raw) return null;
      return {
        async json() {
          return JSON.parse(raw);
        }
      };
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
  let openaiMode = "vague";

  globalThis.fetch = async (input) => {
    const url = typeof input === "string" ? input : input.url;
    if (url.includes("/api/batch?")) {
      return new Response(
        JSON.stringify([
          {
            qid: "Q123",
            label: "Festival de Cannes 1968",
            date: "1968-05-18T00:00:00Z",
            wikipediaUrl: "https://fr.wikipedia.org/wiki/Festival_de_Cannes_1968",
            rupture_type: "FIRST_PUBLIC_DEMO",
            confidence: 0.8,
            placeHints: { p276Qid: "Q39984", p276Label: "Cannes" }
          }
        ]),
        { status: 200, headers: { "content-type": "application/json" } }
      );
    }
    if (url === "https://api.openai.com/v1/responses") {
      if (openaiMode === "vague") {
        return new Response(
          JSON.stringify({
            output_parsed: {
              fact: "Le 18 mai 1968, Festival de Cannes 1968 marque une rupture d'usage.",
              before_state: "Les usages quotidiens restaient inchanges dans ce contexte.",
              after_state: "Apres cette date, adaptation immediate sur place.",
              gesture_changed: "A partir de ce jour, tu dois adapter ton geste.",
              material_anchor: "Contexte general",
              evidence: [{ quote: "Le 18 mai 1968, le festival ouvre.", source_url: "https://fr.wikipedia.org/wiki/Festival_de_Cannes_1968" }],
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
            fact: "Le 18 mai 1968, Festival de Cannes 1968 ouvre ses projections publiques.",
            before_state: "Avant ce jour, les projections ne sont pas accessibles au public au Palais des Festivals.",
            after_state: "Apres le 18 mai 1968, le public peut entrer en salle pour voir les projections.",
            gesture_changed: "A partir de ce jour, tu peux entrer en salle et assister a une projection sur ecran.",
            material_anchor: "Palais des Festivals, salle de projection et ecran",
            evidence: [{ quote: "Le 18 mai 1968, le festival ouvre ses projections publiques.", source_url: "https://fr.wikipedia.org/wiki/Festival_de_Cannes_1968" }],
            rupture_test: { geste_modifie: true, duree_longue: true, impact_quotidien: true },
            place_selected: null
          }
        }),
        { status: 200, headers: { "content-type": "application/json" } }
      );
    }
    throw new Error(`unexpected_fetch:${url}`);
  };

  const env = {
    R2: r2,
    OPENAI_API_KEY: "test_key",
    __PRISMA_MOCK: prisma
  };

  const url = "https://example.com/api/scene?year=1968&country=Q142&qid=Q123&lang=fr";

  openaiMode = "vague";
  const rejected = await onRequestGet({ request: new Request(url), env });
  assert.equal(rejected.status, 422);
  const rejectedBody = await rejected.json();
  assert.equal(rejectedBody?.error, "validation_failed");
  assert.match(String(rejectedBody?.code || ""), /(vague_language|missing_gesture|invalid_verb_for_type)/);

  openaiMode = "strict";
  const accepted = await onRequestGet({ request: new Request(url), env });
  assert.equal(accepted.status, 200);
  const body = await accepted.json();
  assert.match(String(body.gesture_changed || ""), /(projection|projete|projete)/i);
  assert.match(String(body.material_anchor || ""), /(ecran|écran|salle|palais)/i);
  assert.ok(Array.isArray(body.evidence) && body.evidence.length > 0);

  console.log("quality gate smoke: ok");
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
