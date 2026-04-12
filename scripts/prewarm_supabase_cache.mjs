import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SITE_BASE_URL = process.env.SITE_BASE_URL || 'http://localhost:8788';
const COUNTRY_QID = 'Q142';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const yearsArg = process.argv.find((arg) => arg.startsWith('--years='));
const langArg = process.argv.find((arg) => arg.startsWith('--lang='));

const [fromYear, toYear] = (yearsArg?.split('=')[1] || '1950-2026').split('-').map(Number);
const lang = (langArg?.split('=')[1] || 'fr').toLowerCase();

async function fetchFirstCandidateQid(year) {
  const params = new URLSearchParams({
    year: String(year),
    country: COUNTRY_QID,
    lang,
    limit: '1'
  });

  const response = await fetch(`${SITE_BASE_URL}/api/candidates-ranked?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Candidates failed for ${year}: ${response.status}`);
  }

  const payload = await response.json();
  const qid = payload?.items?.[0]?.qid;
  return typeof qid === 'string' && qid.trim() ? qid.trim() : null;
}

async function existsReady(year, eventQid) {
  const { data, error } = await client
    .from('event_cache')
    .select('event_qid,status,r2_key')
    .eq('year', year)
    .eq('country_qid', COUNTRY_QID)
    .eq('lang', lang)
    .eq('event_qid', eventQid)
    .maybeSingle();

  if (error) {
    return false;
  }

  return data?.status === 'ready' && Boolean(data?.r2_key);
}

async function warmScene(year, eventQid) {
  const params = new URLSearchParams({
    year: String(year),
    country: COUNTRY_QID,
    lang,
    qid: eventQid,
    mode: 'fast'
  });

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const response = await fetch(`${SITE_BASE_URL}/api/scene?${params.toString()}`);
    if (response.status === 200) {
      return;
    }
    if (response.status === 202) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      continue;
    }

    const text = await response.text();
    throw new Error(`Warmup failed for ${year}/${eventQid}: ${response.status} ${text}`);
  }

  throw new Error(`Warmup pending too long for ${year}/${eventQid}`);
}

async function main() {
  for (let year = fromYear; year <= toYear; year += 1) {
    const eventQid = await fetchFirstCandidateQid(year);

    if (!eventQid) {
      console.log(`skip ${year}: no candidate`);
      continue;
    }

    const ready = await existsReady(year, eventQid);
    if (ready) {
      console.log(`skip ${year}: ${eventQid} ready`);
      continue;
    }

    console.log(`warm ${year}: ${eventQid}`);
    await warmScene(year, eventQid);
    await new Promise((resolve) => setTimeout(resolve, 150));
  }

  console.log('done');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
