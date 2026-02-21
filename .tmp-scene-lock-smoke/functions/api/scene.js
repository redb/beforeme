"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onRequestGet = void 0;
exports.onRequestOptions = onRequestOptions;
const prisma_js_1 = require("../lib/prisma.js");
const wiki_lead_js_1 = require("../lib/wiki-lead.js");
const openaiPayload_1 = require("../../src/lib/openaiPayload");
const precisePlaceResolver_1 = require("../../src/server/place/precisePlaceResolver");
const validateStrictPlace_1 = require("../../src/server/place/validateStrictPlace");
const OPENAI_ENDPOINT = "https://api.openai.com/v1/responses";
const SCHEMA_VERSION = "1.0";
const PENDING_TTL_MS = 90_000;
function parseYear(raw) {
    const value = Number(raw);
    return Number.isInteger(value) && value >= 1000 && value <= 2100 ? value : null;
}
function parseLang(raw) {
    return String(raw || "fr").toLowerCase().startsWith("fr") ? "fr" : "en";
}
function parseQid(raw) {
    const value = String(raw || "").trim().toUpperCase();
    return /^Q\d+$/.test(value) ? value : null;
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
    return parsed;
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
        return { ok: false, code: "missing_precise_place", message: "place resolver rejected selection", flags };
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
function parseOpenAIOutput(payload) {
    const parsed = payload;
    const value = parsed.output_parsed;
    if (!value)
        return null;
    const fact = String(value.fact || "").trim();
    const beforeState = String(value.before_state || "").trim();
    const afterState = String(value.after_state || "").trim();
    const placeSelected = value.place_selected === null ? null : String(value.place_selected || "").trim();
    if (!fact || !beforeState || !afterState)
        return null;
    return {
        fact,
        before_state: beforeState,
        after_state: afterState,
        place_selected: placeSelected || null
    };
}
async function buildStableScene(env, requestUrl, params) {
    const modes = params.mode === "fast" ? ["fast", "geo"] : ["geo", "fast"];
    let batchItems = [];
    for (const mode of modes) {
        try {
            const payload = await fetchJsonWithTimeout(`${requestUrl.protocol}//${requestUrl.host}/api/batch?year=${params.year}&country=${params.countryQid}&mode=${mode}`, { method: "GET", headers: { accept: "application/json" } }, 55_000);
            if (Array.isArray(payload)) {
                batchItems = payload.filter(isBatchItem);
            }
            if (batchItems.length)
                break;
        }
        catch {
            // ignore and try next mode
        }
    }
    if (!batchItems.length)
        throw Object.assign(new Error("No candidates"), { status: 404, code: "no_candidates" });
    const event = batchItems.find((item) => item.qid.toUpperCase() === params.eventQid.toUpperCase());
    if (!event)
        throw Object.assign(new Error("Event not found"), { status: 404, code: "event_not_found" });
    const isoDay = dateToIsoDay(event.date);
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
            place_selected: "string|null"
        }
    };
    const promptHash = await computePromptHash(openaiRequestPayload);
    const apiKey = String(env.OPENAI_API_KEY || "").trim();
    if (!apiKey)
        throw Object.assign(new Error("OPENAI_API_KEY missing"), { status: 500, code: "missing_openai_key" });
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
                    content: "Return only structural output. No narration. Select place_selected from provided place_candidates only."
                },
                { role: "user", content: JSON.stringify(openaiRequestPayload) }
            ],
            max_output_tokens: 260,
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
                            place_selected: { type: ["string", "null"] }
                        },
                        required: ["fact", "before_state", "after_state", "place_selected"]
                    }
                }
            }
        })
    }, 18_000);
    const structural = parseOpenAIOutput(openaiRaw);
    if (!structural)
        throw Object.assign(new Error("Invalid model output"), { status: 422, code: "invalid_model_output" });
    const selectedPlace = pickPlace(placeResolution.candidates, structural.place_selected) || placeResolution.selected;
    const sources = [
        { label: "Wikipedia", url: event.wikipediaUrl },
        ...(selectedPlace?.sourceUrl ? [{ label: "Official", url: selectedPlace.sourceUrl }] : [])
    ].filter((entry, index, arr) => arr.findIndex((x) => x.url === entry.url) === index);
    const validation = validateStrict({
        date: isoDay,
        place: selectedPlace,
        ruptureType: event.rupture_type,
        fact: structural.fact,
        beforeState: structural.before_state,
        afterState: structural.after_state,
        sources,
        placeFlags: placeResolution.flags
    });
    if (!validation.ok) {
        const failed = validation;
        throw Object.assign(new Error(failed.message), { status: 422, code: failed.code, validationFlags: failed.flags });
    }
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
            sources,
            generated_at: new Date().toISOString(),
            prompt_hash: promptHash
        },
        validationFlags: [...new Set(validation.flags)]
    };
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
        if (fromR2) {
            return json(200, fromR2, immutableHeaders());
        }
        const prisma = (context.env.__PRISMA_MOCK ||
            (0, prisma_js_1.getPrismaClient)(context.env));
        const dbRow = await prisma.eventCache.findUnique({
            where: { year_countryQid_lang_eventQid: { year, countryQid, lang, eventQid } }
        });
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
            await prisma.eventCache.update({
                where: { year_countryQid_lang_eventQid: { year, countryQid, lang, eventQid } },
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
            if (status === 422)
                return json(422, { error: code, message });
            if (status === 404)
                return json(404, { error: code, message });
            throw error;
        }
        await putToR2(context.env, key, stable);
        await prisma.eventCache.update({
            where: { year_countryQid_lang_eventQid: { year, countryQid, lang, eventQid } },
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
        return json(200, stable, immutableHeaders());
    }
    catch (error) {
        const detail = error instanceof Error ? error.message : "internal_error";
        return json(500, { error: "scene_request_failed", detail });
    }
}
async function onRequestOptions() {
    return new Response(null, { status: 204, headers: noStoreHeaders() });
}
exports.onRequestGet = handler;
exports.default = handler;
