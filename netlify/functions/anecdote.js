import { PrismaClient } from '@prisma/client';

const WIKIDATA_SPARQL_ENDPOINT = 'https://query.wikidata.org/sparql';
const ALLOWED_LANGS = new Set(['fr', 'en']);
const ALLOWED_SCOPES = new Set(['global', 'local']);
const MAX_SLOT = 20;

const ALLOWED_CATEGORIES = [
  { id: 'invention', terms: ['invention', 'invent', 'prototype', 'device', 'machine', 'appareil', 'brevet'] },
  { id: 'discovery', terms: ['discovery', 'discover', 'observation', 'decouverte', 'scientifique', 'identified'] },
  { id: 'exploration', terms: ['exploration', 'expedition', 'mission', 'voyage', 'traversee', 'spatial', 'mapping'] },
  { id: 'cultural', terms: ['film', 'cinema', 'album', 'song', 'chanson', 'roman', 'livre', 'poeme', 'festival'] },
  { id: 'first-occurrence', terms: ['first', 'premier', 'premiere', 'inauguration', 'opening', 'ouverture', 'launch', 'lancement'] }
];

const BLOCKED_TERMS = [
  'war', 'battle', 'assassination', 'disaster', 'earthquake', 'flood', 'hurricane', 'tsunami', 'politic', 'election',
  'government', 'minister', 'president', 'guerre', 'bataille', 'assassinat', 'catastrophe', 'seisme', 'inondation',
  'ouragan', 'politique', 'election', 'gouvernement', 'ministre', 'president', 'military', 'militaire', 'attentat'
];

const PUBLIC_TERMS = [
  'public', 'inauguration', 'opening', 'ouverture', 'launch', 'lancement', 'demonstration', 'premiere', 'festival', 'service'
];

const VIBES = {
  fr: {
    global: {
      place: 'une rue animee',
      crowd: 'les passants',
      sound: 'un bourdonnement bref',
      object: 'un objet encore rare'
    },
    local: {
      place: 'ta place de quartier',
      crowd: 'les voisins',
      sound: 'un frottement de roues',
      object: 'un outil inattendu'
    }
  },
  en: {
    global: {
      place: 'a busy street',
      crowd: 'people nearby',
      sound: 'a short metallic hum',
      object: 'an unfamiliar object'
    },
    local: {
      place: 'your neighborhood square',
      crowd: 'local passersby',
      sound: 'a rolling friction sound',
      object: 'an unexpected tool'
    }
  }
};

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function includesAny(haystack, terms) {
  return terms.some((term) => haystack.includes(term));
}

function parseYear(raw) {
  const year = Number(raw);
  if (!Number.isInteger(year) || year < 1 || year > 2100) {
    return null;
  }
  return year;
}

function parseSlot(raw) {
  const slot = Number(raw);
  if (!Number.isInteger(slot) || slot < 1 || slot > MAX_SLOT) {
    return null;
  }
  return slot;
}

function safeLang(raw) {
  const value = normalizeText(raw).slice(0, 2);
  return ALLOWED_LANGS.has(value) ? value : 'fr';
}

function safeCountry(raw) {
  const country = String(raw || 'US').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2);
  return country.length === 2 ? country : 'US';
}

function safeScope(raw) {
  const scope = normalizeText(raw);
  return ALLOWED_SCOPES.has(scope) ? scope : 'global';
}

function getCacheKey({ year, lang, country, scope }) {
  if (scope === 'global') {
    return `g:${year}:${lang}`;
  }
  return `l:${year}:${country}:${lang}`;
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

function shuffleWithSeed(items, seedKey) {
  const random = mulberry32(hashString(seedKey));
  const list = [...items];
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

function truncateWords(text, maxWords) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) {
    return words.join(' ');
  }
  return `${words.slice(0, maxWords).join(' ')}...`;
}

function chooseCategory(corpus) {
  for (const category of ALLOWED_CATEGORIES) {
    if (includesAny(corpus, category.terms)) {
      return category.id;
    }
  }
  return null;
}

function buildSparqlQuery(year, lang) {
  const nextYear = year + 1;
  return `
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX schema: <http://schema.org/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?event ?eventLabel ?eventDescription ?article WHERE {
  { ?event wdt:P585 ?date . } UNION { ?event wdt:P571 ?date . }

  FILTER(?date >= "${year}-01-01T00:00:00Z"^^xsd:dateTime)
  FILTER(?date < "${nextYear}-01-01T00:00:00Z"^^xsd:dateTime)

  OPTIONAL {
    ?event rdfs:label ?eventLabel .
    FILTER(LANG(?eventLabel) = "${lang}" || LANG(?eventLabel) = "en")
  }

  OPTIONAL {
    ?event schema:description ?eventDescription .
    FILTER(LANG(?eventDescription) = "${lang}" || LANG(?eventDescription) = "en")
  }

  OPTIONAL {
    ?article schema:about ?event ;
             schema:isPartOf <https://${lang}.wikipedia.org/> .
  }
}
LIMIT 800
`;
}

