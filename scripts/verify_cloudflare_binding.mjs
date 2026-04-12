import { execFileSync } from "node:child_process";

const TARGET_PROJECT = "avantmoi";
const PUBLIC_DOMAIN = "avantmoi.com";

function readProjects() {
  const stdout = execFileSync(
    "npx",
    ["wrangler", "pages", "project", "list", "--json"],
    { encoding: "utf-8", stdio: ["ignore", "pipe", "pipe"] }
  );
  return JSON.parse(stdout);
}

function parseDomains(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

try {
  const projects = readProjects();
  if (!Array.isArray(projects)) {
    fail("[cloudflare-binding] Unexpected project list payload.");
  }

  const holders = projects
    .map((project) => ({
      name: project["Project Name"],
      domains: parseDomains(project["Project Domains"])
    }))
    .filter((project) => project.domains.includes(PUBLIC_DOMAIN));

  if (holders.length !== 1) {
    fail(
      `[cloudflare-binding] Expected exactly one Pages project to hold ${PUBLIC_DOMAIN}, found ${holders.length}.`
    );
  }

  const holder = holders[0];
  if (holder.name !== TARGET_PROJECT) {
    fail(
      `[cloudflare-binding] ${PUBLIC_DOMAIN} is attached to ${holder.name}, expected ${TARGET_PROJECT}. Fix the custom domain binding in Cloudflare Pages.`
    );
  }

  process.stdout.write(
    `[cloudflare-binding] OK: ${PUBLIC_DOMAIN} is attached to ${TARGET_PROJECT}.\n`
  );
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  fail(`[cloudflare-binding] Verification failed: ${message}`);
}
