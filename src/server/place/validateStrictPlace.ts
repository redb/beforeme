import { RuptureType, type RuptureType as RuptureTypeValue } from "../../lib/ruptureTaxonomy";
import type { PlaceCandidate } from "./precisePlaceResolver";

export type DatePrecision = "day" | "month" | "year" | "unknown";
export type StrictPlaceEvaluation = {
  ok: boolean;
  flags: string[];
};

const OFFICIAL_DOMAINS = [
  "legifrance.gouv.fr",
  "conseil-constitutionnel.fr",
  "vie-publique.fr",
  "service-public.fr",
  "info.gouv.fr"
];

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

export function computeDatePrecision(isoDate: string): DatePrecision {
  const raw = String(isoDate || "").trim();
  const dayMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (dayMatch) return "day";
  if (/^\d{4}-\d{2}/.test(raw)) return "month";
  if (/^\d{4}/.test(raw)) return "year";
  return "unknown";
}

export function acceptsStrictPlace(params: {
  selected: PlaceCandidate | null;
  ruptureType: RuptureTypeValue;
  datePrecision: DatePrecision;
  sourceUrls: string[];
}): boolean {
  return evaluateStrictPlace(params).ok;
}

export function evaluateStrictPlace(params: {
  selected: PlaceCandidate | null;
  ruptureType: RuptureTypeValue;
  datePrecision: DatePrecision;
  sourceUrls: string[];
}): StrictPlaceEvaluation {
  const { selected, ruptureType, datePrecision, sourceUrls } = params;
  const flags: string[] = [`date_precision:${datePrecision}`];
  if (!selected) {
    flags.push("rejected:missing_place");
    return { ok: false, flags };
  }

  if (selected.qid && (selected.type === "site" || selected.type === "institution")) {
    flags.push("accepted:qid_site_or_institution");
    return { ok: true, flags };
  }

  if (selected.type === "institution" && hasOfficialSource(sourceUrls)) {
    flags.push("accepted:institution_with_official_source");
    return { ok: true, flags };
  }

  if (selected.type === "city" && isLegalOrState(ruptureType) && datePrecision === "day") {
    flags.push("accepted:city_legal_or_state_with_day_precision");
    return { ok: true, flags };
  }

  flags.push("rejected:missing_precise_place");
  return { ok: false, flags };
}
