import {
  classifyRupture,
  isEligibleRupture,
  classifyRuptureWithConfidence,
  type BatchEvent
} from "../../src/lib/ruptureClassifier";
import { type RuptureType } from "../../src/lib/ruptureTaxonomy";

interface SparqlValue {
  value?: string;
}

interface SparqlBinding {
  item?: SparqlValue;
  itemLabel?: SparqlValue;
  date?: SparqlValue;
  placeLabel?: SparqlValue;
  cityLabel?: SparqlValue;
  article?: SparqlValue;
  p276?: SparqlValue;
  p276Label?: SparqlValue;
  p131?: SparqlValue;
  p131Label?: SparqlValue;
  p159?: SparqlValue;
  p159Label?: SparqlValue;
  p291?: SparqlValue;
  p291Label?: SparqlValue;
}

interface SparqlResponse {
  results?: {
    bindings?: SparqlBinding[];
  };
}

interface FetchBindingsOptions {
  timeoutMs: number;
  retries?: number;
}

function headers(contentType = "application/json; charset=utf-8"): HeadersInit {
  return {
    "content-type": contentType,
    "cache-control": "no-store",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, OPTIONS",
    "access-control-allow-headers": "content-type",
  };
}

function json(status: number, payload: unknown): Response {
  return new Response(JSON.stringify(payload), { status, headers: headers() });
}

function parseYear(input: string | null): number | null {
  if (!input) return null;
  const year = Number(input);
  if (!Number.isInteger(year) || year < 1000 || year > 2100) return null;
  return year;
}

function parseCountry(input: string | null): string | null {
  if (!input) return null;
  const value = input.trim().toUpperCase();
  return /^Q\d+$/.test(value) ? value : null;
}

function extractQid(url?: string): string {
  const match = (url || "").match(/Q\d+/i);
  return match ? match[0].toUpperCase() : "";
}

function buildFastSparqlQueryByKeywords(
  year: number,
  countryQid: string,
  includeKeywords: string[],
  limit: number
): string {
  const includeFilter = includeKeywords
    .map((keyword) => `CONTAINS(?articleTitle, "${keyword.toLowerCase()}")`)
    .join(" || ");

  return `
SELECT DISTINCT ?item ?itemLabel ?date ?article ?sitelinks WHERE {
  VALUES ?country { wd:${countryQid} }
  ?item wdt:P17 ?country .

  {
    ?item wdt:P585 ?date .
    FILTER(YEAR(?date) = ${year})
  }
  UNION
  {
    ?item wdt:P577 ?date .
    FILTER(YEAR(?date) = ${year})
  }
  UNION
  {
    ?item wdt:P580 ?date .
    FILTER(YEAR(?date) = ${year})
  }

  OPTIONAL {
    ?frArticle schema:about ?item ;
               schema:isPartOf <https://fr.wikipedia.org/> .
  }
  OPTIONAL {
    ?enArticle schema:about ?item ;
               schema:isPartOf <https://en.wikipedia.org/> .
  }
  BIND(COALESCE(?frArticle, ?enArticle) AS ?article)
  FILTER(BOUND(?article))
  BIND(
    IF(
      STRSTARTS(STR(?article), "https://fr.wikipedia.org/wiki/"),
      STRAFTER(STR(?article), "https://fr.wikipedia.org/wiki/"),
      IF(
        STRSTARTS(STR(?article), "https://en.wikipedia.org/wiki/"),
        STRAFTER(STR(?article), "https://en.wikipedia.org/wiki/"),
        ""
      )
    ) AS ?articleTitleRaw
  )
  BIND(LCASE(?articleTitleRaw) AS ?articleTitle)

  OPTIONAL { ?item wikibase:sitelinks ?sitelinks . }

  FILTER(${includeFilter})

  FILTER(
    !CONTAINS(?articleTitle, "election") &&
    !CONTAINS(?articleTitle, "legislative") &&
    !CONTAINS(?articleTitle, "presidentielle") &&
    !CONTAINS(?articleTitle, "presidential") &&
    !CONTAINS(?articleTitle, "municipale") &&
    !CONTAINS(?articleTitle, "legislatives_de_1968_dans_la_loire") &&
    !CONTAINS(?articleTitle, "legislatives_de_1968_dans_la_haute-loire") &&
    !CONTAINS(?articleTitle, "legislatives_de_1968_dans_la_loire-atlantique") &&
    !CONTAINS(?articleTitle, "legislatives_de_1968_en_indre-et-loire") &&
    !CONTAINS(?articleTitle, "legislatives_de_1968_en_loir-et-cher") &&
    !CONTAINS(?articleTitle, "legislatives_de_1968_en_saone-et-loire") &&
    !CONTAINS(?articleTitle, "olympique") &&
    !CONTAINS(?articleTitle, "olympic")
  )
}
ORDER BY DESC(COALESCE(?sitelinks, 0)) DESC(?date)
LIMIT ${limit}
`.trim();
}

