import { getPrismaClient } from '../../lib/prisma.js';
import { requireAdminSession } from '../../lib/admin-auth.js';

function responseHeaders() {
  return {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization'
  };
}

function json(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: responseHeaders()
  });
}

function parseYear(raw) {
  if (!raw) return null;
  const year = Number(raw);
  return Number.isInteger(year) ? year : null;
}

function isMissingTableError(error) {
  const message = String(error instanceof Error ? error.message : '');
  return message.includes('does not exist') || message.includes('relation') || message.includes('event_cache');
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: responseHeaders() });
}

export async function onRequestGet(context) {
  const auth = await requireAdminSession(context.request, context.env);
  if (!auth.ok) {
    return json(auth.status || 401, { error: auth.error || 'unauthorized' });
  }

  try {
    const year = parseYear(context.params?.year || new URL(context.request.url).searchParams.get('year'));
    const where = year ? { year, country: 'FR' } : { country: 'FR' };

    const client = getPrismaClient(context.env);
    const rows = await client.eventCache.findMany({
      where,
      orderBy: [{ year: 'desc' }, { updatedAt: 'desc' }],
      take: 300,
      select: {
        year: true,
        country: true,
        lang: true,
        eventQid: true,
        title: true,
        fact: true,
        sourceUrl: true,
        updatedAt: true
      }
    });

    return json(200, { items: rows });
  } catch (error) {
    if (isMissingTableError(error)) {
      return json(200, { items: [] });
    }
    return json(500, { error: error instanceof Error ? error.message : 'internal_error' });
  }
}

export async function onRequestDelete(context) {
  const auth = await requireAdminSession(context.request, context.env);
  if (!auth.ok) {
    return json(auth.status || 401, { error: auth.error || 'unauthorized' });
  }

  try {
    const requestUrl = new URL(context.request.url);
    const year = parseYear(requestUrl.searchParams.get('year'));
    const eventQid = String(requestUrl.searchParams.get('eventQid') || '').trim();
    const lang = String(requestUrl.searchParams.get('lang') || 'fr').trim();

    if (!year || !eventQid) {
      return json(400, { error: 'year and eventQid are required' });
    }

    const client = getPrismaClient(context.env);
    await client.eventCache.delete({
      where: {
        year_country_lang_eventQid: {
          year,
          country: 'FR',
          lang,
          eventQid
        }
      }
    });

    return json(200, { ok: true });
  } catch (error) {
    if (isMissingTableError(error)) {
      return json(200, { ok: true });
    }
    return json(500, { error: error instanceof Error ? error.message : 'internal_error' });
  }
}
