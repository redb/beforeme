CREATE TABLE IF NOT EXISTS "event_cache" (
  "id" TEXT PRIMARY KEY,
  "year" INTEGER NOT NULL,
  "country" TEXT NOT NULL,
  "lang" TEXT NOT NULL,
  "event_qid" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "fact" TEXT NOT NULL,
  "source_url" TEXT NOT NULL,
  "scene" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS "event_cache_year_country_lang_event_qid_key"
ON "event_cache" ("year", "country", "lang", "event_qid");

CREATE TABLE IF NOT EXISTS "vote" (
  "id" TEXT PRIMARY KEY,
  "year" INTEGER NOT NULL,
  "country" TEXT NOT NULL,
  "lang" TEXT NOT NULL,
  "event_qid" TEXT NOT NULL,
  "up" INTEGER NOT NULL DEFAULT 0,
  "down" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS "vote_year_country_lang_event_qid_key"
ON "vote" ("year", "country", "lang", "event_qid");

CREATE TABLE IF NOT EXISTS "app_config" (
  "key" TEXT PRIMARY KEY,
  "value" JSONB NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
