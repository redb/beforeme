import { RuptureType, type RuptureType as RuptureTypeValue } from "../../lib/ruptureTaxonomy";

export type PlaceType = "site" | "institution" | "city" | "country";

export type PlaceCandidate = {
  id: string;
  type: PlaceType;
  name: string;
  qid?: string | null;
  evidence: "wikidata" | "wikipedia_infobox" | "wikipedia_text" | "heuristic";
  sourceUrl?: string;
};

export type PlaceResolution = {
  selected: PlaceCandidate | null;
  candidates: PlaceCandidate[];
  flags: string[];
};

export type PlaceHints = {
  p276Qid?: string | null;
  p276Label?: string | null;
  p131Qid?: string | null;
  p131Label?: string | null;
  p159Qid?: string | null;
  p159Label?: string | null;
  p291Qid?: string | null;
  p291Label?: string | null;
};

export type ResolvePrecisePlaceContext = {
  eventQid: string;
  ruptureType: RuptureTypeValue;
  year: number;
  countryQid: string;
  lang: "fr" | "en";
  wikipediaUrl: string;
  wikipediaLeadText: string;
  wikipediaInfobox?: Record<string, string> | null;
  wikidataPlace?: PlaceHints | null;
};

const OFFICIAL_INSTITUTIONS: Array<{
  terms: string[];
  name: string;
  sourceUrl: string;
}> = [
  {
    terms: ["jorf", "journal officiel", "promulgation", "decret", "décret", "loi"],
    name: "Journal officiel de la République française (JORF)",
    sourceUrl: "https://www.legifrance.gouv.fr/"
  },
  {
    terms: ["conseil constitutionnel", "decision", "décision"],
    name: "Conseil constitutionnel",
    sourceUrl: "https://www.conseil-constitutionnel.fr/"
  },
  {
    terms: ["assemblee nationale", "assemblée nationale"],
    name: "Assemblée nationale",
    sourceUrl: "https://www.assemblee-nationale.fr/"
  },
  {
    terms: ["senat", "sénat"],
    name: "Sénat",
    sourceUrl: "https://www.senat.fr/"
  },
  {
    terms: ["parlement"],
    name: "Parlement français",
    sourceUrl: "https://www.vie-publique.fr/"
  }
];

