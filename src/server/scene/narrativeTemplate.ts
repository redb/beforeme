export type NarrativeTemplate = {
  instant: string;
  before: string;
  after: string;
};

function cleanSentence(value: string): string {
  const text = String(value || "").trim().replace(/\s+/g, " ");
  if (!text) return "";
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

function simplifyGesture(value: string): string {
  const text = String(value || "").trim();
  if (!text) return "";
  return text
    .replace(/^a partir de ce jour,\s*/i, "")
    .replace(/^from this day on,\s*/i, "")
    .replace(/^a compter de ce jour,\s*/i, "")
    .trim();
}

export function buildNarrativeTemplate(params: {
  date: string;
  placeName: string;
  gestureChanged: string;
  beforeState: string;
  afterState: string;
}): NarrativeTemplate {
  const place = String(params.placeName || "").trim() || "Lieu non precise";
  const gesture = simplifyGesture(params.gestureChanged);
  const microAction = cleanSentence(gesture || "Le geste change.");

  return {
    instant: `${params.date} - ${place}. ${microAction}`,
    before: cleanSentence(params.beforeState) || "Avant: ce geste n etait pas possible.",
    after: cleanSentence(params.afterState) || "Apres: ce geste devient possible."
  };
}
