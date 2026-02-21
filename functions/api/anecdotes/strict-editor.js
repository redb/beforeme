import { getPrismaClient } from '../../lib/prisma.js';
import { getWikiLead } from '../../lib/wiki-lead.js';

const MODEL_NAME = 'gpt-4.1-mini';
const MAX_ITEMS = 20;
const CACHE_LANG_PREFIX = 'strict-editor:v2:';
const DISABLE_STRICT_EDITOR_CACHE = true;

const BANNED_WORDS = [
  'chose', 'phénomène', 'phenomene', 'dispositif', 'innovation', 'quelque chose', 'atmosphère', 'atmosphere',
  'symbole', 'tension', 'espoir', 'événement', 'evenement', 'situation', 'transformation', 'révolution',
  'revolution', 'contexte', 'ambiance', 'impact', 'progrès', 'progres', 'évolution', 'evolution', 'société',
  'societe', 'modernité', 'modernite', 'système', 'systeme', 'dynamique', 'processus'
];

const BANNED_PATTERNS = [
  'apparaît devant toi',
  'apparait devant toi',
  'coupe le passage',
  'un bruit sec part du trottoir',
  'ce geste devient la norme'
];

function responseHeaders() {
  return {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}

function json(status, payload) {
  return new Response(JSON.stringify(payload), { status, headers: responseHeaders() });
}

function log(level, message, context = {}) {
  const payload = { level, message, ts: new Date().toISOString(), ...context };
  if (level === 'error') console.error(JSON.stringify(payload));
  else console.log(JSON.stringify(payload));
}

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

function sentenceCount(text) {
  return String(text || '')
    .split(/[.!?]/)
    .map((part) => part.trim())
    .filter(Boolean).length;
}

function countWords(text) {
  return String(text || '').trim().split(/\s+/).filter(Boolean).length;
}

function hasConcreteElement(text) {
  return /(paves|pavés|banderole|badge|ticket|raquette|tribune|panneau|vitrine|tele|télé|camera|caméra|guichet|barricade|flamme|affiche|micro|casque|journal|rideau)/i.test(text);
}

function hasHumanAction(text) {
  return /(lit|lisent|cour|court|courent|applaudit|applaudissent|compose|composent|colle|collent|ferme|ferment|pointe|pointent|crie|crient|avance|avancent|ouvre|ouvrent|regarde|regardent|arrache|arrachent)/i.test(text);
}

function hasSensoryDetail(text) {
  return /(bruit|odeur|lumiere|lumière|froid|poussiere|poussière|fumee|fumée|cris|vibration|metal|métal|claquement)/i.test(text);
}

function hasImmediateConsequence(text) {
  return /(tout de suite|immédiatement|immediatement|dans la minute|d'un coup|aussitôt|aussitot|tu dois|tu ne peux plus|la file change|la rue se vide)/i.test(text);
}

function validateSceneStrict(scene) {
  const s = String(scene || '').trim();
  if (!s) return { ok: false, reason: 'scene_empty' };
  const words = countWords(s);
  const sentences = sentenceCount(s);
  if (sentences < 3 || sentences > 4) return { ok: false, reason: 'scene_sentence_count' };
  if (words < 50 || words > 90) return { ok: false, reason: 'scene_word_count' };
  if (!/\btu\b/i.test(s)) return { ok: false, reason: 'scene_missing_second_person' };
  if (!hasConcreteElement(s)) return { ok: false, reason: 'scene_missing_concrete_element' };
  if (!hasHumanAction(s)) return { ok: false, reason: 'scene_missing_human_action' };
  if (!hasSensoryDetail(s)) return { ok: false, reason: 'scene_missing_sensory_detail' };
  if (!hasImmediateConsequence(s)) return { ok: false, reason: 'scene_missing_immediate_consequence' };

  const lowered = normalizeText(s);
  for (const word of BANNED_WORDS) {
    if (lowered.includes(normalizeText(word))) return { ok: false, reason: `scene_banned_word:${word}` };
  }
  for (const pattern of BANNED_PATTERNS) {
    if (lowered.includes(normalizeText(pattern))) return { ok: false, reason: `scene_banned_pattern:${pattern}` };
  }
  return { ok: true };
}

function validateFactStrict(fact) {
  const f = String(fact || '').trim();
  if (!f) return { ok: false, reason: 'fact_empty' };
  if (sentenceCount(f) > 1) return { ok: false, reason: 'fact_sentence_count' };
  if (countWords(f) > 28) return { ok: false, reason: 'fact_too_long' };
  if (!/\d{4}|janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre|1968/i.test(f)) {
    return { ok: false, reason: 'fact_missing_date_or_period' };
  }
  return { ok: true };
}

function extractDateOrPeriod(lead, fallbackYear) {
  const text = String(lead || '');
  const fullDate = text.match(/\b\d{1,2}\s+(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+1968\b/i);
  if (fullDate) return fullDate[0];
  const monthYear = text.match(/\b(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+1968\b/i);
  if (monthYear) return monthYear[0];
  return `1968`;
}

function extractPlace(lead) {
  const text = String(lead || '');
  const placeMatch = text.match(/\b(Paris|Lyon|Marseille|Grenoble|Cannes|Nanterre|Strasbourg|Bordeaux|Toulouse|Nantes|Nice|Lille)\b/);
  return placeMatch ? placeMatch[1] : 'Paris';
}

function buildFallbackSceneFromLead({ title, wikiLead }) {
  const whenText = extractDateOrPeriod(wikiLead, 1968);
  const placeText = extractPlace(wikiLead);
  const concrete = /festival|cannes/i.test(title) ? 'une affiche pliée' : 'une banderole froissée';
  const action = /festival|cannes/i.test(title) ? 'des passants lisent le programme' : 'des étudiants collent des tracts';
  const sensory = /fumée|gaz|lacrymogène/i.test(wikiLead) ? 'Une odeur de fumée pique la gorge.' : 'Le bruit des slogans rebondit contre les vitrines.';

  return `${whenText}, ${placeText} : tu tiens ${concrete} pendant que ${action} devant toi. `
    + `Un agent pointe la rue, la foule recule puis revient en courant vers le carrefour. `
    + `${sensory} `
    + `Pour avancer, tu dois changer d’itinéraire immédiatement et contourner le bloc suivant.`;
}

function buildFallbackFactFromLead({ wikiLead, title }) {
  const firstSentence = String(wikiLead || '').split(/(?<=[.!?])\s+/)[0]?.trim() || '';
  if (firstSentence && /1968|janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre/i.test(firstSentence)) {
    const compact = firstSentence.replace(/\s+/g, ' ').trim().split(' ').slice(0, 24).join(' ');
    return compact.endsWith('.') ? compact : `${compact}.`;
  }
  const whenText = extractDateOrPeriod(wikiLead, 1968);
  return `${title} se déroule en ${whenText} en France selon la source Wikipédia.`;
}

async function mapWithConcurrency(items, concurrency, worker) {
  const results = new Array(items.length);
  let cursor = 0;

  async function runOne() {
    while (true) {
      const index = cursor;
      cursor += 1;
      if (index >= items.length) return;
      results[index] = await worker(items[index], index);
    }
  }

  const runners = Array.from({ length: Math.max(1, Math.min(concurrency, 3)) }, () => runOne());
  await Promise.all(runners);
  return results;
}

async function rewriteWithModel({ item, wikiLead, year, country, env }) {
  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is missing');

  const prompt = [
    'Tu es l’éditeur strict d’avantmoi.com.',
    'Réécris JSON avec EXACTEMENT les clés scene et fact.',
    'Règles: scène 3-4 phrases, 50-90 mots, 2e personne, présent, France, année 1968 uniquement.',
    'Inclure: 1 élément concret, 1 action humaine, 1 détail sensoriel, 1 conséquence immédiate.',
    'Interdire les formulations génériques et mots vagues.',
    'Fact: 1 phrase vérifiable issue du lead.',
    `Year: ${year}`,
    `Country: ${country}`,
    `Title: ${item.title}`,
    `Source: ${item.sourceUrl}`,
    `WikiLead: ${wikiLead}`
  ].join('\n');

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: String(env.OPENAI_MODEL || MODEL_NAME),
      input: prompt,
      max_output_tokens: 350,
      text: {
        format: {
          type: 'json_schema',
          name: 'strict_editor_output',
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              scene: { type: 'string' },
              fact: { type: 'string' }
            },
            required: ['scene', 'fact']
          }
        }
      }
    })
  });

  if (!response.ok) {
    throw new Error(`openai_http_${response.status}`);
  }
  const payload = await response.json();
  let output = payload?.output_parsed || null;

  if (!output || typeof output !== 'object') {
    const outputText = String(payload?.output_text || '').trim();
    if (outputText) {
      try {
        output = JSON.parse(outputText);
      } catch {
        const sceneMatch = outputText.match(/scene\s*[:=]\s*(.+)/i);
        const factMatch = outputText.match(/fact\s*[:=]\s*(.+)/i);
        output = {
          scene: sceneMatch ? sceneMatch[1].trim() : '',
          fact: factMatch ? factMatch[1].trim() : ''
        };
      }
    }
  }

  const scene = String(output?.scene || '').trim();
  const fact = String(output?.fact || '').trim();
  if (scene && fact) return { scene, fact };

  return {
    scene: buildFallbackSceneFromLead({ title: item.title, wikiLead }),
    fact: buildFallbackFactFromLead({ wikiLead, title: item.title })
  };
}

