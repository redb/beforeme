"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onRequestGet = void 0;
exports.onRequestOptions = onRequestOptions;
const prisma_js_1 = require("../lib/prisma.js");
const wiki_lead_js_1 = require("../lib/wiki-lead.js");
const openaiPayload_1 = require("../../src/lib/openaiPayload");
const ruptureTaxonomy_1 = require("../../src/lib/ruptureTaxonomy");
const precisePlaceResolver_1 = require("../../src/server/place/precisePlaceResolver");
const validateStrictPlace_1 = require("../../src/server/place/validateStrictPlace");
const validateRuptureImpact_1 = require("../../src/server/validateRuptureImpact");
const narrativeTemplate_1 = require("../../src/server/scene/narrativeTemplate");
const renderNarrative_1 = require("../../src/server/scene/renderNarrative");
const OPENAI_ENDPOINT = "https://api.openai.com/v1/responses";
const SCHEMA_VERSION = "1.0";
const PENDING_TTL_MS = 240_000;
function logScene(event, payload) {
    console.log(JSON.stringify({ level: "info", event, ts: new Date().toISOString(), ...payload }));
}
const KNOWN_EVENT_RULES = [
    {
        pattern: /festival_de_cannes_1968/i,
        date: "1968-05-18",
        fact: "Le 18 mai 1968, le Festival de Cannes est interrompu au Palais des Festivals avant sa cloture prevue.",
        placeName: "Palais des Festivals",
        placeType: "site",
        materialAnchor: "Salle de projection et ecran du Palais des Festivals",
        gestureChanged: "A partir de ce jour, tu peux entrer dans la salle de projection, mais la seance peut etre interrompue avant la fin.",
        beforeState: "Avant le 18 mai 1968, au Palais des Festivals, une projection officielle allait jusqu a son terme.",
        afterState: "Apres le 18 mai 1968, au Palais des Festivals, une projection officielle peut etre arretee en cours de seance.",
        extraSources: [
            { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Festival_de_Cannes_1968" }
        ]
    },
    {
        pattern: /loi_veil/i,
        date: "1975-01-17",
        placeName: "Journal officiel de la Republique francaise",
        placeType: "institution",
        materialAnchor: "Service hospitalier et dossier medical",
        gestureChanged: "A partir de ce jour, tu peux demander une IVG a l hopital dans un cadre medical autorise.",
        beforeState: "Avant le 17 janvier 1975, a l hopital, la demande d IVG n est pas recevable dans le cadre penal ordinaire.",
        afterState: "Apres le 17 janvier 1975, a l hopital, la demande d IVG suit une procedure medicale legalement encadree.",
        extraSources: [
            { label: "Legifrance", url: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000693983" },
            { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Loi_Veil" }
        ]
    },
    {
        pattern: /reforme_du_divorce_en_france/i,
        date: "1975-07-11",
        placeName: "Tribunal judiciaire",
        placeType: "institution",
        materialAnchor: "Greffe du tribunal et acte de divorce",
        gestureChanged: "A partir de ce jour, tu peux deposer une demande de divorce par consentement mutuel sans invoquer une faute.",
        beforeState: "Avant le 11 juillet 1975, au tribunal, la procedure de divorce repose principalement sur la preuve d une faute.",
        afterState: "Apres le 11 juillet 1975, au tribunal, la procedure permet un divorce par accord mutuel des epoux.",
        extraSources: [
            { label: "Legifrance", url: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000693724" },
            { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/R%C3%A9forme_du_divorce_en_France" }
        ]
    },
    {
        pattern: /carte_orange/i,
        date: "1975-10-01",
        placeName: "Portique du metro parisien",
        placeType: "site",
        materialAnchor: "Portique de metro et carte orange",
        gestureChanged: "A partir de ce jour, tu peux presenter une carte orange au portique au lieu d acheter un ticket a chaque trajet.",
        beforeState: "Avant le 1 octobre 1975, au metro parisien, les voyageurs achetent des tickets separes selon le trajet.",
        afterState: "Apres le 1 octobre 1975, au metro parisien, un abonnement mensuel unique permet des trajets repetes.",
        extraSources: [
            { label: "RATP", url: "https://www.ratp.fr/groupe-ratp/histoire" },
            { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Carte_orange" }
        ]
    },
    {
        pattern: /loi_haby/i,
        date: "1975-07-11",
        placeName: "College public",
        placeType: "institution",
        materialAnchor: "Salle de classe et programme commun",
        gestureChanged: "A partir de ce jour, tu suis un tronc commun au college avant toute orientation differenciee.",
        beforeState: "Avant le 11 juillet 1975, au college, l orientation des eleves intervient plus tot selon des filieres distinctes.",
        afterState: "Apres le 11 juillet 1975, au college, les eleves suivent un programme commun de reference.",
        extraSources: [
            { label: "Legifrance", url: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000693721" },
            { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Loi_Haby" }
        ]
    },
    {
        pattern: /allocation_de_parent_isole/i,
        date: "1975-07-11",
        placeName: "Guichet de la CAF",
        placeType: "institution",
        materialAnchor: "Guichet CAF et formulaire de demande",
        gestureChanged: "A partir de ce jour, tu peux deposer une demande d allocation parent isole avec un dossier au guichet CAF.",
        beforeState: "Avant juillet 1975, au guichet social, aucun dispositif cible n organise cette demande pour un parent isole.",
        afterState: "Apres juillet 1975, au guichet CAF, un formulaire specifique ouvre un droit d allocation parent isole.",
        extraSources: [
            { label: "Vie publique", url: "https://www.vie-publique.fr" },
            { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Allocation_de_parent_isol%C3%A9" }
        ]
    },
    {
        pattern: /conservatoire_du_littoral/i,
        date: "1975-07-10",
        placeName: "Parcelle littorale protegee",
        placeType: "site",
        materialAnchor: "Parcelle littorale et acte de cession",
        gestureChanged: "A partir de ce jour, tu ne peux plus lancer librement un projet de construction sur une parcelle acquise pour protection.",
        beforeState: "Avant le 10 juillet 1975, sur certaines parcelles littorales, les projets de lotissement peuvent avancer sans blocage foncier dedie.",
        afterState: "Apres le 10 juillet 1975, sur les parcelles acquises, la protection fonciere bloque durablement certains projets de construction.",
        extraSources: [
            { label: "Legifrance", url: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000693692" },
            { label: "Conservatoire du littoral", url: "https://www.conservatoire-du-littoral.fr" },
            { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Conservatoire_du_littoral" }
        ]
    },
    {
        pattern: /autorite_parentale_en_france/i,
        date: "1970-06-04",
        placeName: "Mairie et services scolaires",
        placeType: "institution",
        materialAnchor: "Formulaire scolaire et double signature parentale",
        gestureChanged: "A partir de ce cadre legal, tu dois presenter une decision parentale avec les deux responsables legaux quand la procedure l exige.",
        beforeState: "Avant la reforme, pour certains actes administratifs, la procedure privilegie la signature du pere.",
        afterState: "Apres la reforme, dans les actes administratifs de l enfant, l autorite parentale conjointe impose une responsabilite partagee.",
        extraSources: [
            { label: "Legifrance", url: "https://www.legifrance.gouv.fr" },
            { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Autorit%C3%A9_parentale_en_France" }
        ]
    },
    {
        pattern: /loi_d.?orientation_en_faveur_des_personnes_handicape/i,
        date: "1975-06-30",
        placeName: "Ecole et guichet administratif",
        placeType: "institution",
        materialAnchor: "Dossier d inscription et notification administrative",
        gestureChanged: "A partir de ce jour, tu peux deposer une demande d integration scolaire ou professionnelle appuyee sur un cadre legal explicite.",
        beforeState: "Avant le 30 juin 1975, les demarches d integration reposent surtout sur des pratiques locales sans cadre national unifie.",
        afterState: "Apres le 30 juin 1975, les demarches d integration s appuient sur un cadre legal national dans l ecole et le travail.",
        extraSources: [
            { label: "Legifrance", url: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000693508" },
            { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Loi_d%27orientation_en_faveur_des_personnes_handicap%C3%A9es" }
        ]
    }
];
function parseYear(raw) {
    const value = Number(raw);
    return Number.isInteger(value) && value >= 1000 && value <= 2100 ? value : null;
}
function parseLang(raw) {
    return String(raw || "fr").toLowerCase().startsWith("fr") ? "fr" : "en";
}
function parseQid(raw) {
    const value = String(raw || "").trim().toUpperCase();
    return /^Q\d+$/.test(value) || /^SEED-[A-Z0-9-]+$/.test(value) ? value : null;
}
function parseCountryQid(raw) {
    const value = String(raw || "Q142").trim().toUpperCase();
    if (/^Q\d+$/.test(value))
        return value;
    if (value === "FR")
        return "Q142";
    if (value === "US")
        return "Q30";
    if (value === "CA")
        return "Q16";
    if (value === "BR")
        return "Q155";
    if (value === "MG")
        return "Q1019";
    if (value === "DE")
        return "Q183";
    if (value === "ES")
        return "Q29";
    if (value === "IT")
        return "Q38";
    if (value === "GB" || value === "UK")
        return "Q145";
    return null;
}
function parseMode(raw) {
    return raw === "geo" ? "geo" : "fast";
}
function r2Key(countryQid, year, eventQid, lang) {
    return `v1/${countryQid}/${year}/${eventQid}.${lang}.json`;
}
function noStoreHeaders() {
    return {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET,OPTIONS",
        "access-control-allow-headers": "content-type"
    };
}
function immutableHeaders() {
    return {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "public, s-maxage=31536000, immutable",
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET,OPTIONS",
        "access-control-allow-headers": "content-type"
    };
}
function json(status, payload, headers = noStoreHeaders()) {
    return new Response(JSON.stringify(payload), { status, headers });
}
async function getFromR2(env, key) {
    if (!env.R2)
        return null;
    const object = await env.R2.get(key);
    if (!object)
        return null;
    const parsed = (await object.json());
    if (!parsed || parsed.schema_version !== SCHEMA_VERSION)
        return null;
    if (!Array.isArray(parsed.evidence) || parsed.evidence.length === 0)
        return null;
    if (String(parsed.validation_mode || "strict") === "minimal_fallback")
        return null;
    // Invalidate older local fallback phrasing so fresh, better-written content is regenerated.
    const looksLikeOldHeuristic = typeof parsed.fact === "string" &&
        typeof parsed.before_state === "string" &&
        parsed.fact.startsWith(`Le ${parsed.date},`) &&
        parsed.before_state.includes("geste quotidien associe");
    if (looksLikeOldHeuristic) {
        return null;
    }
    const narrativeTemplate = parsed.narrative_template &&
        typeof parsed.narrative_template.instant === "string" &&
        typeof parsed.narrative_template.before === "string" &&
        typeof parsed.narrative_template.after === "string"
        ? parsed.narrative_template
        : (0, narrativeTemplate_1.buildNarrativeTemplate)({
            date: parsed.date,
            placeName: parsed.place?.name || "",
            gestureChanged: parsed.gesture_changed,
            beforeState: parsed.before_state,
            afterState: parsed.after_state
        });
    const wikipediaSource = Array.isArray(parsed.sources)
        ? parsed.sources
            .map((entry) => (typeof entry?.url === "string" ? entry.url : ""))
            .find((url) => url.includes("wikipedia.org/wiki/")) || ""
        : "";
    const known = wikipediaSource ? knownRuleForWikipediaUrl(wikipediaSource) : null;
    if (known && parsed.lang === "fr" && /^SEED-/i.test(String(parsed.event_qid || ""))) {
        const factMismatch = typeof known.fact === "string" && normalizeForCompare(parsed.fact) !== normalizeForCompare(known.fact);
        const beforeMismatch = typeof known.beforeState === "string" &&
            normalizeForCompare(parsed.before_state) !== normalizeForCompare(known.beforeState);
        const afterMismatch = typeof known.afterState === "string" && normalizeForCompare(parsed.after_state) !== normalizeForCompare(known.afterState);
        if (factMismatch || beforeMismatch || afterMismatch) {
            return null;
        }
    }
    const narrativeText = typeof parsed.narrative_text === "string" && parsed.narrative_text.trim()
        ? parsed.narrative_text.trim()
        : (0, renderNarrative_1.renderNarrativeDeterministic)({
            lang: parsed.lang,
            date: parsed.date,
            placeName: parsed.place?.name || "",
            fact: parsed.fact,
            beforeState: parsed.before_state,
            afterState: parsed.after_state,
            gestureChanged: parsed.gesture_changed,
            materialAnchor: parsed.material_anchor
        });
    const narrativeStyle = parsed.narrative_style === "cinematic_v1" ? parsed.narrative_style : "cinematic_v1";
    return {
        ...parsed,
        narrative_template: narrativeTemplate,
        narrative_text: narrativeText,
        narrative_style: narrativeStyle,
        validation_mode: "strict"
    };
}
async function putToR2(env, key, data) {
    if (!env.R2) {
        throw new Error("R2 binding missing");
    }
    await env.R2.put(key, JSON.stringify(data), {
        httpMetadata: {
            contentType: "application/json; charset=utf-8",
            cacheControl: "public, s-maxage=31536000, immutable"
        }
    });
}
async function computePromptHash(input) {
    const bytes = new TextEncoder().encode(JSON.stringify(input));
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function fetchJsonWithTimeout(url, init, timeoutMs) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await fetch(url, { ...init, signal: controller.signal });
        if (!response.ok)
            throw new Error(`http_${response.status}`);
        return await response.json();
    }
    catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
            throw Object.assign(new Error("upstream_timeout"), { status: 504, code: "upstream_timeout" });
        }
        throw error;
    }
    finally {
        clearTimeout(timer);
    }
}
function dateToIsoDay(raw) {
    const match = String(raw || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match)
        return null;
    return `${match[1]}-${match[2]}-${match[3]}`;
}
function pickPlace(candidates, selectedId) {
    if (!selectedId)
        return null;
    return candidates.find((item) => item.id === selectedId) || null;
}
function normalizeForCompare(value) {
    return String(value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}
function hasConcreteGesture(value) {
    const text = normalizeForCompare(value);
    if (!text)
        return false;
    const gestureHints = [
        "payer",
        "vote",
        "voter",
        "trier",
        "circuler",
        "declarer",
        "utiliser",
        "interdire",
        "acheter",
        "jeter",
        "prendre",
        "presenter",
        "respecter",
        "suivre",
        "dois",
        "peux",
        "ne peux plus",
        "can now",
        "must",
        "cannot",
        "you can",
        "you must",
        "you cannot"
    ];
    return gestureHints.some((hint) => text.includes(hint));
}
function hasMaterialAnchor(value) {
    const text = normalizeForCompare(value);
    if (!text)
        return false;
    const materialHints = [
        "gare",
        "station",
        "palais",
        "bureau",
        "guichet",
        "urne",
        "route",
        "pont",
        "ticket",
        "carte",
        "panneau",
        "borne",
        "usine",
        "ecole",
        "hopital",
        "quai",
        "metro",
        "train",
        "terminal",
        "sirene",
        "ruban",
        "barriere",
        "haut parleur",
        "panneau",
        "affiche",
        "formulaire",
        "combiné",
        "projecteur",
        "rideau",
        "programme",
        "checkpoint",
        "office",
        "street"
    ];
    if (materialHints.some((hint) => text.includes(hint)))
        return true;
    // Accept descriptive anchors (place + object) even if vocabulary differs.
    return text.length >= 14 && text.includes(" ");
}
function validateStrict(params) {
    const flags = [...params.placeFlags];
    if (!params.date) {
        flags.push("date_precision:unknown", "rejected:missing_precise_date");
        return { ok: false, code: "missing_precise_date", message: "date_precision must be day", flags };
    }
    if (!params.fact.trim()) {
        flags.push("rejected:missing_fact");
        return { ok: false, code: "missing_fact", message: "fact required", flags };
    }
    if (!params.beforeState.trim() || !params.afterState.trim()) {
        flags.push("rejected:missing_structural_delta");
        return { ok: false, code: "missing_structural_delta", message: "before_state and after_state required", flags };
    }
    if (!params.gestureChanged.trim()) {
        flags.push("rejected:missing_gesture_changed");
        return { ok: false, code: "missing_gesture_changed", message: "gesture_changed required", flags };
    }
    if (!params.materialAnchor.trim()) {
        flags.push("rejected:missing_material_anchor");
        return { ok: false, code: "missing_material_anchor", message: "material_anchor required", flags };
    }
    const yearToken = params.date ? params.date.slice(0, 4) : "";
    if (yearToken && !params.fact.includes(yearToken)) {
        flags.push("rejected:fact_missing_year");
        return { ok: false, code: "fact_missing_year", message: "fact must include year", flags };
    }
    if (normalizeForCompare(params.beforeState) === normalizeForCompare(params.afterState)) {
        flags.push("rejected:identical_states");
        return { ok: false, code: "identical_states", message: "before_state and after_state must differ", flags };
    }
    if (!params.ruptureTest.geste_modifie) {
        flags.push("rejected:rupture_test_geste_modifie_false");
        return { ok: false, code: "gesture_not_modified", message: "gesture must be modified", flags };
    }
    if (!params.ruptureTest.impact_quotidien) {
        flags.push("rejected:rupture_test_impact_quotidien_false");
        return { ok: false, code: "no_daily_impact", message: "daily impact required", flags };
    }
    if (!params.sources.length) {
        flags.push("rejected:missing_sources");
        return { ok: false, code: "missing_sources", message: "sources required", flags };
    }
    const sourceUrls = params.sources.map((item) => item.url);
    const placeEvaluation = (0, validateStrictPlace_1.evaluateStrictPlace)({
        selected: params.place,
        ruptureType: params.ruptureType,
        datePrecision: "day",
        sourceUrls
    });
    flags.push(...placeEvaluation.flags);
    if (!placeEvaluation.ok) {
        flags.push("place_precision:degraded_non_blocking");
    }
    return { ok: true, flags };
}
async function acquireLock(prisma, params) {
    const now = new Date();
    const lockOwner = crypto.randomUUID();
    const lockExpiresAt = new Date(Date.now() + PENDING_TTL_MS);
    try {
        await prisma.eventCache.create({
            data: {
                year: params.year,
                countryQid: params.countryQid,
                lang: params.lang,
                eventQid: params.eventQid,
                title: params.eventQid,
                status: "pending",
                schemaVersion: SCHEMA_VERSION,
                generatedAt: now,
                updatedAt: now,
                lockOwner,
                lockExpiresAt
            }
        });
        return { acquired: true, lockOwner };
    }
    catch (error) {
        const code = error?.code;
        if (code !== "P2002") {
            throw error;
        }
    }
    const updated = await prisma.eventCache.updateMany({
        where: {
            year: params.year,
            countryQid: params.countryQid,
            lang: params.lang,
            eventQid: params.eventQid,
            OR: [
                { lockExpiresAt: null },
                { lockExpiresAt: { lt: now } }
            ]
        },
        data: {
            status: "pending",
            schemaVersion: SCHEMA_VERSION,
            errorCode: null,
            errorMessage: null,
            updatedAt: now,
            lockOwner,
            lockExpiresAt
        }
    });
    return { acquired: updated.count > 0, lockOwner: updated.count > 0 ? lockOwner : null };
}
async function hasLockOwnership(prisma, params) {
    const row = await prisma.eventCache.findUnique({
        where: {
            year_countryQid_lang_eventQid: {
                year: params.year,
                countryQid: params.countryQid,
                lang: params.lang,
                eventQid: params.eventQid
            }
        }
    });
    if (!row)
        return false;
    if (row.status !== "pending")
        return false;
    if (row.lockOwner !== params.lockOwner)
        return false;
    const expiresAt = row.lockExpiresAt ? new Date(row.lockExpiresAt).getTime() : 0;
    return expiresAt > Date.now();
}
function isBatchItem(value) {
    if (!value || typeof value !== "object")
        return false;
    const item = value;
    return (typeof item.qid === "string" &&
        typeof item.label === "string" &&
        typeof item.date === "string" &&
        typeof item.wikipediaUrl === "string" &&
        typeof item.rupture_type === "string");
}
function isRankedItem(value) {
    if (!value || typeof value !== "object")
        return false;
    const item = value;
    return (typeof item.qid === "string" &&
        typeof item.title === "string" &&
        typeof item.date === "string" &&
        typeof item.wikipediaUrl === "string" &&
        typeof item.rupture_type === "string");
}
function rankedToBatchItem(value) {
    return {
        qid: value.qid.toUpperCase(),
        label: value.title,
        date: value.date,
        dateCandidates: Array.isArray(value.dateCandidates) ? value.dateCandidates.map((item) => String(item || "")).filter(Boolean) : [],
        wikipediaUrl: value.wikipediaUrl,
        rupture_type: value.rupture_type,
        confidence: Number(value.confidence || 0),
        placeHints: {
            p276Qid: value.place?.p276Qid || null,
            p276Label: value.place?.p276Label || null,
            p131Qid: value.place?.p131Qid || null,
            p131Label: value.place?.p131Label || null
        }
    };
}
async function fetchCandidatePool(requestUrl, params) {
    const rankedUrl = `${requestUrl.protocol}//${requestUrl.host}` +
        `/api/candidates-ranked?year=${params.year}&country=${params.countryQid}&lang=${params.lang}&limit=20`;
    try {
        const payload = (await fetchJsonWithTimeout(rankedUrl, { method: "GET", headers: { accept: "application/json" } }, 20_000));
        const rankedItems = Array.isArray(payload?.items) ? payload.items : [];
        const mapped = rankedItems
            .filter((item) => isRankedItem(item))
            .map((item) => rankedToBatchItem(item));
        if (mapped.length)
            return mapped;
    }
    catch {
        // fallback to batch below
    }
    const modes = ["fast", "geo"];
    const out = [];
    const seen = new Set();
    for (const mode of modes) {
        const batchUrl = `${requestUrl.protocol}//${requestUrl.host}/api/batch?year=${params.year}&country=${params.countryQid}&mode=${mode}`;
        try {
            const payload = await fetchJsonWithTimeout(batchUrl, { method: "GET", headers: { accept: "application/json" } }, 55_000);
            const rows = Array.isArray(payload) ? payload : [];
            for (const row of rows) {
                if (!isBatchItem(row))
                    continue;
                const qid = row.qid.toUpperCase();
                if (seen.has(qid))
                    continue;
                seen.add(qid);
                out.push({ ...row, qid });
            }
        }
        catch {
            // keep trying other mode
        }
    }
    return out;
}
function parseOpenAIOutput(payload) {
    const parsed = payload;
    const value = parsed.output_parsed;
    if (!value)
        return null;
    const fact = String(value.fact || "").trim();
    const beforeState = String(value.before_state || "").trim();
    const afterState = String(value.after_state || "").trim();
    const narrativeTemplateRaw = (value.narrative_template || null);
    const narrativeTemplate = narrativeTemplateRaw &&
        typeof narrativeTemplateRaw.instant === "string" &&
        typeof narrativeTemplateRaw.before === "string" &&
        typeof narrativeTemplateRaw.after === "string"
        ? {
            instant: String(narrativeTemplateRaw.instant || "").trim(),
            before: String(narrativeTemplateRaw.before || "").trim(),
            after: String(narrativeTemplateRaw.after || "").trim()
        }
        : undefined;
    const gestureChanged = String(value.gesture_changed || "").trim();
    const materialAnchor = String(value.material_anchor || "").trim();
    const ruptureTestRaw = (value.rupture_test || null);
    const ruptureTest = {
        geste_modifie: ruptureTestRaw?.geste_modifie === true,
        duree_longue: ruptureTestRaw?.duree_longue === true,
        impact_quotidien: ruptureTestRaw?.impact_quotidien === true
    };
    const evidenceRaw = Array.isArray(value.evidence) ? value.evidence : [];
    const evidence = evidenceRaw
        .map((item) => ({
        quote: String(item.quote || "").trim(),
        source_url: String(item.source_url || "").trim()
    }))
        .filter((item) => item.quote && item.source_url);
    const placeSelected = value.place_selected === null ? null : String(value.place_selected || "").trim();
    if (!fact || !beforeState || !afterState || !gestureChanged || !materialAnchor)
        return null;
    return {
        fact,
        before_state: beforeState,
        after_state: afterState,
        narrative_template: narrativeTemplate,
        gesture_changed: gestureChanged,
        material_anchor: materialAnchor,
        rupture_test: ruptureTest,
        evidence,
        place_selected: placeSelected || null
    };
}
function knownRuleForWikipediaUrl(url) {
    const value = String(url || "");
    for (const rule of KNOWN_EVENT_RULES) {
        if (rule.pattern.test(value))
            return rule;
    }
    return null;
}
function buildHeuristicStructural(params) {
    const leadSentence = String(params.wikiLead || "")
        .split(/[.!?]\s+/)
        .map((part) => part.trim())
        .find(Boolean) || params.eventLabel;
    const cleanedLead = leadSentence.replace(/\s+/g, " ").replace(/\(.*?\)/g, "").trim();
    const evidenceQuote = cleanedLead.split(/\s+/).slice(0, 25).join(" ");
    function humanDate(iso, lang) {
        const m = String(iso || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (!m)
            return iso;
        const [, y, mo, d] = m;
        if (lang === "fr") {
            const months = [
                "janvier",
                "fevrier",
                "mars",
                "avril",
                "mai",
                "juin",
                "juillet",
                "aout",
                "septembre",
                "octobre",
                "novembre",
                "decembre"
            ];
            return `${Number(d)} ${months[Number(mo) - 1]} ${y}`;
        }
        return `${y}-${mo}-${d}`;
    }
    const dateHuman = humanDate(params.date, params.lang);
    const known = knownRuleForWikipediaUrl(params.wikipediaUrl);
    const placeName = known?.placeName || params.placeName;
    const materialAnchor = known?.materialAnchor || `${placeName} - ${params.materialElement}`;
    const fallbackGesture = `A partir de ce jour, tu dois presenter ${params.materialElement} au guichet pour finaliser la demarche.`;
    const fallbackBefore = `Avant le ${dateHuman}, au ${placeName}, la procedure se fait sans ${params.materialElement}.`;
    const fallbackAfter = `Apres le ${dateHuman}, au ${placeName}, la procedure impose ${params.materialElement} pour continuer.`;
    const factVerb = params.ruptureType === ruptureTaxonomy_1.RuptureType.LEGAL_REGULATORY
        ? "entre en vigueur"
        : params.ruptureType === ruptureTaxonomy_1.RuptureType.INFRA_SERVICE
            ? "est mise en service"
            : params.ruptureType === ruptureTaxonomy_1.RuptureType.TECH_PUBLIC
                ? "devient utilisable par le public"
                : "debute";
    const fallbackFact = `Le ${dateHuman}, ${params.eventLabel} ${factVerb}. ${cleanedLead}.`;
    if (params.lang === "fr") {
        const beforeState = known?.beforeState || fallbackBefore;
        const afterState = known?.afterState || fallbackAfter;
        const gestureChanged = known?.gestureChanged || fallbackGesture;
        const fact = known?.fact || fallbackFact;
        return {
            fact,
            before_state: beforeState,
            after_state: afterState,
            narrative_template: (0, narrativeTemplate_1.buildNarrativeTemplate)({
                date: params.date,
                placeName,
                gestureChanged,
                beforeState,
                afterState
            }),
            gesture_changed: gestureChanged,
            material_anchor: materialAnchor,
            rupture_test: { geste_modifie: true, duree_longue: true, impact_quotidien: true },
            evidence: evidenceQuote
                ? [{ quote: evidenceQuote, source_url: "" }]
                : [],
            place_selected: null
        };
    }
    const beforeState = `Before ${dateHuman}, at ${placeName}, this process is completed without ${params.materialElement}.`;
    const afterState = `After ${dateHuman}, at ${placeName}, this process requires ${params.materialElement}.`;
    const gestureChanged = `From this day on, you must present ${params.materialElement} at the counter.`;
    return {
        fact: `On ${dateHuman}, ${params.eventLabel} begins for public usage. ${cleanedLead}.`,
        before_state: beforeState,
        after_state: afterState,
        narrative_template: (0, narrativeTemplate_1.buildNarrativeTemplate)({
            date: params.date,
            placeName,
            gestureChanged,
            beforeState,
            afterState
        }),
        gesture_changed: gestureChanged,
        material_anchor: materialAnchor,
        rupture_test: { geste_modifie: true, duree_longue: true, impact_quotidien: true },
        evidence: evidenceQuote
            ? [{ quote: evidenceQuote, source_url: "" }]
            : [],
        place_selected: null
    };
}
function buildEvidenceFromLead(wikiLead, sourceUrl) {
    const sentence = String(wikiLead || "")
        .split(/[.!?]\s+/)
        .map((part) => part.trim())
        .find(Boolean) || "";
    const quote = sentence.split(/\s+/).slice(0, 25).join(" ").trim();
    if (!quote || !sourceUrl)
        return [];
    return [{ quote, source_url: sourceUrl }];
}
function knownPlaceCandidateFromRule(rule, fallbackSourceUrl) {
    if (!rule?.placeName || !rule.placeType)
        return null;
    return {
        id: `known|${rule.placeType}|${rule.placeName.toLowerCase()}`,
        type: rule.placeType,
        name: rule.placeName,
        qid: null,
        evidence: "heuristic",
        sourceUrl: rule.extraSources[0]?.url || fallbackSourceUrl
    };
}
function shouldRetrySameCandidate(code, attempt) {
    if (attempt >= 1)
        return false;
    return code === "vague_language" || code === "invalid_verb_for_type";
}
async function buildStableSceneForEvent(env, requestUrl, params) {
    const event = params.event;
    const knownRule = knownRuleForWikipediaUrl(event.wikipediaUrl);
    const isoDay = knownRule?.date || event.dateCandidates?.find((candidate) => dateToIsoDay(candidate)) || dateToIsoDay(event.date);
    if (!isoDay) {
        throw Object.assign(new Error("missing_precise_date"), {
            status: 422,
            code: "missing_precise_date",
            validationFlags: ["rejected:missing_precise_date"]
        });
    }
    const wikiLead = await (0, wiki_lead_js_1.getWikiLead)(event.wikipediaUrl);
    if (!wikiLead)
        throw Object.assign(new Error("Missing source context"), { status: 422, code: "missing_source_context" });
    const placeResolution = await (0, precisePlaceResolver_1.resolvePrecisePlace)({
        eventQid: event.qid,
        ruptureType: event.rupture_type,
        year: params.year,
        countryQid: params.countryQid,
        lang: params.lang,
        wikipediaUrl: event.wikipediaUrl,
        wikipediaLeadText: wikiLead,
        wikipediaInfobox: null,
        wikidataPlace: event.placeHints || null
    });
    const promptInput = (0, openaiPayload_1.buildScenePromptInput)({
        qid: event.qid,
        label: event.label,
        date: event.date,
        placeLabel: "",
        cityLabel: "",
        wikipediaUrl: event.wikipediaUrl,
        placeHints: event.placeHints
    }, event.rupture_type, placeResolution.candidates);
    const openaiRequestPayload = {
        ...promptInput,
        slot: 1,
        year: params.year,
        country: params.countryQid,
        lang: params.lang,
        source_context: { wikipediaUrl: event.wikipediaUrl, snippets: [wikiLead] },
        output_contract: {
            fact: "string",
            before_state: "string",
            after_state: "string",
            narrative_template: {
                instant: "string",
                before: "string",
                after: "string"
            },
            gesture_changed: "string",
            material_anchor: "string",
            rupture_test: {
                geste_modifie: "boolean",
                duree_longue: "boolean",
                impact_quotidien: "boolean"
            },
            evidence: [{ quote: "string", source_url: "string" }],
            place_selected: "string|null"
        }
    };
    const promptHash = await computePromptHash(openaiRequestPayload);
    const apiKey = String(env.OPENAI_API_KEY || "").trim();
    const fallbackMaterial = String(promptInput.required_material_elements?.[0] || "guichet");
    let lastError = null;
    for (let generationAttempt = 0; generationAttempt <= 1; generationAttempt += 1) {
        let structural = null;
        if (!apiKey) {
            structural = buildHeuristicStructural({
                lang: params.lang,
                date: isoDay,
                ruptureType: event.rupture_type,
                eventLabel: event.label,
                wikiLead,
                placeName: placeResolution.selected?.name || params.countryQid,
                materialElement: fallbackMaterial,
                wikipediaUrl: event.wikipediaUrl
            });
        }
        else {
            try {
                const openaiRaw = await fetchJsonWithTimeout(OPENAI_ENDPOINT, {
                    method: "POST",
                    headers: {
                        authorization: `Bearer ${apiKey}`,
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({
                        model: String(env.OPENAI_MODEL || "gpt-4.1-mini"),
                        input: [
                            {
                                role: "system",
                                content: [
                                    "You generate strict historical structural output in French or English.",
                                    "Return only valid JSON matching the provided schema (no prose outside JSON).",
                                    "fact: one precise, verifiable claim with explicit date anchor and rupture statement.",
                                    "before_state: concrete, observable state immediately before the rupture.",
                                    "after_state: concrete, observable state immediately after the rupture.",
                                    "narrative_template: short three-part template with instant, before, after.",
                                    "gesture_changed: imperative-style daily gesture change from next day.",
                                    "material_anchor: concrete place or object (site, office, ticket, station, etc.).",
                                    "evidence: at least one short quote (<=25 words) tied to a provided source_url.",
                                    "Set rupture_test booleans from evidence, not guesswork.",
                                    "before_state and after_state must be materially different.",
                                    "Select place_selected from provided place_candidates only.",
                                    "Never use vague phrases like 'les usages', 'adaptation immediate', or 'dans ce contexte'.",
                                    generationAttempt > 0
                                        ? "Previous attempt failed quality checks. Use stronger concrete wording and valid verb for rupture_type."
                                        : ""
                                ].join(" ")
                            },
                            {
                                role: "user",
                                content: JSON.stringify({
                                    ...openaiRequestPayload,
                                    editorial_constraints: {
                                        target_example_style: "three_cut_template",
                                        required_date: isoDay,
                                        event_label: event.label,
                                        event_raw_date: event.date,
                                        allowed_claim_templates: promptInput.allowed_claim_templates,
                                        required_material_elements: promptInput.required_material_elements,
                                        retry_reason: generationAttempt > 0 ? "previous_output_rejected_for_vague_or_invalid_verb" : "first_pass"
                                    }
                                })
                            }
                        ],
                        max_output_tokens: 500,
                        text: {
                            format: {
                                type: "json_schema",
                                name: "strict_scene_structural",
                                strict: true,
                                schema: {
                                    type: "object",
                                    additionalProperties: false,
                                    properties: {
                                        fact: { type: "string" },
                                        before_state: { type: "string" },
                                        after_state: { type: "string" },
                                        narrative_template: {
                                            type: "object",
                                            additionalProperties: false,
                                            properties: {
                                                instant: { type: "string" },
                                                before: { type: "string" },
                                                after: { type: "string" }
                                            },
                                            required: ["instant", "before", "after"]
                                        },
                                        gesture_changed: { type: "string" },
                                        material_anchor: { type: "string" },
                                        evidence: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                additionalProperties: false,
                                                properties: {
                                                    quote: { type: "string" },
                                                    source_url: { type: "string" }
                                                },
                                                required: ["quote", "source_url"]
                                            }
                                        },
                                        rupture_test: {
                                            type: "object",
                                            additionalProperties: false,
                                            properties: {
                                                geste_modifie: { type: "boolean" },
                                                duree_longue: { type: "boolean" },
                                                impact_quotidien: { type: "boolean" }
                                            },
                                            required: ["geste_modifie", "duree_longue", "impact_quotidien"]
                                        },
                                        place_selected: { type: ["string", "null"] }
                                    },
                                    required: [
                                        "fact",
                                        "before_state",
                                        "after_state",
                                        "narrative_template",
                                        "gesture_changed",
                                        "material_anchor",
                                        "evidence",
                                        "rupture_test",
                                        "place_selected"
                                    ]
                                }
                            }
                        }
                    })
                }, 18_000);
                structural = parseOpenAIOutput(openaiRaw);
            }
            catch {
                structural = null;
            }
        }
        if (!structural) {
            structural = buildHeuristicStructural({
                lang: params.lang,
                date: isoDay,
                ruptureType: event.rupture_type,
                eventLabel: event.label,
                wikiLead,
                placeName: placeResolution.selected?.name || params.countryQid,
                materialElement: fallbackMaterial,
                wikipediaUrl: event.wikipediaUrl
            });
        }
        if (knownRule && params.lang === "fr" && /^SEED-/i.test(event.qid)) {
            const knownPlaceName = knownRule.placeName || placeResolution.selected?.name || params.countryQid;
            const knownGesture = knownRule.gestureChanged || structural.gesture_changed;
            const knownBefore = knownRule.beforeState || structural.before_state;
            const knownAfter = knownRule.afterState || structural.after_state;
            structural = {
                ...structural,
                fact: knownRule.fact || structural.fact,
                before_state: knownBefore,
                after_state: knownAfter,
                gesture_changed: knownGesture,
                material_anchor: knownRule.materialAnchor || structural.material_anchor,
                narrative_template: (0, narrativeTemplate_1.buildNarrativeTemplate)({
                    date: isoDay,
                    placeName: knownPlaceName,
                    gestureChanged: knownGesture,
                    beforeState: knownBefore,
                    afterState: knownAfter
                })
            };
        }
        let selectedPlace = pickPlace(placeResolution.candidates, structural.place_selected) || placeResolution.selected;
        const knownPlace = knownPlaceCandidateFromRule(knownRule, event.wikipediaUrl);
        if ((!selectedPlace || selectedPlace.type === "city" || selectedPlace.type === "country") && knownPlace) {
            selectedPlace = knownPlace;
        }
        const sources = [
            { label: "Wikipedia", url: event.wikipediaUrl },
            ...(selectedPlace?.sourceUrl ? [{ label: "Official", url: selectedPlace.sourceUrl }] : []),
            ...(knownRule?.extraSources || []),
            { label: "Wikidata", url: `https://www.wikidata.org/wiki/${event.qid}` }
        ].filter((entry, index, arr) => arr.findIndex((x) => x.url === entry.url) === index);
        const evidence = structural.evidence?.length ? structural.evidence : buildEvidenceFromLead(wikiLead, event.wikipediaUrl);
        const normalizedEvidence = evidence.map((item) => ({
            quote: item.quote,
            source_url: item.source_url || event.wikipediaUrl
        }));
        const validation = validateStrict({
            date: isoDay,
            place: selectedPlace,
            ruptureType: event.rupture_type,
            fact: structural.fact,
            beforeState: structural.before_state,
            afterState: structural.after_state,
            gestureChanged: structural.gesture_changed,
            materialAnchor: structural.material_anchor,
            ruptureTest: structural.rupture_test,
            sources,
            placeFlags: placeResolution.flags
        });
        if (!validation.ok) {
            const failed = validation;
            lastError = { code: failed.code, message: failed.message, flags: failed.flags };
            logScene("scene_quality_reject", {
                year: params.year,
                country: params.countryQid,
                qid: event.qid,
                code: failed.code,
                flags: failed.flags,
                memory_binary_total: null
            });
            if (shouldRetrySameCandidate(failed.code, generationAttempt))
                continue;
            break;
        }
        const impact = (0, validateRuptureImpact_1.validateRuptureImpact)({
            ruptureType: event.rupture_type,
            fact: structural.fact,
            beforeState: structural.before_state,
            afterState: structural.after_state,
            gestureChanged: structural.gesture_changed,
            materialAnchor: structural.material_anchor,
            ruptureTest: structural.rupture_test,
            sources,
            evidence: normalizedEvidence,
            placeOk: (0, validateStrictPlace_1.evaluateStrictPlace)({
                selected: selectedPlace,
                ruptureType: event.rupture_type,
                datePrecision: "day",
                sourceUrls: sources.map((source) => source.url)
            }).ok,
            placeFlags: validation.flags
        });
        if (!impact.ok) {
            const failed = impact;
            lastError = { code: failed.code, message: failed.message, flags: failed.flags };
            logScene("scene_quality_reject", {
                year: params.year,
                country: params.countryQid,
                qid: event.qid,
                code: failed.code,
                flags: failed.flags,
                memory_binary_total: failed.memory.total
            });
            if (shouldRetrySameCandidate(failed.code, generationAttempt))
                continue;
            break;
        }
        const narrativeTemplate = structural.narrative_template || (0, narrativeTemplate_1.buildNarrativeTemplate)({
            date: isoDay,
            placeName: selectedPlace?.name || params.countryQid,
            gestureChanged: structural.gesture_changed,
            beforeState: structural.before_state,
            afterState: structural.after_state
        });
        const narrativeResult = await (0, renderNarrative_1.renderNarrativeCinematic)({
            lang: params.lang,
            date: isoDay,
            placeName: selectedPlace?.name || params.countryQid,
            fact: structural.fact,
            beforeState: structural.before_state,
            afterState: structural.after_state,
            gestureChanged: structural.gesture_changed,
            materialAnchor: structural.material_anchor
        }, {
            apiKey: String(env.OPENAI_API_KEY || "").trim(),
            model: String(env.OPENAI_MODEL || "gpt-4.1-mini")
        });
        logScene("scene_narrative_rendered", {
            year: params.year,
            country: params.countryQid,
            qid: event.qid,
            mode: narrativeResult.mode,
            flags: narrativeResult.flags
        });
        return {
            stable: {
                schema_version: SCHEMA_VERSION,
                country_qid: params.countryQid,
                year: params.year,
                lang: params.lang,
                event_qid: event.qid,
                date: isoDay,
                date_precision: "day",
                place: {
                    name: selectedPlace?.name || params.countryQid,
                    qid: selectedPlace?.qid || null,
                    type: (selectedPlace?.type || "country")
                },
                rupture_type: event.rupture_type,
                confidence: Number(event.confidence || 0),
                fact: structural.fact,
                before_state: structural.before_state,
                after_state: structural.after_state,
                gesture_changed: structural.gesture_changed,
                material_anchor: structural.material_anchor,
                rupture_test: structural.rupture_test,
                narrative_template: narrativeTemplate,
                narrative_text: narrativeResult.text,
                narrative_style: narrativeResult.style,
                sources,
                evidence: normalizedEvidence,
                validation_mode: "strict",
                generated_at: new Date().toISOString(),
                prompt_hash: promptHash
            },
            validationFlags: [...new Set([...validation.flags, ...impact.flags])]
        };
    }
    throw Object.assign(new Error(lastError?.message || "validation_failed"), {
        status: 422,
        code: lastError?.code || "validation_failed",
        validationFlags: lastError?.flags || []
    });
}
async function buildStableScene(env, requestUrl, params) {
    const pool = await fetchCandidatePool(requestUrl, {
        year: params.year,
        countryQid: params.countryQid,
        lang: params.lang
    });
    if (!pool.length) {
        throw Object.assign(new Error("no_candidates"), { status: 404, code: "no_candidates" });
    }
    const seen = new Set();
    const ordered = [];
    const requested = pool.find((item) => item.qid.toUpperCase() === params.eventQid.toUpperCase());
    if (requested) {
        ordered.push(requested);
        seen.add(requested.qid);
    }
    for (const candidate of pool) {
        if (seen.has(candidate.qid))
            continue;
        seen.add(candidate.qid);
        ordered.push(candidate);
    }
    const maxAttempts = Math.min(2, ordered.length);
    let lastValidationError = null;
    for (let index = 0; index < maxAttempts; index += 1) {
        const candidate = ordered[index];
        try {
            const result = await buildStableSceneForEvent(env, requestUrl, {
                year: params.year,
                countryQid: params.countryQid,
                lang: params.lang,
                event: candidate,
                rank: index + 1
            });
            logScene("scene_attempt", {
                year: params.year,
                country: params.countryQid,
                requested_qid: params.eventQid,
                qid: candidate.qid,
                rank: index + 1,
                validation_mode: result.stable.validation_mode || "strict",
                result: "accepted"
            });
            return result;
        }
        catch (error) {
            const e = error;
            if (e?.status === 422) {
                lastValidationError = e;
                logScene("scene_attempt", {
                    year: params.year,
                    country: params.countryQid,
                    requested_qid: params.eventQid,
                    qid: candidate.qid,
                    rank: index + 1,
                    validation_mode: "strict",
                    result: "rejected",
                    code: e.code || "validation_failed"
                });
                continue;
            }
            throw error;
        }
    }
    logScene("scene_total_failure", {
        year: params.year,
        country: params.countryQid,
        requested_qid: params.eventQid,
        errorCode: lastValidationError?.code || "validation_failed"
    });
    throw Object.assign(new Error(lastValidationError?.message || "validation_failed"), {
        status: 422,
        code: lastValidationError?.code || "validation_failed",
        validationFlags: Array.isArray(lastValidationError?.validationFlags) ? lastValidationError?.validationFlags : []
    });
}
async function handler(context) {
    if (!context.env.R2) {
        return json(500, { error: "missing_r2_binding" });
    }
    const requestUrl = new URL(context.request.url);
    const year = parseYear(requestUrl.searchParams.get("year"));
    const countryQid = parseCountryQid(requestUrl.searchParams.get("country"));
    const lang = parseLang(requestUrl.searchParams.get("lang"));
    const eventQid = parseQid(requestUrl.searchParams.get("qid"));
    const mode = parseMode(requestUrl.searchParams.get("mode"));
    if (!year || !countryQid || !eventQid) {
        return json(400, { error: "Invalid parameters. Expected year,country,qid." });
    }
    const key = r2Key(countryQid, year, eventQid, lang);
    try {
        const fromR2 = await getFromR2(context.env, key);
        let prisma = null;
        try {
            prisma = (context.env.__PRISMA_MOCK || (0, prisma_js_1.getPrismaClient)(context.env));
        }
        catch (prismaInitError) {
            if (fromR2) {
                return json(200, fromR2, immutableHeaders());
            }
            const result = await buildStableScene(context.env, requestUrl, { year, countryQid, lang, eventQid, mode });
            await putToR2(context.env, key, result.stable);
            return json(200, result.stable, immutableHeaders());
        }
        let dbRow = null;
        try {
            dbRow = await prisma.eventCache.findUnique({
                where: { year_countryQid_lang_eventQid: { year, countryQid, lang, eventQid } }
            });
        }
        catch {
            if (fromR2) {
                return json(200, fromR2, immutableHeaders());
            }
            const result = await buildStableScene(context.env, requestUrl, { year, countryQid, lang, eventQid, mode });
            await putToR2(context.env, key, result.stable);
            return json(200, result.stable, immutableHeaders());
        }
        if (fromR2) {
            if (dbRow?.status === "pending") {
                await prisma.eventCache.updateMany({
                    where: {
                        year,
                        countryQid,
                        lang,
                        eventQid,
                        status: "pending"
                    },
                    data: {
                        status: "ready",
                        date: fromR2.date,
                        datePrecision: fromR2.date_precision,
                        ruptureType: fromR2.rupture_type,
                        confidence: fromR2.confidence,
                        placeName: fromR2.place.name,
                        placeQid: fromR2.place.qid,
                        placeType: fromR2.place.type,
                        r2Key: key,
                        schemaVersion: fromR2.schema_version,
                        promptHash: fromR2.prompt_hash,
                        sourceUrls: fromR2.sources.map((source) => source.url),
                        errorCode: null,
                        errorMessage: null,
                        lockOwner: null,
                        lockExpiresAt: null,
                        updatedAt: new Date()
                    }
                });
            }
            return json(200, fromR2, immutableHeaders());
        }
        if (dbRow?.status === "ready" && dbRow?.r2Key) {
            const dbR2 = await getFromR2(context.env, dbRow.r2Key);
            if (dbR2) {
                return json(200, dbR2, immutableHeaders());
            }
        }
        if (dbRow?.status === "pending") {
            const lockExpiresAt = dbRow.lockExpiresAt ? new Date(dbRow.lockExpiresAt).getTime() : 0;
            if (lockExpiresAt > Date.now()) {
                return json(202, { status: "pending", event_qid: eventQid });
            }
        }
        const lock = await acquireLock(prisma, { year, countryQid, lang, eventQid });
        if (!lock.acquired) {
            return json(202, { status: "pending", event_qid: eventQid });
        }
        const lockOwner = lock.lockOwner;
        let stable;
        let validationFlags = [];
        try {
            const result = await buildStableScene(context.env, requestUrl, { year, countryQid, lang, eventQid, mode });
            stable = result.stable;
            validationFlags = result.validationFlags;
        }
        catch (error) {
            const e = error;
            const status = Number(e?.status || 500);
            const code = String(e?.code || "generation_failed");
            const message = String(e?.message || "generation_failed");
            const rejected = await prisma.eventCache.updateMany({
                where: {
                    year,
                    countryQid,
                    lang,
                    eventQid,
                    status: "pending",
                    lockOwner
                },
                data: {
                    status: "rejected",
                    errorCode: code,
                    errorMessage: message,
                    validationFlags: Array.isArray(e.validationFlags) ? e.validationFlags : null,
                    lockOwner: null,
                    lockExpiresAt: null,
                    updatedAt: new Date()
                }
            });
            if (rejected.count !== 1) {
                console.error(JSON.stringify({
                    level: "error",
                    event: "scene_lock_ownership_mismatch_rejected",
                    year,
                    countryQid,
                    lang,
                    eventQid,
                    lockOwner
                }));
                return json(202, { status: "pending", event_qid: eventQid });
            }
            if (status === 422) {
                return json(422, {
                    error: "validation_failed",
                    code,
                    flags: Array.isArray(e.validationFlags) ? e.validationFlags : []
                });
            }
            if (status === 404)
                return json(404, { error: code, message });
            if (status === 503)
                return json(503, { error: code, message });
            if (status === 504)
                return json(504, { error: code, message });
            throw error;
        }
        const ownershipStillValid = await hasLockOwnership(prisma, {
            year,
            countryQid,
            lang,
            eventQid,
            lockOwner
        });
        if (!ownershipStillValid) {
            console.error(JSON.stringify({
                level: "error",
                event: "scene_lock_ownership_mismatch_before_r2",
                year,
                countryQid,
                lang,
                eventQid,
                lockOwner
            }));
            return json(202, { status: "pending", event_qid: eventQid });
        }
        await putToR2(context.env, key, stable);
        const ready = await prisma.eventCache.updateMany({
            where: {
                year,
                countryQid,
                lang,
                eventQid,
                status: "pending",
                lockOwner
            },
            data: {
                status: "ready",
                date: stable.date,
                datePrecision: stable.date_precision,
                ruptureType: stable.rupture_type,
                confidence: stable.confidence,
                placeName: stable.place.name,
                placeQid: stable.place.qid,
                placeType: stable.place.type,
                r2Key: key,
                schemaVersion: stable.schema_version,
                promptHash: stable.prompt_hash,
                sourceUrls: stable.sources.map((source) => source.url),
                validationFlags: validationFlags.length ? validationFlags : null,
                errorCode: null,
                errorMessage: null,
                generatedAt: new Date(stable.generated_at),
                lockOwner: null,
                lockExpiresAt: null,
                updatedAt: new Date()
            }
        });
        if (ready.count !== 1) {
            console.error(JSON.stringify({
                level: "error",
                event: "scene_lock_ownership_mismatch_ready",
                year,
                countryQid,
                lang,
                eventQid,
                lockOwner
            }));
            return json(202, { status: "pending", event_qid: eventQid });
        }
        return json(200, stable, immutableHeaders());
    }
    catch (error) {
        const e = error;
        if (e?.status === 503) {
            return json(503, { error: String(e.code || "service_unavailable"), message: String(e.message || "service_unavailable") });
        }
        if (e?.status === 504) {
            return json(504, { error: String(e.code || "upstream_timeout"), message: String(e.message || "upstream_timeout") });
        }
        const detail = error instanceof Error ? error.message : "internal_error";
        return json(500, { error: "scene_request_failed", detail });
    }
}
async function onRequestOptions() {
    return new Response(null, { status: 204, headers: noStoreHeaders() });
}
exports.onRequestGet = handler;
exports.default = handler;
