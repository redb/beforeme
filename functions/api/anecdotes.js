import { getPrismaClient } from '../lib/prisma.js';

const CONFIG = {
  wikidataSparqlEndpoint: 'https://query.wikidata.org/sparql',
  wikidataApiEndpoint: 'https://www.wikidata.org/w/api.php',
  openaiResponsesEndpoint: 'https://api.openai.com/v1/responses',
  cacheVersion: 'V13',
  maxItems: 20,
  minWords: 55,
  maxWords: 90,
  firstPassLimit: 200,
  secondPassLimit: 500,
  topCandidatesFirst: 120,
  topCandidatesSecond: 120,
  retries: 1,
  sparqlTimeoutMs: 18000,
  entityTimeoutMs: 5000,
  llmTimeoutMs: 9000,
  rateLimitWindowMs: 60_000,
  rateLimitMax: 30,
  disableCache: true,
  enableFallbackNarratives: false,
  enableNarrativeFilters: false
};

const OVERSEAS_QIDS = [
  'Q17012', // Guadeloupe
  'Q17054', // Martinique
  'Q3769', // French Guiana
  'Q17070', // Reunion
  'Q17063', // Mayotte
  'Q34617', // Saint Pierre and Miquelon
  'Q126125', // Saint Martin (French part)
  'Q25362', // Saint Barthelemy
  'Q33788', // New Caledonia
  'Q30971', // French Polynesia
  'Q35555', // Wallis and Futuna
  'Q129003' // French Southern and Antarctic Lands
];
const OVERSEAS_QID_SET = new Set(OVERSEAS_QIDS);
const OVERSEAS_LABEL_KEYWORDS = [
  'guadeloupe',
  'martinique',
  'guyane',
  'reunion',
  'réunion',
  'mayotte',
  'saint-pierre-et-miquelon',
  'saint-barthelemy',
  'saint-barthélemy',
  'saint-martin',
  'nouvelle-caledonie',
  'nouvelle-calédonie',
  'polynesie',
  'polynésie',
  'wallis',
  'futuna',
  'terres australes'
];

const BANNED_CATEGORY_KEYWORDS = [
  'war', 'battle', 'assassination', 'disaster', 'earthquake', 'flood', 'cyclone', 'politic', 'election', 'government',
  'massacre', 'riot', 'strike', 'protest', 'crash', 'accident', 'murder', 'killing', 'death',
  'guerre', 'bataille', 'assassinat', 'catastrophe', 'seisme', 'séisme', 'inondation', 'politique', 'election', 'élection',
  'gouvernement', 'emeute', 'émeute', 'greve', 'grève', 'manifestation', 'meurtre', 'mort',
  'attentat', 'terror', 'terrorisme', 'occupation'
];
const HARD_BAN_CATEGORY_KEYWORDS = [
  'murder', 'assassination', 'disaster', 'meurtre', 'assassinat', 'catastrophe'
];

const BANNED_SCENE_WORDS = [
  'chose', 'phénomène', 'phenomene', 'quelque chose', 'atmosphère', 'atmosphere', 'symbole', 'contexte', 'impact',
  'société', 'societe', 'modernité', 'modernite', 'système', 'systeme', 'dynamique', 'processus', 'transformation',
  'événement', 'evenement', 'objet', 'innovation', 'dispositif', 'appareil'
];
const BANNED_EMOTION_WORDS = [
  'espoir', 'peur', 'tension', 'incertitude', 'fragile', 'hésitant', 'hesitant',
  'scepticisme', 'angoisse', 'anxieux', 'anxieuse'
];
const BANNED_METAPHOR_PATTERNS = [
  'comme si',
  'tel un',
  'telle une',
  'dans une danse',
  'poids du possible',
  'au bord de'
];
const BANNED_PSYCH_WORDS = ['tu sens', 'tu comprends', 'tu réalises', 'tu realises', 'impression', 'intuition'];
const REQUIRED_OBJECT_WORDS = [
  'affiche', 'ticket', 'panneau', 'barrière', 'barriere', 'micro', 'journal', 'pavé', 'pave',
  'vitrine', 'guichet', 'tribune', 'casque', 'rideau', 'urne', 'combiné', 'combine', 'radio',
  'téléviseur', 'televiseur', 'badge', 'banderole'
];
const REQUIRED_ACTION_WORDS = [
  'court', 'courent', 'lit', 'lisent', 'applaudit', 'applaudissent', 'colle', 'collent',
  'pointe', 'pointent', 'ouvre', 'ouvrent', 'ferme', 'ferment', 'grimpe', 'grimpent',
  'change', 'changent', 'marche', 'marchent', 'arrête', 'arrêtent', 'arrete', 'arretent'
];
const REQUIRED_PRECISE_LOCATIONS = [
  'gare', 'station', 'quai', 'place', 'marché', 'marche', 'boulevard', 'rue', 'tribune', 'palais'
];
const BANNED_TEMPLATE_PATTERNS = [
  "apparait devant toi",
  "apparaît devant toi",
  "coupe le passage",
  "un bruit sec part du trottoir"
];
const BANNED_SCENE_FRAGMENTS = [
  'se répand sur le trottoir',
  'se repand sur le trottoir',
  'deux passants lisent le panneau à voix haute',
  'deux passants lisent le panneau a voix haute',
  'la foule se décale vers la grille',
  'la foule se decale vers la grille',
  'quitter l’axe principal et contourner la rue voisine',
  'quitter l\'axe principal et contourner la rue voisine',
  'tu t’arrêtes devant une entrée marquée',
  'tu t\'arretes devant une entree marquee',
  'tout le quartier s’organise autour de ce repère',
  'tout le quartier s\'organise autour de ce repere'
];

const VISUAL_KEYWORDS = [
  'gare', 'station', 'rue', 'boulevard', 'place', 'café', 'cafe', 'marché', 'marche', 'vitrine', 'radio',
  'affiche', 'téléviseur', 'televiseur', 'tram', 'bus', 'quai', 'palais', 'hall', 'guichet', 'cabine'
];

const CONCRETE_OBJECTS = [
  'radio', 'affiche', 'téléviseur', 'combiné', 'ticket', 'pavé', 'barrière', 'guichet', 'micro', 'panneau',
  'vitrine', 'portière', 'horloge', 'urne', 'projecteur', 'rideau', 'journal'
];
const TITLE_TRASH_KEYWORDS = [
  'jeux olympiques', 'relais', 'epreuve', 'épreuve', 'liste', 'saison', 'championnat', 'tournoi', 'finale'
];
const TYPE_TRASH_KEYWORDS = [
  'liste', 'season', 'saison', 'olympic competition', 'competition olympique', 'compétition olympique'
];

