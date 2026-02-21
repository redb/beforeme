import { readFile, writeFile } from 'node:fs/promises';

async function getWikiLead(sourceUrl) {
  try {
    const parsed = new URL(sourceUrl);
    if (!parsed.hostname.endsWith('wikipedia.org')) return '';
    const lang = parsed.hostname.split('.')[0];
    const match = parsed.pathname.match(/^\/wiki\/(.+)$/);
    if (!match) return '';
    const title = decodeURIComponent(match[1]).replaceAll('_', ' ');

    const buildUrl = (introOnly) => {
      const url = new URL(`https://${lang}.wikipedia.org/w/api.php`);
      url.searchParams.set('action', 'query');
      url.searchParams.set('format', 'json');
      url.searchParams.set('prop', 'extracts');
      url.searchParams.set('explaintext', '1');
      if (introOnly) url.searchParams.set('exintro', '1');
      url.searchParams.set('redirects', '1');
      url.searchParams.set('titles', title);
      url.searchParams.set('origin', '*');
      return url.toString();
    };

    const fetchExtract = async (introOnly) => {
      const response = await fetch(buildUrl(introOnly), {
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) return '';
      const payload = await response.json();
      const pages = payload?.query?.pages || {};
      const firstPage = Object.values(pages)[0];
      return String(firstPage?.extract || '').replace(/\[[^\]]*\]/g, '').replace(/\s+/g, ' ').trim();
    };

    let extract = await fetchExtract(true);
    if (extract.length < 200) extract = await fetchExtract(false);
    if (!extract) return '';
    return extract.length <= 1200 ? extract : `${extract.slice(0, 1200)}...`;
  } catch {
    return '';
  }
}

async function mapWithConcurrency(items, concurrency, worker) {
  const results = new Array(items.length);
  let cursor = 0;

  async function runOne() {
    while (true) {
      const index = cursor;
      cursor += 1;
      if (index >= items.length) return;
      results[index] = await worker(items[index], index);
    }
  }

  const runners = Array.from({ length: Math.max(1, Math.min(concurrency, 3)) }, () => runOne());
  await Promise.all(runners);
  return results;
}

async function main() {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3] || '';
  if (!inputPath) {
    console.error('Usage: pnpm enrich:wikileads <input.json> [output.json]');
    process.exit(1);
  }

  const raw = await readFile(inputPath, 'utf8');
  const payload = JSON.parse(raw);
  const year = Number(payload?.year);
  const country = String(payload?.country || '').toUpperCase();
  const items = Array.isArray(payload?.items) ? payload.items : [];

  const enriched = await mapWithConcurrency(items, 3, async (item) => {
    const wikiLead = await getWikiLead(String(item?.sourceUrl || ''));
    if (!wikiLead) return { ...item, wikiLead: '', invalidReason: 'missing_wikiLead' };
    return { ...item, wikiLead };
  });

  const result = { year, country, items: enriched };
  const serialized = JSON.stringify(result, null, 2);
  if (outputPath) {
    await writeFile(outputPath, serialized, 'utf8');
  } else {
    process.stdout.write(`${serialized}\n`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
