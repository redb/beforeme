import assert from "node:assert/strict";
import { onRequestGet as culturalGet } from "../functions/api/cultural-moment";
import type { EditorialTheme } from "../src/content/editorialTheme";

async function run() {
  const response = await culturalGet({
    request: new Request("https://example.com/api/cultural-moment?year=1984&country=Q142&lang=fr&slot=1")
  });
  assert.equal(response.status, 200);
  const payload = (await response.json()) as {
    theme?: EditorialTheme;
    moment_label?: string;
    category?: string;
    date?: string;
  };
  assert.ok(payload.theme);
  assert.ok(payload.moment_label);
  assert.ok(payload.category);
  assert.equal(String(payload.date || "").slice(0, 4), "1984");
  console.log("cultural moment smoke: ok");
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