const rateLimitState = new Map();
const wikiSummaryCache = new Map();
const SEEDED_EVENTS = {
  'FR:1968': [
    { eventQid: 'SEED-1968-1', title: 'Mai 68', sourceUrl: 'https://fr.wikipedia.org/wiki/Mai_68', placeLabel: 'Paris', dateText: 'mai 1968' },
    { eventQid: 'SEED-1968-2', title: 'Festival de Cannes 1968', sourceUrl: 'https://fr.wikipedia.org/wiki/Festival_de_Cannes_1968', placeLabel: 'Cannes', dateText: 'mai 1968' },
    { eventQid: 'SEED-1968-3', title: 'Accords de Grenelle', sourceUrl: 'https://fr.wikipedia.org/wiki/Accords_de_Grenelle', placeLabel: 'Paris', dateText: '27 mai 1968' },
    { eventQid: 'SEED-1968-4', title: "Jeux olympiques d'hiver de 1968", sourceUrl: "https://fr.wikipedia.org/wiki/Jeux_olympiques_d%27hiver_de_1968", placeLabel: 'Grenoble', dateText: 'février 1968' },
    { eventQid: 'SEED-1968-5', title: 'Manifestations de mai 1968 en France', sourceUrl: 'https://fr.wikipedia.org/wiki/Manifestations_de_mai_1968_en_France', placeLabel: 'Paris', dateText: 'mai 1968' }
  ]
};

function log(level, message, context = {}) {
  const payload = {
    level,
    message,
    ts: new Date().toISOString(),
    ...context
  };

  if (level === 'error') {
    console.error(JSON.stringify(payload));
  } else {
    console.log(JSON.stringify(payload));
  }
}

function responseHeaders(contentType = 'application/json; charset=utf-8') {
  return {
    'Content-Type': contentType,
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}

function json(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: responseHeaders()
  });
}

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

function parseBoolean(value, defaultValue = false) {
  if (value == null) return defaultValue;
  const normalized = String(value).trim().toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes';
}

function parseDebugOptions(searchParams) {
  return {
    noCache: parseBoolean(searchParams.get('noCache'), false),
    noFilters: parseBoolean(searchParams.get('noFilters'), false),
    noAnchors: parseBoolean(searchParams.get('noAnchors'), false),
    noConstraints: parseBoolean(searchParams.get('noConstraints'), false),
    noTimeout: parseBoolean(searchParams.get('noTimeout'), false),
    noFallback: parseBoolean(searchParams.get('noFallback'), false)
  };
}

function parseCountryStrict(raw) {
  const value = String(raw || '').trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(value)) return null;
  return value;
}

function parseYear(raw) {
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 1 || value > 2100) return null;
  return value;
}

function validateInput(searchParams) {
  const year = parseYear(searchParams.get('year'));
  const country = parseCountryStrict(searchParams.get('country'));
  const lang = String(searchParams.get('lang') || '').toLowerCase().startsWith('fr') ? 'fr' : 'en';
  const allowOverseas = parseBoolean(searchParams.get('allowOverseas'), false);
  const safe = parseBoolean(searchParams.get('safe'), false);

  const errors = [];
  if (!year) errors.push('year is required and must be an integer between 1 and 2100');
  if (!country) errors.push('country is required as ISO alpha-2 (ex: FR, US, BR)');

  return {
    ok: errors.length === 0,
    data: { year, country, lang, allowOverseas, safe },
    errors
  };
}

function rateLimitKey(request) {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for') ||
    'unknown'
  );
}

function checkRateLimit(request) {
  const key = rateLimitKey(request);
  const now = Date.now();
  const current = rateLimitState.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitState.set(key, { count: 1, resetAt: now + CONFIG.rateLimitWindowMs });
    return { allowed: true };
  }

  if (current.count >= CONFIG.rateLimitMax) {
    return { allowed: false, retryAfterMs: current.resetAt - now };
  }

  current.count += 1;
  return { allowed: true };
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithTimeoutAndRetry(url, init, { timeoutMs, retries }) {
  let lastError = null;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        ...init,
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response;
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await sleep(200 * (attempt + 1));
      }
    } finally {
      clearTimeout(timer);
    }
  }

  throw lastError || new Error('request_failed');
}

function extractQid(value) {
  const match = String(value || '').match(/Q\d+/);
  return match ? match[0] : null;
}

async function resolveCountryQid(country) {
  if (country === 'FR') return 'Q142';

  const query = `
SELECT ?country WHERE {
  ?country wdt:P31/wdt:P279* wd:Q6256;
           wdt:P297 "${country}".
}
LIMIT 1
`;

  const url = `${CONFIG.wikidataSparqlEndpoint}?query=${encodeURIComponent(query)}`;
  const response = await fetchWithTimeoutAndRetry(
    url,
    {
      method: 'GET',
      headers: {
        Accept: 'application/sparql-results+json',
        'User-Agent': 'AvantMoi/1.0 (contact: contact@avantmoi.com)'
      }
    },
    { timeoutMs: CONFIG.sparqlTimeoutMs, retries: CONFIG.retries }
  );

  const payload = await response.json();
  const qid = extractQid(payload?.results?.bindings?.[0]?.country?.value || '');
  if (!qid) {
    throw new Error(`unsupported_country:${country}`);
  }
  return qid;
}

function buildOverseasExclusionClause(countryQid, allowOverseas) {
  return '';
}

function buildCandidateQuery({ year, countryQid, limit, allowOverseas, strictPlace }) {
  const overseasClause = buildOverseasExclusionClause(countryQid, allowOverseas);
  const placeClause = strictPlace
    ? `{
    ?event wdt:P276 ?placeOut .
    ?placeOut wdt:P131* ?country .
  }
  UNION
  {
    ?event wdt:P131 ?placeOut .
    ?placeOut wdt:P131* ?country .
  }`
    : `{
    ?event wdt:P276 ?placeOut .
    ?placeOut wdt:P17 ?country .
  }
  UNION
  {
    ?event wdt:P131 ?placeOut .
    ?placeOut wdt:P17 ?country .
  }`;
  return `
SELECT ?event ?date ?placeOut ?type WHERE {
  VALUES ?targetYear { ${year} }
  VALUES ?country { wd:${countryQid} }
  {
    ?event wdt:P585 ?date .
  } UNION {
    ?event wdt:P580 ?date .
  } UNION {
    ?event wdt:P582 ?date .
  }
  FILTER(YEAR(?date) = ?targetYear)

  ${placeClause}
  ${overseasClause}

  OPTIONAL { ?event wdt:P31 ?type . }
}
LIMIT ${limit}
`;
}

async function fetchSparqlRows(query) {
  const url = `${CONFIG.wikidataSparqlEndpoint}?query=${encodeURIComponent(query)}`;
  const response = await fetchWithTimeoutAndRetry(
    url,
    {
      method: 'GET',
      headers: {
        Accept: 'application/sparql-results+json',
        'User-Agent': 'AvantMoi/1.0 (contact: contact@avantmoi.com)'
      }
    },
    { timeoutMs: CONFIG.sparqlTimeoutMs, retries: CONFIG.retries }
  );

  const payload = await response.json();
  return payload?.results?.bindings || [];
}

