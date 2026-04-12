# AvantMoi v1 Stable

AvantMoi est un site Vite + TypeScript deploye sur Cloudflare Pages Functions.

La v1 publique est volontairement etroite :
- France uniquement
- francais uniquement
- une scene a la fois
- contenu strictement source
- Cloudflare Pages + Functions + R2 + Prisma

## Garde-fou domaine

- le projet Cloudflare Pages de reference est `avantmoi`
- le domaine public attendu est `avantmoi.com`
- verification manuelle/CI : `npm run verify:cf-binding`
- le deploy `npm run cf:deploy` echoue si `avantmoi.com` est attache a un autre projet Pages

## Contrat public

### UX
- un seul champ public : age ou annee de naissance
- calcul exact de l annee miroir
- une scene a la fois
- `continuer`
- partage facultatif
- pub non bloquante

### Calcul
- `currentYear = Math.floor(new Date().getFullYear())`
- si age :
  - `birthYear = currentYear - age`
  - `mirrorYear = birthYear - age`
- si annee de naissance :
  - `mirrorYear = 2 * birthYear - currentYear`

### Route publique
- home : `/`
- resultat : `/?year=1968`

## Chaine publique canonique

Le front public ne consomme que :
- `GET /api/candidates-ranked`
- `GET /api/scene`

### 1. Classement candidats

```txt
/api/candidates-ranked?year=1968&country=Q142&lang=fr&limit=20
```

Retour :

```json
{
  "year": 1968,
  "country_qid": "Q142",
  "lang": "fr",
  "generated_at": "2026-03-12T00:00:00.000Z",
  "items": [
    { "qid": "Q123", "title": "..." }
  ]
}
```

### 2. Scene canonique

```txt
/api/scene?year=1968&country=Q142&lang=fr&qid=Q123&mode=fast
```

Retour stable :

```json
{
  "schema_version": "1.0",
  "country_qid": "Q142",
  "year": 1968,
  "lang": "fr",
  "event_qid": "Q123",
  "date": "1968-05-18",
  "date_precision": "day",
  "place": { "name": "Palais des Festivals", "qid": "Q1564807", "type": "site" },
  "rupture_type": "FIRST_PUBLIC_DEMO",
  "confidence": 0.9,
  "fact": "...",
  "before_state": "...",
  "after_state": "...",
  "gesture_changed": "...",
  "material_anchor": "...",
  "rupture_test": {
    "geste_modifie": true,
    "duree_longue": true,
    "impact_quotidien": true
  },
  "narrative_template": { "version": "..." },
  "narrative_text": "...",
  "narrative_style": "cinematic_v1",
  "sources": [{ "label": "Wikipedia", "url": "https://fr.wikipedia.org/wiki/..." }],
  "evidence": [{ "quote": "...", "source_url": "https://fr.wikipedia.org/wiki/..." }],
  "validation_mode": "strict",
  "generated_at": "2026-03-12T00:00:00.000Z",
  "prompt_hash": "..."
}
```

## Pipeline scene

`/Users/jean-brunoricard/dev/BeforeMe/functions/api/scene.ts`

Ordre :
1. lookup R2
2. auto-heal DB si R2 pret et DB encore `pending`
3. lookup Prisma `EventCache`
4. lock ownership strict
5. generation structurelle stricte
6. validation stricte
7. ecriture R2
8. update DB `ready` uniquement si ownership toujours valide

Le pipeline refuse toute scene non sourcee.

## Front public

`/Users/jean-brunoricard/dev/BeforeMe/src/main.ts`

Regles :
- pas de selecteur pays public
- pas de geolocalisation publique
- pas de langue publique autre que `fr`
- partage et pub ne bloquent jamais la lecture

`/Users/jean-brunoricard/dev/BeforeMe/src/lib/anecdoteApi.ts` est le seul client public.

## Admin

- URL fixe : `/morgao/`
- pas de lien depuis le site
- `robots.txt` + meta `noindex`
- login Google uniquement
- gestion pub, stats, inspection des scenes

## Variables d environnement

Obligatoires en production :

```bash
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
```

Selon le setup :

```bash
OPENAI_MODEL=gpt-4.1-mini
PRISMA_ACCELERATE_URL=...
ADMIN_GOOGLE_CLIENT_ID=...apps.googleusercontent.com
ADMIN_GOOGLE_EMAILS=toi@domaine.fr
ADMIN_SESSION_SECRET=cle-longue
```

## Developpement local

```bash
npm install
npm run db:up
npm run db:migrate
npm run cf:dev
```

Verifier rapidement :

```bash
curl "http://localhost:8788/api/candidates-ranked?year=1968&country=Q142&lang=fr&limit=5"
curl "http://localhost:8788/api/scene?year=1968&country=Q142&lang=fr&qid=SEED-FR-1968-CANNES&mode=fast"
```

## Build et deploy

```bash
npm run build
npm run build:cf
npm run cf:deploy
```

## Notes de version

- pied de page versionne via `__APP_VERSION__`
- build id injecte via `__APP_BUILD_ID__`
- aucune reference Netlify sur le chemin critique v1
