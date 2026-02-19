import { execFileSync } from 'node:child_process';

const START_YEAR = Number(process.env.SEED_START_YEAR || 1950);
const END_YEAR = Number(process.env.SEED_END_YEAR || 2026);
const LANG = (process.env.SEED_LANG || 'fr').toLowerCase();
const COUNTRY = (process.env.SEED_COUNTRY || 'FR').toUpperCase();
const DB_URL_RAW = process.env.DB_URL || '';

if (!DB_URL_RAW.startsWith('postgres://') && !DB_URL_RAW.startsWith('postgresql://')) {
  console.error('Missing valid DB_URL (postgresql://...)');
  process.exit(1);
}

function parseDbUrl(raw) {
  const rest = raw.replace(/^postgres(?:ql)?:\/\//, '');
  const atPos = rest.lastIndexOf('@');
  if (atPos < 0) throw new Error('Invalid DB URL: missing @');

  const userInfo = rest.slice(0, atPos);
  const hostAndDb = rest.slice(atPos + 1);
  const colonPos = userInfo.indexOf(':');
  if (colonPos < 0) throw new Error('Invalid DB URL: missing user/password separator');

  const user = userInfo.slice(0, colonPos);
  const password = userInfo.slice(colonPos + 1);
  const conn = `postgresql://${encodeURIComponent(user)}@${hostAndDb}`;

  return { conn, password };
}

const { conn: DB_CONN, password: DB_PASSWORD } = parseDbUrl(DB_URL_RAW);

function runPsql(sql) {
  return execFileSync('psql', [DB_CONN, '-v', 'ON_ERROR_STOP=1', '-At', '-c', sql], {
    encoding: 'utf8',
    env: { ...process.env, PGPASSWORD: DB_PASSWORD }
  });
}

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
  if (words.length <= maxWords) return words.join(' ');
  return `${words.slice(0, maxWords).join(' ')}...`;
}

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
  }
};

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
      const response = await fetch('https://query.wikidata.org/sparql', {
        method: 'POST',
        headers: {
          Accept: 'application/sparql-results+json',
          'Content-Type': 'application/sparql-query; charset=utf-8',
          'User-Agent': 'BeforeMe/1.0 seed script'
        },
        body: query
      });

      if (!response.ok) {
        if (response.status >= 500 && attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 600 + attempt * 400));
          continue;
        }
        return [];
      }

      const data = await response.json();
      return Array.isArray(data?.results?.bindings) ? data.results.bindings : [];
    } catch {
      if (attempt === 2) return [];
      await new Promise((resolve) => setTimeout(resolve, 600 + attempt * 400));
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
  return dedupeRows(bindings)
    .map((entry) => {
      if (!entry.label) return null;
      const corpus = normalizeText(`${entry.label} ${entry.description}`);
      if (!corpus || includesAny(corpus, BLOCKED_TERMS)) return null;

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
    .sort((a, b) => b.score - a.score)
    .slice(0, 80);
}

function pickAnchor(label, scope) {
  const text = normalizeText(label);
  const base = VIBES.fr[scope];

  if (text.includes('satellite')) return 'un point lumineux filer au-dessus des toits';
  if (text.includes('television') || text.includes('radio') || text.includes('broadcast')) return 'un ecran allume dans une salle pleine';
  if (text.includes('laser')) return 'un trait de lumiere couper la piece';
  if (text.includes('ordinateur') || text.includes('computer') || text.includes('internet')) return 'un boitier poser une reponse immediate devant la foule';
  if (text.includes('metro') || text.includes('station') || text.includes('train')) return 'un quai changer de rythme sous les yeux de tous';
  if (text.includes('film') || text.includes('cinema') || text.includes('festival')) return 'des images neuves accrocher une salle entiere';

  return `${base.object} apparaitre en plein jour sur ${base.place}`;
}

function pickTruth(category) {
  if (category === 'invention') return 'un geste ordinaire suffit maintenant pour lancer quelque chose.';
  if (category === 'discovery') return 'ce qui etait cache trouve soudain une place devant tous.';
  if (category === 'exploration') return 'la distance semble plus courte quand des preuves reviennent jusqu a toi.';
  if (category === 'cultural') return 'les images et les sons partages deviennent un rendez vous spontane.';
  return 'ce qui paraissait exceptionnel prend la forme d une habitude simple.';
}

function buildNarrative(year, scope, event) {
  const vibe = VIBES.fr[scope];
  const anchor = pickAnchor(event.label, scope);
  const truth = pickTruth(event.category);

  return truncateWords(
    [
      `En ${year}, tu vois ${anchor}.`,
      `${vibe.crowd} ralentissent, se rapprochent, puis cherchent le meilleur angle sans parler fort.`,
      `Tu retiens un detail simple: ${vibe.sound}, puis le silence qui suit juste apres.`,
      `En quelques secondes, tu comprends que ${truth}`
    ].join(' '),
    80
  );
}

function buildFact(event) {
  return truncateWords(`${event.label}. ${event.description || ''}`.trim(), 20);
}

function buildSlots(year, scope, events) {
  const shuffled = shuffleWithSeed(events, `${year}|${COUNTRY}|${LANG}|${scope}`);
  const fallback = {
    label: 'Demonstration publique',
    description: 'Scene urbaine observee',
    url: 'https://www.wikidata.org',
    category: 'first-occurrence'
  };

  return Array.from({ length: 20 }, (_, index) => {
    const slot = index + 1;
    const event = shuffled.length ? shuffled[index % shuffled.length] : fallback;

    return {
      slot,
      narrative: buildNarrative(year, scope, event),
      fact: buildFact(event),
      url: event.url
    };
  });
}

function sqlLiteral(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

function dollarQuote(jsonText) {
  const tag = '$payload$';
  return `${tag}${jsonText}${tag}`;
}

function upsertCache({ key, year, scope, payload }) {
  const countrySql = scope === 'local' ? sqlLiteral(COUNTRY) : 'NULL';
  const sql = `
INSERT INTO public.anecdote_cache (cache_key, scope, year, lang, country, payload)
VALUES (
  ${sqlLiteral(key)},
  ${sqlLiteral(scope)},
  ${year},
  ${sqlLiteral(LANG)},
  ${countrySql},
  ${dollarQuote(JSON.stringify(payload))}::jsonb
)
ON CONFLICT (cache_key)
DO UPDATE SET
  payload = EXCLUDED.payload,
  year = EXCLUDED.year,
  lang = EXCLUDED.lang,
  country = EXCLUDED.country,
  scope = EXCLUDED.scope,
  updated_at = now();
`;

  runPsql(sql);
}

function keyFor(year, scope) {
  return scope === 'global' ? `g:${year}:${LANG}` : `l:${year}:${COUNTRY}:${LANG}`;
}

async function seedYear(year) {
  const bindings = await queryWikidata(year, LANG);
  const events = filterAndRankEvents(bindings);

  for (const scope of ['global', 'local']) {
    const key = keyFor(year, scope);
    const payload = {
      slots: buildSlots(year, scope, events),
      createdAt: new Date().toISOString()
    };

    upsertCache({ key, year, scope, payload });
  }

  return { year, events: events.length };
}

async function main() {
  const started = Date.now();
  const stats = [];

  for (let year = START_YEAR; year <= END_YEAR; year += 1) {
    const stat = await seedYear(year);
    stats.push(stat);
    console.log(`seeded ${year} (events=${stat.events})`);
    await new Promise((resolve) => setTimeout(resolve, 120));
  }

  const totalEvents = stats.reduce((sum, item) => sum + item.events, 0);
  console.log(`done years=${stats.length} totalEventsScored=${totalEvents} elapsedMs=${Date.now() - started}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
