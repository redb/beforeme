import { RuptureType } from "../../lib/ruptureTaxonomy";
import { findSeedOverride } from "./seedOverrides";
import type { CandidateWithSources, RankedCandidate } from "./types";

function toIsoDay(raw: string): string | null {
  const value = String(raw || "").trim();
  const day = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (day) return `${day[1]}-${day[2]}-${day[3]}`;
  const zulu = value.match(/^(\d{4})-(\d{2})-(\d{2})T/);
  if (zulu) return `${zulu[1]}-${zulu[2]}-${zulu[3]}`;
  return null;
}

function detectDatePrecision(raw: string): "day" | "month" | "year" | "unknown" {
  const value = String(raw || "").trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return "day";
  if (/^\d{4}-\d{2}/.test(value)) return "month";
  if (/^\d{4}/.test(value)) return "year";
  return "unknown";
}

function isGenericPage(url: string): boolean {
  const decoded = decodeURIComponent(String(url || "").toLowerCase());
  return (
    decoded.includes("_en_france") ||
    decoded.includes("chronologie") ||
    decoded.includes("liste_") ||
    decoded.includes("list_of") ||
    decoded.includes("histoire_de_")
  );
}

function isVagueTitle(title: string): boolean {
  const value = String(title || "").toLowerCase();
  return (
    value.includes("liste") ||
    value.includes("chronologie") ||
    value.includes("histoire") ||
    value.includes("saison") ||
    value.includes("catalogue")
  );
}

function gestureMaterialPotential(input: { title: string; wikipediaUrl: string }): number {
  const text = `${input.title} ${decodeURIComponent(input.wikipediaUrl)}`.toLowerCase();
  const gestures = ["loi", "decret", "ticket", "metro", "gare", "divorce", "hopital", "ecole", "allocation", "ceinture", "carte", "guichet"];
  const hits = gestures.filter((word) => text.includes(word)).length;
  if (hits >= 3) return 20;
  if (hits >= 2) return 12;
  if (hits >= 1) return 6;
  return 0;
}

function hasGestureSignal(input: { title: string; wikipediaUrl: string }): boolean {
  const text = `${input.title} ${decodeURIComponent(input.wikipediaUrl)}`.toLowerCase();
  return ["loi", "decret", "ouvre", "mise_en_service", "metro", "hopital", "divorce", "ceinture", "carte"].some((word) =>
    text.includes(word)
  );
}

function hasVisibleAnchorSignal(input: { title: string; wikipediaUrl: string }): boolean {
  const text = `${input.title} ${decodeURIComponent(input.wikipediaUrl)}`.toLowerCase();
  return ["palais", "station", "guichet", "portique", "tribunal", "hopital", "ecole", "caf", "metro", "quai"].some((word) =>
    text.includes(word)
  );
}

function durabilityPrior(ruptureType: string): number {
  if (ruptureType === RuptureType.LEGAL_REGULATORY) return 15;
  if (ruptureType === RuptureType.INFRA_SERVICE) return 12;
  if (ruptureType === RuptureType.STATE_CHANGE_EVENT) return 10;
  return 8;
}

function memorabilityBonus(input: { title: string; wikipediaUrl: string }): number {
  const text = `${input.title} ${decodeURIComponent(input.wikipediaUrl)}`.toLowerCase();
  const words = ["hopital", "tribunal", "metro", "guichet", "portique", "palais", "ecole", "caf", "carte"];
  const hits = words.filter((word) => text.includes(word)).length;
  return Math.min(10, hits * 2);
}

function hasPrecisePlaceHint(item: CandidateWithSources): boolean {
  return Boolean(item.placeHints?.p276Qid || item.placeHints?.p276Label || item.placeHints?.p159Qid || item.placeHints?.p159Label);
}

function hasAuthoritySource(item: CandidateWithSources): boolean {
  return item.sources.some((source) => source.authority);
}

function uniqueDays(input: Array<string | null | undefined>): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const raw of input) {
    const day = toIsoDay(String(raw || ""));
    if (!day || seen.has(day)) continue;
    seen.add(day);
    out.push(day);
  }
  return out;
}

