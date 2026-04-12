import assert from "node:assert/strict";
import { rm, mkdir, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { createRequire } from "node:module";

const root = process.cwd();
const outDir = path.join(root, ".tmp-scene-lock-ownership-smoke");

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
  if (cmd.status !== 0) throw new Error(cmd.stderr || cmd.stdout || "tsc_failed");

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
  const key = (y, c, l, q) => `${y}|${c}|${l}|${q}`;
  const keyFromWhere = (where) =>
    key(
      where.year_countryQid_lang_eventQid.year,
      where.year_countryQid_lang_eventQid.countryQid,
      where.year_countryQid_lang_eventQid.lang,
      where.year_countryQid_lang_eventQid.eventQid
    );

  const eventCache = {
    async findUnique({ where }) {
      return rows.get(keyFromWhere(where)) || null;
    },
    async create({ data }) {
      const k = key(data.year, data.countryQid, data.lang, data.eventQid);
      if (rows.has(k)) {
        const e = new Error("unique");
        e.code = "P2002";
        throw e;
      }
      const row = { ...data, id: `id_${rows.size + 1}`, createdAt: new Date(), updatedAt: data.updatedAt || new Date() };
      rows.set(k, row);
      return row;
    },
    async updateMany({ where, data }) {
      const k = key(where.year, where.countryQid, where.lang, where.eventQid);
      const row = rows.get(k);
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
      rows.set(k, row);
      return { count: 1 };
    }
  };

  return { eventCache, rows, key };
}

function createR2Mock(prisma) {
  const store = new Map();
  let raceTarget = null;
  let raceEnabled = false;
  return {
    store,
    setRaceTarget(target) {
      raceTarget = target;
      raceEnabled = true;
    },
    async get(k) {
      const raw = store.get(k);
      if (!raw) return null;
      return {
        async json() {
          return JSON.parse(raw);
        }
      };
    },
    async put(k, body) {
      store.set(k, String(body));
      if (raceEnabled && raceTarget) {
        const row = prisma.rows.get(raceTarget);
        if (row) {
          row.lockOwner = "worker-b";
          row.lockExpiresAt = new Date(Date.now() + 240_000);
          row.status = "pending";
          row.updatedAt = new Date();
        }
      }
    }
  };
}

