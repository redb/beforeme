import { PrismaClient } from '@prisma/client';

const WIKIDATA_SPARQL_ENDPOINT = 'https://query.wikidata.org/sparql';
const ALLOWED_LANGS = new Set(['fr', 'en']);
const ALLOWED_SCOPES = new Set(['global', 'local']);
const MAX_SLOT = 20;
const CACHE_VERSION = 'v17';
const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
const AI_FLAG = String(process.env.BEFOREME_USE_AI || '1').toLowerCase();
const AI_ENABLED = Boolean(process.env.OPENAI_API_KEY) && !['0', 'false', 'off', 'no'].includes(AI_FLAG);
const FRANCE_ONLY_MODE = false;
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

const FR_CURATED_YEAR_EVENTS = {
  1968: [
    {
      label: 'Mai 68 à Paris',
      description: 'manifestations, barricades et affrontements de rue au printemps 1968 en France',
      url: 'https://fr.wikipedia.org/wiki/Mai_68',
      fallbackNarrative: 'En {year}, tu marches boulevard Saint-Michel et des pavés forment une barricade devant toi. Des étudiants crient, des casques avancent, et les passants reculent vers les portes cochères. Une odeur de fumée reste sous les affiches collées sur les murs. La rue ne sert plus seulement à circuler, elle sert à contester.',
      fallbackFact: 'Début des journées de Mai 68 à Paris, au printemps 1968.'
    },
    {
      label: 'Accords de Grenelle',
      description: 'accords negocies fin mai 1968 avec effets immediats sur le travail en France',
      url: 'https://fr.wikipedia.org/wiki/Accords_de_Grenelle',
      fallbackNarrative: 'En {year}, tu attends devant la grille d’usine pendant qu’un délégué lit les points signés à Grenelle. Des ouvriers lèvent la main, d’autres discutent à voix forte avant de reprendre le poste. Le papier froissé passe de main en main près des machines encore tièdes. La paie et les horaires se négocient désormais devant tout le monde.',
      fallbackFact: 'Accords de Grenelle signés fin mai 1968, avec hausses salariales immédiates.'
    },
    {
      label: "Jeux olympiques d'hiver de Grenoble",
      description: 'compétition internationale accueillie à Grenoble en février 1968',
      url: 'https://fr.wikipedia.org/wiki/Jeux_olympiques_d%27hiver_de_1968',
      fallbackNarrative: 'En {year}, tu entres dans un café de Grenoble où la télévision diffuse la cérémonie d’ouverture. Les tables se taisent quand la flamme apparaît, puis des applaudissements couvrent la musique. Le haut-parleur grésille pendant que des drapeaux passent sur l’écran. Regarder un direct international devient un rendez-vous collectif du soir.',
      fallbackFact: 'Ouverture des Jeux olympiques d’hiver de Grenoble, en février 1968.'
    }
  ]
};

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
  'ouragan', 'politique', 'election', 'gouvernement', 'ministre', 'president', 'military', 'militaire', 'attentat',
  'crisis', 'krach', 'recession', 'depression', 'pandemie', 'pandemic',
  'derailment', 'wreck', 'crash', 'collision', 'accident', 'fire', 'incendie', 'naufrage',
  'scandal', 'scandale', 'corruption', 'riot', 'emeute'
];

const META_REJECT_TERMS = [
  'list', 'category', 'conference', 'publication', 'article', 'biography',
  'organization', 'treaty', 'law', 'catalogue', 'census',
  'liste', 'categorie', 'conference', 'publication', 'article', 'biographie',
  'organisation', 'traite', 'loi', 'catalogue', 'recensement',
  'place in', 'human settlement', 'former theatre', 'wikimedia disambiguation page', 'set index article'
];

const SPORTS_REJECT_TERMS = [
  'olympic', 'olympique', 'championship', 'championnat', 'cup', 'coupe', 'tournoi',
  'football', 'soccer', 'tennis', 'hockey', 'rugby', 'basket', 'formula', 'grand prix',
  'league', 'ligue', 'match', 'medal', 'medaille', 'delegation', 'relay', 'paralympic',
  'jeux olympiques', 'summer olympics', 'winter olympics', 'sporting event', 'athletics',
  'football competition', 'tennis event results'
];

const OVERVIEW_REJECT_TERMS = [
  'overview of', 'events of', 'en musique', 'au cinema', 'in film', 'in music',
  'in science', 'in aviation', 'page de liste', 'wikimedia list article', 'sports season'
];

const STRICT_PUBLIC_TERMS = [
  'ouverture', 'inauguration', 'demonstration', 'demonstration publique', 'show', 'spectacle',
  'service public', 'public transport', 'station', 'ligne', 'metro', 'tram', 'train',
  'broadcast', 'television', 'radio', 'cinema', 'projection', 'exposition', 'passenger'
];

const STRICT_IMPACT_TERMS = [
  'public', 'commuter', 'passenger', 'street', 'rue', 'household', 'daily', 'quotidien',
  'telephone', 'ticket', 'payment', 'shop', 'commerce', 'transport', 'school', 'home', 'salon'
];

const STRICT_REJECT_TERMS = [
  'law', 'act', 'decree', 'treaty', 'agreement', 'conference', 'election', 'cabinet',
  'manifesto', 'party', 'prime minister', 'president', 'policy', 'protest', 'strike',
  'loi', 'decret', 'traite', 'accord', 'conference', 'election', 'gouvernement', 'parti',
  'manifeste', 'politique', 'greve', 'manifestation', 'nomination'
];

