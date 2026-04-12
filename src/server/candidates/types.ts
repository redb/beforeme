import type { PlaceHints } from "../place/precisePlaceResolver";
import type { RuptureType } from "../../lib/ruptureTaxonomy";

export type CandidateSource = {
  label: string;
  url: string;
  authority: boolean;
};

export type CandidateCore = {
  qid: string;
  title: string;
  date: string;
  dateCandidates?: string[];
  wikipediaUrl: string;
  rupture_type: RuptureType;
  confidence: number;
  placeHints?: PlaceHints | null;
};

export type CandidateWithSources = CandidateCore & {
  sources: CandidateSource[];
  sourceFlags: string[];
};

export type RankedCandidate = CandidateWithSources & {
  dateCandidates: string[];
  date_precision: "day" | "month" | "year" | "unknown";
  place: {
    hasPreciseHint: boolean;
    p276Qid: string | null;
    p276Label: string | null;
    p131Qid: string | null;
    p131Label: string | null;
  };
  score: {
    total: number;
    breakdown: {
      date_precision_day: number;
      source_count: number;
      authority_source: number;
      gesture_material_potential: number;
      durability_prior: number;
      classifier_confidence: number;
      memorability_bonus: number;
      gesture_clarity: number;
      visible_anchor: number;
      irreversibility: number;
      proof_ready: number;
      daily_impact_prior: number;
      memory_binary_total: number;
      generic_page_penalty: number;
      vague_title_penalty: number;
      missing_place_penalty: number;
    };
  };
  flags: string[];
};