async function run() {
  await compile();
  const require = createRequire(import.meta.url);
  const sceneMod = require(path.join(outDir, "functions/api/scene.js"));
  const { onRequestGet } = sceneMod;

  const prisma = createPrismaMock();
  const r2 = createR2Mock(prisma);
  let openaiCalls = 0;

  globalThis.fetch = async (input) => {
    const url = typeof input === "string" ? input : input.url;
    if (url.includes("/api/batch?")) {
      return new Response(
        JSON.stringify([
          {
            qid: "Q7001",
            label: "Décret test",
            date: "1968-05-21T00:00:00Z",
            wikipediaUrl: "https://fr.wikipedia.org/wiki/Test_unitaire",
            rupture_type: "INFRA_SERVICE",
            confidence: 0.93,
            placeHints: { p276Qid: "Q1564807", p276Label: "Palais des Festivals", p131Qid: "Q90", p131Label: "Paris" }
          },
          {
            qid: "Q7002",
            label: "Décret test",
            date: "1968-05-22T00:00:00Z",
            wikipediaUrl: "https://fr.wikipedia.org/wiki/Test_unitaire",
            rupture_type: "INFRA_SERVICE",
            confidence: 0.93,
            placeHints: { p276Qid: "Q1564807", p276Label: "Palais des Festivals", p131Qid: "Q90", p131Label: "Paris" }
          },
          {
            qid: "Q7003",
            label: "Décret test",
            date: "1968-05-23T00:00:00Z",
            wikipediaUrl: "https://fr.wikipedia.org/wiki/Test_unitaire",
            rupture_type: "INFRA_SERVICE",
            confidence: 0.93,
            placeHints: { p276Qid: "Q1564807", p276Label: "Palais des Festivals", p131Qid: "Q90", p131Label: "Paris" }
          }
        ]),
        { status: 200, headers: { "content-type": "application/json" } }
      );
    }
    if (url.includes("wikipedia.org/w/api.php")) {
      return new Response(
        JSON.stringify({
          query: {
            pages: {
              1: {
                extract: "Le décret est publié au Journal officiel de la République française. ".repeat(10)
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
            fact: "Le 18 mai 1968, le service est mise en service au bureau public.",
            before_state: "Avant cette date, les usagers ne peuvent pas valider leur passage au guichet.",
            after_state: "Apres cette date, les usagers valident leur passage au guichet avec un formulaire.",
            gesture_changed: "A partir de ce jour, tu dois presenter un formulaire au guichet du bureau public.",
            material_anchor: "Bureau administratif et panneau d'information",
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

  const env = { R2: r2, OPENAI_API_KEY: "x", __PRISMA_MOCK: prisma };

  const expiredKey = prisma.key(1968, "Q142", "fr", "Q7001");
  prisma.rows.set(expiredKey, {
    id: "expired",
    year: 1968,
    countryQid: "Q142",
    lang: "fr",
    eventQid: "Q7001",
    title: "Q7001",
    status: "pending",
    schemaVersion: "1.0",
    lockOwner: "worker-a",
    lockExpiresAt: new Date(Date.now() - 1000),
    updatedAt: new Date(Date.now() - 1000),
    generatedAt: new Date(Date.now() - 1000)
  });

  const takeover = await onRequestGet({
    request: new Request("https://example.com/api/scene?year=1968&country=Q142&qid=Q7001&lang=fr"),
    env
  });
  assert.equal(takeover.status, 200);
  const takeoverRow = prisma.rows.get(expiredKey);
  assert.equal(takeoverRow.status, "ready");
  assert.equal(takeoverRow.lockOwner, null);
  assert.equal(takeoverRow.lockExpiresAt, null);

  const raceKey = prisma.key(1968, "Q142", "fr", "Q7002");
  r2.setRaceTarget(raceKey);
  const ownershipMismatch = await onRequestGet({
    request: new Request("https://example.com/api/scene?year=1968&country=Q142&qid=Q7002&lang=fr"),
    env
  });
  assert.equal(ownershipMismatch.status, 202);
  const raceRow = prisma.rows.get(raceKey);
  assert.equal(raceRow.status, "pending");
  assert.equal(raceRow.lockOwner, "worker-b");

  const healKey = prisma.key(1968, "Q142", "fr", "Q7003");
  const healR2Key = "v1/Q142/1968/Q7003.fr.json";
  r2.store.set(
    healR2Key,
    JSON.stringify({
      schema_version: "1.0",
      country_qid: "Q142",
      year: 1968,
      lang: "fr",
      event_qid: "Q7003",
      date: "1968-05-23",
      date_precision: "day",
      place: { name: "Paris", qid: "Q90", type: "city" },
      rupture_type: "LEGAL_REGULATORY",
      confidence: 0.9,
      fact: "Fact",
      before_state: "Before",
      after_state: "After",
      gesture_changed: "A partir de ce jour, tu dois valider ton passage au guichet.",
      material_anchor: "Guichet de controle",
      narrative_template: {
        instant: "1968-05-23 - Paris. Tu valides ton passage au guichet.",
        before: "Avant: pas de validation au guichet.",
        after: "Apres: validation obligatoire au guichet."
      },
      rupture_test: {
        geste_modifie: true,
        duree_longue: true,
        impact_quotidien: true
      },
      sources: [{ label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Test_unitaire" }],
      evidence: [{ quote: "Le decret est publie au Journal officiel.", source_url: "https://fr.wikipedia.org/wiki/Test_unitaire" }],
      generated_at: new Date().toISOString(),
      prompt_hash: "abc"
    })
  );
  prisma.rows.set(healKey, {
    id: "heal",
    year: 1968,
    countryQid: "Q142",
    lang: "fr",
    eventQid: "Q7003",
    title: "Q7003",
    status: "pending",
    schemaVersion: "1.0",
    lockOwner: "worker-x",
    lockExpiresAt: new Date(Date.now() + 60_000),
    updatedAt: new Date(),
    generatedAt: new Date()
  });

  const healed = await onRequestGet({
    request: new Request("https://example.com/api/scene?year=1968&country=Q142&qid=Q7003&lang=fr"),
    env
  });
  assert.equal(healed.status, 200);
  const healedRow = prisma.rows.get(healKey);
  assert.equal(healedRow.status, "ready");
  assert.equal(healedRow.lockOwner, null);
  assert.equal(healedRow.lockExpiresAt, null);

  assert.ok(openaiCalls >= 2);
  console.log("scene lock ownership smoke: ok");
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
