import assert from "node:assert/strict";
import { onRequestGet as gestureGet } from "../functions/api/gesture-scene";
import { onRequestGet as notableGet } from "../functions/api/notable-born";
import { onRequestGet as inventionGet } from "../functions/api/invention-scene";
import { onRequestGet as culturalGet } from "../functions/api/cultural-scene";
import type { EditorialTheme } from "../src/content/editorialTheme";

type Card = {
  kind: "daily" | "person" | "invention" | "cultural";
  theme: EditorialTheme;
  gestureRoot: string;
  date: string;
  matchedYear: number;
  matchType: "exact" | "nearby";
  expectedYear: number;
  editorialCluster?: string;
};

type SeenState = {
  seenThemes: EditorialTheme[];
  seenGestureRoots: string[];
  seenClusters: string[];
};

function buildSceneParams(year: number, rank: number, state: SeenState) {
  const params = new URLSearchParams({
    year: String(year),
    country: "Q142",
    lang: "fr",
    slot: String(rank)
  });
  const previousTheme = state.seenThemes.at(-1);
  const previousGestureRoot = state.seenGestureRoots.at(-1);
  if (previousTheme) params.set("previousTheme", previousTheme);
  if (previousGestureRoot) params.set("previousGestureRoot", previousGestureRoot);
  if (state.seenThemes.length) params.set("seenThemes", state.seenThemes.join(","));
  if (state.seenGestureRoots.length) params.set("seenGestureRoots", state.seenGestureRoots.join(","));
  if (state.seenClusters.length) params.set("seenClusters", state.seenClusters.join(","));
  return params;
}

function buildPersonParams(year: number, rank: number, state: SeenState) {
  const params = new URLSearchParams({ year: String(year), lang: "fr", limit: String(rank) });
  const previousTheme = state.seenThemes.at(-1);
  const previousGestureRoot = state.seenGestureRoots.at(-1);
  if (previousTheme) params.set("previousTheme", previousTheme);
  if (previousGestureRoot) params.set("previousGestureRoot", previousGestureRoot);
  if (state.seenThemes.length) params.set("seenThemes", state.seenThemes.join(","));
  if (state.seenGestureRoots.length) params.set("seenGestureRoots", state.seenGestureRoots.join(","));
  if (state.seenClusters.length) params.set("seenClusters", state.seenClusters.join(","));
  return params;
}

function remember(state: SeenState, card: Card) {
  state.seenThemes.push(card.theme);
  state.seenGestureRoots.push(card.gestureRoot);
  const c = String(card.editorialCluster || "").trim();
  if (c && !state.seenClusters.includes(c)) {
    state.seenClusters.push(c);
  }
  if (state.seenThemes.length > 6) state.seenThemes.shift();
  if (state.seenGestureRoots.length > 6) state.seenGestureRoots.shift();
  if (state.seenClusters.length > 20) state.seenClusters.shift();
}

async function fetchDaily(year: number, state: SeenState, rank = 1): Promise<Card> {
  const response = await gestureGet({
    request: new Request(`https://example.com/api/gesture-scene?${buildSceneParams(year, rank, state).toString()}`)
  });
  assert.equal(response.status, 200, `daily_life missing for ${year}`);
  const payload = (await response.json()) as {
    theme?: EditorialTheme;
    gesture_root?: string;
    date?: string;
    matched_year?: number;
    match_type?: "exact" | "nearby";
    editorial_cluster?: string;
  };
  assert.ok(payload.theme);
  assert.ok(payload.gesture_root);
  assert.ok(payload.matched_year);
  assert.ok(payload.match_type);
  assert.equal(payload.matched_year, year, "geste: année miroir = matched_year (premium)");
  const datePrefix = String(payload.date || "").slice(0, 4);
  if (/^\d{4}$/.test(datePrefix)) {
    assert.equal(Number(datePrefix), payload.matched_year, "geste: année dans la date = matched_year");
  }
  const editorialCluster =
    typeof payload.editorial_cluster === "string" && payload.editorial_cluster.trim()
      ? payload.editorial_cluster.trim()
      : undefined;
  return {
    kind: "daily",
    theme: payload.theme!,
    gestureRoot: payload.gesture_root!,
    date: payload.date!,
    matchedYear: payload.matched_year!,
    matchType: payload.match_type!,
    expectedYear: year,
    editorialCluster
  };
}

async function fetchPerson(year: number, state: SeenState, rank = 1): Promise<Card> {
  const response = await notableGet({
    request: new Request(`https://example.com/api/notable-born?${buildPersonParams(year, rank, state).toString()}`),
    env: {}
  });
  assert.equal(response.status, 200, `person missing for ${year}`);
  const payload = (await response.json()) as { items?: Array<{ theme?: EditorialTheme; gestureRoot?: string; birthDate?: string }> };
  const item = payload.items?.[rank - 1] || payload.items?.[0];
  assert.ok(item?.theme);
  assert.ok(item?.gestureRoot);
  assert.equal(String(item?.birthDate || "").slice(0, 4), String(year));
  return {
    kind: "person",
    theme: item.theme!,
    gestureRoot: item.gestureRoot!,
    date: item.birthDate!,
    matchedYear: year,
    matchType: "exact",
    expectedYear: year
  };
}

