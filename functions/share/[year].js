function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function parseYear(raw) {
  const year = Number(String(raw || '').trim());
  if (!Number.isInteger(year) || year < 1000 || year > 2100) return null;
  return year;
}

async function fetchWikipediaThumbnail(year) {
  const pageTitle = `${year}_en_France`;
  const apiUrl =
    `https://fr.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&pithumbsize=1200&piprop=thumbnail&redirects=1&titles=${encodeURIComponent(pageTitle)}&origin=*`;
  try {
    const response = await fetch(apiUrl, {
      headers: { accept: 'application/json' }
    });
    if (!response.ok) return '';
    const payload = await response.json();
    const pages = payload?.query?.pages || {};
    const firstPage = Object.values(pages)[0];
    const source = String(firstPage?.thumbnail?.source || '').trim();
    return source || '';
  } catch {
    return '';
  }
}

function buildHtml({ year, shareUrl, ogImage }) {
  const title = `AvantMoi.com — ${year} en France`;
  const description = `Explore ton annee miroir ${year} sur AvantMoi : des scenes courtes inspirees d'evenements reels.`;
  const image = ogImage || 'https://avantmoi.com/avantmoimachine.png';

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
    <meta http-equiv="refresh" content="0; url=https://avantmoi.com/" />
  </head>
  <body>
    <script>window.location.replace('https://avantmoi.com/');</script>
  </body>
</html>`;
}

export async function onRequestGet(context) {
  const year = parseYear(context.params?.year);
  if (!year) {
    return Response.redirect('https://avantmoi.com/', 302);
  }

  const shareUrl = `https://avantmoi.com/share/${year}`;
  const ogImage = await fetchWikipediaThumbnail(year);
  const html = buildHtml({ year, shareUrl, ogImage });

  return new Response(html, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=3600'
    }
  });
}

