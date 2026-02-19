const REJECT_TERMS = [
  'liste', 'list of', 'category', 'conference', 'publication', 'article',
  'traite', 'treaty', 'loi', 'law', 'biographie', 'catalogue',
  'filmography list', 'wikimedia list article'
];

const POSITIVE_VISUAL_TERMS = [
  'inauguration', 'ouverture', 'manifestation', 'greve', 'defile',
  'jeux', 'stade', 'gare', 'metro', 'aeroport', 'exposition', 'ceremonie'
];

const POSITIVE_FIRST_TERMS = ['premiere', 'premier', 'lancement', 'debut'];

const NEGATIVE_TERMS = ['fondation', 'creation', 'brevet', 'decret', 'publication', 'liste', 'catalogue'];

const HIGHLIGHT_PLACES = ['paris', 'grenoble', 'marseille', 'lyon'];

const DIRECT_EXPERIENCE_TERMS = [
  'demonstration', 'demonstration publique', 'ouverture', 'inauguration', 'installation',
  'spectacle', 'projection', 'gare', 'metro', 'tram', 'aeroport', 'station',
  'transport', 'borne', 'cabine', 'guichet', 'exposition', 'salon', 'service public'
];

const ACTION_CHANGE_TERMS = [
  'utiliser', 'use', 'prendre', 'acheter', 'payer', 'telephoner', 'appeler', 'regarder',
  'ecouter', 'monter', 'descendre', 'ticket', 'billet', 'acces', 'accessible', 'immediat'
];

const ABSTRACT_REJECT_TERMS = [
  'fondation', 'creation entreprise', 'brevet', 'decret', 'loi', 'treaty',
  'convention', 'publication', 'article', 'catalogue', 'census', 'organisme', 'organization'
];

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function includesAny(haystack, terms) {
  return terms.some((term) => haystack.includes(normalize(term)));
}

export function filterAndScoreCandidates(candidates) {
  const filtered = [];

  for (const item of candidates) {
    const title = normalize(item.title);
    const description = normalize(item.description);
    const corpus = `${title} ${description}`.trim();

    if (!item.date || !item.place) continue;
    if (!item.eventQid) continue;
    if (includesAny(corpus, REJECT_TERMS)) continue;
    if (includesAny(corpus, ABSTRACT_REJECT_TERMS)) continue;

    const hasDirectExperience = includesAny(corpus, DIRECT_EXPERIENCE_TERMS);
    const hasActionChange = includesAny(corpus, ACTION_CHANGE_TERMS);
    if (!hasDirectExperience || !hasActionChange) continue;

    let score = 0;
    if (includesAny(corpus, POSITIVE_VISUAL_TERMS)) score += 30;
    if (includesAny(normalize(item.place), HIGHLIGHT_PLACES)) score += 20;
    if (includesAny(corpus, POSITIVE_FIRST_TERMS)) score += 20;
    if (includesAny(corpus, NEGATIVE_TERMS)) score -= 40;
    if (includesAny(corpus, ['publication', 'liste', 'catalogue'])) score -= 50;

    if (item.countryMatch) score += 10;
    if (item.sourceUrl?.includes('wikipedia.org')) score += 8;

    filtered.push({ ...item, score });
  }

  return filtered.sort((a, b) => b.score - a.score);
}
