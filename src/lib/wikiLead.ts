export type WikiLeadResult = {
  wikiLead: string;
  invalidReason?: string;
};

function normalizeWhitespace(text: string): string {
  return text.replace(/\[[^\]]*\]/g, '').replace(/\s+/g, ' ').trim();
}

function truncateToSentence(text: string, maxChars = 1200): string {
  const clean = normalizeWhitespace(text);
  if (clean.length <= maxChars) return clean;

  const slice = clean.slice(0, maxChars);
  const lastPunctuation = Math.max(slice.lastIndexOf('.'), slice.lastIndexOf('!'), slice.lastIndexOf('?'));
  if (lastPunctuation > 200) return slice.slice(0, lastPunctuation + 1).trim();
  return `${slice.trim()}...`;
}

function parseWikipediaUrl(sourceUrl: string): { lang: string; title: string } | null {
  try {
    const parsed = new URL(sourceUrl);
    if (!parsed.hostname.endsWith('wikipedia.org')) return null;
    const match = parsed.pathname.match(/^\/wiki\/(.+)$/);
    if (!match) return null;
    const lang = parsed.hostname.split('.')[0] ?? 'fr';
    const title = decodeURIComponent(match[1]).replaceAll('_', ' ').trim();
    if (!title) return null;
    return { lang, title };
  } catch {
    return null;
  }
}

async function fetchExtract(lang: string, title: string, introOnly: boolean): Promise<string> {
  const url = new URL(`https://${lang}.wikipedia.org/w/api.php`);
  url.searchParams.set('action', 'query');
  url.searchParams.set('format', 'json');
  url.searchParams.set('prop', 'extracts');
  url.searchParams.set('explaintext', '1');
  if (introOnly) url.searchParams.set('exintro', '1');
  url.searchParams.set('redirects', '1');
  url.searchParams.set('titles', title);
  url.searchParams.set('origin', '*');

  const response = await fetch(url.toString());
  if (!response.ok) return '';
  const payload = (await response.json()) as {
    query?: { pages?: Record<string, { extract?: string }> };
  };
  const page = payload.query?.pages ? Object.values(payload.query.pages)[0] : undefined;
  return normalizeWhitespace(page?.extract ?? '');
}

export async function getWikiLead(sourceUrl: string): Promise<string> {
  const parsed = parseWikipediaUrl(sourceUrl);
  if (!parsed) return '';

  let extract = await fetchExtract(parsed.lang, parsed.title, true);
  if (extract.length < 200) {
    extract = await fetchExtract(parsed.lang, parsed.title, false);
  }
  if (!extract) return '';
  return truncateToSentence(extract, 1200);
}