function normalize(input: string): string {
  return String(input || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function isLegalOrState(type: RuptureTypeValue): boolean {
  return type === RuptureType.LEGAL_REGULATORY || type === RuptureType.STATE_CHANGE_EVENT;
}

function safeName(name: string | null | undefined): string {
  return String(name || "").trim();
}

function extractQid(input: string | null | undefined): string | null {
  const value = String(input || "").trim().toUpperCase();
  return /^Q\d+$/.test(value) ? value : null;
}

function toCandidateId(type: PlaceType, name: string, qid?: string | null): string {
  return `${type}|${name.trim().toLowerCase()}|${String(qid || "").toUpperCase()}`;
}

function pushCandidate(list: PlaceCandidate[], candidate: Omit<PlaceCandidate, "id">) {
  const id = toCandidateId(candidate.type, candidate.name, candidate.qid);
  if (list.some((item) => item.id === id)) return;
  list.push({ ...candidate, id });
}

function resolveFromInfobox(
  infobox: Record<string, string> | null | undefined,
  wikiUrl: string
): PlaceCandidate[] {
  if (!infobox) return [];
  const out: PlaceCandidate[] = [];
  const entries = Object.entries(infobox);
  for (const [key, value] of entries) {
    const k = normalize(key);
    const v = safeName(value);
    if (!v) continue;
    if (["lieu", "localisation", "siege", "siège", "organisateur"].some((needle) => k.includes(needle))) {
      const normalizedValue = normalize(v);
      const type: PlaceType =
        normalizedValue.includes("palais") ||
        normalizedValue.includes("tribunal") ||
        normalizedValue.includes("ministere") ||
        normalizedValue.includes("ministère") ||
        normalizedValue.includes("assemblee") ||
        normalizedValue.includes("assemblée") ||
        normalizedValue.includes("conseil")
          ? "institution"
          : "site";
      pushCandidate(out, {
        type,
        name: v,
        qid: null,
        evidence: "wikipedia_infobox",
        sourceUrl: wikiUrl
      });
    }
  }
  return out;
}

function resolveFromLeadHeuristics(
  lead: string,
  ruptureType: RuptureTypeValue,
  wikiUrl: string
): PlaceCandidate[] {
  const out: PlaceCandidate[] = [];
  const normalizedLead = normalize(lead);

  if (isLegalOrState(ruptureType)) {
    for (const anchor of OFFICIAL_INSTITUTIONS) {
      if (anchor.terms.some((term) => normalizedLead.includes(normalize(term)))) {
        pushCandidate(out, {
          type: "institution",
          name: anchor.name,
          qid: null,
          evidence: "heuristic",
          sourceUrl: anchor.sourceUrl
        });
      }
    }
  }

  const regex = /\b(?:a|au|aux|dans|in)\s+([A-ZÉÈÀÂÎÏÔÙÛÇ][\w'’-]+(?:\s+[A-ZÉÈÀÂÎÏÔÙÛÇ][\w'’-]+){0,3})/u;
  const match = String(lead || "").match(regex);
  if (match?.[1]) {
    pushCandidate(out, {
      type: "city",
      name: match[1].trim(),
      qid: null,
      evidence: "wikipedia_text",
      sourceUrl: wikiUrl
    });
  }

  return out;
}

function resolveFromWikidata(hints: PlaceHints | null | undefined, wikiUrl: string): PlaceCandidate[] {
  const out: PlaceCandidate[] = [];
  if (!hints) return out;

  const siteQid = extractQid(hints.p276Qid) || extractQid(hints.p159Qid);
  const siteName = safeName(hints.p276Label) || safeName(hints.p159Label);
  if (siteQid || siteName) {
    pushCandidate(out, {
      type: "site",
      name: siteName || siteQid || "Site",
      qid: siteQid,
      evidence: "wikidata",
      sourceUrl: wikiUrl
    });
  }

  const cityQid = extractQid(hints.p131Qid) || extractQid(hints.p291Qid);
  const cityName = safeName(hints.p131Label) || safeName(hints.p291Label);
  if (cityQid || cityName) {
    pushCandidate(out, {
      type: "city",
      name: cityName || cityQid || "Ville",
      qid: cityQid,
      evidence: "wikidata",
      sourceUrl: wikiUrl
    });
  }

  return out;
}

function selectCandidate(candidates: PlaceCandidate[]): PlaceCandidate | null {
  const rank: PlaceType[] = ["site", "institution", "city", "country"];
  for (const type of rank) {
    const found = candidates.find((candidate) => candidate.type === type);
    if (found) return found;
  }
  return null;
}

export async function resolvePrecisePlace(
  ctx: ResolvePrecisePlaceContext
): Promise<PlaceResolution> {
  const candidates: PlaceCandidate[] = [];
  const flags: string[] = [];

  const fromWikidata = resolveFromWikidata(ctx.wikidataPlace, ctx.wikipediaUrl);
  for (const candidate of fromWikidata) {
    pushCandidate(candidates, candidate);
  }

  const fromInfobox = resolveFromInfobox(ctx.wikipediaInfobox, ctx.wikipediaUrl);
  for (const candidate of fromInfobox) {
    pushCandidate(candidates, candidate);
  }

  const fromHeuristics = resolveFromLeadHeuristics(ctx.wikipediaLeadText, ctx.ruptureType, ctx.wikipediaUrl);
  for (const candidate of fromHeuristics) {
    pushCandidate(candidates, candidate);
  }

  if (!candidates.some((candidate) => candidate.type === "site") && fromWikidata.some((c) => c.type === "city")) {
    flags.push("fallback_city");
  }
  if (candidates.some((candidate) => candidate.type === "institution" && candidate.evidence === "heuristic")) {
    flags.push("fallback_institution");
  }

  const hasInstitution = candidates.some((candidate) => candidate.type === "institution");
  if (!candidates.length || (!selectCandidate(candidates) && hasInstitution)) {
    pushCandidate(candidates, {
      type: "country",
      name: ctx.countryQid === "Q142" ? "France" : ctx.countryQid,
      qid: ctx.countryQid,
      evidence: "heuristic",
      sourceUrl: ctx.wikipediaUrl
    });
  } else if (hasInstitution && !candidates.some((candidate) => candidate.type === "country")) {
    pushCandidate(candidates, {
      type: "country",
      name: ctx.countryQid === "Q142" ? "France" : ctx.countryQid,
      qid: ctx.countryQid,
      evidence: "heuristic",
      sourceUrl: ctx.wikipediaUrl
    });
  }

  const selected = selectCandidate(candidates);
  return { selected, candidates, flags };
}

