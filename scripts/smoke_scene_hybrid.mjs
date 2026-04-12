import assert from "node:assert/strict";
import { rm, mkdir, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { createRequire } from "node:module";

const root = process.cwd();
const outDir = path.join(root, ".tmp-scene-smoke");

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
      "src/server/place/precisePlaceResolver.ts",
      "src/server/place/validateStrictPlace.ts",
      "src/lib/ruptureClassifier.ts"
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
    "exports.getWikiLead = async function getWikiLead(url){ const u = new URL(url); u.pathname = '/w/api.php'; u.search = '?action=query&format=json&prop=extracts&explaintext=1&exintro=1&redirects=1&titles=Test&origin=*'; const res = await fetch(u.toString()); const json = await res.json(); const page = Object.values(json.query.pages)[0]; return String(page.extract || '').trim(); };",
    "utf-8"
  );
}

function createPrismaMock() {
  const rows = new Map();
  const ops = [];
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
      ops.push({ op: "create", key, status: row.status });
      return row;
    },
    async updateMany({ where, data }) {
      const key = `${where.year}|${where.countryQid}|${where.lang}|${where.eventQid}`;
      const row = rows.get(key);
      if (!row) return { count: 0 };
      if (typeof where.status === "string" && row.status !== where.status) return { count: 0 };
      if (typeof where.lockOwner === "string" && row.lockOwner !== where.lockOwner) return { count: 0 };
      if (where.OR) {
        const now = Date.now();
        const can = where.OR.some((clause) => {
          if (clause.lockExpiresAt === null) return row.lockExpiresAt == null;
          if (clause.lockExpiresAt?.lt instanceof Date) {
            return row.lockExpiresAt instanceof Date && row.lockExpiresAt.getTime() < clause.lockExpiresAt.lt.getTime();
          }
          return false;
        });
        if (!can && row.lockExpiresAt instanceof Date && row.lockExpiresAt.getTime() > now) return { count: 0 };
      }
      Object.assign(row, data);
      rows.set(key, row);
      ops.push({ op: "updateMany", key, status: row.status });
      return { count: 1 };
    },
    async update() {
      throw new Error("update_not_supported_in_scene_flow");
    }
  };
  return { eventCache, rows, ops };
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
  let batchCalls = 0;
  let openaiCalls = 0;
  let wikiCalls = 0;

  globalThis.fetch = async (input) => {
    const url = typeof input === "string" ? input : input.url;
    if (url.includes("/api/batch?")) {
      batchCalls += 1;
      return new Response(
        JSON.stringify([
          {
            qid: "Q123",
            label: "Festival de Cannes 1968",
            date: "1968-05-18T00:00:00Z",
            wikipediaUrl: "https://fr.wikipedia.org/wiki/Test_unitaire",
            rupture_type: "LEGAL_REGULATORY",
            confidence: 0.8,
            placeHints: { p131Qid: "Q39984", p131Label: "Cannes" }
          }
        ]),
        { status: 200, headers: { "content-type": "application/json" } }
      );
    }
    if (url.includes("wikipedia.org/w/api.php")) {
      wikiCalls += 1;
      return new Response(
        JSON.stringify({
          query: {
            pages: {
              1: {
                extract:
                  "Le décret est publié au Journal officiel de la République française. ".repeat(8)
              }
            }
          }
        }),
        { status: 200, headers: { "content-type": "application/json" } }
      );
    }
    if (url === "https://api.openai.com/v1/responses") {
      openaiCalls += 1;
      return new Response(
        JSON.stringify({
          output_parsed: {
            fact: "Le 18 mai 1968, le decret est publie au Journal officiel et entre en vigueur.",
            before_state: "Avant cette date, aucune obligation uniforme n'est appliquee dans les services concernes.",
            after_state: "Apres publication, la regle s'applique immediatement et modifie les demarches au guichet.",
            gesture_changed: "A partir de ce jour, tu dois presenter ce document au guichet pour finaliser la demarche.",
            material_anchor: "Guichet administratif et formulaire officiel",
            rupture_test: {
              geste_modifie: true,
              duree_longue: true,
              impact_quotidien: true
            },
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

  const first = await onRequestGet({ request: new Request(url), env });
  assert.ok(first.status === 200 || first.status === 202);
  if (first.status === 202) {
    await new Promise((resolve) => setTimeout(resolve, 30));
  }

  const key = "1968|Q142|fr|Q123";
  const beforeCounts = { batchCalls, openaiCalls, wikiCalls };
  const second = await onRequestGet({ request: new Request(url), env });
  let secondBody = await second.clone().json().catch(() => null);

  if (second.status !== 200) {
    await new Promise((resolve) => setTimeout(resolve, 30));
    const third = await onRequestGet({ request: new Request(url), env });
    secondBody = await third.clone().json().catch(() => null);
    assert.equal(third.status, 200);
  } else {
    assert.equal(second.status, 200);
  }

  const row = prisma.rows.get(key);
  assert.ok(row);
  assert.ok(row.r2Key);
  assert.ok(r2.store.has(row.r2Key));
  const r2Payload = JSON.parse(r2.store.get(row.r2Key));
  assert.equal(r2Payload.event_qid, "Q123");
  assert.equal(secondBody?.event_qid, "Q123");
  assert.equal(String(r2Payload.narrative_style || ""), "cinematic_v1");
  assert.ok(typeof r2Payload.narrative_text === "string" && r2Payload.narrative_text.trim().length > 30);
  assert.equal(String(secondBody?.narrative_style || ""), "cinematic_v1");
  assert.ok(typeof secondBody?.narrative_text === "string" && secondBody.narrative_text.trim().length > 30);
  assert.match(String(r2Payload.fact || ""), /\b1968\b/);
  assert.notEqual(String(r2Payload.before_state || "").trim(), String(r2Payload.after_state || "").trim());
  assert.equal(r2Payload.rupture_test?.geste_modifie, true);
  assert.equal(r2Payload.rupture_test?.impact_quotidien, true);
  assert.ok(String(r2Payload.gesture_changed || "").trim().length > 20);
  assert.ok(String(r2Payload.material_anchor || "").trim().length > 10);
  assert.ok(Array.isArray(r2Payload.sources) && r2Payload.sources.length > 0);
  assert.equal(batchCalls, beforeCounts.batchCalls);
  assert.equal(openaiCalls, beforeCounts.openaiCalls);
  assert.equal(wikiCalls, beforeCounts.wikiCalls);

  console.log("scene hybrid smoke: ok");
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
