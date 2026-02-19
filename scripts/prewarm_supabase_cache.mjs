import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SITE_BASE_URL = process.env.SITE_BASE_URL || 'http://localhost:8888';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const yearsArg = process.argv.find((arg) => arg.startsWith('--years='));
const langArg = process.argv.find((arg) => arg.startsWith('--lang='));
const countryArg = process.argv.find((arg) => arg.startsWith('--country='));
const scopesArg = process.argv.find((arg) => arg.startsWith('--scopes='));

const [fromYear, toYear] = (yearsArg?.split('=')[1] || '1950-2026').split('-').map(Number);
const lang = (langArg?.split('=')[1] || 'fr').toLowerCase();
const country = (countryArg?.split('=')[1] || 'FR').toUpperCase();
const scopes = (scopesArg?.split('=')[1] || 'global,local')
  .split(',')
  .map((entry) => entry.trim())
  .filter(Boolean);

async function exists(cacheKey) {
  const { data, error } = await client
    .from('anecdote_cache')
    .select('cache_key')
    .eq('cache_key', cacheKey)
    .maybeSingle();

  if (error) {
    return false;
  }

  return Boolean(data?.cache_key);
}

function getCacheKey(year, scope) {
  if (scope === 'global') {
    return `g:${year}:${lang}`;
  }
  return `l:${year}:${country}:${lang}`;
}

async function warmup(year, scope) {
  const slot = 1;
  const params = new URLSearchParams({
    year: String(year),
    lang,
    country,
    scope,
    slot: String(slot)
  });

  const response = await fetch(`${SITE_BASE_URL}/.netlify/functions/anecdote?${params.toString()}`);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Warmup failed for ${year}/${scope}: ${response.status} ${text}`);
  }
}

async function main() {
  for (let year = fromYear; year <= toYear; year += 1) {
    for (const scope of scopes) {
      const cacheKey = getCacheKey(year, scope);

      const found = await exists(cacheKey);
      if (found) {
        console.log(`skip ${cacheKey}`);
        continue;
      }

      console.log(`warmup ${cacheKey}`);
      await warmup(year, scope);
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }

  console.log('done');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
