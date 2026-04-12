import assert from "node:assert/strict";
import { onRequestGet as gestureGet } from "../functions/api/gesture-scene";
import { onRequestGet as inventionGet } from "../functions/api/invention-scene";
import { onRequestGet as culturalGet } from "../functions/api/cultural-scene";
import { onRequestGet as notableGet } from "../functions/api/notable-born";
import { listGestureEntries } from "../src/content/gestures";
import { listInventionEntries } from "../src/content/inventions";
import { listCulturalEntries } from "../src/content/culturalMoments";
import { listNotableBirthsForYear } from "../src/content/notableBirths";
import type { EditorialTheme } from "../src/content/editorialTheme";
import { MAX_GESTURE_NEARBY_YEAR_DISTANCE } from "../src/server/gestures/selectGesture";
import { MAX_INVENTION_NEARBY_YEAR_DISTANCE } from "../src/server/inventions/selectInvention";
import { MAX_CULTURAL_NEARBY_YEAR_DISTANCE } from "../src/server/cultural/selectCulturalMoment";

const START_YEAR = 1925;
const CURRENT_YEAR = new Date().getFullYear();

function lastCompletePersonYear(): number {
  let year = CURRENT_YEAR;
  while (year >= START_YEAR) {
    if (listNotableBirthsForYear(year, "fr").length > 0) return year;
    year -= 1;
  }
  return START_YEAR;
}

const END_YEAR = lastCompletePersonYear();

type SeenState = {
  seenThemes: EditorialTheme[];
  seenGestureRoots: string[];
};

type RuntimeCard = {
  theme: EditorialTheme;
  gestureRoot: string;
  date: string;
  matchedYear: number;
  matchType: "exact" | "nearby";
};

function remember(state: SeenState, card: RuntimeCard) {
  state.seenThemes.push(card.theme);
  state.seenGestureRoots.push(card.gestureRoot);
  if (state.seenThemes.length > 6) state.seenThemes.shift();
  if (state.seenGestureRoots.length > 6) state.seenGestureRoots.shift();
}

function buildSceneParams(year: number, slot: number, state: SeenState): URLSearchParams {
  const params = new URLSearchParams({
    year: String(year),
    country: "Q142",
    lang: "fr",
    slot: String(slot)
  });
  const previousTheme = state.seenThemes.at(-1);
  const previousGestureRoot = state.seenGestureRoots.at(-1);
  if (previousTheme) params.set("previousTheme", previousTheme);
  if (previousGestureRoot) params.set("previousGestureRoot", previousGestureRoot);
  if (state.seenThemes.length) params.set("seenThemes", state.seenThemes.join(","));
  if (state.seenGestureRoots.length) params.set("seenGestureRoots", state.seenGestureRoots.join(","));
  return params;
}

function buildPersonParams(year: number, state: SeenState): URLSearchParams {
  const params = new URLSearchParams({
    year: String(year),
    lang: "fr",
    limit: "1"
  });
  const previousTheme = state.seenThemes.at(-1);
  const previousGestureRoot = state.seenGestureRoots.at(-1);
  if (previousTheme) params.set("previousTheme", previousTheme);
  if (previousGestureRoot) params.set("previousGestureRoot", previousGestureRoot);
  if (state.seenThemes.length) params.set("seenThemes", state.seenThemes.join(","));
  if (state.seenGestureRoots.length) params.set("seenGestureRoots", state.seenGestureRoots.join(","));
  return params;
}

function buildRequest(url: string, key: string): Request {
  return new Request(url, {
    headers: {
      "x-forwarded-for": key
    }
  });
}

