const DEFAULT_NETLIFY_ORIGIN = 'https://beforeme-test-20260219-091055.netlify.app';
const DEFAULT_URL = 'https://avantmoi.com';

const FACT_BY_LANG = {
  fr: 'scene plausible generee localement',
  en: 'plausible scene generated locally'
};

const SCENE_TEMPLATES = {
  fr: [
    'Tu restes sur le trottoir pendant qu une petite foule se forme devant un dispositif inattendu. Les premiers observent, puis reproduisent le geste presque aussitot. Un cliquetis sec revient pres de ton epaule. En quelques minutes, la scene ressemble deja a une habitude.',
    'Tu pousses la porte d un lieu public et tout le monde regarde le meme mouvement au comptoir. Les regards se croisent, puis chacun tente sa version sans parler. Un bruit bref de ressort coupe les conversations. Le geste passe de table en table comme un reflexe neuf.',
    'Tu attends au bord de la place quand une demonstration attire des passants de tous les cotes. Des inconnus rient, puis s approchent pour essayer a leur tour. Une vibration courte traverse la rambarde sous ta main. Ce qui etonne d abord devient vite un decor ordinaire.',
    'Tu marches entre les vitrines et un detail lumineux arrete les pas autour de toi. Les gens ralentissent, puis copient la meme action les uns apres les autres. Un frottement metallique se repete derriere la porte. Le quartier entier semble apprendre le mouvement en direct.'
  ],
  en: [
    'You pause on the sidewalk as a small crowd gathers around an unexpected setup. The first people watch, then copy the same move right away. A dry click repeats near your shoulder. Within minutes, the scene already feels like routine.',
    'You walk into a public place and everyone watches one motion near the counter. Eyes meet, then each person tries their own version without speaking. A short spring-like sound cuts through nearby voices. The gesture spreads table to table like a new reflex.',
    'You wait by the square while a live demonstration pulls passersby from every side. Strangers laugh, then step closer to try it too. A brief vibration runs through the rail under your hand. What feels surprising first quickly turns ordinary.',
    'You move past storefronts and a bright detail suddenly slows everyone around you. People stop, then repeat the same action one after another. A metallic rub loops behind a nearby door. The whole street seems to learn the motion in real time.'
  ]
};

const COUNTRY_VIBE = {
  FR: { fr: 'au coin du boulevard', en: 'near the boulevard corner' },
  US: { fr: 'pres d un diner de quartier', en: 'outside a neighborhood diner' },
  BR: { fr: 'pres d un marche couvert', en: 'near a covered street market' },
  MG: { fr: 'pres d une place animee', en: 'near a busy town square' },
  DE: { fr: 'pres d une station de tram', en: 'near a tram stop' },
  ES: { fr: 'pres d une place centrale', en: 'near a central plaza' },
  IT: { fr: 'pres d un cafe de quartier', en: 'near a local cafe' },
  GB: { fr: 'pres d une gare de quartier', en: 'near a neighborhood station' },
  CA: { fr: 'pres d une avenue commercante', en: 'near a shopping avenue' }
};

function sanitizeOrigin(value) {
  const raw = String(value || '').trim();
  if (!raw) return DEFAULT_NETLIFY_ORIGIN;
  return raw.endsWith('/') ? raw.slice(0, -1) : raw;
}

function normalizeLang(raw) {
  return String(raw || '').toLowerCase().startsWith('fr') ? 'fr' : 'en';
}

function normalizeCountry(raw) {
  const country = String(raw || 'US').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2);
  return country.length === 2 ? country : 'US';
}

function parseYear(raw) {
  const year = Number(raw);
  if (!Number.isInteger(year) || year < 1 || year > 2100) return null;
  return year;
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

function pickDistinctIndices(size, count, random) {
  const bag = Array.from({ length: size }, (_, index) => index);
  const picked = [];
  for (let i = 0; i < count && bag.length > 0; i += 1) {
    const idx = Math.floor(random() * bag.length);
    picked.push(bag.splice(idx, 1)[0]);
  }
  return picked;
}

function fallbackPayload({ year, country, lang }) {
  const random = mulberry32(hashString(`${year}|${country}|${lang}|historical`));
  const templates = SCENE_TEMPLATES[lang];
  const picks = pickDistinctIndices(templates.length, 3, random);
  const vibe = COUNTRY_VIBE[country]?.[lang] || (lang === 'fr' ? 'dans une rue passante' : 'on a busy street');

  const items = picks.map((templateIndex, idx) => {
    const scene = templates[templateIndex].replace('sur le trottoir', `sur le trottoir, ${vibe}`);
    const rank = idx + 1;
    return {
      scene,
      fact: FACT_BY_LANG[lang],
      sourceUrl: DEFAULT_URL,
      eventQid: `LOCAL-${year}-${country}-${lang}-${rank}`,
      title: lang === 'fr' ? `Scene locale ${rank}` : `Local scene ${rank}`
    };
  });

  return { year, country, items };
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

function isValidUpstreamPayload(value) {
  if (!value || typeof value !== 'object') return false;
  if (!Array.isArray(value.items)) return false;
  return value.items.every((item) => {
    if (!item || typeof item !== 'object') return false;
    return (
      typeof item.scene === 'string' &&
      item.scene.length > 0 &&
      typeof item.fact === 'string' &&
      item.fact.length > 0 &&
      typeof item.sourceUrl === 'string' &&
      item.sourceUrl.length > 0
    );
  });
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
  const country = normalizeCountry(incoming.searchParams.get('country'));

  if (!year) {
    return new Response(JSON.stringify({ error: 'year is required and must be an integer' }), {
      status: 400,
      headers: responseHeaders()
    });
  }

  const fallback = fallbackPayload({ year, country, lang });
  const upstreamOrigin = sanitizeOrigin(context.env?.NETLIFY_ORIGIN);
  const upstream = new URL('/api/anecdotes', upstreamOrigin);
  upstream.searchParams.set('year', String(year));
  upstream.searchParams.set('lang', lang);
  upstream.searchParams.set('country', country);

  try {
    const response = await fetchWithTimeout(upstream.toString(), 5000);
    if (!response.ok) {
      return new Response(JSON.stringify(fallback), {
        status: 200,
        headers: responseHeaders()
      });
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.toLowerCase().includes('application/json')) {
      return new Response(JSON.stringify(fallback), {
        status: 200,
        headers: responseHeaders()
      });
    }

    const payload = await response.json();
    if (!isValidUpstreamPayload(payload)) {
      return new Response(JSON.stringify(fallback), {
        status: 200,
        headers: responseHeaders()
      });
    }

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: responseHeaders()
    });
  } catch {
    return new Response(JSON.stringify(fallback), {
      status: 200,
      headers: responseHeaders()
    });
  }
}
