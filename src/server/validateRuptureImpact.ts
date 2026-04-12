import { RuptureType, type RuptureType as RuptureTypeValue } from "../lib/ruptureTaxonomy";
import { validateVerbForType } from "./scene/verbPolicy";

type EvidenceItem = { quote: string; source_url: string };

const VAGUE_PHRASES = [
  "les usages",
  "les pratiques",
  "dans ce contexte",
  "sur place",
  "adaptation immediate",
  "adaptation immédiate",
  "de façon concrete",
  "de facon concrete",
  "durable",
  "restaient inchanges",
  "restaient inchangés",
  "contraintes nouvelles",
  "marque une rupture"
];

const ACTION_VERBS = [
  "payer",
  "voter",
  "trier",
  "circuler",
  "telephoner",
  "téléphoner",
  "acheter",
  "fumer",
  "entrer",
  "sortir",
  "presenter",
  "présenter",
  "deposer",
  "déposer",
  "publier",
  "projeter",
  "projection",
  "projete",
  "projette",
  "utiliser",
  "embarquer",
  "composter",
  "controler",
  "contrôler",
  "scanner",
  "montrer",
  "recevoir"
];

const CONCRETE_NOUNS = [
  "guichet",
  "formulaire",
  "tampon",
  "ticket",
  "billet",
  "barriere",
  "barrière",
  "quai",
  "station",
  "rue",
  "pont",
  "route",
  "terminal",
  "borne",
  "cabine",
  "panneau",
  "affiche",
  "ecran",
  "écran",
  "salle",
  "palais",
  "tribune",
  "micro",
  "projecteur",
  "rideau",
  "programme",
  "combiné",
  "telephone",
  "téléphone",
  "carte",
  "sirene",
  "sirène",
  "file",
  "haut-parleur",
  "haut parleur"
];

const OFFICIAL_DOMAINS = [
  "legifrance.gouv.fr",
  "conseil-constitutionnel.fr",
  "vie-publique.fr",
  "service-public.fr",
  "info.gouv.fr"
];

function normalize(value: string): string {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function hostFromUrl(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return "";
  }
}

function hasOfficialSource(sourceUrls: string[]): boolean {
  return sourceUrls.some((url) => {
    const host = hostFromUrl(url);
    return OFFICIAL_DOMAINS.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
  });
}

function isLegalOrState(ruptureType: RuptureTypeValue): boolean {
  return ruptureType === RuptureType.LEGAL_REGULATORY || ruptureType === RuptureType.STATE_CHANGE_EVENT;
}

function containsVaguePhrase(text: string): boolean {
  const lower = normalize(text);
  return VAGUE_PHRASES.some((phrase) => lower.includes(normalize(phrase)));
}

function hasConcreteNoun(text: string): boolean {
  const lower = normalize(text);
  return CONCRETE_NOUNS.some((noun) => lower.includes(normalize(noun)));
}

function hasActionVerb(text: string): boolean {
  const lower = normalize(text);
  return ACTION_VERBS.some((verb) => new RegExp(`\\b${normalize(verb)}\\b`, "i").test(lower));
}

function countWords(text: string): number {
  return String(text || "").trim().split(/\s+/).filter(Boolean).length;
}

function memoryBreakdown(params: {
  ruptureType: RuptureTypeValue;
  gestureChanged: string;
  materialAnchor: string;
  sourcesOk: boolean;
  impactQuotidien: boolean;
  dureeLongue: boolean;
}): {
  gesture_clarity: 0 | 1;
  visible_anchor: 0 | 1;
  irreversibility: 0 | 1;
  proof_ready: 0 | 1;
  daily_impact: 0 | 1;
  total: number;
} {
  const gesture = hasActionVerb(params.gestureChanged) && hasConcreteNoun(params.gestureChanged) ? 1 : 0;
  const anchor = hasConcreteNoun(params.materialAnchor) ? 1 : 0;
  const irreversibility =
    params.dureeLongue || params.ruptureType === RuptureType.LEGAL_REGULATORY || params.ruptureType === RuptureType.INFRA_SERVICE
      ? 1
      : 0;
  const proof = params.sourcesOk ? 1 : 0;
  const daily = params.impactQuotidien ? 1 : 0;
  return {
    gesture_clarity: gesture,
    visible_anchor: anchor,
    irreversibility: irreversibility,
    proof_ready: proof,
    daily_impact: daily,
    total: gesture + anchor + irreversibility + proof + daily
  };
}