const SCENE_FORBIDDEN_TERMS_STRICT = [
  'objet', 'chose', 'phenomene', 'evenement', 'innovation', 'dispositif',
  'quelque chose', 'systeme', 'appareil', 'geste'
];

const DIRECT_EXPERIENCE_GROUPS = [
  {
    id: 'public-demo',
    terms: ['demonstration', 'demonstration publique', 'public test', 'live demo', 'foire', 'exposition publique']
  },
  {
    id: 'public-opening',
    terms: ['opening', 'ouverture', 'inauguration', 'open to public', 'au public']
  },
  {
    id: 'public-installation',
    terms: ['installation', 'borne', 'kiosk', 'cabine', 'guichet', 'terminal', 'station publique']
  },
  {
    id: 'spectacle',
    terms: ['spectacle', 'show', 'performance', 'projection', 'screening', 'cinema', 'concert']
  },
  {
    id: 'transport-live',
    terms: ['metro', 'tram', 'train', 'bus', 'station', 'ligne', 'service regulier', 'subway', 'railway']
  },
  {
    id: 'street-object',
    terms: ['street', 'rue', 'avenue', 'place publique', 'public square', 'lampadaire', 'booth']
  },
  {
    id: 'usable-tech',
    terms: ['automatic', 'automatique', 'self service', 'dial', 'cadran', 'telephone', 'portable', 'photocopy', 'ticket machine']
  }
];

const OBSERVABLE_PLACE_TERMS = [
  'public', 'rue', 'street', 'avenue', 'square', 'place', 'gare', 'station', 'marche', 'market', 'hall', 'theatre', 'cinema'
];

