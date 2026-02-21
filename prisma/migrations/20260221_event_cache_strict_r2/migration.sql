ALTER TABLE "event_cache"
  ADD COLUMN IF NOT EXISTS "country_qid" TEXT,
  ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS "date" TEXT,
  ADD COLUMN IF NOT EXISTS "date_precision" TEXT,
  ADD COLUMN IF NOT EXISTS "rupture_type" TEXT,
  ADD COLUMN IF NOT EXISTS "confidence" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "place_name" TEXT,
  ADD COLUMN IF NOT EXISTS "place_qid" TEXT,
  ADD COLUMN IF NOT EXISTS "place_type" TEXT,
  ADD COLUMN IF NOT EXISTS "r2_key" TEXT,
  ADD COLUMN IF NOT EXISTS "schema_version" TEXT DEFAULT '1.0',
  ADD COLUMN IF NOT EXISTS "prompt_hash" TEXT,
  ADD COLUMN IF NOT EXISTS "source_urls" JSONB,
  ADD COLUMN IF NOT EXISTS "validation_flags" JSONB,
  ADD COLUMN IF NOT EXISTS "error_code" TEXT,
  ADD COLUMN IF NOT EXISTS "error_message" TEXT,
  ADD COLUMN IF NOT EXISTS "lock_owner" TEXT,
  ADD COLUMN IF NOT EXISTS "lock_expires_at" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "generated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

UPDATE "event_cache"
SET "country_qid" = COALESCE("country_qid", CASE "country" WHEN 'FR' THEN 'Q142' ELSE "country" END)
WHERE "country_qid" IS NULL;

ALTER TABLE "event_cache"
  ALTER COLUMN "country_qid" SET NOT NULL;

DROP INDEX IF EXISTS "event_cache_year_country_lang_event_qid_key";
CREATE UNIQUE INDEX IF NOT EXISTS "event_cache_year_country_qid_lang_event_qid_key"
ON "event_cache" ("year", "country_qid", "lang", "event_qid");

CREATE INDEX IF NOT EXISTS "event_cache_status_updated_at_idx"
ON "event_cache" ("status", "updated_at");

CREATE INDEX IF NOT EXISTS "event_cache_lock_expires_at_idx"
ON "event_cache" ("lock_expires_at");

CREATE INDEX IF NOT EXISTS "event_cache_country_qid_year_lang_idx"
ON "event_cache" ("country_qid", "year", "lang");
