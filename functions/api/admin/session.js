import {
  createAdminSessionToken,
  getAdminGoogleClientId,
  hasAdminAllowList,
  isAllowedAdminEmail,
  requireAdminSession
} from '../../lib/admin-auth.js';

const SESSION_TTL_SECONDS = 60 * 60 * 12;

function responseHeaders() {
  return {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization'
  };
}

function json(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: responseHeaders()
  });
}

function log(event, payload) {
  console.log(JSON.stringify({ service: 'admin-session', event, ...payload }));
}

function validateIdToken(raw) {
  const token = String(raw || '').trim();
  if (!token) {
    return { ok: false, error: 'missing_id_token' };
  }
  if (token.length > 8000) {
    return { ok: false, error: 'id_token_too_long' };
  }
  return { ok: true, token };
}

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      method: 'GET',
      signal: controller.signal
    });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchGoogleTokenInfo(idToken) {
  const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`;
  let lastError = new Error('tokeninfo_failed');

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetchWithTimeout(url, 5000);
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(String(payload?.error_description || payload?.error || `status_${response.status}`));
      }
      return payload;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('tokeninfo_failed');
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 250));
      }
    }
  }

  throw lastError;
}

function parseBody(raw) {
  if (!raw || typeof raw !== 'object') {
    return {};
  }
  return raw;
}

function parseGoogleClaims(payload) {
  const email = String(payload?.email || '').trim().toLowerCase();
  const verified = String(payload?.email_verified || '').toLowerCase() === 'true';
  const aud = String(payload?.aud || '').trim();
  return { email, verified, aud };
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: responseHeaders() });
}

export async function onRequestGet(context) {
  const clientId = getAdminGoogleClientId(context.env);
  const auth = await requireAdminSession(context.request, context.env);

  return json(200, {
    authenticated: auth.ok,
    email: auth.ok ? auth.email : null,
    googleClientId: clientId || null
  });
}

export async function onRequestDelete() {
  return json(200, { ok: true });
}

export async function onRequestPost(context) {
  const requestId = crypto.randomUUID();
  const clientId = getAdminGoogleClientId(context.env);
  if (!clientId) {
    log('config_error', { requestId, reason: 'missing_google_client_id' });
    return json(500, { error: 'google_client_id_missing' });
  }
  if (!hasAdminAllowList(context.env)) {
    log('config_error', { requestId, reason: 'missing_admin_google_emails' });
    return json(500, { error: 'admin_google_emails_missing' });
  }

  let body;
  try {
    body = parseBody(await context.request.json());
  } catch {
    return json(400, { error: 'invalid_json' });
  }

  const idTokenCheck = validateIdToken(body.idToken);
  if (!idTokenCheck.ok) {
    return json(400, { error: idTokenCheck.error });
  }

  try {
    const tokenInfo = await fetchGoogleTokenInfo(idTokenCheck.token);
    const claims = parseGoogleClaims(tokenInfo);

    if (!claims.verified) {
      log('auth_denied', { requestId, reason: 'email_not_verified' });
      return json(401, { error: 'email_not_verified' });
    }
    if (claims.aud !== clientId) {
      log('auth_denied', { requestId, reason: 'aud_mismatch' });
      return json(401, { error: 'aud_mismatch' });
    }
    if (!isAllowedAdminEmail(claims.email, context.env)) {
      log('auth_denied', { requestId, reason: 'email_not_allowed', email: claims.email });
      return json(403, { error: 'email_not_allowed' });
    }

    const nowSec = Math.floor(Date.now() / 1000);
    const exp = nowSec + SESSION_TTL_SECONDS;
    const sessionToken = await createAdminSessionToken(
      {
        email: claims.email,
        iat: nowSec,
        exp
      },
      context.env
    );

    log('auth_success', { requestId, email: claims.email });
    return json(200, {
      ok: true,
      email: claims.email,
      sessionToken,
      expiresIn: SESSION_TTL_SECONDS
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown';
    if (message.includes('ADMIN_SESSION_SECRET is missing')) {
      log('config_error', { requestId, reason: 'missing_admin_session_secret' });
      return json(500, { error: 'admin_session_secret_missing' });
    }
    log('tokeninfo_error', { requestId, message });
    return json(502, { error: 'google_verification_failed' });
  }
}
