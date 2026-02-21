import { getPrismaClient } from '../../lib/prisma.js';

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

function isMissingTableError(error) {
  const message = String(error instanceof Error ? error.message : '');
  return message.includes('does not exist') || message.includes('relation');
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: responseHeaders() });
}

export async function onRequestPost(context) {
  const url = new URL(context.request.url);
  const confirm = String(url.searchParams.get('confirm') || '').trim();
  if (confirm !== 'YES_DELETE_CACHE') {
    return json(400, { error: 'Missing confirm=YES_DELETE_CACHE' });
  }

  try {
    const client = getPrismaClient(context.env);
    const [eventResult, anecdoteResult] = await Promise.all([
      client.eventCache.deleteMany({ where: {} }),
      client.anecdoteCache.deleteMany({ where: {} })
    ]);

    return json(200, {
      ok: true,
      deleted: {
        eventCache: Number(eventResult.count || 0),
        anecdoteCache: Number(anecdoteResult.count || 0)
      }
    });
  } catch (error) {
    if (isMissingTableError(error)) {
      return json(200, {
        ok: true,
        deleted: { eventCache: 0, anecdoteCache: 0 },
        note: 'One or more cache tables are missing.'
      });
    }
    return json(500, { error: error instanceof Error ? error.message : 'purge_failed' });
  }
}

