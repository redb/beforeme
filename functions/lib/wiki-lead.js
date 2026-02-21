const WIKI_TIMEOUT_MS = 7000;

function normalizeWhitespace(text) {
  return String(text || '')
    .replace(/\[[^\]]*\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncateToSentence(text, maxChars = 1200) {
  const clean = normalizeWhitespace(text);
  if (clean.length <= maxChars) return clean;

  const slice = clean.slice(0, maxChars);
  const lastPunctuation = Math.max(slice.lastIndexOf('.'), slice.lastIndexOf('!'), slice.lastIndexOf('?'));
  if (lastPunctuation > 200) {
    return slice.slice(0, lastPunctuation + 1).trim();
  }
  return `${slice.trim()}...`;
}

function parseWikipediaUrl(sourceUrl) {
  try {
    const parsed = new URL(sourceUrl);
    const host = parsed.hostname.toLowerCase();
    const lang = host.split('.')[0];
    if (!host.endsWith('wikipedia.org')) return null;

    const pathMatch = parsed.pathname.match(/^\/wiki\/(.+)$/);
    if (!pathMatch) return null;
    const title = decodeURIComponent(pathMatch[1]).replaceAll('_', ' ').trim();
    if (!title) return null;
    return { lang, title };
  } catch {
    return null;
  }
}

async function fetchJsonWithRetry(url, retries = 1) {
  let lastError = null;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), WIKI_TIMEOUT_MS);
    try {
      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'User-Agent': 'AvantMoi/1.0 (contact: contact@avantmoi.com)'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP_${response.status}`);
      }
      return await response.json();
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
      }
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError || new Error('wiki_fetch_failed');
}

function extractLeadText(payload) {
  const pages = payload?.query?.pages || {};
  const firstPage = Object.values(pages)[0];
  return normalizeWhitespace(firstPage?.extract || '');
}

function buildWikiApiUrl(lang, title, includeIntroOnly) {
  const url = new URL(`https://${lang}.wikipedia.org/w/api.php`);
  url.searchParams.set('action', 'query');
  url.searchParams.set('format', 'json');
  url.searchParams.set('prop', 'extracts');
  url.searchParams.set('explaintext', '1');
  if (includeIntroOnly) {
    url.searchParams.set('exintro', '1');
  }
  url.searchParams.set('redirects', '1');
  url.searchParams.set('titles', title);
  url.searchParams.set('origin', '*');
  return url.toString();
}

export async function getWikiLead(sourceUrl) {
  const parsed = parseWikipediaUrl(sourceUrl);
  if (!parsed) return '';

  const { lang, title } = parsed;

  try {
    const introPayload = await fetchJsonWithRetry(buildWikiApiUrl(lang, title, true), 1);
    let lead = extractLeadText(introPayload);

    if (lead.length < 200) {
      const fullPayload = await fetchJsonWithRetry(buildWikiApiUrl(lang, title, false), 1);
      lead = extractLeadText(fullPayload);
    }

    if (!lead) return '';
    return truncateToSentence(lead, 1200);
  } catch {
    return '';
  }
}

export function parseWikipediaTitleFromUrl(sourceUrl) {
  const parsed = parseWikipediaUrl(sourceUrl);
  return parsed ? parsed.title : '';
}
