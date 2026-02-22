import { getWikiLead } from '../lib/wiki-lead.js';

const MAX_SLOT = 20;
const OPENAI_ENDPOINT = 'https://api.openai.com/v1/responses';
const poolCache = new Map();
const ENABLE_NARRATIVE_FILTERS = false;
const EMOTION_WORDS = [
  'espoir', 'peur', 'tension', 'incertitude', 'fragile', 'hésitant', 'hesitant',
  'scepticisme', 'angoisse', 'anxieux', 'anxieuse'
];
const BANNED_GENERIC_WORDS = [
  'objet', 'chose', 'phénomène', 'phenomene', 'événement', 'evenement',
  'innovation', 'dispositif', 'quelque chose', 'système', 'systeme', 'appareil'
];
const METAPHOR_PATTERNS = [
  'comme si',
  'tel un',
  'telle une',
  'dans une danse',
  'poids du possible',
  'au bord de'
];
const PSYCH_WORDS = [
  'tu sens',
  'tu comprends',
  'tu réalises',
  'tu realises',
  'impression',
  'intuition',
  'esprit'
];
const OBJECT_WORDS = [
  'affiche', 'ticket', 'panneau', 'barrière', 'barriere', 'micro', 'journal', 'pavé', 'pave',
  'vitrine', 'guichet', 'tribune', 'casque', 'rideau', 'urne', 'combiné', 'combine', 'radio',
  'téléviseur', 'televiseur', 'badge', 'banderole'
];
const ACTION_WORDS = [
  'court', 'courent', 'lit', 'lisent', 'applaudit', 'applaudissent', 'colle', 'collent',
  'pointe', 'pointent', 'ouvre', 'ouvrent', 'ferme', 'ferment', 'grimpe', 'grimpent',
  'change', 'changent', 'marche', 'marchent', 'arrête', 'arrêtent', 'arrete', 'arretent'
];
const PRECISE_LOCATIONS = ['gare', 'station', 'quai', 'place', 'marché', 'marche', 'boulevard', 'rue', 'tribune', 'palais'];

/** Wikidata QID → code pays pour la lookup SOURCE_POOL (legacy). */
const QID_TO_COUNTRY = {
  Q142: 'FR',
  Q30: 'US',
  Q155: 'BR',
  Q1019: 'MG',
  Q183: 'DE',
  Q29: 'ES',
  Q38: 'IT',
  Q145: 'GB',
  Q16: 'CA'
};

function countryForPool(countryParam) {
  const raw = String(countryParam || '').trim().toUpperCase();
  if (QID_TO_COUNTRY[raw]) return QID_TO_COUNTRY[raw];
  if (/^[A-Z]{2}$/.test(raw)) return raw;
  return raw || 'FR';
}

const SOURCE_POOL = {
  'FR:1968': [
    {
      title: 'Accords de Grenelle',
      sourceUrl: 'https://fr.wikipedia.org/wiki/Accords_de_Grenelle'
    },
    {
      title: "Jeux olympiques d'hiver de 1968",
      sourceUrl: "https://fr.wikipedia.org/wiki/Jeux_olympiques_d%27hiver_de_1968"
    },
    {
      title: 'Festival de Cannes 1968',
      sourceUrl: 'https://fr.wikipedia.org/wiki/Festival_de_Cannes_1968'
    },
    {
      title: 'Mai 68',
      sourceUrl: 'https://fr.wikipedia.org/wiki/Mai_68'
    },
    {
      title: 'Manifestations de mai 1968 en France',
      sourceUrl: 'https://fr.wikipedia.org/wiki/Manifestations_de_mai_1968_en_France'
    }
  ]
};

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
  return new Response(JSON.stringify(payload), { status, headers: responseHeaders() });
}

function parseSlot(raw) {
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 1 || value > MAX_SLOT) return null;
  return value;
}

function parseYear(raw) {
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 1 || value > 2100) return null;
  return value;
}

function sourceForSlot({ year, country, slot }) {
  const pool = SOURCE_POOL[`${country}:${year}`] || [];
  if (!pool.length) return null;
  return pool[(slot - 1) % pool.length];
}

function countWords(text) {
  return String(text || '').trim().split(/\s+/).filter(Boolean).length;
}

