import { RuptureType } from "./ruptureTaxonomy";

export type BatchEvent = {
  qid: string;
  label: string;
  date: string;
  placeLabel: string;
  cityLabel: string;
  wikipediaUrl: string;
  placeHints?: {
    p276Qid?: string | null;
    p276Label?: string | null;
    p131Qid?: string | null;
    p131Label?: string | null;
    p159Qid?: string | null;
    p159Label?: string | null;
    p291Qid?: string | null;
    p291Label?: string | null;
  };
};

const KEYWORDS = {
  [RuptureType.LEGAL_REGULATORY]: [
    "loi",
    "decret",
    "décret",
    "interdiction",
    "obligation",
    "legalisation",
    "légalisation",
    "promulgation",
    "entree en vigueur",
    "entrée en vigueur",
    "ban",
    "act",
    "law",
    "decree",
    "regulation",
    "mandatory",
    "prohibited"
  ],
  [RuptureType.INFRA_SERVICE]: [
    "inauguration",
    "ouverture",
    "mise en service",
    "ligne",
    "station",
    "aeroport",
    "aéroport",
    "port",
    "autoroute",
    "railway",
    "line",
    "opened",
    "in service"
  ],
  [RuptureType.TECH_PUBLIC]: [
    "lancement",
    "commercial",
    "premier",
    "first",
    "released",
    "available",
    "public access",
    "network",
    "internet",
    "carte bancaire",
    "credit card"
  ],
  [RuptureType.FIRST_PUBLIC_DEMO]: [
    "premiere",
    "première",
    "world premiere",
    "first performance",
    "first broadcast",
    "diffusion",
    "festival"
  ],
  [RuptureType.STATE_CHANGE_EVENT]: [
    "attentat",
    "attaque",
    "bombardement",
    "pandemie",
    "pandémie",
    "confinement",
    "earthquake",
    "explosion",
    "attack",
    "pandemic"
  ]
};

function scoreKeywords(label: string, keywords: string[]): number {
  const lower = label.toLowerCase();
  const ascii = lower.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const tokenSet = new Set(ascii.split(/[^a-z0-9]+/g).filter(Boolean));

  return keywords.reduce((acc, keyword) => {
    const k = keyword.toLowerCase();
    const kAscii = k.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (kAscii.includes(" ")) {
      return ascii.includes(kAscii) ? acc + 1 : acc;
    }
    return tokenSet.has(kAscii) ? acc + 1 : acc;
  }, 0);
}

export function classifyRuptureWithConfidence(
  event: BatchEvent
): { type: RuptureType; confidence: number } | null {
  const label = String(event.label || "");
  if (!label) return null;

  const legalScore = scoreKeywords(label, KEYWORDS[RuptureType.LEGAL_REGULATORY]);
  const infraScore = scoreKeywords(label, KEYWORDS[RuptureType.INFRA_SERVICE]);
  const techScore = scoreKeywords(label, KEYWORDS[RuptureType.TECH_PUBLIC]);
  const demoScore = scoreKeywords(label, KEYWORDS[RuptureType.FIRST_PUBLIC_DEMO]);
  const stateScore = scoreKeywords(label, KEYWORDS[RuptureType.STATE_CHANGE_EVENT]);

  const confidenceFromScore = (score: number): number => {
    const raw = Math.min(0.95, 0.6 + score * 0.15);
    return Number(raw.toFixed(2));
  };

  if (legalScore >= 1) return { type: RuptureType.LEGAL_REGULATORY, confidence: confidenceFromScore(legalScore) };
  if (infraScore >= 1) return { type: RuptureType.INFRA_SERVICE, confidence: confidenceFromScore(infraScore) };
  if (techScore >= 1) return { type: RuptureType.TECH_PUBLIC, confidence: confidenceFromScore(techScore) };
  if (demoScore >= 1) return { type: RuptureType.FIRST_PUBLIC_DEMO, confidence: confidenceFromScore(demoScore) };
  if (stateScore >= 1) return { type: RuptureType.STATE_CHANGE_EVENT, confidence: confidenceFromScore(stateScore) };

  return null;
}

export function classifyRupture(event: BatchEvent): RuptureType | null {
  const result = classifyRuptureWithConfidence(event);
  return result ? result.type : null;
}

export function isEligibleRupture(event: BatchEvent): { ok: boolean; reason?: string } {
  if (!String(event.date || "").trim()) {
    return { ok: false, reason: "missing_date" };
  }

  if (!String(event.wikipediaUrl || "").trim()) {
    return { ok: false, reason: "missing_wikipedia_url" };
  }

  return { ok: true };
}