const ACTIONABLE_TERMS = [
  'use', 'usable', 'utiliser', 'compose', 'composer', 'dial', 'appeler', 'ride', 'board', 'monter',
  'acheter', 'payer', 'watch', 'regarder', 'listen', 'ecouter', 'imprimer', 'print', 'photograph',
  'travel', 'voyager', 'reserve', 'reserver', 'envoyer', 'recevoir', 'allumer', 'brancher',
  'service', 'accessible', 'access', 'direct', 'immediate', 'immediat', 'fonctionnement'
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

const FORBIDDEN_SCENE_TERMS_FR = [
  'objet',
  'chose',
  'geste',
  'evenement',
  'phenomene',
  'quelque chose',
  'quelqu un',
  'quelqu une',
  'appareil',
  'dispositif',
  'innovation'
];

const CONCRETE_SCENES_FR = [
  {
    terms: ['telephone', 'dial', 'cadran', 'switchboard', 'standard', 'numero'],
    minYear: 1930,
    object: 'un telephone a cadran noir',
    action: 'glisses l index dans le cadran et tournes chiffre par chiffre',
    detail: 'le ressort ramene le cadran avec un tac-tac sec',
    transform: 'composer un numero devient direct pour un foyer ordinaire'
  },
  {
    terms: ['tram', 'metro', 'train', 'bus', 'station', 'ligne', 'railway', 'subway'],
    minYear: 1880,
    object: 'un tramway vert',
    action: 'montes, poinconnes ton ticket, puis la porte se referme',
    detail: 'les roues grincent fort au premier virage',
    transform: 'traverser la ville devient un trajet courant'
  },
  {
    terms: ['installation', 'kiosk', 'borne', 'terminal', 'ticket machine', 'self service'],
    minYear: 1950,
    object: 'une borne a billets de metro en metal',
    action: 'glisses une piece, appuies, puis un ticket de metro sort',
    detail: 'la fente claque et le papier chaud arrive dans ta main',
    transform: 'prendre un billet de metro devient possible sans guichetier'
  },
  {
    terms: ['projection', 'screening', 'cinema', 'show', 'spectacle', 'film', 'theatre', 'theater'],
    minYear: 1890,
    object: 'un ecran de projection',
    action: 'achetes un billet, t assieds, puis l image demarre',
    detail: 'la bobine claque derriere la salle',
    transform: 'voir la meme scene ensemble devient une habitude du soir'
  },
  {
    terms: ['street', 'rue', 'avenue', 'square', 'place publique', 'booth', 'public'],
    minYear: 1920,
    object: 'une cabine telephonique vitree',
    action: 'pousses la porte, composes, puis parles sans standard',
    detail: 'la vitre tremble quand la porte revient sur son ressort',
    transform: 'appeler au loin devient un reflexe de rue'
  }
];

const FALLBACK_EVENTS_FR = [
  {
    label: 'Mise en service de lignes telephoniques automatiques',
    description: 'usage direct en ville',
    url: 'https://www.wikidata.org/wiki/Q11016',
    minYear: 1930,
    corpus: 'telephone cadran automatique service public ville'
  },
  {
    label: 'Ouverture de stations de transport urbain',
    description: 'acces public immediat',
    url: 'https://www.wikidata.org/wiki/Q928830',
    minYear: 1880,
    corpus: 'metro tram station ouverture transport service regulier'
  },
  {
    label: 'Installation de bornes en libre service',
    description: 'ticket sur place sans guichet',
    url: 'https://www.wikidata.org/wiki/Q24354',
    minYear: 1950,
    corpus: 'borne terminal ticket machine self service rue'
  },
  {
    label: 'Projections collectives dans des salles urbaines',
    description: 'spectacle accessible au public',
    url: 'https://www.wikidata.org/wiki/Q41253',
    minYear: 1890,
    corpus: 'projection cinema spectacle public salle'
  },
  {
    label: 'Cabines telephoniques en acces public',
    description: 'appel direct depuis la rue',
    url: 'https://www.wikidata.org/wiki/Q83925',
    minYear: 1920,
    corpus: 'cabine telephonique rue public dial numero'
  }
];

const ACTION_VERBS_FR = ['tournes', 'glisses', 'montes', 'poinconnes', 'appuies', 'composes', 'achetes', 'pousses'];

const CAPABILITY_TIMELINE = [
  {
    id: 'chip-card',
    scope: 'global',
    techYear: 1876,
    sinceYear: 1980,
    sinceYearByCountry: { FR: 1984 },
    factActionFr: 'telephoner sans pieces',
    url: 'https://fr.wikipedia.org/wiki/Carte_%C3%A0_puce',
    possibleFr: [
      'En {year}, tu entres dans une cabine et tu sors une carte a puce rayee.',
      'Derriere toi, la file avance sans chercher de monnaie.',
      'Un clic sec valide la carte, puis la tonalite arrive.',
      'Telephoner sans pieces fait deja partie des gestes de rue.'
    ],
    impossibleFr: [
      'En {year}, tu ouvres une cabine telephonique avec seulement ton carnet d adresses.',
      'La personne derriere toi montre la fente a pieces.',
      'Les pieces tombent une par une avant la tonalite.',
      'Pour appeler, la monnaie reste necessaire.'
    ],
    preTechFr: [
      'En {year}, aucun combine ne pend au mur de la poste du quartier.',
      'Pour joindre un proche, il faut un courrier porte par la route.',
      'Le cachet humide marque l enveloppe avant le depart.',
      'Appeler a distance n est pas un geste de rue.'
    ]
  },
  {
    id: 'seatbelt-front',
    scope: 'global',
    techYear: 1886,
    sinceYear: 1973,
    factActionFr: 'avoir la ceinture avant imposee',
    url: 'https://fr.wikipedia.org/wiki/Ceinture_de_s%C3%A9curit%C3%A9',
    possibleFr: [
      'En {year}, tu fermes la portiere et tu tires la sangle diagonale devant ton torse.',
      'Le conducteur attend le clic des ceintures avant avant de demarrer.',
      'Le verrou fait un clac net pres de ta hanche.',
      'A l avant, boucler la sangle fait partie du depart.'
    ],
    impossibleFr: [
      'En {year}, tu montes a l avant et la sangle reste enroulee contre le montant.',
      'Le conducteur demarre sans verifier ton torse.',
      'La boucle de metal tape contre la portiere.',
      'A l avant, boucler la sangle ne fait pas partie du depart.'
    ],
    preTechFr: [
      'En {year}, aucune voiture ne t attend devant la maison, seulement une charrette.',
      'Personne ne cherche de sangle avant de partir.',
      'Le bois grince sous les roues ferrees.',
      'Le trajet se fait sans ceinture automobile.'
    ]
  },
  {
    id: 'seatbelt-rear',
    scope: 'global',
    techYear: 1886,
    sinceYear: 1990,
    factActionFr: 'avoir la ceinture arriere imposee',
    url: 'https://fr.wikipedia.org/wiki/Ceinture_de_s%C3%A9curit%C3%A9',
    possibleFr: [
      'En {year}, tu t installes a l arriere et tu attrapes une sangle sur le cote.',
      'Le conducteur attend le second clic avant d avancer.',
      'La boucle chauffe un peu au soleil contre ta paume.',
      'A l arriere, boucler la sangle fait partie du depart.'
    ],
    impossibleFr: [
      'En {year}, tu t installes a l arriere sans toucher la sangle.',
      'Personne ne se retourne pour verifier les places du fond.',
      'La boucle pend et cogne contre le siege a chaque virage.',
      'A l arriere, boucler la sangle ne fait pas partie du depart.'
    ],
    preTechFr: [
      'En {year}, le trajet se fait en voiture a cheval et non en automobile.',
      'Personne ne demande de boucler une sangle sur la banquette.',
      'Le cuir des sangles de traction craque au demarrage.',
      'Le trajet se fait sans ceinture arriere.'
    ]
  },
  {
    id: 'wiper',
    scope: 'global',
    techYear: 1886,
    sinceYear: 1903,
    factActionFr: 'degager le pare-brise sous la pluie',
    url: 'https://fr.wikipedia.org/wiki/Essuie-glace',
    possibleFr: [
      'En {year}, la pluie charge le pare-brise puis un essuie-glace balaie la vitre.',
      'Les passagers cessent de se pencher pour voir la route.',
      'Le bras de metal revient avec un frottement regulier.',
      'Sous la pluie, garder la vue devient un geste ordinaire.'
    ],
    impossibleFr: [
      'En {year}, la pluie charge le pare-brise et rien ne balaie la vitre.',
      'Le conducteur ralentit puis essuie a la main a l arret.',
      'L eau brouille les lampes en face du capot.',
      'Sous la pluie, la vue se degage seulement a l arret.'
    ],
    preTechFr: [
      'En {year}, sous la pluie, la route se fait en voiture a cheval.',
      'Personne ne cherche de levier devant un pare-brise inexistant.',
      'L eau perle sur la capote et le cuir sent l humidite.',
      'La route sous pluie se fait sans pare-brise.'
    ]
  },
  {
    id: 'washing-machine',
    scope: 'global',
    sinceYear: 1950,
    factActionFr: 'lancer une machine a laver chez soi',
    url: 'https://fr.wikipedia.org/wiki/Lave-linge',
    possibleFr: [
      'En {year}, tu verses le linge dans un tambour de machine a laver.',
      'La cuisine reste calme pendant que le cycle tourne seul.',
      'L eau tape en rythme contre la cuve emaillee.',
      'Laver la semaine passe par un cycle automatique.'
    ],
    impossibleFr: [
      'En {year}, le linge trempe dans une bassine en zinc au milieu de la piece.',
      'Deux personnes tordent les draps a la main pendant longtemps.',
      'La vapeur colle aux vitres autour de l evier.',
      'Le linge avance par trempage et essorage a la main.'
    ]
  },
  {
    id: 'no-smoking-public',
    scope: 'global',
    sinceYear: 2007,
    factActionFr: 'regle anti-tabac dans les lieux publics fermes',
    url: 'https://fr.wikipedia.org/wiki/Interdiction_de_fumer',
    possibleFr: [
      'En {year}, tu entres dans un cafe et un panneau interdit de fumer est au mur.',
      'Les tables restent pleines, personne n allume de cigarette.',
      'L air garde surtout l odeur du cafe chaud.',
      'Dans les lieux fermes, fumer n est plus un reflexe collectif.'
    ],
    impossibleFr: [
      'En {year}, tu t assieds au cafe et plusieurs cigarettes s allument autour de toi.',
      'Personne ne demande de sortir pour fumer.',
      'La fumee reste suspendue sous les lampes.',
      'Dans les lieux fermes, fumer reste un geste collectif.'
    ]
  },
  {
    id: 'wine-canteen',
    scope: 'local',
    countries: ['FR'],
    untilYear: 1956,
    factActionFr: 'servir du vin rouge a la cantine',
    url: 'https://fr.wikipedia.org/wiki/Vin',
    possibleFr: [
      'En {year}, a la cantine, une carafe en verre passe entre les plateaux.',
      'Les adultes servent une petite dose sans surprise.',
      'Le rouge tache le bord blanc du verre.',
      'A table, le vin rouge circule normalement.'
    ],
    impossibleFr: [
      'En {year}, a la cantine, la carafe rouge a disparu des plateaux.',
      'Les surveillants posent de l eau sans discussion.',
      'Les verres restent clairs du debut a la fin du repas.',
      'A table d eleves, seule l eau circule.'
    ]
  }
];

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function includesAny(haystack, terms) {
  return terms.some((term) => {
    if (!term) return false;
    const normalizedTerm = normalizeText(term);
    if (!normalizedTerm) return false;
    if (normalizedTerm.includes(' ')) {
      return haystack.includes(normalizedTerm);
    }
    return new RegExp(`\\b${escapeRegExp(normalizedTerm)}\\b`).test(haystack);
  });
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
    return `g:${CACHE_VERSION}:${year}:${lang}`;
  }
  return `l:${CACHE_VERSION}:${year}:${country}:${lang}`;
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

function detectDirectExperience(corpus) {
  for (const group of DIRECT_EXPERIENCE_GROUPS) {
    if (includesAny(corpus, group.terms)) {
      return group.id;
    }
  }
  return null;
}

function isPasserbyObservable(corpus, experienceType) {
  if (experienceType !== 'usable-tech') {
    return true;
  }
  return includesAny(corpus, OBSERVABLE_PLACE_TERMS);
}

function isHumanActionable(corpus) {
  return includesAny(corpus, ACTIONABLE_TERMS);
}

function buildSparqlQuery(year, lang) {
  const nextYear = year + 1;
  return `
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX schema: <http://schema.org/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?event ?eventLabel ?eventDescription ?article ?countryEntity ?placeCountry WHERE {
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

  OPTIONAL {
    ?event (wdt:P17|wdt:P495) ?countryEntity .
  }

  OPTIONAL {
    ?event wdt:P276 ?place .
    ?place wdt:P17 ?placeCountry .
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
  const strict = [];
  const fallback = [];

  for (const entry of deduped) {
    if (!entry.label) continue;

    const normalizedLabel = normalizeText(entry.label);
    const corpus = normalizeText(`${entry.label} ${entry.description}`);
    if (!corpus) continue;

    if (includesAny(corpus, META_REJECT_TERMS)) continue;
    if (includesAny(corpus, BLOCKED_TERMS)) continue;
    if (includesAny(corpus, SPORTS_REJECT_TERMS)) continue;
    if (includesAny(corpus, OVERVIEW_REJECT_TERMS)) continue;
    if (/^\d{3,4}\b/.test(normalizedLabel)) continue;
    if (normalizedLabel.includes('aux jeux olympiques')) continue;
    if (normalizedLabel.includes('at the olympics')) continue;
    if (normalizedLabel.includes('championnat du monde')) continue;

    const experienceType = detectDirectExperience(corpus);
    const isActionable = isHumanActionable(corpus);
    const hasPublicContext = includesAny(corpus, OBSERVABLE_PLACE_TERMS);
    const category = chooseCategory(corpus) || 'first-occurrence';

    let score = 0;
    if (entry.url) score += 4;
    if (entry.description) score += 2;
    if (hasPublicContext) score += 3;
    if (isActionable) score += 4;
    if (experienceType) score += 3;
    if (entry.label.length > 10 && entry.label.length < 120) score += 1;

    const resolved = {
      label: entry.label,
      description: entry.description,
      url: entry.url || entry.eventUrl,
      category,
      corpus,
      experienceType,
      score
    };

    if (experienceType && isPasserbyObservable(corpus, experienceType) && isActionable) {
      strict.push(resolved);
      continue;
    }

    if ((experienceType || (hasPublicContext && isActionable)) && (entry.url || entry.eventUrl)) {
      fallback.push(resolved);
    }
  }

  const sorter = (a, b) => b.score - a.score;
  if (strict.length) return strict.sort(sorter);
  return fallback.sort(sorter);
}

function parseStrictYearEvents(bindings, country) {
  const countryQid = COUNTRY_TO_QID[country] ? `http://www.wikidata.org/entity/${COUNTRY_TO_QID[country]}` : null;
  const map = new Map();

  for (const row of bindings) {
    const eventUrl = row.event?.value;
    if (!eventUrl) continue;

    if (!map.has(eventUrl)) {
      map.set(eventUrl, {
        eventUrl,
        label: row.eventLabel?.value || '',
        description: row.eventDescription?.value || '',
        url: row.article?.value || '',
        countryMatch: false
      });
    }

    const current = map.get(eventUrl);
    if (!current.label && row.eventLabel?.value) current.label = row.eventLabel.value;
    if (!current.description && row.eventDescription?.value) current.description = row.eventDescription.value;
    if (!current.url && row.article?.value) current.url = row.article.value;

    if (countryQid) {
      const directCountry = row.countryEntity?.value;
      const placeCountry = row.placeCountry?.value;
      if (directCountry === countryQid || placeCountry === countryQid) {
        current.countryMatch = true;
      }
    }
  }

  const candidates = Array.from(map.values())
    .map((entry) => {
      const corpus = normalizeText(`${entry.label} ${entry.description}`);
      if (!entry.label || !entry.url || !entry.url.includes('wikipedia.org')) return null;
      if (!corpus) return null;
      if (includesAny(corpus, BLOCKED_TERMS)) return null;
      if (includesAny(corpus, META_REJECT_TERMS)) return null;
      if (includesAny(corpus, SPORTS_REJECT_TERMS)) return null;
      if (includesAny(corpus, OVERVIEW_REJECT_TERMS)) return null;
      if (includesAny(corpus, STRICT_REJECT_TERMS)) return null;

      const hasPublicSignal = includesAny(corpus, STRICT_PUBLIC_TERMS);
      const hasImpactSignal = includesAny(corpus, STRICT_IMPACT_TERMS);
      const hasActionSignal = includesAny(corpus, ACTIONABLE_TERMS);
      if (!hasPublicSignal && !hasImpactSignal && !hasActionSignal) return null;

      let score = 0;
      if (entry.countryMatch) score += 6;
      if (entry.description) score += 2;
      if (hasPublicSignal) score += 4;
      if (hasImpactSignal) score += 2;
      if (hasActionSignal) score += 3;
      if (entry.label.length > 10 && entry.label.length < 110) score += 1;

      return {
        label: entry.label,
        description: entry.description,
        url: entry.url,
        countryMatch: entry.countryMatch,
        score
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);

  const unique = [];
  const seen = new Set();

  for (const entry of candidates) {
    const key = normalizeText(entry.label);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(entry);
    if (unique.length >= 5) break;
  }

  return unique;
}

function mentionsOtherYear(text, allowedYear) {
  const matches = String(text || '').match(/\b(1[0-9]{3}|20[0-9]{2})\b/g) || [];
  return matches.some((match) => Number(match) !== allowedYear);
}

function validateStrictSceneText(narrative, year) {
  const text = normalizeNarrativeText(narrative);
  const words = wordCount(text);
  if (words < 50 || words > 80) return false;
  if (sentenceCount(text) > 4) return false;
  if (!/\btu\b/i.test(text)) return false;
  if (includesAny(normalizeText(text), SCENE_FORBIDDEN_TERMS_STRICT)) return false;
  if (mentionsOtherYear(text, year)) return false;
  return true;
}

function validateStrictFactText(fact) {
  return wordCount(fact) <= 18;
}

function buildCuratedFallbackStrictSlots(year, events) {
  return events.slice(0, 3).map((event, index) => {
    const slot = index + 1;
    const narrative = normalizeNarrativeText(String(event.fallbackNarrative || '').replaceAll('{year}', String(year)));
    const fact = normalizeNarrativeText(event.fallbackFact || '');
    return {
      slot,
      narrative,
      fact,
      url: event.url
    };
  });
}

async function generateStrictYearScenesWithAI({ year, country, lang, events }) {
  if (!AI_ENABLED || !process.env.OPENAI_API_KEY || lang !== 'fr') {
    return null;
  }

  const systemPrompt = [
    'Tu produis 3 scenes immersives strictement ancrees dans une annee donnee.',
    'Ne rien inventer. Utiliser uniquement les faits fournis.',
    'Retourne UNIQUEMENT du JSON: {"items":[{"index":1,"narrative":"...","fact":"..."}]}',
    'Chaque narrative: 4 phrases max, 50 a 80 mots, present, 2e personne.',
    'Interdits: objet, chose, phenomene, evenement, innovation, dispositif, quelque chose, systeme, appareil, geste.',
    'La scene contient un element concret nomme, une reaction humaine, une perception sensorielle, une consequence immediate.',
    'Aucune mention d une autre annee.',
    'Chaque fact <= 18 mots.'
  ].join(' ');

  const payload = {
    year,
    country,
    lang,
    events: events.map((event, index) => ({
      index: index + 1,
      label: event.label,
      description: event.description,
      url: event.url
    }))
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch(OPENAI_ENDPOINT, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: JSON.stringify(payload) }
        ]
      })
    });

    if (!response.ok) return null;

    const data = await response.json();
    const rawJson = extractJsonFromModelContent(data?.choices?.[0]?.message?.content);
    if (!rawJson) return null;

    const parsed = JSON.parse(rawJson);
    const items = Array.isArray(parsed?.items) ? parsed.items : [];
    const byIndex = new Map();

    for (const item of items) {
      const index = Number(item?.index);
      const narrative = normalizeNarrativeText(item?.narrative || '');
      const fact = normalizeNarrativeText(item?.fact || '');
      if (!Number.isInteger(index) || index < 1 || index > 3) continue;
      if (!validateStrictSceneText(narrative, year)) continue;
      if (!validateStrictFactText(fact)) continue;
      byIndex.set(index, { narrative, fact });
    }

    if (byIndex.size < 3) return null;
    return byIndex;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function buildStrictYearSlots({ year, country, lang, scope }) {
  if (scope !== 'global' || lang !== 'fr') {
    return [];
  }

  const curated = FR_CURATED_YEAR_EVENTS[year];
  if (country === 'FR' && Array.isArray(curated) && curated.length >= 3) {
    const selected = curated.slice(0, 3);
    const aiScenes = await generateStrictYearScenesWithAI({
      year,
      country,
      lang,
      events: selected
    });

    if (!aiScenes) {
      return buildCuratedFallbackStrictSlots(year, selected);
    }

    return selected.map((event, index) => {
      const slot = index + 1;
      const scene = aiScenes.get(slot);
      return {
        slot,
        narrative: scene.narrative,
        fact: scene.fact,
        url: event.url
      };
    });
  }

  const bindings = await queryWikidata(year, lang);
  const events = parseStrictYearEvents(bindings, country);
  if (events.length < 3) {
    return [];
  }

  const selected = events.slice(0, 3);
  const aiScenes = await generateStrictYearScenesWithAI({
    year,
    country,
    lang,
    events: selected
  });

  if (!aiScenes) {
    return [];
  }

  return selected.map((event, index) => {
    const slot = index + 1;
    const scene = aiScenes.get(slot);
    return {
      slot,
      narrative: scene.narrative,
      fact: scene.fact,
      url: event.url
    };
  });
}

