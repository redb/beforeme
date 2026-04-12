/**
 * Passe chaque carte éditoriale (geste, invention, culturel) au même scanner que test:editorial-fr.
 * Affiche chaque échec ; code de sortie 1 si au moins une carte échoue.
 *
 *   npx tsx scripts/editorial/scan_every_record.ts
 */

import { assertEditorialRecord, collectEditorialRecordsForScan } from "../smoke_editorial_fr_catalog";

function main() {
  const records = collectEditorialRecordsForScan();
  const failures: string[] = [];

  for (const record of records) {
    try {
      assertEditorialRecord(record);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      failures.push(`${record.kind}:${record.id} — ${msg}`);
    }
  }

  if (failures.length) {
    console.error(`${failures.length} échec(s) sur ${records.length} cartes :\n`);
    for (const line of failures) console.error(line);
    process.exitCode = 1;
    return;
  }

  console.log(JSON.stringify({ ok: true, scanned: records.length }, null, 2));
}

main();
