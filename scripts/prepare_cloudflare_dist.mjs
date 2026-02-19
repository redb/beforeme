import { copyFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const root = process.cwd();
const distDir = resolve(root, 'dist');
const cloudflareRedirects = resolve(root, 'public', '_redirects.cloudflare');
const cloudflareHeaders = resolve(root, 'public', '_headers');
const outputRedirects = resolve(distDir, '_redirects');
const outputHeaders = resolve(distDir, '_headers');

async function safeCopy(source, destination) {
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(source, destination);
}

async function main() {
  await safeCopy(cloudflareRedirects, outputRedirects);
  await safeCopy(cloudflareHeaders, outputHeaders);
  process.stdout.write('Cloudflare dist config prepared.\n');
}

main().catch((error) => {
  process.stderr.write(`Failed to prepare Cloudflare dist: ${String(error)}\n`);
  process.exit(1);
});
