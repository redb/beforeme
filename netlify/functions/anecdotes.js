import { PrismaClient } from '@prisma/client';
import { filterAndScoreCandidates } from './lib/filterEvents.js';
import { generateWithOpenAI } from './lib/openaiClient.js';
import { validateAnecdote } from './lib/validateAnecdote.js';

const WIKIDATA_ENDPOINT = process.env.WIKIDATA_ENDPOINT || 'https://query.wikidata.org/sparql';
const LANG_DEFAULT = 'fr';
const COUNTRY_DEFAULT = 'US';
const COUNTRY_TO_QID = {
  FR: 'Q142',
  US: 'Q30',
  BR: 'Q155',
  MG: 'Q1019',
  DE: 'Q183',
  ES: 'Q29',
  IT: 'Q38',
  GB: 'Q145',
  CA: 'Q16'
};

let prismaClient = null;

function sanitizeNarrativeText(value) {
  return String(value || '')
    .replace(/\b[Tt]u comprends\s*:\s*/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s([,.!?;:])/g, '$1')
    .trim();
}

function getPrismaClient() {
  const url = process.env.DATABASE_URL || process.env.PRISMA_ACCELERATE_URL || '';
  if (!url) {
    throw new Error('DATABASE_URL is missing');
  }

  if (!prismaClient) {
    prismaClient = new PrismaClient({
      datasources: {
        db: { url }
      }
    });
  }

  return prismaClient;
}

function parseYear(raw) {
  const year = Number(raw);
  if (!Number.isInteger(year) || year < 1800 || year > 2100) {
    return null;
  }
  return year;
}

function normalizeLang(raw) {
  return raw === 'en' ? 'en' : 'fr';
}

function normalizeCountry(raw) {
  const country = String(raw || COUNTRY_DEFAULT).toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2);
  return COUNTRY_TO_QID[country] ? country : COUNTRY_DEFAULT;
}

function qidFromEventUrl(eventUrl) {
  const value = String(eventUrl || '');
  const match = value.match(/Q\d+/);
  return match ? match[0] : '';
}

function buildQuery(year, countryQid, articleLang) {
  return `
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX schema: <http://schema.org/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?event ?eventLabel ?eventDescription ?eventDate ?placeLabel ?article ?instance WHERE {
  BIND(${year} AS ?targetYear)

  { ?event wdt:P585 ?eventDate . }
  UNION { ?event wdt:P580 ?eventDate . }
  UNION { ?event wdt:P571 ?eventDate . }

  FILTER(YEAR(?eventDate) = ?targetYear)

  {
    ?event wdt:P17 wd:${countryQid} .
  }
  UNION
  {
    ?event wdt:P276 ?place .
    ?place wdt:P17 wd:${countryQid} .
  }

  OPTIONAL { ?event wdt:P31 ?instance . }

  OPTIONAL {
    ?event wdt:P276 ?place2 .
    ?place2 rdfs:label ?placeLabel .
    FILTER(LANG(?placeLabel) = "fr" || LANG(?placeLabel) = "en")
  }

  OPTIONAL {
    ?event rdfs:label ?eventLabel .
    FILTER(LANG(?eventLabel) = "fr" || LANG(?eventLabel) = "en")
  }

  OPTIONAL {
    ?event schema:description ?eventDescription .
    FILTER(LANG(?eventDescription) = "fr" || LANG(?eventDescription) = "en")
  }

  OPTIONAL {
    ?article schema:about ?event ;
             schema:isPartOf <https://${articleLang}.wikipedia.org/> .
  }

  FILTER(!EXISTS { ?event wdt:P31 wd:Q13406463 })
  FILTER(!EXISTS { ?event wdt:P31 wd:Q13433827 })
}
LIMIT 80
`;
}

