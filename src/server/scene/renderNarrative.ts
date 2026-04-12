export type NarrativeStyle = "cinematic_v1";

type NarrativeInput = {
  lang: "fr" | "en";
  date: string;
  placeName: string;
  fact: string;
  beforeState: string;
  afterState: string;
  gestureChanged: string;
  materialAnchor: string;
};

type NarrativeRenderOptions = {
  apiKey?: string;
  model?: string;
};

type NarrativeGateResult =
  | { ok: true; flags: string[] }
  | { ok: false; code: string; flags: string[] };

export type NarrativeRenderResult = {
  text: string;
  style: NarrativeStyle;
  mode: "deterministic" | "ai";
  flags: string[];
};

const OPENAI_ENDPOINT = "https://api.openai.com/v1/responses";
const NARRATIVE_MAX_CHARS = 520;

const VAGUE_PHRASES = [
  "les usages",
  "les pratiques",
  "dans ce contexte",
  "sur place",
  "adaptation immediate",
  "adaptation immédiate",
  "de façon concrete",
  "de facon concrete",
  "marque une rupture"
];

const ACTION_VERBS = [
  "payer",
  "voter",
  "trier",
  "circuler",
  "telephoner",
  "acheter",
  "fumer",
  "entrer",
  "sortir",
  "presenter",
  "deposer",
  "publier",
  "projeter",
  "projection",
  "utiliser",
  "embarquer",
  "composter",
  "controler",
  "scanner",
  "montrer",
  "recevoir"
];

const ACTOR_STOPWORDS = new Set([
  "Le",
  "La",
  "Les",
  "Un",
  "Une",
  "Des",
  "Avant",
  "Apres",
  "Après",
  "Tu",
  "Du",
  "De",
  "Et",
  "Au",
  "Aux",
  "On",
  "From",
  "Before",
  "After",
  "You",
  "The",
  "A",
  "An",
  "In",
  "At",
  "Devant",
  "Janvier",
  "Fevrier",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Aout",
  "Septembre",
  "Octobre",
  "Novembre",
  "Decembre"
]);

function normalize(value: string): string {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanSentence(value: string): string {
  const text = String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;!?])/g, "$1")
    .replace(/([.?!]){2,}/g, "$1");
  if (!text) return "";
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

function stripAfterPrefix(value: string): string {
  return String(value || "")
    .trim()
    .replace(/^(apres|après|after)\s*:?\s*/i, "")
    .trim();
}

function simplifyGesture(value: string): string {
  return String(value || "")
    .trim()
    .replace(/^a partir de ce jour,\s*/i, "")
    .replace(/^a compter de ce jour,\s*/i, "")
    .replace(/^from this day on,\s*/i, "")
    .trim();
}

