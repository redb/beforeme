function toBase64Url(value) {
  return btoa(value).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

function fromBase64Url(value) {
  const normalized = value.replaceAll('-', '+').replaceAll('_', '/');
  const padding = '='.repeat((4 - (normalized.length % 4 || 4)) % 4);
  return atob(`${normalized}${padding}`);
}

function textEncoder() {
  return new TextEncoder();
}

function getSessionSecret(env) {
  return String(env?.ADMIN_SESSION_SECRET || '').trim();
}

function allowedEmails(env) {
  const raw = String(env?.ADMIN_GOOGLE_EMAILS || env?.ADMIN_GOOGLE_EMAIL || '').trim();
  return raw
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

function googleClientId(env) {
  return String(env?.ADMIN_GOOGLE_CLIENT_ID || env?.GOOGLE_CLIENT_ID || '').trim();
}

async function hmacSign(input, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    textEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, textEncoder().encode(input));
  return toBase64Url(String.fromCharCode(...new Uint8Array(signature)));
}

export async function createAdminSessionToken(payload, env) {
  const secret = getSessionSecret(env);
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET is missing');
  }

  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = await hmacSign(encodedPayload, secret);
  return `${encodedPayload}.${signature}`;
}

export async function verifyAdminSessionToken(token, env) {
  const secret = getSessionSecret(env);
  if (!secret) {
    return { ok: false, reason: 'session_secret_missing' };
  }

  const [encodedPayload, signature] = String(token || '').split('.');
  if (!encodedPayload || !signature) {
    return { ok: false, reason: 'malformed' };
  }

  const expected = await hmacSign(encodedPayload, secret);
  if (signature !== expected) {
    return { ok: false, reason: 'signature_mismatch' };
  }

  let payload;
  try {
    payload = JSON.parse(fromBase64Url(encodedPayload));
  } catch {
    return { ok: false, reason: 'invalid_payload' };
  }

  const email = String(payload?.email || '').trim().toLowerCase();
  const exp = Number(payload?.exp || 0);
  if (!email || !Number.isFinite(exp)) {
    return { ok: false, reason: 'invalid_claims' };
  }

  if (Date.now() >= exp * 1000) {
    return { ok: false, reason: 'expired' };
  }

  const allowList = allowedEmails(env);
  if (!allowList.length) {
    return { ok: false, reason: 'allowlist_missing' };
  }
  if (!allowList.includes(email)) {
    return { ok: false, reason: 'email_not_allowed' };
  }

  return { ok: true, email };
}

function extractBearerToken(request) {
  const header = String(request.headers.get('Authorization') || '');
  if (!header.toLowerCase().startsWith('bearer ')) {
    return '';
  }
  return header.slice(7).trim();
}

export async function requireAdminSession(request, env) {
  const token = extractBearerToken(request);
  if (!token) {
    return { ok: false, status: 401, error: 'missing_session' };
  }

  const result = await verifyAdminSessionToken(token, env);
  if (!result.ok) {
    return { ok: false, status: 401, error: result.reason || 'invalid_session' };
  }

  return { ok: true, email: result.email };
}

export function getAdminGoogleClientId(env) {
  return googleClientId(env);
}

export function isAllowedAdminEmail(email, env) {
  const allowList = allowedEmails(env);
  if (!allowList.length) return false;
  return allowList.includes(String(email || '').trim().toLowerCase());
}

export function hasAdminAllowList(env) {
  return allowedEmails(env).length > 0;
}