function sanitizeInputItems(rawItems) {
  return (Array.isArray(rawItems) ? rawItems : []).map((item) => ({
    uniqueEventId: String(item?.uniqueEventId || '').trim(),
    eventQid: String(item?.eventQid || '').trim(),
    title: String(item?.title || '').trim(),
    sourceUrl: String(item?.sourceUrl || '').trim()
  }));
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: responseHeaders() });
}

export async function onRequestPost(context) {
  const requestId = crypto.randomUUID();
  let payload;
  try {
    payload = await context.request.json();
  } catch {
    return json(400, { error: 'invalid_json_body', requestId });
  }

  const year = Number(payload?.year);
  const country = String(payload?.country || '').toUpperCase();
  const inputItems = sanitizeInputItems(payload?.items);
  if (!Number.isInteger(year) || country !== 'FR' || inputItems.length === 0) {
    return json(400, { error: 'invalid_payload', requestId });
  }

  const client = getPrismaClient(context.env);
  const rejected = [];
  const outputItems = [];
  const start = Date.now();

  const enriched = await mapWithConcurrency(inputItems, 3, async (item) => {
    const wikiLead = await getWikiLead(item.sourceUrl);
    if (!wikiLead) {
      return { ...item, wikiLead: '', invalidReason: 'missing_wikiLead' };
    }
    return { ...item, wikiLead };
  });

  for (const item of enriched) {
    if (outputItems.length >= MAX_ITEMS) break;
    if (!item.wikiLead) {
      rejected.push({
        uniqueEventId: item.uniqueEventId,
        eventQid: item.eventQid,
        title: item.title,
        reason: item.invalidReason || 'missing_wikiLead'
      });
      continue;
    }

    const cacheLang = `${CACHE_LANG_PREFIX}${item.uniqueEventId}`;
    if (!DISABLE_STRICT_EDITOR_CACHE) {
      const cached = await client.eventCache.findUnique({
        where: {
          year_country_lang_eventQid: {
            year,
            country,
            lang: cacheLang,
            eventQid: item.eventQid
          }
        },
        select: {
          title: true,
          scene: true,
          fact: true,
          sourceUrl: true
        }
      });

      if (cached?.scene && cached?.fact) {
        outputItems.push({
          uniqueEventId: item.uniqueEventId,
          eventQid: item.eventQid,
          title: cached.title,
          scene: cached.scene,
          fact: cached.fact,
          sourceUrl: cached.sourceUrl
        });
        continue;
      }
    }

    try {
      const rewritten = await rewriteWithModel({
        item,
        wikiLead: item.wikiLead,
        year,
        country,
        env: context.env
      });

      const sceneCheck = validateSceneStrict(rewritten.scene);
      if (!sceneCheck.ok) {
        rejected.push({
          uniqueEventId: item.uniqueEventId,
          eventQid: item.eventQid,
          title: item.title,
          reason: sceneCheck.reason
        });
        continue;
      }

      let fact = rewritten.fact;
      let factCheck = validateFactStrict(fact);
      if (!factCheck.ok) {
        fact = buildFallbackFactFromLead({ wikiLead: item.wikiLead, title: item.title });
        factCheck = validateFactStrict(fact);
      }
      if (!factCheck.ok) {
        rejected.push({
          uniqueEventId: item.uniqueEventId,
          eventQid: item.eventQid,
          title: item.title,
          reason: factCheck.reason
        });
        continue;
      }

      if (!DISABLE_STRICT_EDITOR_CACHE) {
        await client.eventCache.upsert({
          where: {
            year_country_lang_eventQid: {
              year,
              country,
              lang: cacheLang,
              eventQid: item.eventQid
            }
          },
          create: {
            year,
            country,
            lang: cacheLang,
            eventQid: item.eventQid,
            title: item.title,
            scene: rewritten.scene,
            fact,
            sourceUrl: item.sourceUrl
          },
          update: {
            title: item.title,
            scene: rewritten.scene,
            fact,
            sourceUrl: item.sourceUrl
          }
        });
      }

      outputItems.push({
        uniqueEventId: item.uniqueEventId,
        eventQid: item.eventQid,
        title: item.title,
        scene: rewritten.scene,
        fact,
        sourceUrl: item.sourceUrl
      });
    } catch (error) {
      rejected.push({
        uniqueEventId: item.uniqueEventId,
        eventQid: item.eventQid,
        title: item.title,
        reason: error instanceof Error ? error.message : 'rewrite_failed'
      });
    }
  }

  const partial = outputItems.length < MAX_ITEMS;
  const responsePayload = {
    year,
    country,
    partial,
    items: outputItems.slice(0, MAX_ITEMS),
    rejected
  };

  log('info', 'strict_editor_completed', {
    requestId,
    year,
    country,
    count: responsePayload.items.length,
    rejected: responsePayload.rejected.length,
    partial,
    durationMs: Date.now() - start
  });

  return json(200, responsePayload);
}
