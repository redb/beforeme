"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classifyRuptureWithConfidence = classifyRuptureWithConfidence;
exports.classifyRupture = classifyRupture;
exports.isEligibleRupture = isEligibleRupture;
const ruptureTaxonomy_1 = require("./ruptureTaxonomy");
const KEYWORDS = {
    [ruptureTaxonomy_1.RuptureType.LEGAL_REGULATORY]: [
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
    [ruptureTaxonomy_1.RuptureType.INFRA_SERVICE]: [
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
    [ruptureTaxonomy_1.RuptureType.TECH_PUBLIC]: [
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
    [ruptureTaxonomy_1.RuptureType.FIRST_PUBLIC_DEMO]: [
        "premiere",
        "première",
        "world premiere",
        "first performance",
        "first broadcast",
        "diffusion",
        "festival"
    ],
    [ruptureTaxonomy_1.RuptureType.STATE_CHANGE_EVENT]: [
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
function scoreKeywords(label, keywords) {
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
function classifyRuptureWithConfidence(event) {
    const label = String(event.label || "");
    if (!label)
        return null;
    const legalScore = scoreKeywords(label, KEYWORDS[ruptureTaxonomy_1.RuptureType.LEGAL_REGULATORY]);
    const infraScore = scoreKeywords(label, KEYWORDS[ruptureTaxonomy_1.RuptureType.INFRA_SERVICE]);
    const techScore = scoreKeywords(label, KEYWORDS[ruptureTaxonomy_1.RuptureType.TECH_PUBLIC]);
    const demoScore = scoreKeywords(label, KEYWORDS[ruptureTaxonomy_1.RuptureType.FIRST_PUBLIC_DEMO]);
    const stateScore = scoreKeywords(label, KEYWORDS[ruptureTaxonomy_1.RuptureType.STATE_CHANGE_EVENT]);
    const confidenceFromScore = (score) => {
        const raw = Math.min(0.95, 0.6 + score * 0.15);
        return Number(raw.toFixed(2));
    };
    if (legalScore >= 1)
        return { type: ruptureTaxonomy_1.RuptureType.LEGAL_REGULATORY, confidence: confidenceFromScore(legalScore) };
    if (infraScore >= 1)
        return { type: ruptureTaxonomy_1.RuptureType.INFRA_SERVICE, confidence: confidenceFromScore(infraScore) };
    if (techScore >= 1)
        return { type: ruptureTaxonomy_1.RuptureType.TECH_PUBLIC, confidence: confidenceFromScore(techScore) };
    if (demoScore >= 1)
        return { type: ruptureTaxonomy_1.RuptureType.FIRST_PUBLIC_DEMO, confidence: confidenceFromScore(demoScore) };
    if (stateScore >= 1)
        return { type: ruptureTaxonomy_1.RuptureType.STATE_CHANGE_EVENT, confidence: confidenceFromScore(stateScore) };
    return null;
}
function classifyRupture(event) {
    const result = classifyRuptureWithConfidence(event);
    return result ? result.type : null;
}
function isEligibleRupture(event) {
    if (!String(event.date || "").trim()) {
        return { ok: false, reason: "missing_date" };
    }
    if (!String(event.wikipediaUrl || "").trim()) {
        return { ok: false, reason: "missing_wikipedia_url" };
    }
    return { ok: true };
}
