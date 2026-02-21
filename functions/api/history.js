const DEFAULT_URL = 'https://avantmoi.com';

const FALLBACK_EVENTS = {
  fr: [
    { label: 'Demonstration publique d un nouveau dispositif urbain', summary: 'Une demonstration attire la foule et un geste quotidien change en ville.', url: DEFAULT_URL },
    { label: 'Ouverture d un service collectif en centre-ville', summary: 'Un service accessible au public modifie les habitudes de deplacement.', url: DEFAULT_URL },
    { label: 'Premiere mise en usage d un outil pratique', summary: 'Un outil jusque-la rare devient visible et teste par tous.', url: DEFAULT_URL },
    { label: 'Nouvelle pratique diffusee dans les lieux publics', summary: 'Une pratique se repand rapidement dans les espaces frequentes.', url: DEFAULT_URL },
    { label: 'Presentation d une innovation d usage courant', summary: 'Une presentation publique transforme un geste simple du quotidien.', url: DEFAULT_URL },
    { label: 'Premier deploiement d un service en quartier', summary: 'Un deploiement local change la facon d attendre et de circuler.', url: DEFAULT_URL },
    { label: 'Lancement d un acces simplifie au public', summary: 'Un acces simplifie rend un service plus direct pour les passants.', url: DEFAULT_URL },
    { label: 'Diffusion d un nouvel usage dans la rue', summary: 'Un usage encore neuf devient visible puis familier dans la rue.', url: DEFAULT_URL }
  ],
  en: [
    { label: 'Public demonstration of a new city device', summary: 'A public demo draws a crowd and shifts an everyday urban gesture.', url: DEFAULT_URL },
    { label: 'Opening of a shared downtown service', summary: 'A public-facing service changes how people move through the area.', url: DEFAULT_URL },
    { label: 'First practical use of a visible tool', summary: 'A once-rare tool appears in public and gets tested by everyone.', url: DEFAULT_URL },
    { label: 'New public-place practice becomes common', summary: 'A new practice spreads quickly across busy public places.', url: DEFAULT_URL },
    { label: 'Presentation of a daily-use innovation', summary: 'A public presentation changes a simple day-to-day behavior.', url: DEFAULT_URL },
    { label: 'First neighborhood rollout of a service', summary: 'A local rollout changes how people wait and get around.', url: DEFAULT_URL },
    { label: 'Launch of simpler public access', summary: 'Simpler access makes a familiar service feel immediate.', url: DEFAULT_URL },
    { label: 'Spread of a new street-level habit', summary: 'A new habit appears in public and quickly feels familiar.', url: DEFAULT_URL }
  ]
};

function parseYear(raw) {
  const year = Number(raw);
  if (!Number.isInteger(year) || year < 1 || year > 2100) return null;
  return year;
}

function normalizeLang(raw) {
  return String(raw || '').toLowerCase().startsWith('fr') ? 'fr' : 'en';
}

function hashString(input) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickFallbackEvents(year, lang) {
  const random = mulberry32(hashString(`${year}|${lang}|history`));
  const pool = [...FALLBACK_EVENTS[lang]];
  const items = [];

  while (pool.length > 0 && items.length < 5) {
    const index = Math.floor(random() * pool.length);
    items.push(pool.splice(index, 1)[0]);
  }

  return items;
}

function responseHeaders(contentType = 'application/json; charset=utf-8') {
  return {
    'Content-Type': contentType,
    'Cache-Control': 'public, max-age=900',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}

function isHistoryItem(value) {
  return Boolean(
    value &&
      typeof value === 'object' &&
      typeof value.summary === 'string' &&
      value.summary.length > 0 &&
      typeof value.label === 'string' &&
      value.label.length > 0 &&
      typeof value.url === 'string' &&
      value.url.length > 0
  );
}

function isHistoryPayload(value) {
  return Array.isArray(value) && value.every(isHistoryItem);
}

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal
    });
  } finally {
    clearTimeout(timer);
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: responseHeaders()
  });
}

export async function onRequestGet(context) {
  const incoming = new URL(context.request.url);
  const year = parseYear(incoming.searchParams.get('year'));
  const lang = normalizeLang(incoming.searchParams.get('lang'));

  if (!year) {
    return new Response(JSON.stringify({ error: 'Invalid year parameter' }), {
      status: 400,
      headers: responseHeaders()
    });
  }

  const fallback = pickFallbackEvents(year, lang);
  if (!isHistoryPayload(fallback)) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: responseHeaders()
    });
  }

  return new Response(JSON.stringify(fallback.slice(0, 5)), {
    status: 200,
    headers: responseHeaders()
  });
}
