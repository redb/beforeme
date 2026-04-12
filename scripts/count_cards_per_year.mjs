import { listCulturalEntries } from "../src/content/culturalMoments/index.ts";
import { listGestureEntries } from "../src/content/gestures/index.ts";
import { listInventionEntries } from "../src/content/inventions/index.ts";
import { listNotableBirthsForYear } from "../src/content/notableBirths/index.ts";

const START = 1925;
const END = new Date().getFullYear();
const cultural = listCulturalEntries("Q142", "fr");
const gestures = listGestureEntries("Q142", "fr");
const inventions = listInventionEntries("Q142", "fr");

const under = [];
for (let y = START; y <= END; y++) {
  const g = gestures.filter((e) => e.ruptureYear === y).length;
  const c = cultural.filter((e) => e.year === y).length;
  const i = inventions.filter((e) => e.releaseYear === y).length;
  const p = listNotableBirthsForYear(y, "fr").length;
  const n = g + c + i + p;
  if (n < 4) under.push({ y, n, g, c, i, p });
}
console.log("years with total < 4:", under.length);
console.log(JSON.stringify(under, null, 2));
