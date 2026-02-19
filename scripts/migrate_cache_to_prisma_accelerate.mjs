import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const SOURCE_DB_URL = process.env.SOURCE_DB_URL || '';
const TARGET_PRISMA_URL = process.env.TARGET_PRISMA_URL || '';

if (!SOURCE_DB_URL.startsWith('postgres://') && !SOURCE_DB_URL.startsWith('postgresql://')) {
  console.error('Invalid SOURCE_DB_URL');
  process.exit(1);
}
if (!TARGET_PRISMA_URL.startsWith('prisma+postgres://')) {
  console.error('Invalid TARGET_PRISMA_URL');
  process.exit(1);
}

function parseDbUrl(raw) {
  const rest = raw.replace(/^postgres(?:ql)?:\/\//, '');
  const atPos = rest.lastIndexOf('@');
  if (atPos < 0) throw new Error('Invalid source DB URL: missing @');

  const userInfo = rest.slice(0, atPos);
  const hostAndDb = rest.slice(atPos + 1);
  const colonPos = userInfo.indexOf(':');
  if (colonPos < 0) throw new Error('Invalid source DB URL: missing user/password separator');

  const user = userInfo.slice(0, colonPos);
  const password = userInfo.slice(colonPos + 1);
  const conn = `postgresql://${encodeURIComponent(user)}@${hostAndDb}`;
  return { conn, password };
}

function readSourceRows() {
  const { conn, password } = parseDbUrl(SOURCE_DB_URL);

  const sql = `
select
  cache_key,
  scope,
  year,
  lang,
  coalesce(country, ''),
  payload::text,
  created_at::text,
  updated_at::text
from public.anecdote_cache
order by cache_key;
`;

  const out = execFileSync('psql', [conn, '-At', '-F', '\t', '-c', sql], {
    encoding: 'utf8',
    env: { ...process.env, PGPASSWORD: password },
    maxBuffer: 64 * 1024 * 1024
  });

  const lines = out
    .split('\n')
    .map((line) => line.trimEnd())
    .filter(Boolean);

  return lines.map((line) => {
    const [cacheKey, scope, year, lang, country, payloadText, createdAt, updatedAt] = line.split('\t');
    return {
      cacheKey,
      scope,
      year: Number(year),
      lang,
      country: country || null,
      payload: JSON.parse(payloadText),
      createdAt: new Date(createdAt),
      updatedAt: new Date(updatedAt)
    };
  });
}

function setupTempPrismaProject() {
  const dir = path.join(os.tmpdir(), `beforeme-prisma-migrate-${Date.now()}`);
  mkdirSync(dir, { recursive: true });

  writeFileSync(
    path.join(dir, 'package.json'),
    JSON.stringify(
      {
        name: 'beforeme-prisma-migrate',
        private: true,
        type: 'module',
        dependencies: {
          '@prisma/client': '6.16.0'
        },
        devDependencies: {
          prisma: '6.16.0'
        }
      },
      null,
      2
    )
  );

  writeFileSync(
    path.join(dir, 'schema.prisma'),
    `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model AnecdoteCache {
  cacheKey  String   @id @map("cache_key")
  scope     String
  year      Int
  lang      String
  country   String?
  payload   Json
  createdAt DateTime @map("created_at")
  updatedAt DateTime @map("updated_at")

  @@map("anecdote_cache")
}
`
  );

  return dir;
}

function installAndGenerate(tempDir) {
  execFileSync('npm', ['install', '--silent'], { cwd: tempDir, stdio: 'inherit' });
  execFileSync('npx', ['prisma', 'generate', '--schema', 'schema.prisma', '--no-engine'], {
    cwd: tempDir,
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL: 'postgresql://user:pass@localhost:5432/postgres'
    }
  });
}

function ensureTargetTable(tempDir) {
  const sql = `
create table if not exists "anecdote_cache" (
  "cache_key" text primary key,
  "scope" text not null,
  "year" integer not null,
  "lang" text not null,
  "country" text,
  "payload" jsonb not null,
  "created_at" timestamptz not null default now(),
  "updated_at" timestamptz not null default now()
);
`;

  const sqlFile = path.join(tempDir, 'ensure_anecdote_cache.sql');
  writeFileSync(sqlFile, sql);

  execFileSync('npx', ['prisma', 'db', 'execute', '--url', TARGET_PRISMA_URL, '--file', sqlFile], {
    cwd: tempDir,
    stdio: 'inherit'
  });
}

async function migrate(rows, tempDir) {
  const { PrismaClient } = await import(path.join(tempDir, 'node_modules', '@prisma', 'client', 'index.js'));
  process.env.DATABASE_URL = TARGET_PRISMA_URL;
  const prisma = new PrismaClient();

  try {
    for (const row of rows) {
      await prisma.anecdoteCache.upsert({
        where: { cacheKey: row.cacheKey },
        create: {
          cacheKey: row.cacheKey,
          scope: row.scope,
          year: row.year,
          lang: row.lang,
          country: row.country,
          payload: row.payload,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt
        },
        update: {
          scope: row.scope,
          year: row.year,
          lang: row.lang,
          country: row.country,
          payload: row.payload,
          updatedAt: row.updatedAt
        }
      });
    }

    const count = await prisma.anecdoteCache.count();
    console.log(JSON.stringify({ migrated: rows.length, targetCount: count }, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  const rows = readSourceRows();
  console.log(`source rows: ${rows.length}`);

  const tempDir = setupTempPrismaProject();
  console.log(`temp dir: ${tempDir}`);

  installAndGenerate(tempDir);
  ensureTargetTable(tempDir);
  await migrate(rows, tempDir);
}

main().catch((error) => {
  console.error(error?.message || String(error));
  process.exit(1);
});
