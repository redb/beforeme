import { getPrismaClient } from '../lib/prisma.js';

const CONFIG = {
  wikidataSparqlEndpoint: 'https://query.wikidata.org/sparql',
  wikidataApiEndpoint: 'https://www.wikidata.org/w/api.php',
  openaiResponsesEndpoint: 'https://api.openai.com/v1/responses',
  cacheVersion: 'V8',
  maxItems: 20,
  minWords: 55,
  maxWords: 90,
  firstPassLimit: 200,
  secondPassLimit: 500,
  topCandidatesFirst: 120,
  topCandidatesSecond: 120,
  retries: 2,
  sparqlTimeoutMs: 12000,
  entityTimeoutMs: 8000,
  llmTimeoutMs: 2500,
  rateLimitWindowMs: 60_000,
  rateLimitMax: 30,
  disableCache: false
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
  'événement', 'evenement'
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
    'Cache-Control': 'public, max-age=300',
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
        'User-Agent': 'BeforeMe/1.0 (contact: info@morgao.com)'
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
  if (countryQid !== 'Q142' || allowOverseas) return '';
  const values = OVERSEAS_QIDS.map((qid) => `wd:${qid}`).join(' ');
  return `
  FILTER NOT EXISTS {
    VALUES ?overseas { ${values} }
    ?placeOut wdt:P131* ?overseas .
  }`;
}

function buildCandidateQuery({ year, countryQid, limit, wikiPrimary, allowOverseas }) {
  const overseasClause = buildOverseasExclusionClause(countryQid, allowOverseas);
  return `
SELECT ?event ?date ?placeOut ?type ?article WHERE {
  VALUES ?targetYear { ${year} }
  VALUES ?country { wd:${countryQid} }
  VALUES ?dateProp { wdt:P585 wdt:P580 wdt:P582 }

  ?event ?dateProp ?date .
  FILTER(YEAR(?date) = ?targetYear)

  OPTIONAL { ?event wdt:P276 ?placeP276 . }
  OPTIONAL { ?event wdt:P131 ?placeP131 . }
  BIND(COALESCE(?placeP276, ?placeP131) AS ?placeOut)
  FILTER(BOUND(?placeOut))
  ?placeOut wdt:P131* ?country .
  ${overseasClause}

  OPTIONAL { ?event wdt:P31 ?type . }

  OPTIONAL {
    ?article schema:about ?event ;
             schema:isPartOf ?wiki .
    FILTER(?wiki IN (<https://${wikiPrimary}.wikipedia.org/>, <https://en.wikipedia.org/>))
  }
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
        'User-Agent': 'BeforeMe/1.0 (contact: info@morgao.com)'
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
      dateIso: String(row?.date?.value || '').trim(),
      article: String(row?.article?.value || '').trim()
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
          'User-Agent': 'BeforeMe/1.0 (contact: info@morgao.com)'
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

async function fetchWikipediaSummary(frTitle) {
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
          'User-Agent': 'BeforeMe/1.0 (contact: info@morgao.com)'
        }
      },
      { timeoutMs: 4000, retries: 1 }
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

function pickSummaryAnchors(extract, placeLabel) {
  const anchors = [];
  const pushAnchor = (value) => {
    const text = String(value || '').trim();
    if (!text) return;
    if (text.length < 4 || text.length > 40) return;
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

function generateSummaryFallbackScene(candidate, anchors) {
  const prefix = candidate.dateText ? `${candidate.dateText}, ${candidate.placeLabel},` : `${candidate.placeLabel},`;
  const [a1, a2] = anchors;
  return [
    `${prefix} tu t'arrêtes quand ${a1} apparaît devant toi et coupe le passage.`,
    `Des passants se figent, montrent ${a2}, puis s'approchent pour voir de plus près.`,
    `Un bruit sec part du trottoir, les regards changent de direction, et les voix tombent.`,
    `En quelques pas, la file se refait autour de toi et ce geste devient la norme du moment.`
  ].join(' ');
}

