const WIKI_HEADERS = {
  Accept: "application/json",
  "User-Agent": "AvantMoi/1.0 (+https://avantmoi.com; Cloudflare Pages API)"
};

function parseYear(raw) {
  const year = Number(raw);
  if (!Number.isInteger(year) || year < 1 || year > 2100) return null;
  return year;
}

function normalizeLang(raw) {
  return String(raw || "").toLowerCase().startsWith("fr") ? "fr" : "en";
}

function responseHeaders(contentType = "application/json; charset=utf-8") {
  return {
    "Content-Type": contentType,
    "Cache-Control": "public, max-age=900",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      method: "GET",
      headers: WIKI_HEADERS,
      signal: controller.signal
    });
  } finally {
    clearTimeout(timer);
  }
}

/** Titres essayés dans l'ordre (article « année en France » puis page année). */
function wikipediaTitlesForYear(year, lang) {
  if (lang === "fr") {
    return [`${year}_en_France`, String(year)];
  }
  return [`${year}_in_France`, String(year)];
}

/**
 * Récupère l'extrait Wikipédia (REST summary) pour une année.
 * @returns {Promise<{ extract: string; pageUrl: string; pageTitle: string } | null>}
 */
async function fetchWikipediaYearExtract(year, lang) {
  const host = lang === "fr" ? "fr.wikipedia.org" : "en.wikipedia.org";
  const titles = wikipediaTitlesForYear(year, lang);
  const attempts = [];

  for (const title of titles) {
    const path = encodeURIComponent(title.replace(/ /g, "_"));
    const url = `https://${host}/api/rest_v1/page/summary/${path}`;
    const res = await fetchWithTimeout(url, 8000);
    if (!res.ok) {
      attempts.push({ title, status: res.status });
      continue;
    }
    let data;
    try {
      data = await res.json();
    } catch {
      attempts.push({ title, reason: "json_parse_error" });
      continue;
    }
    if (data.type === "disambiguation" || !data.extract) {
      attempts.push({ title, reason: "disambiguation_or_no_extract", type: data.type });
      continue;
    }
    const pageUrl = data.content_urls?.desktop?.page || `https://${host}/wiki/${encodeURIComponent(title)}`;
    return {
      extract: String(data.extract),
      pageUrl,
      pageTitle: data.title || title
    };
  }

  console.log(
    JSON.stringify({
      level: "warn",
      event: "history_wikipedia_miss",
      ts: new Date().toISOString(),
      year,
      lang,
      attempts
    })
  );
  return null;
}

function splitIntoSentences(text) {
  return String(text)
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 35 && s.length < 900);
}

function buildItemsFromExtract(extract, pageUrl) {
  const sentences = splitIntoSentences(extract);
  if (!sentences.length) {
    const compact = extract.trim();
    if (compact.length >= 40) {
      return [
        {
          label: compact.length > 120 ? `${compact.slice(0, 117)}…` : compact,
          summary: compact,
          url: pageUrl
        }
      ];
    }
    return [];
  }
  return sentences.slice(0, 5).map((s) => ({
    label: s.length > 120 ? `${s.slice(0, 117)}…` : s,
    summary: s,
    url: pageUrl
  }));
}

function isHistoryItem(value) {
  return Boolean(
    value &&
      typeof value === "object" &&
      typeof value.summary === "string" &&
      value.summary.length > 0 &&
      typeof value.label === "string" &&
      value.label.length > 0 &&
      typeof value.url === "string" &&
      value.url.length > 0
  );
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: responseHeaders()
  });
}

export async function onRequestGet(context) {
  const incoming = new URL(context.request.url);
  const year = parseYear(incoming.searchParams.get("year"));
  const lang = normalizeLang(incoming.searchParams.get("lang"));

  if (!year) {
    return new Response(JSON.stringify({ error: "Invalid year parameter" }), {
      status: 400,
      headers: responseHeaders()
    });
  }

  const wiki = await fetchWikipediaYearExtract(year, lang);
  if (!wiki) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: responseHeaders()
    });
  }

  const items = buildItemsFromExtract(wiki.extract, wiki.pageUrl).filter(isHistoryItem);
  if (!items.length) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: responseHeaders()
    });
  }

  console.log(
    JSON.stringify({
      level: "info",
      event: "history_wikipedia_served",
      ts: new Date().toISOString(),
      year,
      lang,
      pageTitle: wiki.pageTitle,
      itemCount: items.length
    })
  );

  return new Response(JSON.stringify(items.slice(0, 5)), {
    status: 200,
    headers: responseHeaders()
  });
}
