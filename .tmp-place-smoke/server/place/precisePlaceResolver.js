"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvePrecisePlace = resolvePrecisePlace;
const ruptureTaxonomy_1 = require("../../lib/ruptureTaxonomy");
const OFFICIAL_INSTITUTIONS = [
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
function normalize(input) {
    return String(input || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}
function isLegalOrState(type) {
    return type === ruptureTaxonomy_1.RuptureType.LEGAL_REGULATORY || type === ruptureTaxonomy_1.RuptureType.STATE_CHANGE_EVENT;
}
function safeName(name) {
    return String(name || "").trim();
}
function extractQid(input) {
    const value = String(input || "").trim().toUpperCase();
    return /^Q\d+$/.test(value) ? value : null;
}
function toCandidateId(type, name, qid) {
    return `${type}|${name.trim().toLowerCase()}|${String(qid || "").toUpperCase()}`;
}
function pushCandidate(list, candidate) {
    const id = toCandidateId(candidate.type, candidate.name, candidate.qid);
    if (list.some((item) => item.id === id))
        return;
    list.push({ ...candidate, id });
}
function resolveFromInfobox(infobox, wikiUrl) {
    if (!infobox)
        return [];
    const out = [];
    const entries = Object.entries(infobox);
    for (const [key, value] of entries) {
        const k = normalize(key);
        const v = safeName(value);
        if (!v)
            continue;
        if (["lieu", "localisation", "siege", "siège", "organisateur"].some((needle) => k.includes(needle))) {
            const normalizedValue = normalize(v);
            const type = normalizedValue.includes("palais") ||
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
function resolveFromLeadHeuristics(lead, ruptureType, wikiUrl) {
    const out = [];
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
function resolveFromWikidata(hints, wikiUrl) {
    const out = [];
    if (!hints)
        return out;
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
function selectCandidate(candidates) {
    const rank = ["site", "institution", "city", "country"];
    for (const type of rank) {
        const found = candidates.find((candidate) => candidate.type === type);
        if (found)
            return found;
    }
    return null;
}
async function resolvePrecisePlace(ctx) {
    const candidates = [];
    const flags = [];
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
    }
    else if (hasInstitution && !candidates.some((candidate) => candidate.type === "country")) {
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