function buildGeoSparqlQuery(year: number, countryQid: string): string {
  return `
SELECT DISTINCT ?item ?itemLabel ?date ?article ?sitelinks WHERE {
  ?item wdt:P31/wdt:P279* wd:Q1656682 ;
        wdt:P585 ?date .
  FILTER(YEAR(?date) = ${year})

  {
    ?item wdt:P17 wd:${countryQid} .
  }
  UNION
  {
    ?item wdt:P276 ?place .
    ?place wdt:P131* ?admin .
    ?admin wdt:P17 wd:${countryQid} .
  }
  UNION
  {
    ?item wdt:P131* ?adminDirect .
    ?adminDirect wdt:P17 wd:${countryQid} .
  }

  OPTIONAL {
    ?frArticle schema:about ?item ;
               schema:isPartOf <https://fr.wikipedia.org/> .
  }
  OPTIONAL {
    ?enArticle schema:about ?item ;
               schema:isPartOf <https://en.wikipedia.org/> .
  }
  BIND(COALESCE(?frArticle, ?enArticle) AS ?article)
  FILTER(BOUND(?article))

  OPTIONAL { ?item wikibase:sitelinks ?sitelinks . }

  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }
}
ORDER BY DESC(COALESCE(?sitelinks, 0)) DESC(?date)
LIMIT 20
`.trim();
}

function cleanEvent(row: SparqlBinding): BatchEvent {
  const wikipediaUrl = row.article?.value || "";
  let label = row.itemLabel?.value || "";
  if (!label && wikipediaUrl) {
    const match = wikipediaUrl.match(/\/wiki\/(.+)$/);
    if (match) {
      label = decodeURIComponent(match[1]).replace(/_/g, " ");
    }
  }

  return {
    qid: extractQid(row.item?.value),
    label,
    date: row.date?.value || "",
    placeLabel: row.placeLabel?.value || "",
    cityLabel: row.cityLabel?.value || "",
    wikipediaUrl,
  };
}

type ClassifiedBatchEvent = BatchEvent & {
  rupture_type: RuptureType;
  confidence?: number;
};

type PlaceHints = NonNullable<BatchEvent["placeHints"]>;

async function fetchSparqlBindings(
  query: string,
  options: FetchBindingsOptions
): Promise<SparqlBinding[]> {
  const endpoint = "https://query.wikidata.org/sparql?format=json&query=" + encodeURIComponent(query);
  const retries = Math.max(0, options.retries ?? 1);
  let lastError: unknown = null;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs);
    try {
      const response = await fetch(endpoint, {
        method: "GET",
        signal: controller.signal,
        headers: {
          accept: "application/sparql-results+json, application/json",
          "user-agent": "AvantMoi/1.0 (contact: contact@avantmoi.com)",
        },
      });

      if (!response.ok) {
        throw new Error(`sparql_http_${response.status}`);
      }

      const raw = (await response.json()) as SparqlResponse;
      return Array.isArray(raw?.results?.bindings) ? raw.results!.bindings! : [];
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 220 * (attempt + 1)));
      }
    } finally {
      clearTimeout(timeout);
    }
  }
  throw lastError || new Error("sparql_failed");
}

function buildPlaceHintsQuery(qids: string[]): string {
  const values = qids.map((qid) => `wd:${qid}`).join(" ");
  return `
SELECT ?item ?p276 ?p276Label ?p131 ?p131Label ?p159 ?p159Label ?p291 ?p291Label WHERE {
  VALUES ?item { ${values} }
  OPTIONAL { ?item wdt:P276 ?p276 . }
  OPTIONAL { ?item wdt:P131 ?p131 . }
  OPTIONAL { ?item wdt:P159 ?p159 . }
  OPTIONAL { ?item wdt:P291 ?p291 . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }
}
`.trim();
}

function parsePlaceHints(bindings: SparqlBinding[]): Map<string, PlaceHints> {
  const map = new Map<string, PlaceHints>();
  for (const row of bindings) {
    const itemQid = extractQid(row.item?.value);
    if (!itemQid) continue;
    const existing = map.get(itemQid) || {};
    map.set(itemQid, {
      p276Qid: existing.p276Qid || extractQid(row.p276?.value),
      p276Label: existing.p276Label || row.p276Label?.value || null,
      p131Qid: existing.p131Qid || extractQid(row.p131?.value),
      p131Label: existing.p131Label || row.p131Label?.value || null,
      p159Qid: existing.p159Qid || extractQid(row.p159?.value),
      p159Label: existing.p159Label || row.p159Label?.value || null,
      p291Qid: existing.p291Qid || extractQid(row.p291?.value),
      p291Label: existing.p291Label || row.p291Label?.value || null
    });
  }
  return map;
}