function isInYearRange(candidate, year) {
  const minYear = Number.isInteger(candidate.minYear) ? candidate.minYear : -Infinity;
  const maxYear = Number.isInteger(candidate.maxYear) ? candidate.maxYear : Infinity;
  return year >= minYear && year <= maxYear;
}

function pickConcreteSceneFr(event, year) {
  const corpus = event.corpus || '';
  const inRange = CONCRETE_SCENES_FR.filter((candidate) => isInYearRange(candidate, year));

  for (const candidate of inRange) {
    if (includesAny(corpus, candidate.terms)) {
      return candidate;
    }
  }

  if (inRange.length) {
    const seed = hashString(`${year}|${corpus}|scene`);
    return inRange[seed % inRange.length];
  }

  return CONCRETE_SCENES_FR[0];
}

function hasForbiddenSceneWordsFr(text) {
  return includesAny(normalizeText(text), FORBIDDEN_SCENE_TERMS_FR);
}

function validateSceneFr(text) {
  const normalized = normalizeText(text);
  const hasConcreteObject = CONCRETE_SCENES_FR.some((candidate) => normalized.includes(normalizeText(candidate.object)));
  const hasAction = includesAny(normalized, ACTION_VERBS_FR);
  const hasTransformation = normalized.includes('devient');
  return hasConcreteObject && hasAction && hasTransformation && !hasForbiddenSceneWordsFr(text);
}

