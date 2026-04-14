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

/** Les robots de prévisualisation doivent recevoir l HTML sans redirection instantanée ; sinon ils suivent l accueil et perdent l og:image spécifique à l année. */
function isSocialCrawler(userAgent) {
  const ua = String(userAgent || '').toLowerCase();
  return /facebookexternalhit|facebot|facebookcatalog|twitterbot|linkedinbot|slackbot|whatsapp|telegram|discordbot|pinterest|skypeuripreview|vkshare|embedly|outbrain|quora|slack-img|slackbot-linkpreview|opengraph|ia_archiver|vkshare|redditbot|applebot|slackbot|preview/i.test(
    ua
  );
}

function buildHtml({ year, shareUrl, ogImage, crawler }) {
  const title = `AvantMoi.com — ${year} en France`;
  const description = `Explore ton annee miroir ${year} sur AvantMoi : des scenes courtes inspirees d'evenements reels.`;
  const image = ogImage || 'https://avantmoi.com/avantmoimachine.png';

  const redirectHead = crawler
    ? ''
    : `<meta http-equiv="refresh" content="0; url=https://avantmoi.com/" />`;
  const redirectBody = crawler
    ? `<p><a href="https://avantmoi.com/">Continuer vers AvantMoi.com</a></p>`
    : `<script>window.location.replace('https://avantmoi.com/');</script>`;

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
    ${redirectHead}
  </head>
  <body>
    ${redirectBody}
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
  const ua = context.request.headers.get('user-agent') || '';
  const crawler = isSocialCrawler(ua);
  const html = buildHtml({ year, shareUrl, ogImage, crawler });

  return new Response(html, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=300, s-maxage=300',
      vary: 'User-Agent'
    }
  });
}