function parseRows(rows) {
  return rows
    .map((row) => ({
      eventQid: extractQid(row?.event?.value || ''),
      placeQid: extractQid(row?.placeOut?.value || ''),
      placeMissing: !extractQid(row?.placeOut?.value || ''),
      typeQid: extractQid(row?.type?.value || ''),
      dateIso: String(row?.date?.value || '').trim()
    }))
    .filter((item) => item.eventQid && item.dateIso);
}

function isMetropolitanExcludedCandidate(candidate) {
  if (OVERSEAS_QID_SET.has(candidate.placeQid)) return true;
  const searchable = normalizeText(`${candidate.placeLabel} ${candidate.placeDescription}`);
  return OVERSEAS_LABEL_KEYWORDS.some((word) => searchable.includes(normalizeText(word)));
}

function chunk(items, size) {
  const output = [];
  for (let i = 0; i < items.length; i += size) {
    output.push(items.slice(i, i + size));
  }
  return output;
}

async function fetchEntityBundle(ids, lang) {
  const entities = new Map();
  const chunks = chunk([...new Set(ids)].filter((id) => /^Q\d+$/.test(String(id || ''))), 50);

  for (const group of chunks) {
    const url = new URL(CONFIG.wikidataApiEndpoint);
    url.searchParams.set('action', 'wbgetentities');
    url.searchParams.set('format', 'json');
    url.searchParams.set('props', 'labels|descriptions|sitelinks');
    url.searchParams.set('languages', lang === 'fr' ? 'fr|en' : 'en|fr');
    url.searchParams.set('sitefilter', 'frwiki|enwiki');
    url.searchParams.set('ids', group.join('|'));

    const response = await fetchWithTimeoutAndRetry(
      url.toString(),
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'User-Agent': 'AvantMoi/1.0 (contact: contact@avantmoi.com)'
        }
      },
      { timeoutMs: CONFIG.entityTimeoutMs, retries: CONFIG.retries }
    );

    const payload = await response.json();
    const rawEntities = payload?.entities || {};

    for (const id of group) {
      const entity = rawEntities[id];
      if (!entity) continue;

      const label =
        entity?.labels?.[lang]?.value ||
        entity?.labels?.fr?.value ||
        entity?.labels?.en?.value ||
        '';

      const description =
        entity?.descriptions?.[lang]?.value ||
        entity?.descriptions?.fr?.value ||
        entity?.descriptions?.en?.value ||
        '';

      const frTitle = entity?.sitelinks?.frwiki?.title || '';
      const enTitle = entity?.sitelinks?.enwiki?.title || '';

      entities.set(id, {
        label: String(label || '').trim(),
        description: String(description || '').trim(),
        frTitle,
        enTitle
      });
    }
  }

  return entities;
}

function wikiUrlFromTitle(host, title) {
  if (!title) return null;
  return `https://${host}/wiki/${encodeURIComponent(title.replaceAll(' ', '_'))}`;
}

function sourceUrlForEvent(eventQid, entityMeta) {
  const fr = wikiUrlFromTitle('fr.wikipedia.org', entityMeta?.frTitle || '');
  if (!fr) return null;
  return fr;
}

function categorySignals(candidate) {
  const searchable = normalizeText(`${candidate.title} ${candidate.description} ${candidate.typeLabel}`);
  const hardBan = HARD_BAN_CATEGORY_KEYWORDS.some((word) => searchable.includes(normalizeText(word)));
  const softHits = BANNED_CATEGORY_KEYWORDS.filter((word) => searchable.includes(normalizeText(word))).length;
  return { hardBan, softHits };
}

function isTrashCompetitionCandidate(candidate) {
  const title = normalizeText(candidate.title);
  const type = normalizeText(candidate.typeLabel);
  const titleTrash = TITLE_TRASH_KEYWORDS.some((word) => title.includes(normalizeText(word)));
  const typeTrash = TYPE_TRASH_KEYWORDS.some((word) => type.includes(normalizeText(word)));
  return titleTrash || typeTrash;
}

function computeVisualScore(candidate, { safe }) {
  const searchable = normalizeText(`${candidate.title} ${candidate.description} ${candidate.typeLabel} ${candidate.placeLabel}`);

  let score = 0;
  if (candidate.sourceUrl.includes('fr.wikipedia.org')) score += 4;
  if (candidate.placeLabel) score += 3;
  if (VISUAL_KEYWORDS.some((word) => searchable.includes(normalizeText(word)))) score += 2;
  if (candidate.datePrecision === 'precise') score += 2;
  if (candidate.typeLabel) score += 1;
  if (safe) {
    score -= Math.min(candidate.softBannedHits || 0, 4);
  }
  return score;
}

