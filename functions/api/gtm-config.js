import { getPrismaClient } from '../lib/prisma.js';
import { requireAdminSession } from '../lib/admin-auth.js';

const CONFIG_KEY = 'gtm_config';
let transientValue = null;

function responseHeaders() {
  return {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'public, max-age=60, s-maxage=120',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization'
  };
}

function json(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: responseHeaders()
  });
}

function defaultConfig() {
  return { gtmId: '' };
}

/** @returns {string} ID valide ou chaîne vide ; rejette les formats incorrects. */
function normalizeStoredGtmId(raw) {
  const id = String(raw || '').trim();
  if (!id) return '';
  return /^GTM-[A-Z0-9]+$/.test(id) ? id : '';
}

function isMissingTableError(error) {
  const message = String(error instanceof Error ? error.message : '');
  return message.includes('does not exist') || message.includes('relation') || message.includes('app_config');
}

async function parseBody(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: responseHeaders() });
}

export async function onRequestGet(context) {
  try {
    const client = getPrismaClient(context.env);
    const row = await client.appConfig.findUnique({
      where: { key: CONFIG_KEY }
    });
    const raw = row?.value && typeof row.value === 'object' ? row.value.gtmId : '';
    const gtmId = normalizeStoredGtmId(typeof raw === 'string' ? raw : '');
    return json(200, { gtmId });
  } catch (error) {
    if (isMissingTableError(error)) {
      const v = transientValue?.gtmId;
      const gtmId = normalizeStoredGtmId(typeof v === 'string' ? v : '');
      return json(200, { gtmId });
    }
    const fallback = transientValue || defaultConfig();
    return json(200, { gtmId: normalizeStoredGtmId(fallback.gtmId) });
  }
}

export async function onRequestPut(context) {
  const auth = await requireAdminSession(context.request, context.env);
  if (!auth.ok) {
    return json(auth.status || 401, { error: auth.error || 'unauthorized' });
  }

  try {
    const body = await parseBody(context.request);
    const raw = String(body.gtmId ?? '').trim();
    if (raw && !/^GTM-[A-Z0-9]+$/.test(raw)) {
      return json(400, { error: 'invalid_gtm_id' });
    }
    const value = { gtmId: raw ? raw : '' };

    const client = getPrismaClient(context.env);
    try {
      await client.appConfig.upsert({
        where: { key: CONFIG_KEY },
        create: { key: CONFIG_KEY, value },
        update: { value }
      });
    } catch (error) {
      if (!isMissingTableError(error)) {
        throw error;
      }
      transientValue = value;
    }

    return json(200, { ok: true, value });
  } catch (error) {
    return json(500, { error: error instanceof Error ? error.message : 'internal_error' });
  }
}
