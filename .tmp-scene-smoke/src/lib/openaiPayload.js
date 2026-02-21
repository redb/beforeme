"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildScenePromptInput = buildScenePromptInput;
const ruptureTaxonomy_1 = require("./ruptureTaxonomy");
function yearFromDate(date) {
    const match = String(date || "").match(/^(\d{4})/);
    return match ? Number(match[1]) : 0;
}
function buildScenePromptInput(event, type, placeCandidates) {
    return {
        slot: 1,
        year: yearFromDate(event.date),
        country: "",
        event,
        rupture_type: type,
        allowed_claim_templates: ruptureTaxonomy_1.ALLOWED_CLAIM_TEMPLATES[type],
        required_material_elements: ruptureTaxonomy_1.REQUIRED_MATERIAL_ELEMENTS[type],
        place_candidates: placeCandidates.map((candidate) => ({
            id: candidate.id,
            type: candidate.type,
            name: candidate.name,
            qid: candidate.qid || null,
            evidence: candidate.evidence,
            sourceUrl: candidate.sourceUrl || null
        })),
        place_selected: null,
        source_context: {
            wikipediaUrl: event.wikipediaUrl,
            snippets: []
        }
    };
}
