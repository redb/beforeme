import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const root = process.cwd();
const distDir = resolve(root, 'dist');
const cloudflareRedirects = resolve(root, 'public', '_redirects.cloudflare');
const cloudflareHeaders = resolve(root, 'public', '_headers');
const outputRedirects = resolve(distDir, '_redirects');
const outputHeaders = resolve(distDir, '_headers');
const outputRoutes = resolve(distDir, '_routes.json');

async function safeCopy(source, destination) {
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(source, destination);
}

/** Invoquer les Functions uniquement pour /api/* (évite que /* → index.html prenne le pas). */
const routesConfig = {
  version: 1,
  include: ['/api/*'],
  exclude: []
};

async function main() {
  await safeCopy(cloudflareRedirects, outputRedirects);
  await safeCopy(cloudflareHeaders, outputHeaders);
  await writeFile(outputRoutes, JSON.stringify(routesConfig, null, 2), 'utf8');
  process.stdout.write('Cloudflare dist config prepared.\n');
}

main().catch((error) => {
  process.stderr.write(`Failed to prepare Cloudflare dist: ${String(error)}\n`);
  process.exit(1);
});
