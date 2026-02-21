import { getWikiLead } from '../lib/wiki-lead.js';

const MAX_SLOT = 20;
const OPENAI_ENDPOINT = 'https://api.openai.com/v1/responses';
const poolCache = new Map();

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
  const words = countWords(text);
  if (words < 30 || words > 130) return false;
  const sentences = sentenceCount(text);
  if (sentences < 2 || sentences > 6) return false;
  if (!/\btu\b/i.test(text)) return false;
  const lowered = normalizeText(text);
  const blocked = ['se repand sur le trottoir', 'entree marquee', 'tout le quartier s organise autour de ce repere'];
  if (blocked.some((item) => lowered.includes(item))) return false;
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

async function generateSceneWithAI({ year, title, wikiLead, env }) {
  const apiKey = String(env?.OPENAI_API_KEY || '').trim();
  if (!apiKey) return '';

  const prompt = [
    'Écris une micro-scène immersive en français.',
    'Règles: 3 ou 4 phrases, 45 à 90 mots, présent, 2e personne.',
    'Aucune analyse historique. Aucune morale.',
    `Année: ${year}`,
    `Titre: ${title}`,
    `Lead source: ${wikiLead}`
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
          max_output_tokens: 220
        })
      },
      { timeoutMs: 18000, retries: 2 }
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
  const country = String(requestUrl.searchParams.get('country') || 'FR').trim().toUpperCase();
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
    wikiLead,
    env: context.env
  });

  if (!isValidNarrative(narrative)) {
    return json(502, { error: 'AI scene did not pass minimal narrative checks.' });
  }

  const payload = {
    slot,
    narrative,
    fact: shortFactFromLead(wikiLead, source.title),
    url: source.sourceUrl
  };
  poolCache.set(cacheKey, payload);
  return json(200, payload);
}
