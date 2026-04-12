# Mise en place - AvantMoi v1 Stable

## Verrou Cloudflare Pages

- projet Pages canonique : `avantmoi`
- domaine public canonique : `avantmoi.com`
- ancien projet a desattacher des que le switch est fait : `beforeme-temp-20260219`
- commande de verification : `npm run verify:cf-binding`

## Ce qui a été créé

- **docker-compose.yml** – Postgres 16 (user `beforeme`, password `beforeme`, DB `beforeme`, port 5432).
- **.dev.vars** – Variables pour `npm run cf:dev` (DATABASE_URL pointe vers ce Postgres).
- **.env** – Même DATABASE_URL pour `prisma migrate` et scripts.
- **Scripts npm** : `db:up`, `db:down`, `db:migrate`, `db:reset`.

## Étapes (avec Docker)

```bash
# 1. Postgres
npm run db:up

# 2. Attendre 2–3 s puis migrer
npm run db:migrate

# 3. (Optionnel) Clé OpenAI pour generer des scenes si cache vide
# Édite .dev.vars et ajoute : OPENAI_API_KEY=sk-...

# 4. Lancer l’app (arrête l’ancien cf:dev si port 8788 pris)
npm run cf:dev
```

Puis dans un autre terminal ou dans le navigateur :

```bash
curl "http://localhost:8788/api/candidates-ranked?year=1968&country=Q142&lang=fr&limit=5"
curl "http://localhost:8788/api/scene?year=1968&country=Q142&lang=fr&qid=SEED-FR-1968-CANNES&mode=fast"
```

Sans `OPENAI_API_KEY`, `/api/scene` repondra `503 missing_openai_key` si aucune scene prete n est deja en cache. Avec une cle valide, les scenes seront generees puis ecrites en R2 + PostgreSQL.

## Sans Docker

Si tu as déjà un Postgres (local ou distant) :

1. Mets son URL dans **.dev.vars** et **.env** (`DATABASE_URL=postgresql://...`).
2. Lance `npm run db:migrate`.
3. Puis `npm run cf:dev`.

## Réinitialiser la base

```bash
npm run db:reset
```

Supprime le volume Postgres, recrée le conteneur et réapplique les migrations.
