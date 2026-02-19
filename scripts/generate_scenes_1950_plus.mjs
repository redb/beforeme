import fs from 'node:fs/promises';

const START_YEAR = 1950;
const END_YEAR = 2026;
const ENDPOINT = 'https://query.wikidata.org/sparql';

const ALLOWED = [
  { id: 'invention', terms: ['invention', 'invent', 'prototype', 'device', 'machine', 'patent', 'invente', 'brevet', 'appareil', 'techn'] },
  { id: 'discovery', terms: ['discovery', 'discovered', 'identified', 'observation', 'decouverte', 'observe', 'identifie', 'scientifique'] },
  { id: 'exploration', terms: ['exploration', 'expedition', 'explorer', 'mission', 'voyage', 'traversee', 'cartographie', 'lunaire', 'spatial'] },
  { id: 'cultural', terms: ['film', 'cinema', 'album', 'song', 'chanson', 'roman', 'livre', 'poeme', 'opera', 'festival', 'television', 'broadcast', 'radio'] },
  { id: 'first-occurrence', terms: ['first', 'premier', 'premiere', 'inauguration', 'opening', 'ouverture', 'launch', 'lancement', 'demonstration', 'demonstration'] }
];

const PUBLIC_TERMS = [
  'public',
  'inauguration',
  'ouverture',
  'opening',
  'launch',
  'lancement',
  'premiere',
  'first',
  'demonstration',
  'festival',
  'exposition',
  'station',
  'service'
];

const BLOCKED = [
  'war', 'battle', 'assassination', 'killed', 'massacre', 'coup', 'military', 'election', 'government', 'minister',
  'guerre', 'bataille', 'assassinat', 'massacre', 'coup', 'militaire', 'election', 'gouvernement', 'ministre',
  'earthquake', 'flood', 'hurricane', 'disaster', 'tsunami', 'crash', 'catastrophe', 'seisme', 'inondation', 'ouragan', 'attentat'
];

const SPORTS = ['olympic', 'championship', 'match', 'tennis', 'football', 'basket', 'tournoi', 'sport', 'medal'];

function normalize(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function includesAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

function pickCategory(text) {
  for (const entry of ALLOWED) {
    if (includesAny(text, entry.terms)) {
      return entry.id;
    }
  }
  return null;
}

function splitWords(text) {
  return text.trim().split(/\s+/).filter(Boolean);
}

function truncateWords(text, maxWords) {
  const words = splitWords(text);
  if (words.length <= maxWords) {
    return text;
  }

  return `${words.slice(0, maxWords).join(' ')}...`;
}

function buildQuery(year, dateProp) {
  return `
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX schema: <http://schema.org/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?event ?eventLabel ?eventDescription ?article WHERE {
  ?event ${dateProp} ?date .
  FILTER(?date >= "${year}-01-01T00:00:00Z"^^xsd:dateTime)
  FILTER(?date < "${year + 1}-01-01T00:00:00Z"^^xsd:dateTime)

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
             schema:isPartOf <https://fr.wikipedia.org/> .
  }
}
LIMIT 350
`;
}

async function queryYear(year, dateProp) {
  const query = buildQuery(year, dateProp);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/sparql-results+json',
          'Content-Type': 'application/sparql-query; charset=utf-8',
          'User-Agent': 'BeforeMe/1.0 scenes-builder'
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
      if (attempt === 2) {
        return [];
      }
      await new Promise((resolve) => setTimeout(resolve, 600 + attempt * 400));
    }
  }

  return [];
}

function dedupeRows(rows) {
  const map = new Map();

  for (const row of rows) {
    const key = row.event?.value;
    if (!key) continue;

    const label = row.eventLabel?.value || '';
    const desc = row.eventDescription?.value || '';
    const article = row.article?.value || '';

    if (!map.has(key)) {
      map.set(key, { key, label, desc, article });
      continue;
    }

    const current = map.get(key);
    if (!current.label && label) current.label = label;
    if (!current.desc && desc) current.desc = desc;
    if (!current.article && article) current.article = article;
  }

  return Array.from(map.values());
}

