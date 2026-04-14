#!/usr/bin/env node
/**
 * Verifie qu une image OG est resoluble pour chaque annee miroir atteignable
 * (meme logique que functions/share/[year].js via functions/lib/wikipedia-year-og.js).
 *
 * Usage: node scripts/verify_share_year_images.mjs
 */

import { fetchYearOgImage } from '../functions/lib/wikipedia-year-og.js';

const CURRENT_YEAR = new Date().getFullYear();

function reachableMirrorYears() {
  const set = new Set();
  for (let birthYear = 1900; birthYear <= CURRENT_YEAR; birthYear += 1) {
    set.add(2 * birthYear - CURRENT_YEAR);
  }
  return [...set].sort((a, b) => a - b);
}

async function main() {
  const years = reachableMirrorYears();
  const missing = [];

  for (const y of years) {
    const url = await fetchYearOgImage(y);
    if (!url) {
      missing.push({ year: y, reason: 'no_image' });
    }
    await new Promise((r) => setTimeout(r, 120));
  }

  console.log(
    JSON.stringify(
      {
        currentYear: CURRENT_YEAR,
        mirrorYearCount: years.length,
        range: { min: years[0], max: years[years.length - 1] },
        ok: missing.length === 0,
        missing
      },
      null,
      2
    )
  );

  if (missing.length) {
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
