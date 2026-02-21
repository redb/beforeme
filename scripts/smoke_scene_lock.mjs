import assert from "node:assert/strict";
import { rm, mkdir, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { createRequire } from "node:module";

const root = process.cwd();
const outDir = path.join(root, ".tmp-scene-lock-smoke");

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
        const error = new Error("unique");
        error.code = "P2002";
        throw error;
      }
      const row = { ...data, id: `id_${rows.size + 1}`, createdAt: new Date(), updatedAt: data.updatedAt || new Date() };
      rows.set(k, row);
      return row;
    },
    async updateMany({ where, data }) {
      const k = key(where.year, where.countryQid, where.lang, where.eventQid);
      const row = rows.get(k);
      if (!row) return { count: 0 };
      const now = new Date();
      const canTakeLock = where.OR.some((clause) => {
        if (clause.lockExpiresAt === null) return row.lockExpiresAt == null;
        if (clause.lockExpiresAt?.lt instanceof Date) {
          return row.lockExpiresAt instanceof Date && row.lockExpiresAt.getTime() < clause.lockExpiresAt.lt.getTime();
        }
        return false;
      });
      if (!canTakeLock && row.lockExpiresAt instanceof Date && row.lockExpiresAt.getTime() > now.getTime()) {
        return { count: 0 };
      }
      Object.assign(row, data);
      rows.set(k, row);
      return { count: 1 };
    },
    async update({ where, data }) {
      const k = keyFromWhere(where);
      const row = rows.get(k);
      if (!row) throw new Error("missing_row");
      Object.assign(row, data);
      rows.set(k, row);
      return row;
    }
  };
  return { eventCache, rows, key };
}

function createR2Mock() {
  const store = new Map();
  return {
    store,
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
    if (url.includes("/api/batch?")) {
      return new Response(
        JSON.stringify([
          {
            qid: "Q2001",
            label: "Décret test",
            date: "1968-05-18T00:00:00Z",
            wikipediaUrl: "https://fr.wikipedia.org/wiki/Test_unitaire",
            rupture_type: "LEGAL_REGULATORY",
            confidence: 0.91,
            placeHints: { p131Qid: "Q90", p131Label: "Paris" }
          },
          {
            qid: "Q2002",
            label: "Décret test",
            date: "1968",
            wikipediaUrl: "https://fr.wikipedia.org/wiki/Test_unitaire",
            rupture_type: "LEGAL_REGULATORY",
            confidence: 0.91,
            placeHints: { p131Qid: "Q90", p131Label: "Paris" }
          },
          {
            qid: "Q2003",
            label: "Décret test",
            date: "1968-05-20T00:00:00Z",
            wikipediaUrl: "https://fr.wikipedia.org/wiki/Test_unitaire",
            rupture_type: "LEGAL_REGULATORY",
            confidence: 0.91,
            placeHints: { p131Qid: "Q90", p131Label: "Paris" }
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
                extract:
                  "Le décret est publié au Journal officiel de la République française. ".repeat(10)
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
            fact: "Décret publié au Journal officiel.",
            before_state: "Aucune obligation n'est appliquée.",
            after_state: "La règle devient immédiatement obligatoire.",
            place_selected: null
          }
        }),
        { status: 200, headers: { "content-type": "application/json" } }
      );
    }
    throw new Error(`unexpected_fetch:${url}`);
  };

  const env = { R2: r2, OPENAI_API_KEY: "test_key", __PRISMA_MOCK: prisma };

  const lockKey = prisma.key(1968, "Q142", "fr", "Q2003");
  prisma.rows.set(lockKey, {
    id: "locked",
    year: 1968,
    countryQid: "Q142",
    lang: "fr",
    eventQid: "Q2003",
    title: "Q2003",
    status: "pending",
    schemaVersion: "1.0",
    lockOwner: "other",
    lockExpiresAt: new Date(Date.now() + 60_000),
    updatedAt: new Date(),
    generatedAt: new Date()
  });

  const locked = await onRequestGet({
    request: new Request("https://example.com/api/scene?year=1968&country=Q142&qid=Q2003&lang=fr"),
    env
  });
  assert.equal(locked.status, 202);

  const accepted = await onRequestGet({
    request: new Request("https://example.com/api/scene?year=1968&country=Q142&qid=Q2001&lang=fr"),
    env
  });
  assert.equal(accepted.status, 200);
  const acceptedRow = prisma.rows.get(prisma.key(1968, "Q142", "fr", "Q2001"));
  assert.equal(acceptedRow.status, "ready");
  assert.equal(acceptedRow.lockOwner, null);
  assert.equal(acceptedRow.lockExpiresAt, null);
  assert.ok(Array.isArray(acceptedRow.validationFlags));
  assert.ok(acceptedRow.validationFlags.includes("accepted:institution_with_official_source"));

  const rejected = await onRequestGet({
    request: new Request("https://example.com/api/scene?year=1968&country=Q142&qid=Q2002&lang=fr"),
    env
  });
  assert.equal(rejected.status, 422);
  const rejectedRow = prisma.rows.get(prisma.key(1968, "Q142", "fr", "Q2002"));
  assert.equal(rejectedRow.status, "rejected");
  assert.equal(rejectedRow.errorCode, "missing_precise_date");
  assert.ok(Array.isArray(rejectedRow.validationFlags));
  assert.ok(rejectedRow.validationFlags.includes("rejected:missing_precise_date"));

  const previousOpenaiCalls = openaiCalls;
  const fromR2 = await onRequestGet({
    request: new Request("https://example.com/api/scene?year=1968&country=Q142&qid=Q2001&lang=fr"),
    env
  });
  assert.equal(fromR2.status, 200);
  assert.equal(openaiCalls, previousOpenaiCalls);

  console.log("scene lock smoke: ok");
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
