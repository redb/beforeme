function responseHeaders() {
  return {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}

function json(status, payload) {
  return new Response(JSON.stringify(payload), { status, headers: responseHeaders() });
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: responseHeaders() });
}

export async function onRequestGet(context) {
  return json(200, {
    hasOpenAIKey: Boolean(String(context.env?.OPENAI_API_KEY || '').trim()),
    hasOpenAIModel: Boolean(String(context.env?.OPENAI_MODEL || '').trim()),
    hasDatabaseUrl: Boolean(String(context.env?.DATABASE_URL || '').trim()),
    branch: String(context.env?.CF_PAGES_BRANCH || ''),
    pagesUrl: String(context.env?.CF_PAGES_URL || '')
  });
}
