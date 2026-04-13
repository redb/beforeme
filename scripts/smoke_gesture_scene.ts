import assert from 'node:assert/strict';
import { onRequestGet } from '../functions/api/gesture-scene.ts';

async function fetchGesture(url: string) {
  return onRequestGet({ request: new Request(url) });
}

async function run() {
  const minitel = await fetchGesture('https://example.com/api/gesture-scene?year=1982&country=Q142&lang=fr&slot=1');
  assert.equal(minitel.status, 200);
  const minitelPayload = await minitel.json() as { gesture_id: string; matched_year: number; match_type: string };
  assert.equal(minitelPayload.gesture_id, 'fr-1982-minitel');
  assert.equal(minitelPayload.matched_year, 1982);
  assert.equal(minitelPayload.match_type, 'exact');

  const internet = await fetchGesture('https://example.com/api/gesture-scene?year=1994&country=Q142&lang=fr&slot=1');
  assert.equal(internet.status, 200);
  const internetPayload = await internet.json() as { gesture_id: string; matched_year: number; match_type: string };
  assert.equal(internetPayload.gesture_id, 'fr-1994-internet-grand-public');
  assert.equal(internetPayload.matched_year, 1994);
  assert.equal(internetPayload.match_type, 'exact');

  // Premium : pas de carte « année proche » — année sans geste exact au catalogue → 404
  const noExactYear = await fetchGesture('https://example.com/api/gesture-scene?year=1730&country=Q142&lang=fr&slot=1');
  assert.equal(noExactYear.status, 404);

  const missing = await fetchGesture('https://example.com/api/gesture-scene?year=1730&country=Q142&lang=fr&slot=99');
  assert.equal(missing.status, 404);

  console.log('gesture scene smoke: ok');
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