async function fetchInvention(year: number, state: SeenState, rank = 1): Promise<Card> {
  const response = await inventionGet({
    request: new Request(`https://example.com/api/invention-scene?${buildSceneParams(year, rank, state).toString()}`)
  });
  assert.equal(response.status, 200, `invention missing for ${year}`);
  const payload = (await response.json()) as {
    theme?: EditorialTheme;
    gesture_root?: string;
    date?: string;
    matched_year?: number;
    match_type?: "exact" | "nearby";
    editorial_cluster?: string;
  };
  assert.ok(payload.theme);
  assert.ok(payload.gesture_root);
  assert.ok(payload.matched_year);
  assert.ok(payload.match_type);
  assert.equal(payload.matched_year, year, "invention: année miroir = matched_year (premium)");
  const datePrefix = String(payload.date || "").slice(0, 4);
  if (/^\d{4}$/.test(datePrefix)) {
    assert.equal(Number(datePrefix), payload.matched_year, "invention: année dans la date = matched_year");
  }
  const editorialCluster =
    typeof payload.editorial_cluster === "string" && payload.editorial_cluster.trim()
      ? payload.editorial_cluster.trim()
      : undefined;
  return {
    kind: "invention",
    theme: payload.theme!,
    gestureRoot: payload.gesture_root!,
    date: payload.date!,
    matchedYear: payload.matched_year!,
    matchType: payload.match_type!,
    expectedYear: year,
    editorialCluster
  };
}

async function fetchCultural(year: number, state: SeenState, rank = 1): Promise<Card> {
  const response = await culturalGet({
    request: new Request(`https://example.com/api/cultural-scene?${buildSceneParams(year, rank, state).toString()}`)
  });
  assert.equal(response.status, 200, `cultural missing for ${year}`);
  const payload = (await response.json()) as {
    theme?: EditorialTheme;
    gesture_root?: string;
    date?: string;
    matched_year?: number;
    match_type?: "exact" | "nearby";
    editorial_cluster?: string;
  };
  assert.ok(payload.theme);
  assert.ok(payload.gesture_root);
  assert.ok(payload.matched_year);
  assert.ok(payload.match_type);
  assert.equal(payload.matched_year, year, "culturel: année miroir = matched_year (premium)");
  const datePrefix = String(payload.date || "").slice(0, 4);
  if (/^\d{4}$/.test(datePrefix)) {
    assert.equal(Number(datePrefix), payload.matched_year, "culturel: année dans la date = matched_year");
  }
  const editorialCluster =
    typeof payload.editorial_cluster === "string" && payload.editorial_cluster.trim()
      ? payload.editorial_cluster.trim()
      : undefined;
  return {
    kind: "cultural",
    theme: payload.theme!,
    gestureRoot: payload.gesture_root!,
    date: payload.date!,
    matchedYear: payload.matched_year!,
    matchType: payload.match_type!,
    expectedYear: year,
    editorialCluster
  };
}

/** Enchaîne les 4 scènes comme le client : mémoire thèmes / roots / clusters mise à jour après chaque carte. */
async function fetchCycle(year: number): Promise<Card[]> {
  const state: SeenState = { seenThemes: [], seenGestureRoots: [], seenClusters: [] };
  const daily = await fetchDaily(year, state);
  remember(state, daily);
  const person = await fetchPerson(year, state);
  remember(state, person);
  const invention = await fetchInvention(year, state);
  remember(state, invention);
  const cultural = await fetchCultural(year, state);
  remember(state, cultural);
  return [daily, person, invention, cultural];
}

async function run() {
  const years = [1968, 1982, 1994];
  const cards = (await Promise.all(years.map((year) => fetchCycle(year)))).flat();

  for (const card of cards) {
    assert.equal(card.matchedYear, card.expectedYear, `${card.kind}: année catalogue = année miroir`);
    if (card.kind === "person") {
      assert.equal(Number(card.date.slice(0, 4)), card.matchedYear);
    } else {
      assert.equal(card.matchType, "exact");
      const prefix = String(card.date || "").slice(0, 4);
      if (/^\d{4}$/.test(prefix)) {
        assert.equal(Number(prefix), card.matchedYear);
      }
    }
  }

  for (const year of years) {
    const yearCards = cards.filter((card) => card.expectedYear === year);
    assert.equal(yearCards.length, 4);
    assert.equal(new Set(yearCards.map((card) => card.kind)).size, 4);
  }

  const uniqueThemes = new Set(cards.map((card) => card.theme));
  assert.ok(uniqueThemes.size >= 4);

  console.log("story cycle smoke: ok");
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