async function queryWikidata(year, lang) {
  const query = buildSparqlQuery(year, lang);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(WIKIDATA_SPARQL_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/sparql-results+json',
          'Content-Type': 'application/sparql-query; charset=utf-8',
          'User-Agent': 'BeforeMe/1.0 anecdote function'
        },
        body: query
      });

      if (!response.ok) {
        if (response.status >= 500 && attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 500 + attempt * 500));
          continue;
        }
        return [];
      }

      const data = await response.json();
      return Array.isArray(data?.results?.bindings) ? data.results.bindings : [];
    } catch {
      if (attempt === 2) {
        return [];
      }
      await new Promise((resolve) => setTimeout(resolve, 500 + attempt * 500));
    }
  }

  return [];
}

function dedupeRows(bindings) {
  const map = new Map();

  for (const row of bindings) {
    const eventUrl = row.event?.value;
    if (!eventUrl) continue;

    if (!map.has(eventUrl)) {
      map.set(eventUrl, {
        eventUrl,
        label: row.eventLabel?.value || '',
        description: row.eventDescription?.value || '',
        url: row.article?.value || ''
      });
      continue;
    }

    const current = map.get(eventUrl);
    if (!current.label && row.eventLabel?.value) current.label = row.eventLabel.value;
    if (!current.description && row.eventDescription?.value) current.description = row.eventDescription.value;
    if (!current.url && row.article?.value) current.url = row.article.value;
  }

  return Array.from(map.values());
}

function filterAndRankEvents(bindings) {
  const deduped = dedupeRows(bindings);

  return deduped
    .map((entry) => {
      if (!entry.label) return null;
      const corpus = normalizeText(`${entry.label} ${entry.description}`);
      if (!corpus) return null;
      if (includesAny(corpus, BLOCKED_TERMS)) return null;

      const category = chooseCategory(corpus);
      if (!category) return null;

      let score = 0;
      if (entry.url) score += 4;
      if (entry.description) score += 2;
      if (includesAny(corpus, PUBLIC_TERMS)) score += 3;
      if (entry.label.length > 10 && entry.label.length < 120) score += 1;

      return {
        label: entry.label,
        description: entry.description,
        url: entry.url || entry.eventUrl,
        category,
        score
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);
}

function pickAnchor(label, lang, scope) {
  const text = normalizeText(label);
  const base = VIBES[lang][scope];

  if (text.includes('satellite')) {
    return lang === 'fr'
      ? 'un point lumineux filer au-dessus des toits'
      : 'a bright point crossing above the roofs';
  }

  if (text.includes('television') || text.includes('radio') || text.includes('broadcast')) {
    return lang === 'fr'
      ? 'un ecran allume dans une salle pleine'
      : 'a lit screen inside a crowded room';
  }

  if (text.includes('laser')) {
    return lang === 'fr' ? 'un trait de lumiere couper la piece' : 'a narrow beam slicing the room';
  }

  if (text.includes('ordinateur') || text.includes('computer') || text.includes('internet')) {
    return lang === 'fr'
      ? 'un boitier poser une reponse immediate devant la foule'
      : 'a device answering instantly in front of everyone';
  }

  if (text.includes('metro') || text.includes('station') || text.includes('train')) {
    return lang === 'fr'
      ? 'un quai changer de rythme sous les yeux de tous'
      : 'a platform changing rhythm in plain sight';
  }

  if (text.includes('film') || text.includes('cinema') || text.includes('festival')) {
    return lang === 'fr'
      ? 'des images neuves accrocher une salle entiere'
      : 'new moving images holding an entire room';
  }

  return lang === 'fr'
    ? `${base.object} apparaitre en plein jour sur ${base.place}`
    : `${base.object} appearing in daylight at ${base.place}`;
}

function pickTruth(lang, category) {
  if (lang === 'fr') {
    if (category === 'invention') return 'un geste ordinaire suffit maintenant pour lancer quelque chose.';
    if (category === 'discovery') return 'ce qui etait cache trouve soudain une place devant tous.';
    if (category === 'exploration') return 'la distance semble plus courte quand des preuves reviennent jusqu a toi.';
    if (category === 'cultural') return 'les images et les sons partages deviennent un rendez vous spontane.';
    return 'ce qui paraissait exceptionnel prend la forme d une habitude simple.';
  }

  if (category === 'invention') return 'an ordinary gesture is now enough to trigger something.';
  if (category === 'discovery') return 'what stayed hidden suddenly takes space in public sight.';
  if (category === 'exploration') return 'distance feels shorter once proof returns in front of people.';
  if (category === 'cultural') return 'shared images and sounds become a common meeting point.';
  return 'what felt exceptional suddenly starts to look routine.';
}

function buildNarrative({ year, lang, scope, event }) {
  const vibe = VIBES[lang][scope];
  const anchor = pickAnchor(event.label, lang, scope);
  const truth = pickTruth(lang, event.category);

  if (lang === 'fr') {
    const text = [
      `En ${year}, tu vois ${anchor}.`,
      `${vibe.crowd} ralentissent, se rapprochent, puis cherchent le meilleur angle sans parler fort.`,
      `Tu retiens un detail simple: ${vibe.sound}, puis le silence qui suit juste apres.`,
      `En quelques secondes, tu comprends que ${truth}`
    ].join(' ');

    return truncateWords(text, 80);
  }

  const text = [
    `In ${year}, you see ${anchor}.`,
    `${vibe.crowd} slow down, move closer, then look for a better angle in silence.`,
    `One detail stays with you: ${vibe.sound}, then the pause right after.`,
    `Within seconds, you feel that ${truth}`
  ].join(' ');

  return truncateWords(text, 80);
}

function buildFact(lang, event) {
  if (lang === 'fr') {
    return truncateWords(`${event.label}. ${event.description || ''}`.trim(), 20);
  }
  return truncateWords(`${event.label}. ${event.description || ''}`.trim(), 20);
}

function buildSlots({ year, lang, country, scope, rankedEvents }) {
  const seedKey = `${year}|${country}|${lang}|${scope}`;
  const shuffled = shuffleWithSeed(rankedEvents, seedKey);

  if (!shuffled.length) {
    const fallbackEvent = {
      label: lang === 'fr' ? 'Demonstration publique' : 'Public demonstration',
      description: lang === 'fr' ? 'Scene urbaine observee' : 'Observed urban scene',
      url: 'https://www.wikidata.org',
      category: 'first-occurrence'
    };

    return Array.from({ length: MAX_SLOT }, (_, index) => {
      const slot = index + 1;
      return {
        slot,
        narrative: buildNarrative({ year, lang, scope, event: fallbackEvent }),
        fact: buildFact(lang, fallbackEvent),
        url: fallbackEvent.url
      };
    });
  }

  return Array.from({ length: MAX_SLOT }, (_, index) => {
    const slot = index + 1;
    const event = shuffled[index % shuffled.length];

    return {
      slot,
      narrative: buildNarrative({ year, lang, scope, event }),
      fact: buildFact(lang, event),
      url: event.url
    };
  });
}

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=900'
    },
    body: JSON.stringify(body)
  };
}

