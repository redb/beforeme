const WIKIDATA_SPARQL_ENDPOINT = 'https://query.wikidata.org/sparql';

const ALLOWED_LANGS = new Set(['fr', 'en']);

const ALLOWED_CATEGORIES = [
  {
    id: 'invention',
    terms: [
      'invention',
      'invented',
      'inventor',
      'prototype',
      'device',
      'apparatus',
      'machine',
      'tool',
      'instrument',
      'engine',
      'patent',
      'invente',
      'inventeur',
      'brevet',
      'appareil',
      'outil'
    ]
  },
  {
    id: 'discovery',
    terms: [
      'discovery',
      'discovered',
      'identified',
      'detected',
      'observation',
      'identified',
      'decouverte',
      'decouvert',
      'identifie',
      'observe',
      'mise en evidence'
    ]
  },
  {
    id: 'exploration',
    terms: [
      'exploration',
      'expedition',
      'explorer',
      'voyage',
      'traversal',
      'crossing',
      'mapping',
      'ascension',
      'explorateur',
      'traversee',
      'cartographie'
    ]
  },
  {
    id: 'cultural-work-creation',
    terms: [
      'novel',
      'book',
      'poem',
      'painting',
      'sculpture',
      'opera',
      'composition',
      'play',
      'film',
      'song',
      'published',
      'premiered',
      'oeuvre',
      'roman',
      'livre',
      'poeme',
      'tableau',
      'piece',
      'chanson',
      'publie',
      'premiere'
    ]
  },
  {
    id: 'first-occurrence',
    terms: [
      'first ',
      'first-ever',
      'opening',
      'inauguration',
      'launch',
      'founded',
      'foundation',
      'debut',
      'premiere fois',
      'premier',
      'lancement',
      'ouverture',
      'fondation'
    ]
  }
];

const BLOCKED_TERMS = [
  'war',
  'battle',
  'assassination',
  'disaster',
  'earthquake',
  'flood',
  'hurricane',
  'tsunami',
  'explosion',
  'attack',
  'politic',
  'election',
  'government',
  'minister',
  'president',
  'parliament',
  'coup',
  'military',
  'riot',
  'genocide',
  'guerre',
  'bataille',
  'assassinat',
  'catastrophe',
  'seisme',
  'inondation',
  'ouragan',
  'attaque',
  'politique',
  'election',
  'gouvernement',
  'ministre',
  'president',
  'parlement',
  'militaire',
  'attentat'
];

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

function buildSparqlQuery(year, lang) {
  const nextYear = year + 1;

  return `
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX bd: <http://www.bigdata.com/rdf#>
PREFIX wikibase: <http://wikiba.se/ontology#>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX schema: <http://schema.org/>

SELECT ?event ?eventLabel ?eventDescription ?typeLabel ?article WHERE {
  BIND("${year}-01-01T00:00:00Z"^^xsd:dateTime AS ?start)
  BIND("${nextYear}-01-01T00:00:00Z"^^xsd:dateTime AS ?end)

  {
    ?event wdt:P585 ?date .
  } UNION {
    ?event wdt:P571 ?date .
  }

  FILTER(?date >= ?start && ?date < ?end)

  OPTIONAL { ?event wdt:P31 ?type . }

  OPTIONAL {
    ?article schema:about ?event ;
             schema:isPartOf <https://${lang}.wikipedia.org/> .
  }

  SERVICE wikibase:label { bd:serviceParam wikibase:language "${lang},en". }
}
LIMIT 500
`;
}

function classifyCategory(entry) {
  const corpus = normalizeText([entry.label, entry.description, ...entry.types].join(' '));

  if (!corpus) {
    return null;
  }

  if (includesAny(corpus, BLOCKED_TERMS)) {
    return null;
  }

  for (const category of ALLOWED_CATEGORIES) {
    if (includesAny(corpus, category.terms)) {
      return category.id;
    }
  }

  return null;
}

function summarize(entry) {
  const source = entry.description ? `${entry.label}. ${entry.description}` : entry.label;
  const compact = source
    .replace(/\s+/g, ' ')
    .replace(/\([^)]*\)/g, '')
    .trim();

  const words = compact.split(' ').filter(Boolean);
  if (words.length <= 20) {
    return words.join(' ');
  }

  return `${words.slice(0, 20).join(' ')}...`;
}

function parseBindings(bindings, lang) {
  const map = new Map();

  for (const row of bindings) {
    const eventUrl = row.event?.value;
    if (!eventUrl) {
      continue;
    }

    if (!map.has(eventUrl)) {
      map.set(eventUrl, {
        eventUrl,
        label: row.eventLabel?.value || '',
        description: row.eventDescription?.value || '',
        url: '',
        types: new Set()
      });
    }

    const current = map.get(eventUrl);

    if (!current.label && row.eventLabel?.value) {
      current.label = row.eventLabel.value;
    }

    if (!current.description && row.eventDescription?.value) {
      current.description = row.eventDescription.value;
    }

    if (!current.url && row.article?.value) {
      current.url = row.article.value;
    }

    if (row.typeLabel?.value) {
      current.types.add(row.typeLabel.value);
    }
  }

  const ranked = Array.from(map.values())
    .map((entry) => {
      const category = classifyCategory(entry);
      if (!category || !entry.label) {
        return null;
      }

      const resolvedUrl = entry.url || entry.eventUrl;

      let score = 0;
      if (resolvedUrl.includes(`${lang}.wikipedia.org`)) score += 3;
      if (entry.description) score += 1;
      if (entry.label.length >= 15 && entry.label.length <= 100) score += 1;

      return {
        category,
        label: entry.label,
        summary: summarize(entry),
        url: resolvedUrl,
        score
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }

      return a.label.localeCompare(b.label);
    });

  const unique = [];
  const seen = new Set();

  for (const entry of ranked) {
    const key = normalizeText(entry.label);
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    unique.push({
      summary: entry.summary,
      label: entry.label,
      url: entry.url
    });

    if (unique.length >= 5) {
      break;
    }
  }

  return unique;
}

function safeLang(input) {
  const normalized = normalizeText(input).slice(0, 2);
  return ALLOWED_LANGS.has(normalized) ? normalized : 'en';
}

function parseYear(input) {
  const year = Number(input);
  if (!Number.isInteger(year) || year < 1 || year > 2100) {
    return null;
  }

  return year;
}

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=1800'
    },
    body: JSON.stringify(body)
  };
}

export const handler = async (event) => {
  const params = event.queryStringParameters || {};
  const year = parseYear(params.year);
  const lang = safeLang(params.lang);

  if (!year) {
    return jsonResponse(400, { error: 'Invalid year parameter' });
  }

  try {
    const query = buildSparqlQuery(year, lang);
    const response = await fetch(WIKIDATA_SPARQL_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/sparql-results+json',
        'Content-Type': 'application/sparql-query; charset=utf-8',
        'User-Agent': 'BeforeMe/1.0 (Netlify Function)'
      },
      body: query
    });

    if (!response.ok) {
      return jsonResponse(200, []);
    }

    const data = await response.json();
    const bindings = data?.results?.bindings;

    if (!Array.isArray(bindings)) {
      return jsonResponse(200, []);
    }

    const payload = parseBindings(bindings, lang);
    return jsonResponse(200, payload);
  } catch {
    return jsonResponse(200, []);
  }
};
