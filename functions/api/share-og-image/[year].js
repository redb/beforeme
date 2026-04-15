import { fetchYearOgImage } from '../../lib/wikipedia-year-og.js';

const WIKI_UA = 'AvantMoi/1.0 (https://avantmoi.com/)';
const FALLBACK_IMAGE = 'https://avantmoi.com/avantmoimachine.png';

function parseYear(raw) {
  const year = Number(String(raw || '').trim());
  if (!Number.isInteger(year) || year < 1000 || year > 2100) return null;
  return year;
}

function yearFromContext(context) {
  const fromParams = context.params?.year;
  if (fromParams != null && fromParams !== '') {
    const y = parseYear(fromParams);
    if (y) return y;
  }
  const url = new URL(context.request.url);
  const m = url.pathname.match(/\/api\/share-og-image\/(\d{4})\/?$/);
  return m ? parseYear(m[1]) : null;
}

/**
 * Image servie depuis le meme domaine que le site (og:image pour Meta / WhatsApp).
 */
export async function onRequestGet(context) {
  try {
    const year = yearFromContext(context);
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
        'User-Agent': WIKI_UA,
        Accept: 'image/*,*/*;q=0.8'
      }
    });

    if (!upstream.ok) {
      return Response.redirect(FALLBACK_IMAGE, 302);
    }

    const buf = await upstream.arrayBuffer();
    if (!buf || buf.byteLength === 0) {
      return Response.redirect(FALLBACK_IMAGE, 302);
    }

    const contentType = upstream.headers.get('content-type') || 'image/jpeg';

    return new Response(buf, {
      status: 200,
      headers: {
        'content-type': contentType,
        'cache-control': 'public, max-age=86400, s-maxage=86400',
        'access-control-allow-origin': '*'
      }
    });
  } catch {
    return Response.redirect(FALLBACK_IMAGE, 302);
  }
}
