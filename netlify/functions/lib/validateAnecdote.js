const FORBIDDEN_WORDS = [
  'objet', 'chose', 'evenement', 'phenomene', 'dispositif',
  'innovation', 'quelque chose', 'systeme', 'appareil', 'geste'
];

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function countWords(text) {
  return String(text || '').trim().split(/\s+/).filter(Boolean).length;
}

function countSentences(text) {
  return String(text || '')
    .split(/[.!?]+/)
    .map((part) => part.trim())
    .filter(Boolean).length;
}

export function validateAnecdote({ scene, fact, sourceUrl, year }) {
  if (!scene || !fact || !sourceUrl) return { ok: false, reason: 'missing_fields' };

  const sceneText = String(scene).trim();
  const factText = String(fact).trim();
  const sceneNorm = normalize(sceneText);

  const years = sceneText.match(/\b(18|19|20)\d{2}\b/g) || [];
  const hasOtherYear = years.some((entry) => Number(entry) !== Number(year));
  if (hasOtherYear) return { ok: false, reason: 'other_year_mentioned' };

  if (FORBIDDEN_WORDS.some((word) => sceneNorm.includes(word))) {
    return { ok: false, reason: 'forbidden_word' };
  }

  if (sceneNorm.includes('tu comprends')) {
    return { ok: false, reason: 'moralizing_tone' };
  }

  const wc = countWords(sceneText);
  if (wc < 50 || wc > 80) return { ok: false, reason: 'word_count' };

  const sentenceCount = countSentences(sceneText);
  if (sentenceCount > 4) return { ok: false, reason: 'sentence_count' };

  if (countWords(factText) > 25) return { ok: false, reason: 'fact_too_long' };

  if (!/^https?:\/\//.test(sourceUrl)) return { ok: false, reason: 'bad_source_url' };

  return { ok: true };
}