export function rankImpact(items: CandidateWithSources[]): RankedCandidate[] {
  const ranked = items.map((item) => {
    const override = findSeedOverride({ title: item.title, wikipediaUrl: item.wikipediaUrl });
    const dateCandidates = uniqueDays([override?.date, ...(item.dateCandidates || []), item.date]);
    const date = dateCandidates[0] || override?.date || item.date;
    const datePrecision = detectDatePrecision(date);

    const dateScore = datePrecision === "day" ? 20 : datePrecision === "month" ? 5 : 0;
    const sourceCountScore = item.sources.length >= 3 ? 15 : item.sources.length >= 2 ? 10 : 0;

    let authorityScore = 0;
    const legalOrState =
      item.rupture_type === RuptureType.LEGAL_REGULATORY ||
      item.rupture_type === RuptureType.STATE_CHANGE_EVENT;
    if (legalOrState) {
      authorityScore = hasAuthoritySource(item) ? 20 : -25;
    }

    const gestureScore = gestureMaterialPotential({ title: item.title, wikipediaUrl: item.wikipediaUrl });
    const durabilityScore = durabilityPrior(item.rupture_type);
    const confidenceScore = Math.round(Math.max(0, Math.min(1, Number(item.confidence || 0))) * 10);
    const memoryScore = memorabilityBonus({ title: item.title, wikipediaUrl: item.wikipediaUrl });

    const gestureClarity = hasGestureSignal({ title: item.title, wikipediaUrl: item.wikipediaUrl }) ? 1 : 0;
    const visibleAnchor = hasVisibleAnchorSignal({ title: item.title, wikipediaUrl: item.wikipediaUrl }) ? 1 : 0;
    const irreversibility =
      item.rupture_type === RuptureType.LEGAL_REGULATORY ||
      item.rupture_type === RuptureType.INFRA_SERVICE ||
      item.rupture_type === RuptureType.STATE_CHANGE_EVENT
        ? 1
        : 0;
    const proofReady = item.sources.length >= 2 && (!legalOrState || hasAuthoritySource(item)) ? 1 : 0;
    const dailyImpactPrior =
      item.rupture_type === RuptureType.LEGAL_REGULATORY || item.rupture_type === RuptureType.INFRA_SERVICE ? 1 : 0;
    const memoryBinaryTotal = gestureClarity + visibleAnchor + irreversibility + proofReady + dailyImpactPrior;

    const genericPenalty = isGenericPage(item.wikipediaUrl) ? -30 : 0;
    const vaguePenalty = isVagueTitle(item.title) ? -20 : 0;
    const missingPlacePenalty = hasPrecisePlaceHint(item) || override?.placeName ? 0 : -15;

    const totalRaw =
      dateScore +
      sourceCountScore +
      authorityScore +
      gestureScore +
      durabilityScore +
      confidenceScore +
      memoryScore +
      memoryBinaryTotal * 4 +
      genericPenalty +
      vaguePenalty +
      missingPlacePenalty;
    const total = Math.max(0, Math.min(100, totalRaw));

    const flags: string[] = [...item.sourceFlags];
    if (datePrecision === "day") flags.push("date_precision_day");
    if (genericPenalty < 0) flags.push("penalty_generic_page");
    if (vaguePenalty < 0) flags.push("penalty_vague_title");
    if (missingPlacePenalty < 0) flags.push("penalty_missing_place");
    if (override?.placeName) flags.push("seed_place_override");
    if (override?.date) flags.push("seed_date_override");

    return {
      ...item,
      date,
      dateCandidates,
      date_precision: datePrecision,
      place: {
        hasPreciseHint: hasPrecisePlaceHint(item) || Boolean(override?.placeName),
        p276Qid: item.placeHints?.p276Qid || null,
        p276Label: item.placeHints?.p276Label || null,
        p131Qid: item.placeHints?.p131Qid || null,
        p131Label: item.placeHints?.p131Label || null
      },
      score: {
        total,
        breakdown: {
          date_precision_day: dateScore,
          source_count: sourceCountScore,
          authority_source: authorityScore,
          gesture_material_potential: gestureScore,
          durability_prior: durabilityScore,
          classifier_confidence: confidenceScore,
          memorability_bonus: memoryScore,
          gesture_clarity: gestureClarity,
          visible_anchor: visibleAnchor,
          irreversibility: irreversibility,
          proof_ready: proofReady,
          daily_impact_prior: dailyImpactPrior,
          memory_binary_total: memoryBinaryTotal,
          generic_page_penalty: genericPenalty,
          vague_title_penalty: vaguePenalty,
          missing_place_penalty: missingPlacePenalty
        }
      },
      flags
    };
  });

  ranked.sort((a, b) => b.score.total - a.score.total || b.confidence - a.confidence);
  return ranked;
}
