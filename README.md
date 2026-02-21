# AvantMoi

Site statique Vite + TS avec Cloudflare Pages Functions.

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

## Pipeline France-only (fonction Cloudflare)

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
2. Filtre/score dur via `functions/api/anecdotes.js`
3. Prend top 6 puis tente de produire 3 scenes
4. Cache Prisma `EventCache` par `(year,country,lang,eventQid)`
5. Si cache existe: ressert direct
6. Sinon generation OpenAI + post-validation via `functions/api/anecdotes.js` (max 3 tentatives)

## Schema Prisma

Fichier: `prisma/schema.prisma`

- `AnecdoteCache`
- `EventCache` (unique: `year,country,lang,eventQid`)
- `Vote` (unique: `year,country,lang,eventQid`)
- `AppConfig` (config encart pub)

Migration SQL:

- `prisma/migrations/20260219_pipeline_france_only/migration.sql`

## Variables d environnement

Configurer en local et Cloudflare:

```bash
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://... # optionnel selon setup Prisma
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o
WIKIDATA_ENDPOINT=https://query.wikidata.org/sparql
ADMIN_GOOGLE_CLIENT_ID=...apps.googleusercontent.com
ADMIN_GOOGLE_EMAILS=toi@gmail.com
ADMIN_SESSION_SECRET=une-cle-longue-et-secrete
```

### Auth admin Google (`/morgao/`)

- Créer un OAuth Client ID Web dans Google Cloud.
- Ajouter les origines autorisées:
  - `https://avantmoi.com`
  - `https://www.avantmoi.com` (si utilisé)
  - URL preview Cloudflare si besoin
- Mettre le client ID dans `ADMIN_GOOGLE_CLIENT_ID`.
- Mettre l email admin dans `ADMIN_GOOGLE_EMAILS` (liste CSV possible).
- Mettre une clé forte dans `ADMIN_SESSION_SECRET` (min 32 chars).

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

## DNS Cloudflare (DNS only)

1. Ajouter le domaine dans Cloudflare Pages.
2. Dans Cloudflare:
   - `CNAME` `www` vers le domaine Pages cible
   - `CNAME` `@` selon ton setup DNS
3. Attendre propagation, puis verifier TLS sur Cloudflare.