async function generateSceneWithAI(candidate, anchors, summaryExtract, context) {
  const apiKey = context.env?.OPENAI_API_KEY;
  if (!apiKey || anchors.length < 2) return null;

  const prompt = [
    'Écris une micro-scène immersive en français.',
    'Contraintes STRICTES: 3 à 4 phrases, 55-90 mots, narration à la 2e personne, présent.',
    'Inclure explicitement le lieu fourni, une action visible, une réaction humaine, une conséquence immédiate.',
    'Inclure EXACTEMENT les deux ancres textuelles fournies (sans les modifier).',
    'Interdits: analyse historique, morale, politique, guerre, style générique.',
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
      { timeoutMs: CONFIG.llmTimeoutMs, retries: 0 }
    );

    const payload = await response.json();
    return String(payload?.output_text || '').replace(/\s+/g, ' ').trim();
  } catch {
    return null;
  }
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
  if (!scene) return false;
  if (!String(placeLabel || '').trim()) return false;
  const sentences = sentenceCount(scene);
  if (sentences < 3 || sentences > 4) return false;

  const words = countWords(scene);
  if (words < CONFIG.minWords || words > CONFIG.maxWords) return false;

  const lower = normalizeText(scene);
  if (!lower.includes('tu')) return false;
  if (!/['’]/.test(scene)) return false;
  if (!/[àâçéèêëîïôûùüÿœ]/i.test(scene)) return false;
  if (!normalizeText(scene).includes(normalizeText(placeLabel))) return false;
  if (!Array.isArray(anchors) || anchors.length < 2) return false;
  if (!anchors.every((anchor) => scene.includes(anchor))) return false;

  for (const banned of BANNED_SCENE_WORDS) {
    if (lower.includes(normalizeText(banned))) return false;
  }

  return true;
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

async function collectCandidates({ year, countryQid, lang, allowOverseas, limit }) {
  const wikiPrimary = lang === 'fr' ? 'fr' : 'en';
  const query = buildCandidateQuery({ year, countryQid, limit, wikiPrimary, allowOverseas });
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

async function buildItemsFromCandidates({ year, country, rankedCandidates, topLimit, context }) {
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
    if (items.length >= CONFIG.maxItems) break;
    if (candidate.placeMissing) continue;
    if (usedQids.has(candidate.eventQid)) continue;
    if (usedTitles.has(candidate.title.toLowerCase())) continue;
    if (usedSources.has(candidate.sourceUrl)) continue;

    const summary = await fetchWikipediaSummary(candidate.frTitle);
    if (!summary?.extract) continue;
    withSummary += 1;

    const anchors = pickSummaryAnchors(summary.extract, candidate.placeLabel);
    if (anchors.length < 2) continue;
    withAnchors += 1;

    const aiScene = await generateSceneWithAI(candidate, anchors, summary.extract, context);
    const candidateScene = aiScene || generateSummaryFallbackScene(candidate, anchors);
    const scene = validateScene(candidateScene, candidate.placeLabel, anchors) ? candidateScene : null;
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

async function buildAndStoreBatch({ client, year, country, lang, cacheLang, allowOverseas, safe, context, skipSave }) {
  const countryQid = await resolveCountryQid(country);

  const safeCollect = async (limit) => {
    try {
      return await collectCandidates({ year, countryQid, lang, allowOverseas, limit });
    } catch (error) {
      log('error', 'anecdotes_collect_failed', {
        year,
        country,
        lang,
        limit,
        error: error instanceof Error ? error.message : 'collect_failed'
      });
      return { rowsCount: 0, parsed: [] };
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
  let ranked = filterAndRankCandidates(enriched, { country, allowOverseas, safe });
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
    context
  });

  if (payload.items.length < CONFIG.maxItems) {
    const secondPass = await safeCollect(CONFIG.secondPassLimit);

    const mergedRaw = uniqueBy([...firstPass.parsed, ...secondPass.parsed], (item) => `${item.eventQid}|${item.dateIso}`);
    const mergedRawLimited = mergedRaw.slice(0, 220);
    enriched = await safeEnrich(mergedRawLimited);
    ranked = filterAndRankCandidates(enriched, { country, allowOverseas, safe });
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

    payload = await buildItemsFromCandidates({
      year,
      country,
      rankedCandidates: ranked,
      topLimit: CONFIG.topCandidatesSecond,
      context
    });
  }

  log('info', 'anecdotes_pipeline_counts', {
    year,
    country,
    lang,
    validated: payload.items.length,
    partial: payload.partial
  });

  if (!skipSave && payload.items.length > 0) {
    await saveCache(client, payload, cacheLang);
  }
  return payload;
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: responseHeaders() });
}

export async function onRequestGet(context) {
  const validation = validateInput(new URL(context.request.url).searchParams);
  if (!validation.ok) {
    return json(400, { error: validation.errors.join('; ') });
  }

  const limiter = checkRateLimit(context.request);
  if (!limiter.allowed) {
    return json(429, { error: 'rate_limited', retryAfterMs: limiter.retryAfterMs });
  }

  const { year, country, lang, allowOverseas, safe } = validation.data;
  const cacheLang = safe ? `${lang}-${CONFIG.cacheVersion}-safe` : `${lang}-${CONFIG.cacheVersion}`;

  try {
    const client = getPrismaClient(context.env);

    if (CONFIG.disableCache) {
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
      skipSave: CONFIG.disableCache
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
