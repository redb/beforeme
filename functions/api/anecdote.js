const DEFAULT_NETLIFY_ORIGIN = 'https://beforeme-test-20260219-091055.netlify.app';
const MAX_SLOT = 20;
const DEFAULT_FACT = {
  fr: 'scene plausible generee localement',
  en: 'plausible scene generated locally'
};
const DEFAULT_URL = 'https://avantmoi.com';
const FALLBACK_TEMPLATES = {
  fr: {
    global: [
      'Tu avances sur un trottoir humide et un objet nouveau attire tous les regards. Les passants ralentissent, puis se rapprochent sans parler. Un cliquetis sec revient a intervalles reguliers pres de ta manche. Le geste parait etrange, puis devient naturel en quelques minutes.',
      'Tu pousses une porte vitree et une file se forme autour d un comptoir improvise. Chacun observe le meme mouvement, puis l imite presque aussitot. Un bruit de ressort rebondit contre les carreaux. Sans annonce, une habitude commune prend sa place.',
      'Tu attends au bord de la rue quand une demonstration commence devant un petit groupe serre. Des inconnus echangent un regard puis tendent la main a leur tour. Une vibration breve traverse la rambarde sous tes doigts. Ce qui surprend d abord s installe deja dans le decor.',
      'Tu t arretes pres d une vitrine et un detail lumineux capte toute l attention. Les gens sourient, puis cherchent comment reproduire le meme geste. Un frottement metallique se repete juste derriere toi. En quelques instants, la scene ressemble a une routine.'
    ],
    local: [
      'Tu rejoins un cafe de quartier et un rituel change sans explication entre deux tables. Les voisins se penchent, puis testent la meme chose a leur tour. Un tintement bref traverse la salle pendant que les chaises grincent. Chez toi aussi, le quotidien prend un nouveau rythme.',
      'Tu longes un marche et un usage inattendu apparait au milieu des stands ouverts. Les vendeurs observent, puis adoptent le geste sans hesitation. Un claquement net couvre un instant les conversations proches. Dans ton pays, ce reflexe commence a circuler partout.',
      'Tu montes dans un transport urbain et un detail pratique apparait pres de la porte. Les voyageurs hesitent une seconde, puis font pareil les uns apres les autres. Un declic sec marque chaque essai reussi. La ville semble apprendre ce mouvement en direct.',
      'Tu traverses une place animee quand une nouveaute discrete attire les curieux. Des passants rient, puis se rangent pour essayer a leur tour. Un son court cogne contre les murs de pierre. A la fin, personne ne trouve la scene etrange.'
    ]
  },
  en: {
    global: [
      'You stop on a crowded sidewalk and a new object pulls every eye at once. People slow down, then move closer without speaking. A dry click repeats near your sleeve every few seconds. What looks odd first starts to feel normal immediately.',
      'You walk through a glass door and a line grows around an improvised counter. Each person watches one move, then copies it right away. A spring-like sound bounces off the windows behind you. Without any speech, a shared habit takes shape.',
      'You wait near the street as a short public demo starts in front of a tight crowd. Strangers exchange glances and try the same motion one after another. A brief vibration runs through the rail under your hand. The unusual moment turns ordinary fast.',
      'You pause by a storefront while a bright detail captures everyone nearby. People smile, then search for the exact same gesture. A metallic rub repeats just behind you. Within minutes, the scene feels like part of daily life.'
    ],
    local: [
      'You enter a neighborhood cafe and a familiar routine shifts between two tables. Locals lean in, then repeat the same action themselves. A short chime crosses the room as chairs scrape the floor. In your area, everyday rhythm starts to change.',
      'You pass through a public market and a practical habit appears between open stalls. Vendors watch closely, then adopt the move without hesitation. A crisp snap briefly cuts through nearby voices. In your country, this reflex starts spreading quickly.',
      'You board city transport and notice a new practical detail near the door. Riders pause for a second, then follow one by one. A small click marks each successful attempt. The city seems to learn the motion in real time.',
      'You cross a busy square when a subtle novelty gathers a curious circle. Passersby laugh, then line up to try it too. A short tone hits the stone walls around you. By the end, nobody treats it as strange.'
    ]
  }
};

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

  const templates = FALLBACK_TEMPLATES[lang][scope];
  const random = mulberry32(hashString(`${year}|${country}|${lang}|${scope}|${slot}`));
  const index = Math.floor(random() * templates.length);
  const narrative = templates[index];

  return {
    slot,
    narrative,
    fact: DEFAULT_FACT[lang],
    url: DEFAULT_URL
  };
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
