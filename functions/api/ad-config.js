import { getPrismaClient } from '../lib/prisma.js';

const CONFIG_KEY = 'ad_config';
let transientValue = null;

function responseHeaders() {
  return {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,x-admin-token'
  };
}

function json(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: responseHeaders()
  });
}

function defaultConfig() {
  return {
    mode: 'label',
    label: 'Propose par AvantMoi.com',
    html: '',
    imageUrl: '',
    linkUrl: ''
  };
}

function isMissingTableError(error) {
  const message = String(error instanceof Error ? error.message : '');
  return message.includes('does not exist') || message.includes('relation') || message.includes('app_config');
}

function isAuthorized(request, env) {
  const expected = String(env?.ADMIN_TOKEN || '').trim();
  if (!expected) return false;
  const token = String(request.headers.get('x-admin-token') || request.headers.get('X-Admin-Token') || '').trim();
  return token === expected;
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
    return json(200, row?.value || transientValue || defaultConfig());
  } catch (error) {
    if (isMissingTableError(error)) {
      return json(200, transientValue || defaultConfig());
    }
    return json(200, transientValue || defaultConfig());
  }
}

export async function onRequestPut(context) {
  if (!isAuthorized(context.request, context.env)) {
    return json(401, { error: 'Unauthorized' });
  }

  try {
    const body = await parseBody(context.request);
    const value = {
      mode: String(body.mode || 'label'),
      label: String(body.label || 'Propose par AvantMoi.com'),
      html: String(body.html || ''),
      imageUrl: String(body.imageUrl || ''),
      linkUrl: String(body.linkUrl || '')
    };

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
