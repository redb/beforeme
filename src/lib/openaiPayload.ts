import {
  ALLOWED_CLAIM_TEMPLATES,
  REQUIRED_MATERIAL_ELEMENTS,
  RuptureType
} from "./ruptureTaxonomy";
import type { BatchEvent } from "./ruptureClassifier";
import type { PlaceCandidate } from "../server/place/precisePlaceResolver";

function yearFromDate(date: string): number {
  const match = String(date || "").match(/^(\d{4})/);
  return match ? Number(match[1]) : 0;
}

export function buildScenePromptInput(
  event: BatchEvent,
  type: RuptureType,
  placeCandidates: PlaceCandidate[]
) {
  return {
    slot: 1,
    year: yearFromDate(event.date),
    country: "",
    event,
    rupture_type: type,
    allowed_claim_templates: ALLOWED_CLAIM_TEMPLATES[type],
    required_material_elements: REQUIRED_MATERIAL_ELEMENTS[type],
    place_candidates: placeCandidates.map((candidate) => ({
      id: candidate.id,
      type: candidate.type,
      name: candidate.name,
      qid: candidate.qid || null,
      evidence: candidate.evidence,
      sourceUrl: candidate.sourceUrl || null
    })),
    place_selected: null as string | null,
    source_context: {
      wikipediaUrl: event.wikipediaUrl,
      snippets: [] as string[]
    }
  };
}