export function validateRuptureImpact(params: {
  ruptureType: RuptureTypeValue;
  fact: string;
  beforeState: string;
  afterState: string;
  gestureChanged: string;
  materialAnchor: string;
  ruptureTest: { geste_modifie: boolean; duree_longue: boolean; impact_quotidien: boolean };
  sources: Array<{ label: string; url: string }>;
  evidence: EvidenceItem[];
  placeOk: boolean;
  placeFlags: string[];
}):
  | {
      ok: true;
      flags: string[];
      memory: { gesture_clarity: 0 | 1; visible_anchor: 0 | 1; irreversibility: 0 | 1; proof_ready: 0 | 1; daily_impact: 0 | 1; total: number };
    }
  | {
      ok: false;
      code: string;
      message: string;
      flags: string[];
      memory: { gesture_clarity: 0 | 1; visible_anchor: 0 | 1; irreversibility: 0 | 1; proof_ready: 0 | 1; daily_impact: 0 | 1; total: number };
    } {
  const flags = [...params.placeFlags];

  const fieldsToCheck = [
    params.fact,
    params.beforeState,
    params.afterState,
    params.gestureChanged,
    params.materialAnchor
  ];
  if (fieldsToCheck.some((field) => containsVaguePhrase(field))) {
    const memory = memoryBreakdown({
      ruptureType: params.ruptureType,
      gestureChanged: params.gestureChanged,
      materialAnchor: params.materialAnchor,
      sourcesOk: false,
      impactQuotidien: params.ruptureTest.impact_quotidien,
      dureeLongue: params.ruptureTest.duree_longue
    });
    flags.push("rejected:vague_language");
    return { ok: false, code: "vague_language", message: "vague_language", flags, memory };
  }

  if (!params.ruptureTest.geste_modifie || !params.ruptureTest.impact_quotidien) {
    const memory = memoryBreakdown({
      ruptureType: params.ruptureType,
      gestureChanged: params.gestureChanged,
      materialAnchor: params.materialAnchor,
      sourcesOk: false,
      impactQuotidien: params.ruptureTest.impact_quotidien,
      dureeLongue: params.ruptureTest.duree_longue
    });
    flags.push("rejected:rupture_test_failed");
    return { ok: false, code: "missing_gesture", message: "rupture_test_failed", flags, memory };
  }

  if (!hasActionVerb(params.gestureChanged) || !hasConcreteNoun(params.gestureChanged)) {
    const memory = memoryBreakdown({
      ruptureType: params.ruptureType,
      gestureChanged: params.gestureChanged,
      materialAnchor: params.materialAnchor,
      sourcesOk: false,
      impactQuotidien: params.ruptureTest.impact_quotidien,
      dureeLongue: params.ruptureTest.duree_longue
    });
    flags.push("rejected:missing_gesture");
    return { ok: false, code: "missing_gesture", message: "missing_gesture", flags, memory };
  }

  if (!hasConcreteNoun(params.materialAnchor)) {
    const memory = memoryBreakdown({
      ruptureType: params.ruptureType,
      gestureChanged: params.gestureChanged,
      materialAnchor: params.materialAnchor,
      sourcesOk: false,
      impactQuotidien: params.ruptureTest.impact_quotidien,
      dureeLongue: params.ruptureTest.duree_longue
    });
    flags.push("rejected:missing_material_anchor");
    return { ok: false, code: "missing_material_anchor", message: "missing_material_anchor", flags, memory };
  }

  const sourceUrls = params.sources.map((source) => source.url).filter(Boolean);
  if (sourceUrls.length < 2) {
    const memory = memoryBreakdown({
      ruptureType: params.ruptureType,
      gestureChanged: params.gestureChanged,
      materialAnchor: params.materialAnchor,
      sourcesOk: false,
      impactQuotidien: params.ruptureTest.impact_quotidien,
      dureeLongue: params.ruptureTest.duree_longue
    });
    flags.push("rejected:missing_sources");
    return { ok: false, code: "missing_evidence", message: "missing_sources", flags, memory };
  }

  if (isLegalOrState(params.ruptureType) && !hasOfficialSource(sourceUrls)) {
    const memory = memoryBreakdown({
      ruptureType: params.ruptureType,
      gestureChanged: params.gestureChanged,
      materialAnchor: params.materialAnchor,
      sourcesOk: false,
      impactQuotidien: params.ruptureTest.impact_quotidien,
      dureeLongue: params.ruptureTest.duree_longue
    });
    flags.push("rejected:missing_authority_source");
    return { ok: false, code: "missing_evidence", message: "missing_authority_source", flags, memory };
  }

  if (!params.evidence || params.evidence.length < 1) {
    const memory = memoryBreakdown({
      ruptureType: params.ruptureType,
      gestureChanged: params.gestureChanged,
      materialAnchor: params.materialAnchor,
      sourcesOk: false,
      impactQuotidien: params.ruptureTest.impact_quotidien,
      dureeLongue: params.ruptureTest.duree_longue
    });
    flags.push("rejected:missing_evidence");
    return { ok: false, code: "missing_evidence", message: "missing_evidence", flags, memory };
  }

  for (const item of params.evidence) {
    const quote = String(item?.quote || "").trim();
    const sourceUrl = String(item?.source_url || "").trim();
    if (!quote || !sourceUrl) {
      const memory = memoryBreakdown({
        ruptureType: params.ruptureType,
        gestureChanged: params.gestureChanged,
        materialAnchor: params.materialAnchor,
        sourcesOk: false,
        impactQuotidien: params.ruptureTest.impact_quotidien,
        dureeLongue: params.ruptureTest.duree_longue
      });
      flags.push("rejected:missing_evidence");
      return { ok: false, code: "missing_evidence", message: "missing_evidence", flags, memory };
    }
    if (countWords(quote) > 25) {
      const memory = memoryBreakdown({
        ruptureType: params.ruptureType,
        gestureChanged: params.gestureChanged,
        materialAnchor: params.materialAnchor,
        sourcesOk: false,
        impactQuotidien: params.ruptureTest.impact_quotidien,
        dureeLongue: params.ruptureTest.duree_longue
      });
      flags.push("rejected:evidence_too_long");
      return { ok: false, code: "missing_evidence", message: "evidence_too_long", flags, memory };
    }
    if (!sourceUrls.includes(sourceUrl)) {
      const memory = memoryBreakdown({
        ruptureType: params.ruptureType,
        gestureChanged: params.gestureChanged,
        materialAnchor: params.materialAnchor,
        sourcesOk: false,
        impactQuotidien: params.ruptureTest.impact_quotidien,
        dureeLongue: params.ruptureTest.duree_longue
      });
      flags.push("rejected:evidence_source_mismatch");
      return { ok: false, code: "missing_evidence", message: "evidence_source_mismatch", flags, memory };
    }
  }

  const verbCheck = validateVerbForType({ ruptureType: params.ruptureType, text: params.fact });
  if (!verbCheck.ok) {
    const memory = memoryBreakdown({
      ruptureType: params.ruptureType,
      gestureChanged: params.gestureChanged,
      materialAnchor: params.materialAnchor,
      sourcesOk: true,
      impactQuotidien: params.ruptureTest.impact_quotidien,
      dureeLongue: params.ruptureTest.duree_longue
    });
    flags.push("rejected:invalid_verb_for_type");
    return { ok: false, code: "invalid_verb_for_type", message: "invalid_verb_for_type", flags, memory };
  }

  if (!params.placeOk) {
    const memory = memoryBreakdown({
      ruptureType: params.ruptureType,
      gestureChanged: params.gestureChanged,
      materialAnchor: params.materialAnchor,
      sourcesOk: true,
      impactQuotidien: params.ruptureTest.impact_quotidien,
      dureeLongue: params.ruptureTest.duree_longue
    });
    flags.push("rejected:missing_precise_place");
    return { ok: false, code: "missing_precise_place", message: "missing_precise_place", flags, memory };
  }

  const memory = memoryBreakdown({
    ruptureType: params.ruptureType,
    gestureChanged: params.gestureChanged,
    materialAnchor: params.materialAnchor,
    sourcesOk: true,
    impactQuotidien: params.ruptureTest.impact_quotidien,
    dureeLongue: params.ruptureTest.duree_longue
  });
  if (memory.total < 4) {
    flags.push("rejected:memory_score_below_threshold");
    return {
      ok: false,
      code: "memory_score_below_threshold",
      message: "memory_score_below_threshold",
      flags,
      memory
    };
  }

  return { ok: true, flags, memory };
}
