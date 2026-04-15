/**
 * Image Open Graph pour /share/{year} : vignette page Wikipédia « YYYY en France »,
 * ou première image de l article si pas de vignette (cas fréquent : pas d infobox).
 */

const FR_WIKI_API =
  'https://fr.wikipedia.org/w/api.php?action=query&format=json&origin=*';

/** Obligatoire : sans User-Agent, l API renvoie 403 (les Workers Cloudflare ont souvent un UA vide). */
const WIKI_USER_AGENT = 'AvantMoi/1.0 (https://avantmoi.com/)';

/** Eviter drapeaux, pictos de maintenance (ambox), sabliers « en cours », etc. */
const SKIP_FILE_REGEX =
  /ambox|circle-icons|hourglass|clock\.svg|currentevent|lock-|info_simple|wikimedia|commons-logo|pd-icon|flag|drapeau|fleur-de-lis|logo|coat of arms|armoiries|symbol|emblem|portal[-_]/i;

async function fetchJson(url, attempt = 1) {
  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
      'User-Agent': WIKI_USER_AGENT,
      'Api-User-Agent': WIKI_USER_AGENT
    }
  });
  if (response.status === 429 || response.status === 503) {
    if (attempt < 4) {
      await new Promise((r) => setTimeout(r, 400 * attempt));
      return fetchJson(url, attempt + 1);
    }
  }
  if (!response.ok) return null;
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function fetchFrenchYearPageThumbnail(year) {
  const pageTitle = `${year}_en_France`;
  const url = `${FR_WIKI_API}&prop=pageimages&pithumbsize=1200&piprop=thumbnail&redirects=1&titles=${encodeURIComponent(pageTitle)}`;
  const payload = await fetchJson(url);
  const pages = payload?.query?.pages || {};
  const firstPage = Object.values(pages)[0];
  if (firstPage?.missing) return '';
  const source = String(firstPage?.thumbnail?.source || '').trim();
  return source || '';
}

export async function fetchFirstArticleImageUrl(year) {
  const pageTitle = `${year}_en_France`;
  const listUrl = `${FR_WIKI_API}&prop=images&imlimit=25&titles=${encodeURIComponent(pageTitle)}`;
  const payload = await fetchJson(listUrl);
  const pages = payload?.query?.pages || {};
  const firstPage = Object.values(pages)[0];
  if (firstPage?.missing || !firstPage?.images?.length) return '';

  for (const im of firstPage.images) {
    const title = String(im?.title || '');
    if (!/^(Fichier|File):/i.test(title)) continue;
    if (SKIP_FILE_REGEX.test(title)) continue;

    const infoUrl = `${FR_WIKI_API}&prop=imageinfo&iiprop=url&iiurlwidth=1200&titles=${encodeURIComponent(title)}`;
    const infoPayload = await fetchJson(infoUrl);
    const infoPages = infoPayload?.query?.pages || {};
    const infoPage = Object.values(infoPages)[0];
    const info = infoPage?.imageinfo?.[0];
    const urlOut = String(info?.url || info?.thumburl || '').trim();
    if (urlOut) return urlOut;
  }

  return '';
}

export async function fetchYearOgImage(year) {
  const thumb = await fetchFrenchYearPageThumbnail(year);
  if (thumb) return thumb;
  return fetchFirstArticleImageUrl(year);
}