function buildFallbackEvents(lang, year, country, scope) {
  if (lang !== 'fr') {
    return [];
  }

  const seedKey = `${year}|${country}|${lang}|${scope}|fallback`;
  const inRange = FALLBACK_EVENTS_FR.filter((entry) => isInYearRange(entry, year));
  if (!inRange.length) {
    return [];
  }
  return shuffleWithSeed(inRange, seedKey);
}

function applyTemplateYear(lines, year) {
  return lines.map((line) => line.replaceAll('{year}', String(year)));
}

function pickCapabilityPool(scope, country) {
  let pool = CAPABILITY_TIMELINE.filter((entry) => entry.scope === scope);
  if (!pool.length) {
    pool = CAPABILITY_TIMELINE.filter((entry) => entry.scope === 'global');
  }

  const countryFiltered = pool.filter((entry) => {
    if (!Array.isArray(entry.countries) || !entry.countries.length) {
      return true;
    }
    return entry.countries.includes(country);
  });

  if (countryFiltered.length) {
    if (scope === 'local' && countryFiltered.length < 3) {
      return CAPABILITY_TIMELINE.filter((entry) => entry.scope === 'global');
    }
    return countryFiltered;
  }

  return CAPABILITY_TIMELINE.filter((entry) => entry.scope === 'global');
}

