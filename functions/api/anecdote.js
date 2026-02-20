import { buildFallbackSlots } from '../lib/fallback-scenes.js';
const DEFAULT_NETLIFY_ORIGIN = 'https://beforeme-test-20260219-091055.netlify.app';
const MAX_SLOT = 20;

function sanitizeOrigin(value) {
  const raw = String(value || '').trim();
  if (!raw) return DEFAULT_NETLIFY_ORIGIN;
  return raw.endsWith('/') ? raw.slice(0, -1) : raw;
}

function buildUpstreamUrl(request, env) {
  const upstreamOrigin = sanitizeOrigin(env?.NETLIFY_ORIGIN);
  const incoming = new URL(request.url);
  const upstream = new URL('/api/anecdote', upstreamOrigin);

  for (const [key, value] of incoming.searchParams.entries()) {
    upstream.searchParams.set(key, value);
  }

  return upstream;
}

function responseHeaders(contentType = 'application/json; charset=utf-8') {
  return {
    'Content-Type': contentType,
    'Cache-Control': 'public, max-age=60',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}

function normalizeLang(raw) {
  return String(raw || '').toLowerCase().startsWith('fr') ? 'fr' : 'en';
}

function normalizeScope(raw) {
  return String(raw || '').toLowerCase() === 'local' ? 'local' : 'global';
}

function parseSlot(raw) {
  const slot = Number(raw);
  if (!Number.isInteger(slot) || slot < 1 || slot > MAX_SLOT) return null;
  return slot;
}

function parseYear(raw) {
  const year = Number(raw);
  if (!Number.isInteger(year) || year < 1 || year > 2100) return null;
  return year;
}

function isAnecdoteSlot(payload) {
  return Boolean(
    payload &&
      typeof payload === 'object' &&
      typeof payload.slot === 'number' &&
      typeof payload.narrative === 'string' &&
      typeof payload.fact === 'string' &&
      typeof payload.url === 'string'
  );
}

function buildFallbackSlot(query) {
  const year = parseYear(query.get('year'));
  const slot = parseSlot(query.get('slot'));
  if (!year || !slot) return null;

  const lang = normalizeLang(query.get('lang'));
  const scope = normalizeScope(query.get('scope'));
  const country = String(query.get('country') || 'US').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2) || 'US';
  const slots = buildFallbackSlots({ year, country, lang, scope });
  return slots[slot - 1] || null;
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: responseHeaders()
  });
}

export async function onRequestGet(context) {
  try {
    const incomingUrl = new URL(context.request.url);
    const fallback = buildFallbackSlot(incomingUrl.searchParams);
    if (!fallback) {
      return new Response(JSON.stringify({ error: 'Invalid parameters. Expected year and slot.' }), {
        status: 400,
        headers: responseHeaders()
      });
    }

    const upstream = buildUpstreamUrl(context.request, context.env);
    const upstreamResponse = await fetch(upstream.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    });

    if (upstreamResponse.ok) {
      const contentType = upstreamResponse.headers.get('content-type') || '';
      if (contentType.toLowerCase().includes('application/json')) {
        const payload = await upstreamResponse.json();
        if (isAnecdoteSlot(payload)) {
          return new Response(JSON.stringify(payload), {
            status: 200,
            headers: responseHeaders()
          });
        }
      }
    }

    return new Response(JSON.stringify(fallback), {
      status: 200,
      headers: responseHeaders()
    });
  } catch {
    const incomingUrl = new URL(context.request.url);
    const fallback = buildFallbackSlot(incomingUrl.searchParams);
    if (fallback) {
      return new Response(JSON.stringify(fallback), {
        status: 200,
        headers: responseHeaders()
      });
    }

    return new Response(JSON.stringify({ error: 'Cloudflare anecdote upstream is unavailable.' }), {
      status: 502,
      headers: responseHeaders()
    });
  }
}