let prismaClient = null;

function createPrismaClient() {
  const url = process.env.DATABASE_URL || process.env.PRISMA_ACCELERATE_URL || '';
  if (!url) return null;

  if (!prismaClient) {
    prismaClient = new PrismaClient({
      datasources: {
        db: {
          url
        }
      }
    });
  }

  return prismaClient;
}

async function readCache(client, cacheKey) {
  const row = await client.anecdoteCache.findUnique({
    where: { cacheKey },
    select: { payload: true }
  });
  return row?.payload || null;
}

async function writeCache(client, params) {
  const { cacheKey, year, lang, country, scope, payload } = params;

  await client.anecdoteCache.upsert({
    where: { cacheKey },
    create: {
      cacheKey,
      year,
      lang,
      country: scope === 'local' ? country : null,
      scope,
      payload,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    update: {
      year,
      lang,
      country: scope === 'local' ? country : null,
      scope,
      payload,
      updatedAt: new Date()
    }
  });
}

function getSlotFromPayload(payload, slot) {
  if (!payload || !Array.isArray(payload.slots)) {
    return null;
  }

  return payload.slots.find((entry) => entry && entry.slot === slot) || null;
}

async function warmup(year, lang, country, scope) {
  const bindings = await queryWikidata(year, lang);
  const ranked = filterAndRankEvents(bindings);
  const slots = buildSlots({ year, lang, country, scope, rankedEvents: ranked.slice(0, 80) });

  return {
    slots,
    createdAt: new Date().toISOString()
  };
}

export const handler = async (event) => {
  const query = event.queryStringParameters || {};

  const year = parseYear(query.year);
  const slot = parseSlot(query.slot);
  const lang = safeLang(query.lang);
  const country = safeCountry(query.country);
  const scope = safeScope(query.scope);

  if (!year || !slot) {
    return jsonResponse(400, { error: 'Invalid parameters. Expected year and slot.' });
  }

  const cacheKey = getCacheKey({ year, lang, country, scope });
  const client = createPrismaClient();

  if (!client) {
    return jsonResponse(500, { error: 'DATABASE_URL is missing.' });
  }

  try {
    let payload = await readCache(client, cacheKey);
    let slotData = getSlotFromPayload(payload, slot);

    if (!slotData) {
      payload = await warmup(year, lang, country, scope);
      await writeCache(client, { cacheKey, year, lang, country, scope, payload });
      slotData = getSlotFromPayload(payload, slot);
    }

    if (!slotData) {
      return jsonResponse(404, { error: 'Slot not found after warmup.' });
    }

    return jsonResponse(200, slotData);
  } catch (error) {
    return jsonResponse(500, { error: 'Internal error while resolving anecdote slot.' });
  }
};