async function fetchDaily(year: number, state: SeenState): Promise<RuntimeCard> {
  const response = await gestureGet({
    request: buildRequest(`https://example.com/api/gesture-scene?${buildSceneParams(year, 1, state).toString()}`, `audit-daily-${year}`)
  });
  assert.equal(response.status, 200, `daily_life runtime missing for ${year}`);
  const payload = (await response.json()) as {
    theme?: EditorialTheme;
    gesture_root?: string;
    date?: string;
    matched_year?: number;
    match_type?: "exact" | "nearby";
  };
  assert.equal(String(payload.date || "").slice(0, 4), String(payload.matched_year || ""), `daily_life year mismatch for ${year}`);
  assert.ok(payload.theme, `daily_life theme missing for ${year}`);
  assert.ok(payload.gesture_root, `daily_life gesture_root missing for ${year}`);
  assert.ok(payload.matched_year, `daily_life matched_year missing for ${year}`);
  assert.ok(payload.match_type, `daily_life match_type missing for ${year}`);
  if (payload.match_type === "nearby") {
    assert.ok(
      Math.abs(payload.matched_year! - year) <= MAX_GESTURE_NEARBY_YEAR_DISTANCE,
      `daily_life nearby gap too large for ${year}`
    );
  }
  return {
    theme: payload.theme!,
    gestureRoot: payload.gesture_root!,
    date: payload.date!,
    matchedYear: payload.matched_year!,
    matchType: payload.match_type!
  };
}

async function fetchPerson(year: number, state: SeenState): Promise<RuntimeCard> {
  const local = listNotableBirthsForYear(year, "fr");
  const response = await notableGet({
    request: buildRequest(`https://example.com/api/notable-born?${buildPersonParams(year, state).toString()}`, `audit-person-${year}`),
    env: {}
  });
  assert.equal(response.status, 200, `person runtime missing for ${year}`);
  const payload = (await response.json()) as {
    items?: Array<{ label?: string; birthDate?: string; theme?: EditorialTheme; gestureRoot?: string }>;
  };
  const item = payload.items?.[0];
  assert.ok(item, `person item missing for ${year}`);
  assert.equal(String(item.birthDate || "").slice(0, 4), String(year), `person year mismatch for ${year}`);
  assert.ok(item.theme, `person theme missing for ${year}`);
  assert.ok(item.gestureRoot, `person gestureRoot missing for ${year}`);
  if (local.length) {
    assert.ok(
      local.some((entry) => entry.name === item.label && entry.birthDate === item.birthDate),
      `person should resolve from local catalog for ${year}`
    );
  }
  return { theme: item.theme!, gestureRoot: item.gestureRoot!, date: item.birthDate!, matchedYear: year, matchType: "exact" };
}

async function fetchInvention(year: number, state: SeenState): Promise<RuntimeCard> {
  const response = await inventionGet({
    request: buildRequest(`https://example.com/api/invention-scene?${buildSceneParams(year, 1, state).toString()}`, `audit-invention-${year}`)
  });
  assert.equal(response.status, 200, `invention runtime missing for ${year}`);
  const payload = (await response.json()) as {
    theme?: EditorialTheme;
    gesture_root?: string;
    date?: string;
    matched_year?: number;
    match_type?: "exact" | "nearby";
  };
  assert.equal(String(payload.date || "").slice(0, 4), String(payload.matched_year || ""), `invention year mismatch for ${year}`);
  assert.ok(payload.theme, `invention theme missing for ${year}`);
  assert.ok(payload.gesture_root, `invention gesture_root missing for ${year}`);
  assert.ok(payload.matched_year, `invention matched_year missing for ${year}`);
  assert.ok(payload.match_type, `invention match_type missing for ${year}`);
  if (payload.match_type === "nearby") {
    assert.ok(
      Math.abs(payload.matched_year! - year) <= MAX_INVENTION_NEARBY_YEAR_DISTANCE,
      `invention nearby gap too large for ${year}`
    );
  }
  return {
    theme: payload.theme!,
    gestureRoot: payload.gesture_root!,
    date: payload.date!,
    matchedYear: payload.matched_year!,
    matchType: payload.match_type!
  };
}

