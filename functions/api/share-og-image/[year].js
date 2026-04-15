import { fetchYearOgImage, WIKI_USER_AGENT } from '../../lib/wikipedia-year-og.js';

function parseYear(raw) {
  const year = Number(String(raw || '').trim());
  if (!Number.isInteger(year) || year < 1000 || year > 2100) return null;
  return year;
}

const FALLBACK_IMAGE = 'https://avantmoi.com/avantmoimachine.png';

/**
 * Image servie depuis le meme domaine que le site : les crawlers Meta / WhatsApp
 * recuperent souvent mieux og:image en self-host qu’en URL Wikimedia directe.
 */
export async function onRequestGet(context) {
  const year = parseYear(context.params?.year);
  if (!year) {
    return Response.redirect(FALLBACK_IMAGE, 302);
  }

  let imageUrl = '';
  try {
    imageUrl = await fetchYearOgImage(year);
  } catch {
    imageUrl = '';
  }

  if (!imageUrl) {
    return Response.redirect(FALLBACK_IMAGE, 302);
  }

  const upstream = await fetch(imageUrl, {
    headers: {
      'User-Agent': WIKI_USER_AGENT,
      Accept: 'image/*,*/*;q=0.8'
    }
  });

  if (!upstream.ok || !upstream.body) {
    return Response.redirect(FALLBACK_IMAGE, 302);
  }

  const contentType = upstream.headers.get('content-type') || 'image/jpeg';

  return new Response(upstream.body, {
    status: 200,
    headers: {
      'content-type': contentType,
      'cache-control': 'public, max-age=86400, s-maxage=86400',
      'access-control-allow-origin': '*'
    }
  });
}
