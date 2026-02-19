# AvantMoi

Site statique Vite + TS avec Netlify Functions.

## Points cle

- Calcul annee miroir:
  - `currentYear = Math.floor(new Date().getFullYear())`
  - si age: `birthYear = currentYear - age`, `mirrorYear = birthYear - age`
  - si annee de naissance: `mirrorYear = 2 * birthYear - currentYear`
- Une anecdote a la fois
- Bloc pub non bloquant
- Partage facultatif
- Fond video fixe (`/public/tunnel-bg.mp4`)
- Admin simple (`/morgao/`) pour pub + suppression de fiches cachees

## Pipeline France-only (fonction Netlify)

Endpoint:

```txt
/api/anecdotes?year=1968&lang=fr
```

Retour:

```json
{
  "year": 1968,
  "country": "FR",
  "items": [
    { "scene": "...", "fact": "...", "sourceUrl": "...", "eventQid": "Q...", "title": "..." }
  ]
}
```

Etapes:

1. Recupere des candidats Wikidata (France uniquement, annee exacte)
2. Filtre/score dur via `netlify/functions/lib/filterEvents.js`
3. Prend top 6 puis tente de produire 3 scenes
4. Cache Prisma `EventCache` par `(year,country,lang,eventQid)`
5. Si cache existe: ressert direct
6. Sinon generation OpenAI + post-validation via `netlify/functions/lib/validateAnecdote.js` (max 3 tentatives)

## Schema Prisma

Fichier: `prisma/schema.prisma`

- `AnecdoteCache`
- `EventCache` (unique: `year,country,lang,eventQid`)
- `Vote` (unique: `year,country,lang,eventQid`)
- `AppConfig` (config encart pub)

Migration SQL:

- `prisma/migrations/20260219_pipeline_france_only/migration.sql`

## Variables d environnement

Configurer en local et Netlify:

```bash
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://... # optionnel selon setup Prisma
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o
WIKIDATA_ENDPOINT=https://query.wikidata.org/sparql
ADMIN_TOKEN=... # requis pour /api/admin/events et PUT /api/ad-config
```

## Developpement local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Cloudflare Pages (etape 1: preparation)

- Config Pages: `wrangler.jsonc`
- Build Cloudflare: `npm run build:cf`
- Lancer local Cloudflare Pages: `npm run cf:dev`
- Deploy direct (quand on passera a l etape deploy): `npm run cf:deploy`

Notes:
- `build:cf` garde le build Vite standard puis remplace `dist/_redirects` par la version Cloudflare.
- Les routes API `/api/*` sont encore sur Netlify Functions a ce stade (migration API en etapes suivantes).

## Netlify

- Build command: `npm run build`
- Publish dir: `dist`
- Functions dir: `netlify/functions`
- Redirections:
  - `/api/anecdote -> /.netlify/functions/anecdote`
  - `/api/anecdotes -> /.netlify/functions/anecdotes`
  - `/api/history -> /.netlify/functions/history`
  - `/api/ad-config -> /.netlify/functions/ad-config`
  - `/api/admin/events -> /.netlify/functions/admin-events`
  - `/morgao -> /morgao/index.html`

Deploy:

```bash
npx netlify deploy
npx netlify deploy --prod
```

## DNS Cloudflare (DNS only)

1. Ajouter le domaine dans Netlify.
2. Dans Cloudflare:
   - `CNAME` `www` vers `<site>.netlify.app`
   - `CNAME` `@` (flattening) selon recommandation Netlify
3. Attendre propagation, puis verifier TLS sur Netlify.
