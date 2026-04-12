import { RuptureType, type RuptureType as RuptureTypeValue } from "../../lib/ruptureTaxonomy";

type VerbPolicy = {
  allowed: string[];
};

const POLICY: Record<RuptureTypeValue, VerbPolicy> = {
  [RuptureType.LEGAL_REGULATORY]: {
    allowed: [
      "entre en vigueur",
      "est promulguee",
      "devient obligatoire",
      "devient interdit",
      "devient autorise",
      "enters into force",
      "is promulgated",
      "becomes mandatory",
      "becomes prohibited"
    ]
  },
  [RuptureType.INFRA_SERVICE]: {
    allowed: ["est mise en service", "ouvre", "premier trajet", "is commissioned", "opens", "first trip"]
  },
  [RuptureType.TECH_PUBLIC]: {
    allowed: [
      "devient utilisable",
      "premiere commercialisation",
      "premier acces public",
      "becomes usable",
      "first commercial release",
      "first public access"
    ]
  },
  [RuptureType.FIRST_PUBLIC_DEMO]: {
    allowed: ["est interrompu", "est annule", "debute", "ouvre", "is interrupted", "is canceled", "begins", "opens"]
  },
  [RuptureType.STATE_CHANGE_EVENT]: {
    allowed: ["est interrompu", "est annule", "debute", "is interrupted", "is canceled", "begins"]
  }
};

function normalize(input: string): string {
  return String(input || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function allowedVerbsForType(ruptureType: RuptureTypeValue): string[] {
  return POLICY[ruptureType]?.allowed || [];
}

export function validateVerbForType(params: {
  ruptureType: RuptureTypeValue;
  text: string;
}): { ok: true; matched: string } | { ok: false; allowed: string[] } {
  const source = normalize(params.text);
  const allowed = allowedVerbsForType(params.ruptureType);
  for (const verb of allowed) {
    const token = normalize(verb);
    if (source.includes(token)) {
      return { ok: true, matched: verb };
    }
  }
  return { ok: false, allowed };
}