async function enrichPlaceHints(
  events: ClassifiedBatchEvent[],
  timeoutMs: number
): Promise<ClassifiedBatchEvent[]> {
  if (!events.length) return events;
  const top = [...events]
    .sort((a, b) => Number(b.confidence || 0) - Number(a.confidence || 0))
    .slice(0, 12);
  const qids = [...new Set(top.map((item) => item.qid).filter(Boolean))];
  if (!qids.length) return events;

  const query = buildPlaceHintsQuery(qids);
  const bindings = await fetchSparqlBindings(query, {
    timeoutMs: Math.min(12000, timeoutMs),
    retries: 1
  });
  const hintsMap = parsePlaceHints(bindings);

  return events.map((event) => ({
    ...event,
    placeHints: hintsMap.get(event.qid)
  }));
}

export async function onRequestOptions(): Promise<Response> {
  return new Response(null, { status: 204, headers: headers("text/plain; charset=utf-8") });
}

export async function onRequestGet(context: { request: Request }): Promise<Response> {
  const requestUrl = new URL(context.request.url);
  const year = parseYear(requestUrl.searchParams.get("year"));
  const country = parseCountry(requestUrl.searchParams.get("country"));
  const mode = requestUrl.searchParams.get("mode") === "geo" ? "geo" : "fast";

  if (!year || !country) {
    return json(400, {
      error: "Missing or invalid query parameters. Expected ?year=YYYY&country=QID",
    });
  }

  const isLocal =
    requestUrl.hostname === "127.0.0.1" ||
    requestUrl.hostname === "localhost" ||
    requestUrl.hostname.endsWith(".local");
  const timeoutMs = isLocal ? 25000 : 55000;

  try {
    let bindings: SparqlBinding[] = [];
    if (mode === "geo") {
      const geoQuery = buildGeoSparqlQuery(year, country);
      bindings = await fetchSparqlBindings(geoQuery, { timeoutMs });
    } else {
      const legalQuery = buildFastSparqlQueryByKeywords(
        year,
        country,
        ["loi_", "_loi", "decret", "interdiction", "obligation", "legalisation", "law", "decree", "regulation"],
        12
      );
      const infraQuery = buildFastSparqlQueryByKeywords(
        year,
        country,
        ["inauguration", "ouverture", "mise_en_service", "lancement", "ligne", "station", "aeroport", "airport", "autoroute", "railway", "line", "festival"],
        12
      );
      const stateQuery = buildFastSparqlQueryByKeywords(
        year,
        country,
        ["attentat", "attaque", "explosion", "crash", "inondation", "seisme", "séisme", "attack", "pandemic", "earthquake"],
        12
      );

      const settled = await Promise.allSettled([
        fetchSparqlBindings(legalQuery, { timeoutMs, retries: 1 }),
        fetchSparqlBindings(infraQuery, { timeoutMs, retries: 1 }),
        fetchSparqlBindings(stateQuery, { timeoutMs, retries: 1 })
      ]);

      const chunks = settled
        .filter((result): result is PromiseFulfilledResult<SparqlBinding[]> => result.status === "fulfilled")
        .map((result) => result.value);

      if (chunks.length === 0) {
        return json(502, {
          error: "Wikidata SPARQL request failed",
          status: 504,
        });
      }

      bindings = chunks.flat();
    }

    const events = bindings
      .map(cleanEvent)
      .filter((event) => event.qid && event.label);

    const uniqueEvents = new Map<string, BatchEvent>();
    for (const event of events) {
      if (!uniqueEvents.has(event.qid)) {
        uniqueEvents.set(event.qid, event);
      }
    }

    const ruptureEvents: ClassifiedBatchEvent[] = [];
    for (const event of uniqueEvents.values()) {
      const eligibility = isEligibleRupture(event);
      if (!eligibility.ok) continue;

      const rupture = classifyRuptureWithConfidence(event);
      if (!rupture) continue;
      const ruptureType = rupture.type || classifyRupture(event);
      if (!ruptureType) continue;

      ruptureEvents.push({
        ...event,
        rupture_type: ruptureType,
        confidence: rupture.confidence
      });
    }

    const enriched = await enrichPlaceHints(ruptureEvents, timeoutMs).catch(() => ruptureEvents);
    return json(200, enriched.slice(0, 20));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "unknown_error";
    const statusMatch = errorMessage.match(/^sparql_http_(\d{3})$/);
    if (statusMatch) {
      return json(502, {
        error: "Wikidata SPARQL request failed",
        status: Number(statusMatch[1]),
      });
    }
    return json(500, {
      error: "Failed to query Wikidata",
      detail: errorMessage,
    });
  }
}
