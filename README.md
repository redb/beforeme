# BeforeMe - ton annee miroir

BeforeMe est un front Vite (statique) avec des fonctions Netlify. Tu entres ton age ou ton annee de naissance, puis tu arrives dans ton annee miroir avec une anecdote a la fois.

## Stack

- Vite
- TypeScript (vanilla)
- Netlify Functions
- Prisma Postgres (cache persistent)
- Query params: `/?year=YYYY&lang=fr|en&country=ISO2`

## Calcul annee miroir

- `currentYear = Math.floor(new Date().getFullYear())`
- Si age:
  - `birthYear = currentYear - age`
  - `mirrorYear = birthYear - age`
- Si annee de naissance:
  - `mirrorYear = 2 * birthYear - currentYear`

## Experience

- Une anecdote affichee a la fois
- Bouton `continuer`
- Ad break non bloquant toutes les 5 anecdotes
- Partage facultatif apres le slot 3 (`navigator.share` puis fallback clipboard)
- Source discrete: "inspire d un evenement reel"

## API anecdotes

Endpoint:

```txt
/api/anecdote?year=YYYY&lang=fr&country=FR&scope=global|local&slot=1..20
```

Cache keys:

- global: `g:{year}:{lang}`
- local: `l:{year}:{country}:{lang}`

Payload stocke en base:

```json
{
  "slots": [
    { "slot": 1, "narrative": "...", "fact": "...", "url": "..." }
  ],
  "createdAt": "..."
}
```

## Prisma

### 1) Schema

Le schema Prisma est dans `prisma/schema.prisma` (table `anecdote_cache`).

### 2) Variables d environnement

Configurer dans Netlify (et local):

```bash
DATABASE_URL=prisma+postgres://...
```

### 3) Migration depuis Supabase (optionnel)

```bash
SOURCE_DB_URL=postgresql://... \
TARGET_PRISMA_URL=prisma+postgres://... \
node scripts/migrate_cache_to_prisma_accelerate.mjs
```

## Developpement

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploiement Netlify

Le projet inclut:

- `netlify.toml`
  - build command: `npm run build`
  - publish dir: `dist`
  - functions dir: `netlify/functions`
  - redirects:
    - `/api/anecdote -> /.netlify/functions/anecdote`
    - `/api/history -> /.netlify/functions/history`
- `public/_redirects`
  - fallback SPA

Commandes:

```bash
npx netlify login
npx netlify init
npx netlify deploy
npx netlify deploy --prod
```

## Cloudflare (DNS only)

1. Ajoute le domaine custom dans Netlify.
2. Dans Cloudflare DNS:
   - `CNAME` pour `www` vers `<site>.netlify.app`
   - `CNAME` (ou flattening) pour `@` selon la reco Netlify
3. Attends la propagation DNS.
4. Verifie le certificat TLS dans Netlify.