function escapeRegExp(value: string): string {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function capitalizeFirst(value: string): string {
  const text = String(value || "").trim();
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatDateLabel(isoDay: string, lang: "fr" | "en"): string {
  const m = String(isoDay || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return isoDay;
  const [, y, mo, d] = m;
  if (lang === "fr") {
    const months = [
      "janvier",
      "fevrier",
      "mars",
      "avril",
      "mai",
      "juin",
      "juillet",
      "aout",
      "septembre",
      "octobre",
      "novembre",
      "decembre"
    ];
    return `${Number(d)} ${months[Number(mo) - 1]} ${y}`;
  }
  return `${y}-${mo}-${d}`;
}

function containsVaguePhrase(text: string): boolean {
  const lower = normalize(text);
  return VAGUE_PHRASES.some((phrase) => lower.includes(normalize(phrase)));
}

function extractYears(value: string): Set<string> {
  const years = new Set<string>();
  const matches = String(value || "").match(/\b(1[6-9]\d{2}|20\d{2}|2100)\b/g) || [];
  for (const year of matches) years.add(year);
  return years;
}

function extractGestureTokens(value: string): string[] {
  const tokens = normalize(value)
    .split(/[^a-z0-9]+/)
    .map((token) => token.trim())
    .filter(Boolean);
  const strong = tokens.filter((token) => token.length >= 5);
  return [...new Set(strong)];
}

function hasActionVerbInText(value: string): boolean {
  const lower = normalize(value);
  return ACTION_VERBS.some((verb) => lower.includes(normalize(verb)));
}

function stripLeadingDate(value: string, date: string, lang: "fr" | "en"): string {
  const isoDate = String(date || "").trim();
  const humanDate = formatDateLabel(isoDate, lang);
  let text = String(value || "").trim();

  if (humanDate && lang === "fr") {
    text = text.replace(new RegExp(`^(le\\s+)?${escapeRegExp(humanDate)}\\s*[,:-]?\\s*`, "i"), "");
  } else if (humanDate) {
    text = text.replace(new RegExp(`^(on\\s+)?${escapeRegExp(humanDate)}\\s*[,:-]?\\s*`, "i"), "");
  }

  if (isoDate) {
    text = text.replace(new RegExp(`^${escapeRegExp(isoDate)}\\s*[,:-]?\\s*`, "i"), "");
  }
  if (/^\d{4}\s*[,:-]\s*/i.test(text)) {
    text = text.replace(/^\d{4}\s*[,:-]\s*/i, "");
  }
  return text.trim();
}

function stripLeadClauses(value: string): string {
  let text = String(value || "").trim();
  for (let index = 0; index < 2; index += 1) {
    const commaIndex = text.indexOf(",");
    if (commaIndex < 0) break;
    const head = text.slice(0, commaIndex).trim();
    const tail = text.slice(commaIndex + 1).trim();
    if (!tail || hasActionVerbInText(head)) break;
    text = tail;
  }
  return text.trim();
}

function compactNarrativeClause(
  value: string,
  input: Pick<NarrativeInput, "date" | "lang" | "placeName">
): string {
  let text = String(value || "").trim();
  if (!text) return "";
  text = stripLeadingDate(text, input.date, input.lang);
  if (input.placeName) {
    text = text.replace(new RegExp(`^${escapeRegExp(input.placeName)}\\s*[,:-]?\\s*`, "i"), "");
  }
  text = stripLeadClauses(text);
  text = text.replace(/\s+/g, " ").trim();
  text = text.replace(/^[,;:\-–—]\s*/, "");
  return capitalizeFirst(text);
}

function sentenceEquals(a: string, b: string): boolean {
  return normalize(a) === normalize(b);
}

function extractActorTokens(value: string): Set<string> {
  const out = new Set<string>();
  const matches = String(value || "").match(/\b[A-Z][A-Za-zÀ-ÿ-]{2,}\b/g) || [];
  for (const token of matches) {
    if (!ACTOR_STOPWORDS.has(token)) out.add(token);
  }
  return out;
}

function hasGestureSignal(narrative: string, gestureChanged: string): boolean {
  const narrativeNorm = normalize(narrative);
  const gestureNorm = normalize(gestureChanged);
  const verbMatch = ACTION_VERBS.some((verb) => {
    const v = normalize(verb);
    return gestureNorm.includes(v) && narrativeNorm.includes(v);
  });
  if (verbMatch) return true;
  const tokens = extractGestureTokens(gestureChanged);
  return tokens.some((token) => narrativeNorm.includes(token));
}

function validateNarrativeTextInternal(params: {
  text: string;
  input: NarrativeInput;
}): NarrativeGateResult {
  const flags: string[] = [];
  const text = String(params.text || "").trim();
  if (!text) return { ok: false, code: "narrative_empty", flags: ["rejected:narrative_empty"] };
  if (text.length > NARRATIVE_MAX_CHARS) {
    return { ok: false, code: "narrative_too_long", flags: ["rejected:narrative_too_long"] };
  }
  if (containsVaguePhrase(text)) {
    return { ok: false, code: "narrative_vague_language", flags: ["rejected:narrative_vague_language"] };
  }

  const humanDate = formatDateLabel(params.input.date, params.input.lang);
  const dateAnchorOk =
    normalize(text).includes(normalize(params.input.date)) ||
    normalize(text).includes(normalize(humanDate)) ||
    normalize(text).includes(params.input.date.slice(0, 4));
  if (!dateAnchorOk) {
    return { ok: false, code: "narrative_missing_date", flags: ["rejected:narrative_missing_date"] };
  }

  if (!normalize(text).includes(normalize(params.input.placeName))) {
    return { ok: false, code: "narrative_missing_place", flags: ["rejected:narrative_missing_place"] };
  }

  if (!hasGestureSignal(text, params.input.gestureChanged)) {
    return { ok: false, code: "narrative_missing_gesture", flags: ["rejected:narrative_missing_gesture"] };
  }

  const allowedYears = new Set<string>([
    ...extractYears(params.input.date),
    ...extractYears(params.input.fact),
    ...extractYears(params.input.beforeState),
    ...extractYears(params.input.afterState)
  ]);
  const narrativeYears = extractYears(text);
  for (const year of narrativeYears) {
    if (!allowedYears.has(year)) {
      return { ok: false, code: "narrative_unapproved_date", flags: ["rejected:narrative_unapproved_date"] };
    }
  }

  const allowedActorTokens = extractActorTokens(
    [
      params.input.fact,
      params.input.beforeState,
      params.input.afterState,
      params.input.placeName,
      params.input.materialAnchor
    ].join(" ")
  );
  const narrativeActors = extractActorTokens(text);
  for (const actor of narrativeActors) {
    if (!allowedActorTokens.has(actor)) {
      return { ok: false, code: "narrative_unapproved_actor", flags: ["rejected:narrative_unapproved_actor"] };
    }
  }

  flags.push("accepted:narrative_gate");
  return { ok: true, flags };
}

async function fetchJsonWithTimeout(url: string, init: RequestInit, timeoutMs: number): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    if (!response.ok) throw new Error(`http_${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

function parseNarrativeOpenAiPayload(payload: unknown): string | null {
  const parsed = payload as { output_parsed?: unknown };
  const value = parsed.output_parsed as Record<string, unknown> | undefined;
  if (!value) return null;
  const text = String(value.narrative_text || "").trim();
  return text || null;
}

export function renderNarrativeDeterministic(input: NarrativeInput): string {
  const dateLabel = formatDateLabel(input.date, input.lang);
  const place = String(input.placeName || "").trim() || "Lieu non precise";
  const gesture = compactNarrativeClause(simplifyGesture(input.gestureChanged), input);
  const after = compactNarrativeClause(stripAfterPrefix(input.afterState), input);
  const fact = compactNarrativeClause(input.fact, input);

  const sentences = [
    cleanSentence(`${dateLabel}, ${place}`),
    cleanSentence(gesture || fact),
    cleanSentence(after)
  ].filter(Boolean);

  const deduped: string[] = [];
  for (const sentence of sentences) {
    if (!sentence) continue;
    if (deduped.some((existing) => sentenceEquals(existing, sentence))) continue;
    deduped.push(sentence);
  }

  return deduped.join(" ");
}

async function rewriteNarrativeWithAi(params: {
  input: NarrativeInput;
  deterministicText: string;
  apiKey: string;
  model: string;
}): Promise<string | null> {
  const payload = await fetchJsonWithTimeout(
    OPENAI_ENDPOINT,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${params.apiKey}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: params.model,
        input: [
          {
            role: "system",
            content: [
              "You rewrite a validated historical scene into short cinematic French text.",
              "Keep it factual and grounded.",
              "Never add a new fact, date, place, or actor.",
              "Keep exactly one date anchor and one place anchor from inputs.",
              "Keep the user gesture change explicit.",
              "No vague phrases.",
              "Output only JSON."
            ].join(" ")
          },
          {
            role: "user",
            content: JSON.stringify({
              lang: "fr",
              style: "cinematic_v1",
              max_chars: NARRATIVE_MAX_CHARS,
              deterministic_text: params.deterministicText,
              input: {
                date: params.input.date,
                place: params.input.placeName,
                fact: params.input.fact,
                before_state: params.input.beforeState,
                after_state: params.input.afterState,
                gesture_changed: params.input.gestureChanged,
                material_anchor: params.input.materialAnchor
              }
            })
          }
        ],
        max_output_tokens: 220,
        text: {
          format: {
            type: "json_schema",
            name: "scene_cinematic_narrative",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                narrative_text: { type: "string" }
              },
              required: ["narrative_text"]
            }
          }
        }
      })
    },
    5_000
  );
  return parseNarrativeOpenAiPayload(payload);
}

export function validateNarrativeText(params: {
  text: string;
  input: NarrativeInput;
}): NarrativeGateResult {
  return validateNarrativeTextInternal(params);
}

export async function renderNarrativeCinematic(
  input: NarrativeInput,
  options: NarrativeRenderOptions
): Promise<NarrativeRenderResult> {
  const deterministicText = renderNarrativeDeterministic(input);
  const deterministicGate = validateNarrativeTextInternal({ text: deterministicText, input });
  if (!deterministicGate.ok) {
    return {
      text: deterministicText,
      style: "cinematic_v1",
      mode: "deterministic",
      flags: deterministicGate.flags
    };
  }

  const apiKey = String(options.apiKey || "").trim();
  if (input.lang !== "fr" || !apiKey) {
    return {
      text: deterministicText,
      style: "cinematic_v1",
      mode: "deterministic",
      flags: deterministicGate.flags
    };
  }

  try {
    const aiText = await rewriteNarrativeWithAi({
      input,
      deterministicText,
      apiKey,
      model: String(options.model || "gpt-4.1-mini")
    });
    if (!aiText) {
      return {
        text: deterministicText,
        style: "cinematic_v1",
        mode: "deterministic",
        flags: [...deterministicGate.flags, "fallback:narrative_ai_empty"]
      };
    }
    const aiGate = validateNarrativeTextInternal({ text: aiText, input });
    if (!aiGate.ok) {
      return {
        text: deterministicText,
        style: "cinematic_v1",
        mode: "deterministic",
        flags: [...deterministicGate.flags, ...aiGate.flags, "fallback:narrative_ai_rejected"]
      };
    }
    return {
      text: aiText,
      style: "cinematic_v1",
      mode: "ai",
      flags: aiGate.flags
    };
  } catch {
    return {
      text: deterministicText,
      style: "cinematic_v1",
      mode: "deterministic",
      flags: [...deterministicGate.flags, "fallback:narrative_ai_error"]
    };
  }
}
