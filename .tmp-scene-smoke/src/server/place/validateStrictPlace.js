"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeDatePrecision = computeDatePrecision;
exports.acceptsStrictPlace = acceptsStrictPlace;
exports.evaluateStrictPlace = evaluateStrictPlace;
const ruptureTaxonomy_1 = require("../../lib/ruptureTaxonomy");
const OFFICIAL_DOMAINS = [
    "legifrance.gouv.fr",
    "conseil-constitutionnel.fr",
    "vie-publique.fr",
    "service-public.fr",
    "info.gouv.fr"
];
function hostFromUrl(url) {
    try {
        return new URL(url).hostname.toLowerCase();
    }
    catch {
        return "";
    }
}
function hasOfficialSource(sourceUrls) {
    return sourceUrls.some((url) => {
        const host = hostFromUrl(url);
        return OFFICIAL_DOMAINS.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
    });
}
function isLegalOrState(ruptureType) {
    return ruptureType === ruptureTaxonomy_1.RuptureType.LEGAL_REGULATORY || ruptureType === ruptureTaxonomy_1.RuptureType.STATE_CHANGE_EVENT;
}
function computeDatePrecision(isoDate) {
    const raw = String(isoDate || "").trim();
    const dayMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (dayMatch)
        return "day";
    if (/^\d{4}-\d{2}/.test(raw))
        return "month";
    if (/^\d{4}/.test(raw))
        return "year";
    return "unknown";
}
function acceptsStrictPlace(params) {
    return evaluateStrictPlace(params).ok;
}
function evaluateStrictPlace(params) {
    const { selected, ruptureType, datePrecision, sourceUrls } = params;
    const flags = [`date_precision:${datePrecision}`];
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