function parseDatePrecision(dateIso) {
  const normalized = String(dateIso || '');
  if (!normalized) return { dateText: null, precision: 'none' };

  const match = normalized.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return { dateText: null, precision: 'none' };

  const [, y, m, d] = match;
  const date = new Date(`${y}-${m}-${d}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return { dateText: null, precision: 'none' };

  const formatted = new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(date);

  if (m === '01' && d === '01') {
    return { dateText: null, precision: 'year_only' };
  }

  return { dateText: formatted, precision: 'precise' };
}

async function fetchWikipediaSummary(frTitle, debugOptions = null) {
  if (!frTitle) return null;
  const cacheKey = frTitle.trim();
  if (wikiSummaryCache.has(cacheKey)) return wikiSummaryCache.get(cacheKey);

  const url = `https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(frTitle.replaceAll(' ', '_'))}`;
  try {
    const response = await fetchWithTimeoutAndRetry(
      url,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'User-Agent': 'AvantMoi/1.0 (contact: contact@avantmoi.com)'
        }
      },
      { timeoutMs: debugOptions?.noTimeout ? 8000 : 2200, retries: debugOptions?.noTimeout ? 1 : 0 }
    );
    const payload = await response.json();
    const extract = String(payload?.extract || '').trim();
    if (!extract) {
      wikiSummaryCache.set(cacheKey, null);
      return null;
    }
    const summary = { extract };
    wikiSummaryCache.set(cacheKey, summary);
    return summary;
  } catch {
    wikiSummaryCache.set(cacheKey, null);
    return null;
  }
}

function parseWikipediaFrTitleFromUrl(sourceUrl) {
  try {
    const url = new URL(sourceUrl);
    if (url.hostname !== 'fr.wikipedia.org') return null;
    const match = url.pathname.match(/^\/wiki\/(.+)$/);
    if (!match) return null;
    return decodeURIComponent(match[1]).replaceAll('_', ' ').trim();
  } catch {
    return null;
  }
}

function isGenericYearPage(sourceUrl, wikiLead) {
  const url = String(sourceUrl || '');
  const lead = String(wikiLead || '');

  const badUrlPatterns = [
    /\/wiki\/1968$/i,
    /\/wiki\/19\d{2}$/i,
    /\/wiki\/Liste_/i,
    /\/wiki\/Chronologie/i,
    /\/wiki\/Ann%C3%A9e/i,
    /\/wiki\/Ann%C3%A9es/i,
    /\/wiki\/Année/i,
    /\/wiki\/Années/i
  ];

  const badLeadPatterns = [
    /est une année/i,
    /millésime/i,
    /liste des événements/i,
    /evenements survenus/i,
    /événements survenus/i,
    /chronologie/i
  ];

  if (badUrlPatterns.some((pattern) => pattern.test(url))) return true;
  if (badLeadPatterns.some((pattern) => pattern.test(lead))) return true;
  if (!lead || lead.length < 250) return true;

  return false;
}

function firstFactualSentence(extract) {
  const text = String(extract || '').replace(/\s+/g, ' ').trim();
  if (!text) return null;
  const first = text.split(/(?<=[.!?])\s+/)[0]?.trim();
  if (!first) return null;
  return first.endsWith('.') ? first : `${first}.`;
}

function pickSummaryAnchors(extract, placeLabel) {
  const anchors = [];
  const badAnchors = new Set([
    'les jeux',
    'le jeux',
    'des jeux',
    'xes jeux',
    'xes',
    'jeux',
    'bien'
  ]);

  const sanitizeAnchor = (value) =>
    String(value || '')
      .replace(/^[Ll]es\s+/u, '')
      .replace(/^[Ll]e\s+/u, '')
      .replace(/^[Ll]a\s+/u, '')
      .replace(/^[Dd]es\s+/u, '')
      .trim();

  const pushAnchor = (value) => {
    const text = sanitizeAnchor(value);
    if (!text) return;
    if (text.length < 4 || text.length > 40) return;
    if (/^\d+$/u.test(text)) return;
    if (/^x{1,4}(e|es)?$/iu.test(text)) return;
    if (badAnchors.has(normalizeText(text))) return;
    if (anchors.some((a) => normalizeText(a) === normalizeText(text))) return;
    anchors.push(text);
  };

  const properNouns = extract.match(/\b[A-ZÀ-ÖØ-Ý][\p{L}'’\-]{2,}(?:\s+[A-ZÀ-ÖØ-Ý][\p{L}'’\-]{2,}){0,2}\b/gu) || [];
  for (const noun of properNouns) {
    if (normalizeText(noun) === normalizeText(placeLabel)) continue;
    pushAnchor(noun);
    if (anchors.length >= 3) break;
  }

  for (const object of CONCRETE_OBJECTS) {
    const regex = new RegExp(`\\b(${object.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`, 'iu');
    const match = extract.match(regex);
    if (match) pushAnchor(match[1]);
    if (anchors.length >= 4) break;
  }

  return anchors.slice(0, 2);
}

function buildTitleAnchors(title) {
  const words = String(title || '')
    .split(/[\s,:;()\-/'"’]+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 5);
  const unique = [];
  for (const w of words) {
    if (!unique.some((u) => normalizeText(u) === normalizeText(w))) unique.push(w);
    if (unique.length >= 2) break;
  }
  return unique;
}

function generateQuickSpecificScene(candidate, anchors = []) {
  const [a1, a2] = anchors;
  const prefix = candidate.dateText ? `${candidate.dateText}, ${candidate.placeLabel} :` : `${candidate.placeLabel} :`;
  const titleWords = candidate.title.split(/\s+/).filter(Boolean);
  const anchor1 = (a1 || titleWords.slice(0, 2).join(' ') || candidate.title).trim();
  const anchor2 = (a2 || titleWords.slice(2, 5).join(' ') || 'le panneau').trim();
  return [
    `${prefix} tu tiens une affiche froissée pendant que ${anchor1} se répand sur le trottoir.`,
    `Deux passants lisent ${anchor2} à voix haute, puis la foule se décale vers la grille.`,
    `Le bruit des slogans frappe les vitrines, des bras se lèvent, des tickets tombent au sol.`,
    `Pour passer, tu dois quitter l’axe principal et contourner la rue voisine immédiatement.`
  ].join(' ');
}

function generateSummaryFallbackScene(candidate, anchors) {
  const prefix = candidate.dateText ? `${candidate.dateText}, ${candidate.placeLabel} :` : `${candidate.placeLabel} :`;
  const [a1, a2] = anchors;
  const anchor1 = String(a1 || candidate.title).trim();
  const anchor2 = String(a2 || 'le guichet').trim();
  return [
    `${prefix} tu presses un ticket humide dans ta paume quand ${anchor1} circule de main en main.`,
    `Un groupe pointe ${anchor2}, quelqu’un grimpe sur une borne et lit le texte sans micro.`,
    `L’odeur de fumée reste basse, les semelles glissent sur la poussière, les voix montent d’un cran.`,
    `En moins d’une minute, l’entrée change de côté et ton trajet est dévié vers une autre rue.`
  ].join(' ');
}

async function generateSceneWithAI(candidate, anchors, summaryExtract, context, debugOptions = null) {
  const apiKey = context.env?.OPENAI_API_KEY;
  if (!apiKey || anchors.length < 2) return null;

  const prompt = [
    'Écris UNE micro-scène immersive en français (pas un résumé).',
    'Contraintes STRICTES: exactement 4 phrases, 50-80 mots, narration à la 2e personne, présent.',
    'Inclure explicitement le lieu fourni, une action visible, une réaction humaine, une conséquence immédiate.',
    'Inclure EXACTEMENT les deux ancres textuelles fournies (sans les modifier).',
    'Interdits: analyse historique, morale, politique, guerre, style générique.',
    'Ne pas insérer émotion, métaphore, interprétation psychologique.',
    'Aucune phrase commençant par "tu sens", "tu comprends", "tu réalises".',
    'Interdits lexicaux: objet, chose, phénomène, événement, innovation, dispositif, quelque chose, système, appareil.',
    'La scène contient au moins 2 objets matériels, 1 action physique observable et 1 lieu précis.',
    `Titre: ${candidate.title}`,
    `Description: ${candidate.description || 'n/a'}`,
    `Lieu France: ${candidate.placeLabel}`,
    `Date: ${candidate.dateText || 'non précisée'}`,
    `Résumé source: ${summaryExtract}`,
    `Ancre 1: ${anchors[0]}`,
    `Ancre 2: ${anchors[1]}`
  ].join('\n');

  try {
    const response = await fetchWithTimeoutAndRetry(
      CONFIG.openaiResponsesEndpoint,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: context.env?.OPENAI_MODEL || 'gpt-4.1-mini',
          input: prompt,
          max_output_tokens: 220
        })
      },
      {
        timeoutMs: debugOptions?.noTimeout ? 20000 : CONFIG.llmTimeoutMs,
        retries: debugOptions?.noTimeout ? 2 : 1
      }
    );

    const payload = await response.json();
    const direct = String(payload?.output_text || '').replace(/\s+/g, ' ').trim();
    if (direct) return direct;

    const chunks = [];
    const output = Array.isArray(payload?.output) ? payload.output : [];
    for (const item of output) {
      const content = Array.isArray(item?.content) ? item.content : [];
      for (const part of content) {
        const text = String(part?.text || '').trim();
        if (text) chunks.push(text);
      }
    }
    return chunks.join(' ').replace(/\s+/g, ' ').trim();
  } catch {
    return null;
  }
}

function generateSourcedFallbackScene(candidate, anchors) {
  const prefix = candidate.dateText ? `${candidate.dateText}, ${candidate.placeLabel} :` : `${candidate.placeLabel} :`;
  const [anchor1, anchor2] = anchors;
  const pickMarker = (value) => {
    const cleaned = String(value || '').trim();
    const normalized = normalizeText(cleaned);
    if (!cleaned || cleaned.length < 4) return candidate.title;
    if (normalized === 'bien' || normalized === 'jeux') return candidate.title;
    return cleaned;
  };
  const marker1 = pickMarker(anchor1);
  const marker2 = pickMarker(anchor2);
  return [
    `${prefix} tu t’arrêtes devant une entrée marquée « ${marker1} », où une file se forme contre la barrière.`,
    `Des passants lisent un panneau où « ${marker2} » est écrit, puis changent de trottoir pour mieux suivre.`,
    `Le bruit des pas sur les pavés couvre les discussions, et plusieurs mains pointent la même entrée.`,
    `En quelques minutes, ton trajet habituel est déplacé, car tout le quartier s’organise autour de ce repère.`
  ].join(' ');
}

function countWords(text) {
  return String(text).trim().split(/\s+/).filter(Boolean).length;
}

function sentenceCount(text) {
  return String(text)
    .split(/[.!?]/)
    .map((part) => part.trim())
    .filter(Boolean).length;
}

function validateScene(scene, placeLabel, anchors) {
  if (!CONFIG.enableNarrativeFilters) {
    return Boolean(String(scene || '').trim());
  }

  if (!scene) return false;
  if (!String(placeLabel || '').trim()) return false;
  const sentences = sentenceCount(scene);
  if (sentences !== 4) return false;

  const words = countWords(scene);
  if (words < 50 || words > 80) return false;

  const lower = normalizeText(scene);
  if (!lower.includes('tu')) return false;
  if (!/['’]/.test(scene)) return false;
  if (!/[àâçéèêëîïôûùüÿœ]/i.test(scene)) return false;
  if (!normalizeText(scene).includes(normalizeText(placeLabel))) return false;
  if (Array.isArray(anchors) && anchors.length >= 2) {
    if (!anchors.every((anchor) => scene.includes(anchor))) return false;
  }

  for (const banned of BANNED_SCENE_WORDS) {
    if (lower.includes(normalizeText(banned))) return false;
  }
  for (const banned of BANNED_EMOTION_WORDS) {
    if (lower.includes(normalizeText(banned))) return false;
  }
  for (const banned of BANNED_METAPHOR_PATTERNS) {
    if (lower.includes(normalizeText(banned))) return false;
  }
  for (const banned of BANNED_PSYCH_WORDS) {
    if (lower.includes(normalizeText(banned))) return false;
  }
  for (const pattern of BANNED_TEMPLATE_PATTERNS) {
    if (lower.includes(normalizeText(pattern))) return false;
  }
  for (const fragment of BANNED_SCENE_FRAGMENTS) {
    if (lower.includes(normalizeText(fragment))) return false;
  }
  if (/^\s*(\d{1,2}\s+\w+\s+\d{4},\s+)?france\s*:/i.test(scene)) return false;
  if (/\s,[^\d]/.test(scene)) return false;
  if (/\s\./.test(scene)) return false;
  if (/\bCette\b/.test(scene)) return false;
  if (/Coupe apparaît/i.test(scene)) return false;
  if (/(^|[.!?]\s*)tu\s+(sens|comprends|realises|réalises)\b/i.test(scene)) return false;

  const objectHits = REQUIRED_OBJECT_WORDS
    .filter((word) => new RegExp(`\\b${normalizeText(word)}\\b`, 'i').test(lower))
    .length;
  if (objectHits < 2) return false;
  if (!REQUIRED_ACTION_WORDS.some((word) => new RegExp(`\\b${normalizeText(word)}\\b`, 'i').test(lower))) return false;
  if (!REQUIRED_PRECISE_LOCATIONS.some((loc) => lower.includes(normalizeText(loc)))) return false;

  return true;
}

function hasBannedSceneArtifacts(scene) {
  const lower = normalizeText(scene);
  if (/^\s*(\d{1,2}\s+\w+\s+\d{4},\s+)?france\s*:/i.test(scene)) return true;
  return BANNED_SCENE_FRAGMENTS.some((fragment) => lower.includes(normalizeText(fragment)));
}

function uniqueBy(items, keyFn) {
  const seen = new Set();
  const output = [];
  for (const item of items) {
    const key = keyFn(item);
    if (seen.has(key)) continue;
    seen.add(key);
    output.push(item);
  }
  return output;
}

async function collectCandidates({ year, countryQid, lang, allowOverseas, limit, strictPlace }) {
  const query = buildCandidateQuery({ year, countryQid, limit, allowOverseas, strictPlace });
  const rows = await fetchSparqlRows(query);
  const parsed = parseRows(rows);
  return { rowsCount: rows.length, parsed };
}

async function enrichCandidates(rawCandidates, lang) {
  const ids = rawCandidates.flatMap((item) => [item.eventQid, item.placeQid, item.typeQid]).filter(Boolean);
  const entities = await fetchEntityBundle(ids, lang);

  const enriched = rawCandidates
    .map((candidate) => {
      const eventMeta = entities.get(candidate.eventQid);
      const placeMeta = candidate.placeQid ? entities.get(candidate.placeQid) : null;
      const typeMeta = candidate.typeQid ? entities.get(candidate.typeQid) : null;

      const title = String(eventMeta?.label || '').trim();
      const placeLabel = String(placeMeta?.label || '').trim();
      const placeDescription = String(placeMeta?.description || '').trim();
      const description = String(eventMeta?.description || '').trim();
      const typeLabel = String(typeMeta?.label || '').trim();
      const frTitle = String(eventMeta?.frTitle || '').trim();

      if (!title || !frTitle) {
        return null;
      }

      const dateInfo = parseDatePrecision(candidate.dateIso);
      const sourceUrl = sourceUrlForEvent(candidate.eventQid, eventMeta);
      if (!sourceUrl) return null;

      return {
        eventQid: candidate.eventQid,
        title,
        frTitle,
        placeQid: candidate.placeQid,
        placeLabel: placeLabel || '',
        placeMissing: candidate.placeMissing || !placeLabel,
        placeDescription,
        description,
        typeLabel,
        sourceUrl,
        dateIso: candidate.dateIso,
        dateText: dateInfo.dateText,
        datePrecision: dateInfo.precision
      };
    })
    .filter(Boolean);

  return uniqueBy(enriched, (item) => item.eventQid);
}

function filterAndRankCandidates(candidates, { country, allowOverseas, safe }) {
  const filtered = candidates.filter((candidate) => {
    if (!candidate.sourceUrl?.includes('fr.wikipedia.org')) return false;
    if (candidate.placeMissing) return false;
    if (isTrashCompetitionCandidate(candidate)) return false;

    const safety = categorySignals(candidate);
    if (safe && safety.hardBan) return false;
    if (country === 'FR' && !allowOverseas && isMetropolitanExcludedCandidate(candidate)) return false;
    candidate.softBannedHits = safe ? safety.softHits : 0;
    return true;
  });
  const unique = uniqueBy(filtered, (item) => item.eventQid);

  const scored = unique.map((candidate) => ({
    ...candidate,
    visualScore: computeVisualScore(candidate, { safe })
  }));

  scored.sort((a, b) => b.visualScore - a.visualScore);
  return scored;
}

function buildFact(candidate) {
  if (!candidate.placeLabel) return candidate.dateText ? `${candidate.dateText} : ${candidate.title}` : candidate.title;
  if (candidate.dateText) {
    return `${candidate.dateText}, ${candidate.placeLabel} : ${candidate.title}`;
  }
  return `${candidate.placeLabel} : ${candidate.title}`;
}

async function buildItemsFromCandidates({ year, country, rankedCandidates, topLimit, context, deadlineTs, debugOptions }) {
  const top = rankedCandidates.slice(0, topLimit);
  const items = [];
  const usedQids = new Set();
  const usedTitles = new Set();
  const usedSources = new Set();
  let skippedNoScene = 0;
  let validated = 0;
  let withSummary = 0;
  let withAnchors = 0;

  for (const candidate of top) {
    if (Date.now() > deadlineTs) break;
    if (items.length >= CONFIG.maxItems) break;
    if (candidate.placeMissing) continue;
    if (usedQids.has(candidate.eventQid)) continue;
    if (usedTitles.has(candidate.title.toLowerCase())) continue;
    if (usedSources.has(candidate.sourceUrl)) continue;

    let summaryExtract = '';
    let anchors = [];

    const summary = await fetchWikipediaSummary(candidate.frTitle, debugOptions);
    if (summary?.extract) {
      withSummary += 1;
      summaryExtract = summary.extract;
      if (isGenericYearPage(candidate.sourceUrl, summaryExtract)) {
        continue;
      }
      anchors = debugOptions?.noAnchors
        ? buildTitleAnchors(candidate.title)
        : pickSummaryAnchors(summary.extract, candidate.placeLabel);
      if (anchors.length >= 2) withAnchors += 1;
    }

    if (!summaryExtract) {
      continue;
    }
    if (anchors.length < 2) {
      anchors = buildTitleAnchors(candidate.title);
    }
    if (anchors.length < 2) {
      continue;
    }

    const aiScene = await generateSceneWithAI(candidate, anchors, summaryExtract, context, debugOptions);
    const allowFallback = CONFIG.enableFallbackNarratives && !debugOptions?.noFallback;
    const candidateScene = aiScene || (allowFallback ? generateSourcedFallbackScene(candidate, anchors) : '');
    const scene = debugOptions?.noConstraints
      ? candidateScene
      : (validateScene(candidateScene, candidate.placeLabel, anchors) ? candidateScene : null);
    if (scene) validated += 1;

    if (!scene) {
      skippedNoScene += 1;
      continue;
    }

    usedQids.add(candidate.eventQid);
    usedTitles.add(candidate.title.toLowerCase());
    usedSources.add(candidate.sourceUrl);

    items.push({
      uniqueEventId: `${CONFIG.cacheVersion}-${candidate.eventQid}`,
      eventQid: candidate.eventQid,
      title: candidate.title,
      scene,
      fact: buildFact(candidate),
      sourceUrl: candidate.sourceUrl
    });
  }

  log('info', 'anecdotes_items_built', {
    year,
    country,
    ranked: rankedCandidates.length,
    top: top.length,
    built: items.length,
    validated,
    skippedNoScene,
    withSummary,
    withAnchors
  });

  return {
    year,
    country,
    items,
    partial: items.length < CONFIG.maxItems
  };
}

async function buildItemsFromSeed({ year, country, context, debugOptions }) {
  const seeded = SEEDED_EVENTS[`${country}:${year}`] || [];
  const items = [];

  for (const seed of seeded) {
    const frTitle = parseWikipediaFrTitleFromUrl(seed.sourceUrl);
    if (!frTitle) continue;

    const summary = await fetchWikipediaSummary(frTitle, debugOptions);
    if (!summary?.extract) continue;
    if (isGenericYearPage(seed.sourceUrl, summary.extract)) continue;

    let anchors = debugOptions?.noAnchors
      ? buildTitleAnchors(seed.title)
      : pickSummaryAnchors(summary.extract, seed.placeLabel);
    if (anchors.length < 2) {
      anchors = buildTitleAnchors(seed.title);
    }
    if (anchors.length < 2) continue;

    const candidate = {
      eventQid: seed.eventQid,
      title: seed.title,
      description: '',
      placeLabel: seed.placeLabel,
      dateText: seed.dateText
    };

    const aiScene = await generateSceneWithAI(candidate, anchors, summary.extract, context, debugOptions);
    const allowFallback = CONFIG.enableFallbackNarratives && !debugOptions?.noFallback;
    const scene = aiScene || (allowFallback ? generateSourcedFallbackScene(candidate, anchors) : '');
    if (!scene) continue;
    if (!debugOptions?.noConstraints && !validateScene(scene, candidate.placeLabel, anchors)) continue;

    items.push({
      uniqueEventId: `${CONFIG.cacheVersion}-${seed.eventQid}`,
      eventQid: seed.eventQid,
      title: seed.title,
      scene,
      fact: firstFactualSentence(summary.extract) || buildFact(candidate),
      sourceUrl: seed.sourceUrl
    });
  }

  return {
    year,
    country,
    items,
    partial: items.length < CONFIG.maxItems
  };
}

function isMissingTableError(error) {
  const message = String(error instanceof Error ? error.message : '');
  return message.includes('does not exist') || message.includes('relation') || message.includes('event_cache');
}

function isCacheValid(rows) {
  if (rows.length < 1 || rows.length > CONFIG.maxItems) return false;

  const qids = new Set();
  const titles = new Set();
  const sources = new Set();

  for (const row of rows) {
    if (!String(row.uniqueEventId || '').startsWith(CONFIG.cacheVersion)) return false;
    if (!row.eventQid || !row.title || !row.sourceUrl || !row.scene) return false;
    if (hasBannedSceneArtifacts(String(row.scene || ''))) return false;

    const titleKey = row.title.toLowerCase();
    if (qids.has(row.eventQid) || titles.has(titleKey) || sources.has(row.sourceUrl)) return false;

    qids.add(row.eventQid);
    titles.add(titleKey);
    sources.add(row.sourceUrl);
  }

  return true;
}

async function readCache(client, { year, country, lang }) {
  const rows = await client.eventCache.findMany({
    where: { year, country, lang },
    orderBy: [{ createdAt: 'asc' }],
    select: {
      eventQid: true,
      title: true,
      scene: true,
      fact: true,
      sourceUrl: true
    }
  });

  const hydrated = rows.map((row) => ({
    uniqueEventId: `${CONFIG.cacheVersion}-${row.eventQid}`,
    eventQid: row.eventQid,
    title: row.title,
    scene: row.scene,
    fact: row.fact,
    sourceUrl: row.sourceUrl
  }));

  if (!isCacheValid(hydrated)) return null;
  return {
    year,
    country,
    items: hydrated,
    partial: hydrated.length < CONFIG.maxItems
  };
}

async function saveCache(client, payload, lang) {
  for (const item of payload.items) {
    await client.eventCache.upsert({
      where: {
        year_country_lang_eventQid: {
          year: payload.year,
          country: payload.country,
          lang,
          eventQid: item.eventQid
        }
      },
      create: {
        year: payload.year,
        country: payload.country,
        lang,
        eventQid: item.eventQid,
        title: item.title,
        scene: item.scene,
        fact: item.fact,
        sourceUrl: item.sourceUrl
      },
      update: {
        title: item.title,
        scene: item.scene,
        fact: item.fact,
        sourceUrl: item.sourceUrl
      }
    });
  }

  await client.eventCache.deleteMany({
    where: {
      year: payload.year,
      country: payload.country,
      lang,
      eventQid: {
        notIn: payload.items.map((item) => item.eventQid)
      }
    }
  });
}

async function buildAndStoreBatch({ client, year, country, lang, cacheLang, allowOverseas, safe, context, skipSave, debugOptions }) {
  const countryQid = await resolveCountryQid(country);
  const deadlineTs = Date.now() + 27_000;

  const safeCollect = async (limit) => {
    try {
      const fast = await collectCandidates({ year, countryQid, lang, allowOverseas, limit, strictPlace: false });
      if (fast.parsed.length > 0) return fast;

      const strict = await collectCandidates({ year, countryQid, lang, allowOverseas, limit, strictPlace: true });
      return strict;
    } catch (error) {
      log('error', 'anecdotes_collect_failed', {
        year,
        country,
        lang,
        limit,
        error: error instanceof Error ? error.message : 'collect_failed'
      });
      try {
        const fallback = await collectCandidates({ year, countryQid, lang, allowOverseas, limit, strictPlace: true });
        log('info', 'anecdotes_collect_fallback_used', {
          year,
          country,
          lang,
          limit,
          sparqlRows: fallback.rowsCount,
          parsed: fallback.parsed.length
        });
        return fallback;
      } catch (fallbackError) {
        log('error', 'anecdotes_collect_fallback_failed', {
          year,
          country,
          lang,
          limit,
          error: fallbackError instanceof Error ? fallbackError.message : 'collect_fallback_failed'
        });
        return { rowsCount: 0, parsed: [] };
      }
    }
  };

  const safeEnrich = async (raw) => {
    try {
      return await enrichCandidates(raw, lang);
    } catch (error) {
      log('error', 'anecdotes_enrich_failed', {
        year,
        country,
        lang,
        raw: raw.length,
        error: error instanceof Error ? error.message : 'enrich_failed'
      });
      return [];
    }
  };

  const firstPass = await safeCollect(CONFIG.firstPassLimit);

  let enriched = await safeEnrich(firstPass.parsed);
  let ranked = debugOptions?.noFilters
    ? enriched.map((candidate) => ({ ...candidate, visualScore: 0 }))
    : filterAndRankCandidates(enriched, { country, allowOverseas, safe });
  log('info', 'anecdotes_first_pass_counts', {
    year,
    country,
    lang,
    sparqlRows: firstPass.rowsCount,
    parsed: firstPass.parsed.length,
    enriched: enriched.length,
    ranked: ranked.length
  });

  let payload = await buildItemsFromCandidates({
    year,
    country,
    rankedCandidates: ranked,
    topLimit: CONFIG.topCandidatesFirst,
    context,
    deadlineTs,
    debugOptions
  });

  if (payload.items.length < CONFIG.maxItems && Date.now() < deadlineTs) {
    const secondPass = await safeCollect(CONFIG.secondPassLimit);

    const mergedRaw = uniqueBy([...firstPass.parsed, ...secondPass.parsed], (item) => `${item.eventQid}|${item.dateIso}`);
    const mergedRawLimited = mergedRaw.slice(0, 220);
    enriched = await safeEnrich(mergedRawLimited);
    ranked = debugOptions?.noFilters
      ? enriched.map((candidate) => ({ ...candidate, visualScore: 0 }))
      : filterAndRankCandidates(enriched, { country, allowOverseas, safe });
    log('info', 'anecdotes_second_pass_counts', {
      year,
      country,
      lang,
      sparqlRows: secondPass.rowsCount,
      parsed: secondPass.parsed.length,
      mergedRaw: mergedRaw.length,
      mergedRawLimited: mergedRawLimited.length,
      enriched: enriched.length,
      ranked: ranked.length
    });

    const secondPayload = await buildItemsFromCandidates({
      year,
      country,
      rankedCandidates: ranked,
      topLimit: CONFIG.topCandidatesSecond,
      context,
      deadlineTs,
      debugOptions
    });
    if (secondPayload.items.length > payload.items.length) {
      payload = secondPayload;
    }
  }

  log('info', 'anecdotes_pipeline_counts', {
    year,
    country,
    lang,
    validated: payload.items.length,
    partial: payload.partial
  });

  const allowFallback = CONFIG.enableFallbackNarratives && !debugOptions?.noFallback;
  if (payload.items.length === 0 && allowFallback) {
    const seeded = await buildItemsFromSeed({ year, country, context, debugOptions });
    if (seeded.items.length > 0) {
      payload = seeded;
      log('info', 'anecdotes_seed_fallback_used', {
        year,
        country,
        lang,
        count: seeded.items.length
      });
    }
  }

  if (!skipSave && payload.items.length > 0) {
    await saveCache(client, payload, cacheLang);
  }
  return payload;
}

function validateTransformInput(payload) {
  const year = parseYear(payload?.year);
  const country = parseCountryStrict(payload?.country);
  const items = Array.isArray(payload?.items) ? payload.items : null;

  const errors = [];
  if (!year) errors.push('year is required and must be an integer between 1 and 2100');
  if (country !== 'FR') errors.push('country must be FR for now');
  if (!items) errors.push('items must be an array');

  return { ok: errors.length === 0, errors, year, country, items: items || [] };
}

async function transformItemsToAnecdotes({ year, country, inputItems, context }) {
  const items = [];
  const rejected = [];
  const seenQid = new Set();
  const seenTitle = new Set();
  const seenSource = new Set();

  for (const raw of inputItems) {
    if (items.length >= CONFIG.maxItems) break;
    const eventQid = String(raw?.eventQid || '').trim();
    const title = String(raw?.title || '').trim();
    const sourceUrl = String(raw?.sourceUrl || '').trim();
    const dateText = raw?.dateText ? String(raw.dateText).trim() : undefined;
    const placeText = raw?.placeText ? String(raw.placeText).trim() : undefined;

    const reject = (reason) => {
      rejected.push({ eventQid: eventQid || null, title: title || null, sourceUrl: sourceUrl || null, reason });
    };

    if (!eventQid || !/^Q\d+$/.test(eventQid)) { reject('missing_or_invalid_eventQid'); continue; }
    if (!title) { reject('missing_title'); continue; }
    if (!sourceUrl || !sourceUrl.includes('fr.wikipedia.org/wiki/')) { reject('source_not_fr_wikipedia'); continue; }
    if (seenQid.has(eventQid)) { reject('duplicate_eventQid'); continue; }
    if (seenTitle.has(title.toLowerCase())) { reject('duplicate_title'); continue; }
    if (seenSource.has(sourceUrl)) { reject('duplicate_sourceUrl'); continue; }
    if (isTrashCompetitionCandidate({ title, typeLabel: '' })) { reject('catalog_or_competition_item'); continue; }

    const frTitle = parseWikipediaFrTitleFromUrl(sourceUrl);
    if (!frTitle) { reject('invalid_wikipedia_url'); continue; }

    const summary = await fetchWikipediaSummary(frTitle);
    if (!summary?.extract) { reject('missing_wikipedia_summary'); continue; }
    if (isGenericYearPage(sourceUrl, summary.extract)) { reject('generic_year_page'); continue; }

    let anchors = pickSummaryAnchors(summary.extract, placeText || '');
    if (anchors.length < 2) {
      anchors = buildTitleAnchors(title);
    }
    if (anchors.length < 2) { reject('missing_anchors'); continue; }

    const candidate = {
      eventQid,
      title,
      description: '',
      placeLabel: placeText || 'France',
      dateText: dateText || null
    };

    const aiScene = await generateSceneWithAI(candidate, anchors, summary.extract, context);
    const scene = aiScene;
    if (!validateScene(scene, candidate.placeLabel, anchors)) { reject('scene_validation_failed'); continue; }

    const fact = firstFactualSentence(summary.extract);
    if (!fact) { reject('missing_fact'); continue; }

    seenQid.add(eventQid);
    seenTitle.add(title.toLowerCase());
    seenSource.add(sourceUrl);

    items.push({
      uniqueEventId: `${CONFIG.cacheVersion}-${eventQid}`,
      eventQid,
      title,
      ...(dateText ? { dateText } : {}),
      ...(placeText ? { placeText } : {}),
      scene,
      fact,
      sourceUrl
    });
  }

  if (items.length !== CONFIG.maxItems) {
    return {
      ok: false,
      error: {
        code: 'INSUFFICIENT_VALID_ITEMS',
        message: `Expected 20 valid items, got ${items.length}`,
        year,
        country,
        produced: items.length,
        required: CONFIG.maxItems,
        rejected
      }
    };
  }

  return { ok: true, payload: { year, country, items } };
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: responseHeaders() });
}

export async function onRequestGet(context) {
  const searchParams = new URL(context.request.url).searchParams;
  const debugOptions = parseDebugOptions(searchParams);
  const validation = validateInput(searchParams);
  if (!validation.ok) {
    return json(400, { error: validation.errors.join('; ') });
  }

  const limiter = checkRateLimit(context.request);
  if (!limiter.allowed) {
    return json(429, { error: 'rate_limited', retryAfterMs: limiter.retryAfterMs });
  }

  const { year, country, lang, allowOverseas, safe } = validation.data;
  const debugSuffix = Object.entries(debugOptions)
    .filter(([, value]) => value)
    .map(([key]) => key)
    .join('.');
  const baseCacheLang = safe ? `${lang}-${CONFIG.cacheVersion}-safe` : `${lang}-${CONFIG.cacheVersion}`;
  const cacheLang = debugSuffix ? `${baseCacheLang}-${debugSuffix}` : baseCacheLang;

  try {
    const client = getPrismaClient(context.env);

    if (CONFIG.disableCache || debugOptions.noCache) {
      await client.eventCache.deleteMany({ where: { year, country } });
    } else {
      const cachedPayload = await readCache(client, { year, country, lang: cacheLang });
      if (cachedPayload) {
        log('info', 'anecdotes_cache_hit', { year, country, lang, count: cachedPayload.items.length, partial: cachedPayload.partial });
        return json(200, cachedPayload);
      }
    }

    const payload = await buildAndStoreBatch({
      client,
      year,
      country,
      lang,
      cacheLang,
      allowOverseas,
      safe,
      context,
      skipSave: CONFIG.disableCache || debugOptions.noCache,
      debugOptions
    });

    log('info', 'anecdotes_generated', { year, country, lang, count: payload.items.length });
    return json(200, payload);
  } catch (error) {
    if (isMissingTableError(error)) {
      log('error', 'event_cache_missing', { year, country, lang });
      return json(500, { error: 'event_cache table is missing. Run migration first.' });
    }

    const message = error instanceof Error ? error.message : 'anecdote_generation_failed';
    log('error', 'anecdotes_generation_failed', { year, country, lang, error: message });
    return json(502, { error: message });
  }
}

export async function onRequestPost(context) {
  let payload;
  try {
    payload = await context.request.json();
  } catch {
    return json(400, { error: 'invalid_json_body' });
  }

  const validation = validateTransformInput(payload);
  if (!validation.ok) {
    return json(400, { error: validation.errors.join('; ') });
  }

  const result = await transformItemsToAnecdotes({
    year: validation.year,
    country: validation.country,
    inputItems: validation.items,
    context
  });

  if (!result.ok) {
    return json(422, result.error);
  }

  return json(200, result.payload);
}