function sentenceCount(text) {
  return String(text || '')
    .split(/[.!?]/)
    .map((chunk) => chunk.trim())
    .filter(Boolean).length;
}

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

function isValidNarrative(text) {
  if (!ENABLE_NARRATIVE_FILTERS) {
    return Boolean(String(text || '').trim());
  }

  const words = countWords(text);
  if (words < 50 || words > 80) return false;
  const sentences = sentenceCount(text);
  if (sentences !== 4) return false;
  if (!/\btu\b/i.test(text)) return false;
  const lowered = normalizeText(text);
  const blocked = ['se repand sur le trottoir', 'entree marquee', 'tout le quartier s organise autour de ce repere'];
  if (blocked.some((item) => lowered.includes(item))) return false;
  if (EMOTION_WORDS.some((w) => lowered.includes(normalizeText(w)))) return false;
  if (BANNED_GENERIC_WORDS.some((w) => lowered.includes(normalizeText(w)))) return false;
  if (METAPHOR_PATTERNS.some((w) => lowered.includes(normalizeText(w)))) return false;
  if (PSYCH_WORDS.some((w) => lowered.includes(normalizeText(w)))) return false;
  if (/(^|[.!?]\s*)tu\s+(sens|comprends|realises|réalises)\b/i.test(text)) return false;

  const objectHits = OBJECT_WORDS.filter((w) => new RegExp(`\\b${normalizeText(w)}\\b`, 'i').test(lowered)).length;
  if (objectHits < 2) return false;
  if (!ACTION_WORDS.some((w) => new RegExp(`\\b${normalizeText(w)}\\b`, 'i').test(lowered))) return false;
  if (!PRECISE_LOCATIONS.some((loc) => lowered.includes(normalizeText(loc)))) return false;
  return true;
}

async function fetchWithRetry(url, init, { timeoutMs, retries }) {
  let lastError = null;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { ...init, signal: controller.signal });
      if (!response.ok) {
        throw new Error(`HTTP_${response.status}`);
      }
      return response;
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
      }
    } finally {
      clearTimeout(timer);
    }
  }

  throw lastError || new Error('request_failed');
}

async function generateSceneWithAI({ year, title, sourceUrl, wikiLead, env }) {
  const apiKey = String(env?.OPENAI_API_KEY || '').trim();
  if (!apiKey) return '';

  const prompt = [
    'You are AVANT MOI, a documentary scene composer.',
    'NON-NEGOTIABLE GOAL: produce ONE short, concrete, verifiable scene anchored in a real place and a single verifiable claim, using ONLY provided sources.',
    'OUTPUT FORMAT: output MUST be a single valid JSON object matching SceneCard schema, no extra text.',
    'ABSOLUTE PROHIBITIONS: no psychology, no interpretation, no lyrical prose, no invention, no disclaimers.',
    'EPISTEMIC RULE: do not introduce specific details unless supported by source_context.',
    'SINGLE CLAIM RULE: event_claim is exactly one sentence, directly supported by at least one source.',
    'SCENE RULES: narrative in present tense, 120-180 words, purely observable details, at least 6 observable elements.',
    'VALIDATION: if details missing, keep quality flags false and avoid invention.',
    '',
    'SceneCard schema fields:',
    'slot (int), year (int), country (string), city (string),',
    'location (string), timestamp_hint (string), narrative (string),',
    'observable_elements (string[]), event_claim (string),',
    'sources (array of {type,title,url,support}),',
    'quality_flags ({no_psychology,no_political_interpretation,not_a_summary,has_real_place,has_single_verifiable_claim}).',
    '',
    `Known values: year=${year}, country=FR, slot=1.`,
    `Event title: ${title}`,
    `source_context: ${wikiLead}`,
    `source_url: ${sourceUrl}`
  ].join('\n');

  try {
    const response = await fetchWithRetry(
      OPENAI_ENDPOINT,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: String(env?.OPENAI_MODEL || 'gpt-4.1-mini'),
          input: prompt,
          max_output_tokens: 800,
          text: {
            format: {
              type: 'json_schema',
              name: 'scene_card',
              strict: true,
              schema: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  slot: { type: 'integer' },
                  year: { type: 'integer' },
                  country: { type: 'string' },
                  city: { type: 'string' },
                  location: { type: 'string' },
                  timestamp_hint: { type: 'string' },
                  narrative: { type: 'string' },
                  observable_elements: {
                    type: 'array',
                    items: { type: 'string' }
                  },
                  event_claim: { type: 'string' },
                  sources: {
                    type: 'array',
                    items: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        type: { type: 'string' },
                        title: { type: 'string' },
                        url: { type: 'string' },
                        support: { type: 'string' }
                      },
                      required: ['type', 'title', 'url', 'support']
                    }
                  },
                  quality_flags: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      no_psychology: { type: 'boolean' },
                      no_political_interpretation: { type: 'boolean' },
                      not_a_summary: { type: 'boolean' },
                      has_real_place: { type: 'boolean' },
                      has_single_verifiable_claim: { type: 'boolean' }
                    },
                    required: [
                      'no_psychology',
                      'no_political_interpretation',
                      'not_a_summary',
                      'has_real_place',
                      'has_single_verifiable_claim'
                    ]
                  }
                },
                required: [
                  'slot',
                  'year',
                  'country',
                  'city',
                  'location',
                  'timestamp_hint',
                  'narrative',
                  'observable_elements',
                  'event_claim',
                  'sources',
                  'quality_flags'
                ]
              }
            }
          }
        })
      },
      { timeoutMs: 18000, retries: 2 }
    );
    const payload = await response.json();
    const card = payload?.output_parsed || null;
    if (card && typeof card === 'object') {
      return JSON.stringify(card);
    }
    return '';
  } catch {
    return '';
  }
}

