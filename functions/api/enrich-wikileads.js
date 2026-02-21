import { getWikiLead } from '../lib/wiki-lead.js';

function responseHeaders() {
  return {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}

function json(status, payload) {
  return new Response(JSON.stringify(payload), { status, headers: responseHeaders() });
}

function log(level, message, context = {}) {
  const payload = { level, message, ts: new Date().toISOString(), ...context };
  if (level === 'error') console.error(JSON.stringify(payload));
  else console.log(JSON.stringify(payload));
}

function sanitizeItems(rawItems) {
  return (Array.isArray(rawItems) ? rawItems : []).map((item) => ({
    ...item,
    uniqueEventId: String(item?.uniqueEventId || '').trim(),
    eventQid: String(item?.eventQid || '').trim(),
    title: String(item?.title || '').trim(),
    sourceUrl: String(item?.sourceUrl || '').trim()
  }));
}

async function mapWithConcurrency(items, concurrency, worker) {
  const results = new Array(items.length);
  let cursor = 0;

  async function runOne() {
    while (true) {
      const index = cursor;
      cursor += 1;
      if (index >= items.length) return;
      results[index] = await worker(items[index], index);
    }
  }

  const runners = Array.from({ length: Math.max(1, Math.min(concurrency, 3)) }, () => runOne());
  await Promise.all(runners);
  return results;
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: responseHeaders() });
}

export async function onRequestPost(context) {
  const requestId = crypto.randomUUID();
  let payload;
  try {
    payload = await context.request.json();
  } catch {
    return json(400, { error: 'invalid_json_body', requestId });
  }

  const year = Number(payload?.year);
  const country = String(payload?.country || '').toUpperCase();
  const items = sanitizeItems(payload?.items);
  if (!Number.isInteger(year) || !country || items.length === 0) {
    return json(400, { error: 'invalid_payload', requestId });
  }

  const start = Date.now();
  const enriched = await mapWithConcurrency(items, 3, async (item) => {
    const wikiLead = await getWikiLead(item.sourceUrl);
    if (!wikiLead) {
      return { ...item, wikiLead: '', invalidReason: 'missing_wikiLead' };
    }
    return { ...item, wikiLead };
  });

  const invalidCount = enriched.filter((item) => !item.wikiLead).length;
  log('info', 'enrich_wikileads_completed', {
    requestId,
    year,
    country,
    count: enriched.length,
    invalidCount,
    durationMs: Date.now() - start
  });

  return json(200, { year, country, items: enriched });
}
