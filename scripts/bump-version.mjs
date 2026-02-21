import { readFile, writeFile } from "node:fs/promises";

const PACKAGE_JSON_PATH = new URL("../package.json", import.meta.url);

function bumpPatch(version) {
  const match = String(version || "").trim().match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) return "0.0.1";

  const major = Number(match[1]);
  const minor = Number(match[2]);
  const patch = Number(match[3]) + 1;
  return `${major}.${minor}.${patch}`;
}

async function run() {
  const raw = await readFile(PACKAGE_JSON_PATH, "utf-8");
  const pkg = JSON.parse(raw);

  const nextVersion = bumpPatch(pkg.version);
  pkg.version = nextVersion;

  await writeFile(PACKAGE_JSON_PATH, `${JSON.stringify(pkg, null, 2)}\n`, "utf-8");
  console.log(`[version] bumped to ${nextVersion}`);
}

run().catch((error) => {
  console.error("[version] bump failed:", error instanceof Error ? error.message : String(error));
  process.exit(1);
});