function getCapabilityPivotYear(capability) {
  if (Number.isInteger(capability.sinceYear)) return capability.sinceYear;
  if (Number.isInteger(capability.untilYear)) return capability.untilYear;
  if (Number.isInteger(capability.techYear)) return capability.techYear;
  return null;
}

function getSinceYearForCountry(capability, country) {
  const override = capability?.sinceYearByCountry?.[country];
  if (Number.isInteger(override)) return override;
  return capability.sinceYear;
}

function evaluateCapabilityState(capability, year, country) {
  if (Number.isInteger(capability.techYear) && year < capability.techYear) {
    return { possible: false, mode: 'pre-tech', pivotYear: capability.techYear };
  }

  const sinceYear = getSinceYearForCountry(capability, country);
  if (Number.isInteger(sinceYear)) {
    return {
      possible: year >= sinceYear,
      mode: year >= sinceYear ? 'possible' : 'impossible',
      pivotYear: sinceYear
    };
  }

  if (Number.isInteger(capability.untilYear)) {
    return {
      possible: year <= capability.untilYear,
      mode: year <= capability.untilYear ? 'possible' : 'impossible',
      pivotYear: capability.untilYear
    };
  }

  return { possible: false, mode: 'impossible', pivotYear: year };
}

function pickCapabilityForSlot({ year, lang, country, scope, slot }) {
  const pool = pickCapabilityPool(scope, country);
  const ordered = [...pool].sort((a, b) => {
    const pivotA = getCapabilityPivotYear(a) ?? year;
    const pivotB = getCapabilityPivotYear(b) ?? year;
    const distA = Math.abs(year - pivotA);
    const distB = Math.abs(year - pivotB);

    if (distA !== distB) return distA - distB;

    const hashA = hashString(`${year}|${country}|${lang}|${scope}|${a.id}`);
    const hashB = hashString(`${year}|${country}|${lang}|${scope}|${b.id}`);
    return hashA - hashB;
  });

  return ordered[(slot - 1) % ordered.length];
}