async function fetchCultural(year: number, state: SeenState): Promise<RuntimeCard> {
  const response = await culturalGet({
    request: buildRequest(`https://example.com/api/cultural-scene?${buildSceneParams(year, 1, state).toString()}`, `audit-cultural-${year}`)
  });
  assert.equal(response.status, 200, `cultural runtime missing for ${year}`);
  const payload = (await response.json()) as {
    theme?: EditorialTheme;
    gesture_root?: string;
    date?: string;
    matched_year?: number;
    match_type?: "exact" | "nearby";
  };
  assert.equal(String(payload.date || "").slice(0, 4), String(payload.matched_year || ""), `cultural year mismatch for ${year}`);
  assert.ok(payload.theme, `cultural theme missing for ${year}`);
  assert.ok(payload.gesture_root, `cultural gesture_root missing for ${year}`);
  assert.ok(payload.matched_year, `cultural matched_year missing for ${year}`);
  assert.ok(payload.match_type, `cultural match_type missing for ${year}`);
  if (payload.match_type === "nearby") {
    assert.ok(
      Math.abs(payload.matched_year! - year) <= MAX_CULTURAL_NEARBY_YEAR_DISTANCE,
      `cultural nearby gap too large for ${year}`
    );
  }
  return {
    theme: payload.theme!,
    gestureRoot: payload.gesture_root!,
    date: payload.date!,
    matchedYear: payload.matched_year!,
    matchType: payload.match_type!
  };
}

async function auditRuntimeYear(year: number) {
  const state: SeenState = { seenThemes: [], seenGestureRoots: [] };
  for (const card of [
    await fetchDaily(year, state),
    await fetchPerson(year, state),
    await fetchInvention(year, state),
    await fetchCultural(year, state)
  ]) {
    remember(state, card);
  }
}

function nearestDelta(targetYear: number, years: number[]): number {
  return years.reduce((best, year) => {
    const delta = Math.abs(year - targetYear);
    return Math.min(best, delta);
  }, Number.POSITIVE_INFINITY);
}

async function main() {
  const gestureYears = [...new Set(listGestureEntries("Q142", "fr").map((entry) => entry.ruptureYear))];
  const inventionYears = [...new Set(listInventionEntries("Q142", "fr").map((entry) => entry.releaseYear))];
  const culturalYears = [...new Set(listCulturalEntries("Q142", "fr").map((entry) => entry.year))];
  const localPersonYears = Array.from({ length: END_YEAR - START_YEAR + 1 }, (_, index) => START_YEAR + index).filter(
    (year) => listNotableBirthsForYear(year, "fr").length > 0
  );
  const skippedYearsWithoutLocalPerson = Array.from(
    { length: END_YEAR - START_YEAR + 1 },
    (_, index) => START_YEAR + index
  ).filter((year) => !localPersonYears.includes(year));

  for (const year of localPersonYears) {
    assert.ok(
      nearestDelta(year, gestureYears) <= MAX_GESTURE_NEARBY_YEAR_DISTANCE,
      `missing exact daily_life (gesture) for year ${year} — premium: année catalogue = année demandée`
    );
    assert.ok(
      nearestDelta(year, inventionYears) <= MAX_INVENTION_NEARBY_YEAR_DISTANCE,
      `missing exact invention for year ${year} — premium: année catalogue = année demandée`
    );
    assert.ok(
      nearestDelta(year, culturalYears) <= MAX_CULTURAL_NEARBY_YEAR_DISTANCE,
      `missing exact cultural_moment for year ${year} — premium: année catalogue = année demandée`
    );
    await auditRuntimeYear(year);
  }

  const pendingCurrentYear = END_YEAR < CURRENT_YEAR ? CURRENT_YEAR : null;
  console.log(
    JSON.stringify(
      {
        requestedCoverageStart: START_YEAR,
        franceCoverageStart: localPersonYears[0] || START_YEAR,
        franceCoverageEnd: END_YEAR,
        pendingCurrentYear,
        auditedYears: localPersonYears.length,
        skippedYearsWithoutLocalPerson,
        exactCoverage: {
          daily: gestureYears.length,
          invention: inventionYears.length,
          cultural: culturalYears.length,
          personLocal: localPersonYears.length
        },
        premiumYearTolerance: {
          daily: MAX_GESTURE_NEARBY_YEAR_DISTANCE,
          invention: MAX_INVENTION_NEARBY_YEAR_DISTANCE,
          cultural: MAX_CULTURAL_NEARBY_YEAR_DISTANCE
        }
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