async function getCandidatesFromWikidata(year, country, lang) {
  const countryQid = COUNTRY_TO_QID[country] || COUNTRY_TO_QID[COUNTRY_DEFAULT];
  const articleLang = lang === 'en' ? 'en' : 'fr';
  const query = buildQuery(year, countryQid, articleLang);

  const response = await fetch(WIKIDATA_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/sparql-results+json',
      'Content-Type': 'application/sparql-query; charset=utf-8',
      'User-Agent': 'AvantMoi/1.0 anecdotes pipeline'
    },
    body: query
  });

  if (!response.ok) {
    throw new Error(`Wikidata error ${response.status}`);
  }

  const data = await response.json();
  const rows = Array.isArray(data?.results?.bindings) ? data.results.bindings : [];

  const map = new Map();

  for (const row of rows) {
    const eventUrl = row.event?.value;
    if (!eventUrl) continue;

    const eventQid = qidFromEventUrl(eventUrl);
    if (!eventQid) continue;

    if (!map.has(eventQid)) {
      map.set(eventQid, {
        eventQid,
        title: row.eventLabel?.value || '',
        description: row.eventDescription?.value || '',
        date: row.eventDate?.value || '',
        place: row.placeLabel?.value || '',
        sourceUrl: row.article?.value || eventUrl,
        countryMatch: true
      });
      continue;
    }

    const current = map.get(eventQid);
    if (!current.title && row.eventLabel?.value) current.title = row.eventLabel.value;
    if (!current.description && row.eventDescription?.value) current.description = row.eventDescription.value;
    if (!current.date && row.eventDate?.value) current.date = row.eventDate.value;
    if (!current.place && row.placeLabel?.value) current.place = row.placeLabel.value;
    if ((!current.sourceUrl || current.sourceUrl.includes('wikidata.org')) && row.article?.value) {
      current.sourceUrl = row.article.value;
    }
  }

  return Array.from(map.values());
}

async function readCachedEvent(client, params) {
  const { year, country, lang, eventQid } = params;
  return client.eventCache.findUnique({
    where: {
      year_country_lang_eventQid: {
        year,
        country,
        lang,
        eventQid
      }
    }
  });
}

async function saveEventCache(client, params) {
  const { year, country, lang, eventQid, title, fact, sourceUrl, scene } = params;

  return client.eventCache.upsert({
    where: {
      year_country_lang_eventQid: {
        year,
        country,
        lang,
        eventQid
      }
    },
    create: {
      year,
      country,
      lang,
      eventQid,
      title,
      fact,
      sourceUrl,
      scene
    },
    update: {
      title,
      fact,
      sourceUrl,
      scene
    }
  });
}

function json(statusCode, payload) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=60'
    },
    body: JSON.stringify(payload)
  };
}

async function buildItems(year, lang, country) {
  const client = getPrismaClient();

  const rawCandidates = await getCandidatesFromWikidata(year, country, lang);
  const topCandidates = filterAndScoreCandidates(rawCandidates).slice(0, 6);

  const items = [];

  for (const candidate of topCandidates) {
    if (items.length >= 3) break;

    const cached = await readCachedEvent(client, {
      year,
      country,
      lang,
      eventQid: candidate.eventQid
    });

    if (cached) {
      items.push({
        scene: sanitizeNarrativeText(cached.scene),
        fact: sanitizeNarrativeText(cached.fact),
        sourceUrl: cached.sourceUrl,
        eventQid: cached.eventQid,
        title: cached.title
      });
      continue;
    }

    let generated = null;

    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const output = await generateWithOpenAI({ year, candidate, lang });
        const checked = validateAnecdote({
          scene: output.scene,
          fact: output.fact,
          sourceUrl: output.sourceUrl,
          year
        });

        if (!checked.ok) {
          continue;
        }

        generated = output;
        break;
      } catch {
        // retry next attempt
      }
    }

    if (!generated) {
      continue;
    }

    const row = await saveEventCache(client, {
      year,
      country,
      lang,
      eventQid: candidate.eventQid,
      title: candidate.title,
      fact: sanitizeNarrativeText(generated.fact),
      sourceUrl: generated.sourceUrl || candidate.sourceUrl,
      scene: sanitizeNarrativeText(generated.scene)
    });

    items.push({
      scene: sanitizeNarrativeText(row.scene),
      fact: sanitizeNarrativeText(row.fact),
      sourceUrl: row.sourceUrl,
      eventQid: row.eventQid,
      title: row.title
    });
  }

  return items;
}

export const handler = async (event) => {
  try {
    const query = event.queryStringParameters || {};
    const year = parseYear(query.year);
    const lang = normalizeLang(query.lang || LANG_DEFAULT);
    const country = normalizeCountry(query.country);

    if (!year) {
      return json(400, { error: 'year is required and must be an integer' });
    }

    const items = await buildItems(year, lang, country);

    return json(200, {
      year,
      country,
      items
    });
  } catch (error) {
    return json(500, {
      error: 'Failed to build anecdotes',
      details: error instanceof Error ? error.message : 'unknown'
    });
  }
};
