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

  const nearby = await fetchGesture('https://example.com/api/gesture-scene?year=1911&country=Q142&lang=fr&slot=1');
  assert.equal(nearby.status, 200);
  const nearbyPayload = await nearby.json() as { gesture_id: string; matched_year: number; match_type: string };
  assert.equal(nearbyPayload.gesture_id, 'fr-1910-saint-germain-metro');
  assert.equal(nearbyPayload.matched_year, 1910);
  assert.equal(nearbyPayload.match_type, 'nearby');

  const missing = await fetchGesture('https://example.com/api/gesture-scene?year=1911&country=Q142&lang=fr&slot=99');
  assert.equal(missing.status, 404);

  console.log('gesture scene smoke: ok');
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
