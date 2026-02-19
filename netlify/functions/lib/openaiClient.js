const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

function safeJson(content) {
  const text = String(content || '').trim();
  if (!text) return null;
  if (text.startsWith('{')) return text;

  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();

  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start >= 0 && end > start) return text.slice(start, end + 1);

  return null;
}

export async function generateWithOpenAI({ year, candidate, lang = 'fr' }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is missing');
  }

  const model = process.env.OPENAI_MODEL || 'gpt-4o';

  const system = [
    'Tu ecris une scene AvantMoi immersive et concrete.',
    'Format strict: 4 phrases max, 50 a 80 mots, present de narration, 2e personne.',
    'Utilise l orthographe francaise correcte avec accents.',
    'Interdits dans la scene: objet, chose, evenement, phenomene, dispositif, innovation, quelque chose, systeme, appareil, geste.',
    'N utilise jamais la formule "Tu comprends:".',
    'Pas d analyse historique. Pas d autre annee mentionnee.',
    'Retourne uniquement du JSON {"scene":"...","fact":"...","sourceUrl":"..."}.'
  ].join(' ');

  const user = {
    year,
    country: 'France',
    lang,
    candidate: {
      title: candidate.title,
      description: candidate.description,
      date: candidate.date,
      place: candidate.place,
      sourceUrl: candidate.sourceUrl,
      eventQid: candidate.eventQid
    },
    rules: {
      maxSentences: 4,
      minWords: 50,
      maxWords: 80,
      factMaxWords: 25
    }
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch(OPENAI_ENDPOINT, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        temperature: 0.25,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: JSON.stringify(user) }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI error ${response.status}`);
    }

    const data = await response.json();
    const raw = safeJson(data?.choices?.[0]?.message?.content);
    if (!raw) {
      throw new Error('OpenAI returned empty content');
    }

    const parsed = JSON.parse(raw);
    return {
      scene: String(parsed.scene || '').trim(),
      fact: String(parsed.fact || '').trim(),
      sourceUrl: String(parsed.sourceUrl || candidate.sourceUrl || '').trim()
    };
  } finally {
    clearTimeout(timeout);
  }
}