function shortFactFromLead(lead, fallbackTitle) {
  const firstSentence = String(lead || '').split(/(?<=[.!?])\s+/)[0]?.trim() || '';
  if (!firstSentence) {
    return `${fallbackTitle}.`;
  }
  const trimmed = firstSentence.split(/\s+/).slice(0, 20).join(' ');
  return trimmed.endsWith('.') ? trimmed : `${trimmed}.`;
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: responseHeaders() });
}

export async function onRequestGet(context) {
  const requestUrl = new URL(context.request.url);
  const year = parseYear(requestUrl.searchParams.get('year'));
  const slot = parseSlot(requestUrl.searchParams.get('slot'));
  const countryParam = requestUrl.searchParams.get('country') || 'FR';
  const country = countryForPool(countryParam);
  const lang = String(requestUrl.searchParams.get('lang') || 'fr').toLowerCase().startsWith('fr') ? 'fr' : 'en';

  if (!year || !slot) {
    return json(400, { error: 'Invalid parameters. Expected year and slot.' });
  }
  if (country !== 'FR' || lang !== 'fr') {
    return json(404, { error: 'Mode one-by-one currently available for FR/fr only.' });
  }

  const source = sourceForSlot({ year, country, slot });
  if (!source) {
    return json(404, { error: 'No source pool configured for this year/country yet.' });
  }

  const cacheKey = `${year}|${country}|${slot}`;
  const cached = poolCache.get(cacheKey);
  if (cached) {
    return json(200, cached);
  }

  const wikiLead = await getWikiLead(source.sourceUrl);
  if (!wikiLead || wikiLead.length < 200) {
    return json(502, { error: 'Wikipedia lead unavailable for selected source.' });
  }

  const narrative = await generateSceneWithAI({
    year,
    title: source.title,
    sourceUrl: source.sourceUrl,
    wikiLead,
    env: context.env
  });

  let card = null;
  try {
    card = JSON.parse(narrative);
  } catch {
    card = null;
  }

  const renderedNarrative = String(card?.narrative || '').trim();
  const renderedFact = String(card?.event_claim || '').trim();
  const sourceFromCard = Array.isArray(card?.sources)
    ? String(card.sources[0]?.url || '').trim()
    : '';
  const renderedUrl = sourceFromCard || source.sourceUrl;

  if (!isValidNarrative(renderedNarrative) || !renderedFact || !renderedUrl) {
    return json(502, { error: 'AI scene did not pass minimal narrative checks.' });
  }

  const payload = {
    slot,
    narrative: renderedNarrative,
    fact: renderedFact || shortFactFromLead(wikiLead, source.title),
    url: renderedUrl
  };
  poolCache.set(cacheKey, payload);
  return json(200, payload);
}