function chooseEvent(year, rows) {
  const candidates = dedupeRows(rows)
    .map((entry) => {
      const corpus = normalize(`${entry.label} ${entry.desc}`);
      if (!entry.label || !corpus) return null;
      if (includesAny(corpus, BLOCKED)) return null;

      const category = pickCategory(corpus);
      const isPublic = includesAny(corpus, PUBLIC_TERMS);
      const isSport = includesAny(corpus, SPORTS);

      let score = 0;
      if (entry.article) score += 5;
      if (category) score += 4;
      if (isPublic) score += 3;
      if (entry.desc) score += 1;
      if (isSport) score -= 3;

      return {
        year,
        label: entry.label,
        desc: entry.desc,
        url: entry.article || `https://www.wikidata.org/wiki/${entry.key.split('/').pop()}`,
        category: category || 'fallback',
        score
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);

  if (!candidates.length) {
    return null;
  }

  const preferred = candidates.find((item) => item.category !== 'fallback');
  return preferred || candidates[0];
}

function pickAnchor(label) {
  const text = normalize(label);
  if (text.includes('satellite')) return 'un point lumineux qui traverse le ciel au-dessus de la foule';
  if (text.includes('television') || text.includes('broadcast') || text.includes('radio')) return 'un ecran allume dans un lieu plein de monde';
  if (text.includes('laser')) return 'un trait de lumiere net qui semble couper la piece';
  if (text.includes('ordinateur') || text.includes('computer')) return 'un boitier pose sur une table qui repond en direct';
  if (text.includes('internet') || text.includes('web')) return 'un terminal relie a distance dans un espace public';
  if (text.includes('metro') || text.includes('train') || text.includes('station')) return 'un quai ou un panneau se met a parler autrement';
  if (text.includes('film') || text.includes('cinema') || text.includes('festival')) return 'une salle ou des images nouvelles captent tous les regards';
  if (text.includes('inauguration') || text.includes('ouverture')) return 'un portail qui s ouvre et laisse entrer une file entiere';
  if (text.includes('telephone') || text.includes('mobile')) return 'un appareil qui sonne au milieu de la rue sans cabine';
  return 'un dispositif inattendu qui apparait devant tout le monde';
}

function pickTruth(category) {
  if (category === 'invention') return 'un geste simple suffit desormais pour declencher quelque chose autour de toi.';
  if (category === 'discovery') return 'ce qui restait invisible trouve soudain une place dans le regard de tous.';
  if (category === 'exploration') return 'les limites paraissent moins fixes des que quelqu un revient les yeux remplis de preuves.';
  if (category === 'cultural') return 'les images et les sons partages deviennent un rendez-vous ordinaire pour des inconnus.';
  if (category === 'first-occurrence') return 'ce qui semblait exceptionnel prend d un coup la forme d une habitude.';
  return 'la scene parait neuve, mais ton corps comprend deja comment y revenir demain.';
}

function buildScene(year, event) {
  const anchor = pickAnchor(event.label);
  const truth = pickTruth(event.category);

  const lines = [
    `En ${year}, tu t arretes quand ${anchor}.`,
    'Autour de toi, les gens ralentissent, se rapprochent, puis cherchent le meilleur angle pour voir.',
    'Un seul detail te reste en main: un bourdonnement court qui revient au meme rythme.',
    `Tu retiens une idee claire: ${truth}`
  ];

  let narrative = lines.join(' ');
  let words = splitWords(narrative).length;

  if (words < 45) {
    narrative += ' Personne ne parle fort, mais personne ne veut quitter la scene.';
  }

  const parts = narrative.split('. ');
  const trimmed = parts.slice(0, 4).join('. ');

  return splitWords(trimmed).length <= 70 ? trimmed : truncateWords(trimmed, 70);
}

function buildFact(event) {
  const fact = `${event.year}: ${event.label}`;
  return truncateWords(fact, 20);
}

async function generate() {
  const lines = ['# Scenes 1950-2026', ''];
  const missing = [];

  for (let year = START_YEAR; year <= END_YEAR; year += 1) {
    const rowsPointInTime = await queryYear(year, 'wdt:P585');
    let chosen = chooseEvent(year, rowsPointInTime);

    if (!chosen) {
      const rowsInception = await queryYear(year, 'wdt:P571');
      chosen = chooseEvent(year, rowsInception);
    }

    if (!chosen) {
      missing.push(year);
      lines.push(`## ${year}`);
      lines.push('Tu avances dans une rue active quand un objet nouveau attire tous les regards.');
      lines.push('Les passants ralentissent et se regroupent sans se parler.');
      lines.push('Un bruit sec revient, toujours identique, et chacun attend la repetition.');
      lines.push('Tu comprends que la scene va revenir demain, comme un geste normal du decor.');
      lines.push('');
      lines.push('**Evenement exact non resolu automatiquement pour cette annee.**');
      lines.push('https://www.wikidata.org/');
      lines.push('');
      continue;
    }

    lines.push(`## ${year}`);
    lines.push(buildScene(year, chosen));
    lines.push('');
    lines.push(`**${buildFact(chosen)}**`);
    lines.push(chosen.url);
    lines.push('');

    // Polite delay to avoid hammering endpoint
    await new Promise((resolve) => setTimeout(resolve, 120));
  }

  await fs.writeFile('SCENES_1950_2026.md', `${lines.join('\n')}\n`, 'utf8');
  await fs.writeFile('SCENES_1950_2026.meta.json', JSON.stringify({ missing }, null, 2), 'utf8');

  console.log('done');
  console.log('missing years:', missing.length);
}

generate();
