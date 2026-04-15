function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

import { fetchYearOgImage } from '../lib/wikipedia-year-og.js';

function parseYear(raw) {
  const year = Number(String(raw || '').trim());
  if (!Number.isInteger(year) || year < 1000 || year > 2100) return null;
  return year;
}

/**
 * Pas de redirection automatique : les aperçus (Messenger, iOS, etc.) utilisent souvent
 * un UA « navigateur » ; une redirect immédiate les envoie vers l accueil et l og:image
 * redevient générique. Tout le monde reçoit le même HTML avec les meta OG complètes.
 */
function buildHtml({ year, shareUrl, ogImage }) {
  const title = `AvantMoi.com — ${year} en France`;
  const description = `Explore ton annee miroir ${year} sur AvantMoi : des scenes courtes inspirees d'evenements reels.`;
  const displayImage = ogImage || 'https://avantmoi.com/avantmoimachine.png';
  /** og:image sur le meme domaine : meilleure prise en charge par Meta / WhatsApp que Wikimedia en direct. */
  const metaImage = ogImage
    ? `https://avantmoi.com/api/share-og-image/${year}`
    : displayImage;
  const homeWithYear = `https://avantmoi.com/?year=${encodeURIComponent(String(year))}`;

  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${escapeHtml(shareUrl)}" />
    <meta property="og:site_name" content="AvantMoi.com" />
    <meta property="og:locale" content="fr_FR" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />
    <link rel="canonical" href="${escapeHtml(shareUrl)}" />
    <style>
      body { font-family: system-ui, sans-serif; margin: 0; padding: 24px; text-align: center;
        background: #0e1322; color: #f5f7fb; min-height: 100vh; box-sizing: border-box; }
      .card { max-width: 420px; margin: 0 auto; }
      img.hero { max-width: 100%; height: auto; border-radius: 12px; border: 1px solid #334060; }
      a.cta { display: inline-block; margin-top: 20px; padding: 12px 24px; background: #fff; color: #111;
        text-decoration: none; border-radius: 999px; font-weight: 600; }
      a.cta:hover { opacity: 0.92; }
      p.muted { color: #9dadcc; font-size: 14px; margin-top: 16px; }
    </style>
  </head>
  <body>
    <div class="card">
      <p><img class="hero" src="${escapeHtml(displayImage)}" alt="" loading="eager" /></p>
      <h1 style="font-size: 1.15rem; font-weight: 600;">${escapeHtml(title)}</h1>
      <p class="muted">${escapeHtml(description)}</p>
      <a class="cta" href="${escapeHtml(homeWithYear)}">Ouvrir dans AvantMoi</a>
      <p class="muted"><a href="https://avantmoi.com/" style="color: #7ab6ff;">avantmoi.com</a></p>
    </div>
  </body>
</html>`;
}

export async function onRequestGet(context) {
  const year = parseYear(context.params?.year);
  if (!year) {
    return Response.redirect('https://avantmoi.com/', 302);
  }

  const shareUrl = `https://avantmoi.com/share/${year}`;
  let ogImage = '';
  try {
    ogImage = await fetchYearOgImage(year);
  } catch {
    ogImage = '';
  }
  const html = buildHtml({ year, shareUrl, ogImage });

  return new Response(html, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'private, no-cache, must-revalidate'
    }
  });
}