function buildTimeAnchorFr(state, year) {
  const pivot = state.pivotYear;
  const delta = year - pivot;

  if (state.mode === 'pre-tech') {
    const yearsLeft = Math.max(1, pivot - year);
    return `Repere ${pivot}, encore ${yearsLeft} ans plus tard.`;
  }

  if (state.possible) {
    const yearsSince = Math.max(0, delta);
    if (yearsSince <= 2) return `Le basculement est tout recent: ${pivot}.`;
    if (yearsSince <= 10) return `Le basculement date de ${pivot}, c est encore proche.`;
    return `Le basculement remonte a ${pivot}, deja installe.`;
  }

  const yearsLeft = Math.max(1, pivot - year);
  if (yearsLeft <= 2) return `Le basculement arrive en ${pivot}, c est imminent.`;
  if (yearsLeft <= 10) return `Le basculement n arrive qu en ${pivot}, encore ${yearsLeft} ans.`;
  return `Le basculement reste loin: ${pivot}, encore ${yearsLeft} ans.`;
}

function getCapabilityLinesForState(capability, state) {
  if (state.mode === 'pre-tech') {
    return capability.preTechFr || capability.impossibleFr;
  }
  return state.possible ? capability.possibleFr : capability.impossibleFr;
}

function buildNarrativeFromCapability({ year, lang, capability, state }) {
  if (lang !== 'fr') {
    const status = state.possible ? 'you can already do this' : 'you still cannot do this';
    return `In ${year}, you notice a daily routine changing in plain sight. People adapt immediately around you. A concrete rule shifts what is allowed in normal life. You understand one thing: ${status}.`;
  }

  const sourceLines = getCapabilityLinesForState(capability, state);
  const lines = applyTemplateYear(sourceLines, year);
  return truncateWords(lines.join(' '), 80);
}

function buildCapabilityFact(lang, capability, state, year) {
  if (lang !== 'fr') {
    const status = state.possible ? 'Possible' : 'Not possible';
    return truncateWords(`${status} around ${state.pivotYear}: ${capability.id}`, 20);
  }

  return truncateWords(capability.factActionFr, 20);
}

function buildSlotPlans({ year, lang, country, scope }) {
  return Array.from({ length: MAX_SLOT }, (_, index) => {
    const slot = index + 1;
    const capability = pickCapabilityForSlot({ year, lang, country, scope, slot });
    const state = evaluateCapabilityState(capability, year, country);
    return { slot, capability, state };
  });
}

function buildSlotsFromPlans({ year, lang, plans }) {
  return plans.map((plan) => {
    const { slot, capability, state } = plan;
    return {
      slot,
      narrative: buildNarrativeFromCapability({ year, lang, capability, state }),
      fact: buildCapabilityFact(lang, capability, state, year),
      url: capability.url
    };
  });
}

function wordCount(text) {
  return String(text || '').trim().split(/\s+/).filter(Boolean).length;
}

function sentenceCount(text) {
  return String(text || '')
    .split(/[.!?]+/)
    .map((part) => part.trim())
    .filter(Boolean).length;
}

function extractJsonFromModelContent(content) {
  const raw = String(content || '').trim();
  if (!raw) return null;
  if (raw.startsWith('{') || raw.startsWith('[')) return raw;

  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start >= 0 && end > start) {
    return raw.slice(start, end + 1);
  }
  return null;
}

function normalizeNarrativeText(text) {
  return String(text || '')
    .replace(/\b[Tt]u comprends\s*:\s*/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s([,.!?;:])/g, '$1')
    .trim();
}

function validateAiNarrative({ lang, narrative, state, capability }) {
  if (typeof narrative !== 'string') return false;
  const normalized = normalizeNarrativeText(narrative);
  const words = wordCount(normalized);
  if (words < 40 || words > 95) return false;
  if (sentenceCount(normalized) !== 4) return false;

  if (lang === 'fr') {
    const lowered = normalizeText(normalized);
    if (!/\btu\b/.test(lowered)) return false;
    if (lowered.includes('tu comprends')) return false;
    if (lowered.includes('on pouvait') || lowered.includes('on ne pouvait pas')) return false;
    if (lowered.includes('imposer') || lowered.includes('obliger')) return false;
    if (hasForbiddenSceneWordsFr(normalized)) return false;
    if (capability?.id === 'seatbelt-front') {
      if (lowered.includes('tout le monde clique')) return false;
      if (lowered.includes('places du fond')) return false;
      if (/\barriere\b/.test(lowered)) return false;
    }
  }

  return true;
}

async function generateNarrativesWithAI({ year, lang, country, scope, plans }) {
  if (!AI_ENABLED || !process.env.OPENAI_API_KEY) {
    return null;
  }

  const systemPrompt = lang === 'fr'
    ? [
        'Tu ecris des micro-scenes immersives pour une application temporelle.',
        'Retourne UNIQUEMENT du JSON valide: {"slots":[{"slot":1,"narrative":"..."}]}',
        'Chaque narrative suit strictement: 4 phrases, 45 a 70 mots, present de narration, deuxieme personne "tu".',
        'Chaque scene contient au moins un objet concret nomme et une action observable.',
        'Derniere phrase reste perceptive, concrete et neutre, sans jugement historique.',
        'Interdits dans la narration: "on pouvait", "on ne pouvait pas", "imposer", "obliger".',
        'N utilise jamais la formule "Tu comprends:".',
        'Si le sujet concerne la ceinture avant, ne parle jamais des places arriere ou de "tout le monde clique".',
        'Mots interdits: objet, chose, geste, evenement, phenomene, quelque chose, quelqu un, appareil, dispositif, innovation.'
      ].join(' ')
    : 'Write immersive micro-scenes. Return JSON only: {"slots":[{"slot":1,"narrative":"..."}]} with exactly 4 sentences each.';

  const payload = {
    year,
    lang,
    country,
    scope,
    slots: plans.map((plan) => ({
      slot: plan.slot,
      capabilityId: plan.capability.id,
      possible: plan.state.possible,
      mode: plan.state.mode,
      pivotYear: plan.state.pivotYear,
      factAction: plan.capability.factActionFr,
      referenceUrl: plan.capability.url,
      templateHint: buildNarrativeFromCapability({
        year,
        lang,
        capability: plan.capability,
        state: plan.state
      })
    }))
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch(OPENAI_ENDPOINT, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        temperature: 0.4,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: JSON.stringify(payload) }
        ]
      })
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    const rawJson = extractJsonFromModelContent(content);
    if (!rawJson) return null;

    const parsed = JSON.parse(rawJson);
    const items = Array.isArray(parsed?.slots) ? parsed.slots : [];
    const bySlot = new Map();

    for (const item of items) {
      const slot = Number(item?.slot);
      const narrative = normalizeNarrativeText(item?.narrative || '');
      const plan = plans.find((entry) => entry.slot === slot);
      if (!plan) continue;
      if (!validateAiNarrative({ lang, narrative, state: plan.state, capability: plan.capability })) continue;
      bySlot.set(slot, narrative);
    }

    return bySlot;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function buildSlots({ year, lang, country, scope }) {
  const plans = buildSlotPlans({ year, lang, country, scope });
  let slots = buildSlotsFromPlans({ year, lang, plans });

  const strictYearSlots = await buildStrictYearSlots({ year, country, lang, scope });
  const protectedSlots = new Set();

  if (strictYearSlots.length >= 3) {
    const strictBySlot = new Map(strictYearSlots.map((entry) => [entry.slot, entry]));
    slots = slots.map((slotEntry) => strictBySlot.get(slotEntry.slot) || slotEntry);
    for (const item of strictYearSlots) {
      protectedSlots.add(item.slot);
    }
  }

  const aiNarratives = await generateNarrativesWithAI({ year, lang, country, scope, plans });

  if (!aiNarratives || !aiNarratives.size) {
    return slots;
  }

  return slots.map((slotEntry) => {
    if (protectedSlots.has(slotEntry.slot)) {
      return slotEntry;
    }

    const aiNarrative = aiNarratives.get(slotEntry.slot);
    if (!aiNarrative) {
      return slotEntry;
    }

    return {
      ...slotEntry,
      narrative: aiNarrative
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

  const slotEntry = payload.slots.find((entry) => entry && entry.slot === slot) || null;
  if (!slotEntry) {
    return null;
  }

  return {
    ...slotEntry,
    narrative: normalizeNarrativeText(slotEntry.narrative || ''),
    fact: normalizeNarrativeText(slotEntry.fact || '')
  };
}

async function warmup(year, lang, country, scope) {
  const slots = await buildSlots({ year, lang, country, scope });

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
  const requestedCountry = safeCountry(query.country);
  const country = FRANCE_ONLY_MODE ? 'FR' : requestedCountry;
  const scope = safeScope(query.scope);

  if (!year || !slot) {
    return jsonResponse(400, { error: 'Invalid parameters. Expected year and slot.' });
  }

  const cacheKey = getCacheKey({ year, lang, country, scope });
  const client = createPrismaClient();

  if (!client) {
    try {
      const payload = await warmup(year, lang, country, scope);
      const slotData = getSlotFromPayload(payload, slot);
      if (!slotData) {
        return jsonResponse(404, { error: 'Slot not found after warmup.' });
      }
      return jsonResponse(200, slotData);
    } catch {
      return jsonResponse(500, { error: 'DATABASE_URL is missing and local fallback failed.' });
    }
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
