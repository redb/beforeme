# Cahier Technique - BeforeMe (AvantMoi)

## 1. Objet
BeforeMe est une application web orientee partage social qui projette un utilisateur dans une "annee miroir" et affiche des micro-scenes historiques immersives.

Le produit est deploye en front statique (Vite) avec fonctions serverless (Cloudflare Functions) et cache persistant en base PostgreSQL via Prisma.

## 2. Perimetre fonctionnel
1. Saisie utilisateur:
- age
- ou annee de naissance
- lieu/pays (autodetection + saisie libre)
2. Calcul de l annee miroir.
3. Affichage d une anecdote a la fois.
4. Navigation par bouton `continuer`.
5. Bloc publicitaire non bloquant toutes les 5 anecdotes.
6. Partage facultatif a partir de la 3e anecdote.
7. Source historique discrete par anecdote.
8. Interface admin simple pour configuration pub et moderation cache.

## 3. Regles metier
## 3.1 Formules de calcul
- `currentYear = Math.floor(new Date().getFullYear())`
- Cas age:
  - `birthYear = currentYear - age`
  - `mirrorYear = birthYear - age`
- Cas annee de naissance:
  - `mirrorYear = 2 * birthYear - currentYear`

## 3.2 Contraintes
- Entrées invalides rejetees cote client.
- Annee miroir bornee aux annees positives et non futures.
- Donnees de pays normalisees ISO alpha-2.

## 4. Architecture technique
## 4.1 Frontend
- Stack: Vite + TypeScript (vanilla).
- Rendu: SPA legere avec query params.
- Routage: `/?year=YYYY&country=FR` (pas de framework routeur).
- Fichiers cle:
  - `/Users/jean-brunoricard/dev/BeforeMe/src/main.ts`
  - `/Users/jean-brunoricard/dev/BeforeMe/src/style.css`
  - `/Users/jean-brunoricard/dev/BeforeMe/src/lib/i18n.ts`

## 4.2 Backend serverless
- Plateforme: Cloudflare Functions.
- Runtime: Node.js.
- Endpoints exposes:
  - `/api/anecdote`
  - `/api/anecdotes`
  - `/api/history`
  - `/api/ad-config`
  - `/api/admin/events`

## 4.3 Persistance
- ORM: Prisma.
- Base: PostgreSQL (Supabase/Prisma Postgres selon environnement).
- Schema: `/Users/jean-brunoricard/dev/BeforeMe/prisma/schema.prisma`
- Tables:
  - `anecdote_cache`
  - `event_cache`
  - `vote`
  - `app_config`

## 5. Flux principal utilisateur
1. L utilisateur saisit son age ou son annee de naissance.
2. Le front calcule `mirrorYear`.
3. Le front appelle `/api/anecdote` avec `year`, `lang`, `country`, `scope`, `slot`.
4. La fonction lit le cache.
5. Si absent, warmup generation + ecriture cache.
6. Retour d un slot unique: `{ narrative, fact, url }`.
7. Le front affiche la scene, la source et les actions.

## 6. Pipeline anecdotes
## 6.1 Generation
- Cible: slots 1..20.
- Sources: Wikidata SPARQL + heuristiques de filtrage + generation narrative.
- Contraintes de style: scene courte, lisible mobile, 2e personne, scene observable.

## 6.2 Cache
- Clefs:
  - global: `g:{version}:{year}:{lang}`
  - local: `l:{version}:{year}:{country}:{lang}`
- Format payload:
```json
{
  "slots": [
    { "slot": 1, "narrative": "...", "fact": "...", "url": "..." }
  ],
  "createdAt": "ISO-8601"
}
```

## 6.3 Strategie
- Lecture cache prioritaire.
- Warmup uniquement en cache miss.
- Reponses deterministes par clef de cache.

## 7. UX, animations et rendu visuel
## 7.1 Etat de repos
- Fond video fixe (avec fallback image).
- Voile sombre constant.
- Interface sobre type cartes.

## 7.2 Interaction
- Au clic `me propulser` et `continuer`:
  - pulse de luminosite court
  - reveal texte/carte en transition
  - blocage nul de la navigation

## 7.3 Publicite
- Bloc non intrusif toutes les 5 anecdotes.
- Le bouton continuer reste actif independamment du chargement pub.

## 7.4 Partage
- A partir du slot 3:
  - `navigator.share` si disponible
  - fallback copie presse-papier

## 8. Internationalisation et localisation
- Langues supportees: FR, EN.
- Dictionnaire UI local.
- Pays autodetecte + override utilisateur.

## 9. API contract (resume)
## 9.1 `/api/anecdote`
Exemple:
`/api/anecdote?year=1968&lang=fr&country=FR&scope=global&slot=1`

Retour:
```json
{
  "slot": 1,
  "narrative": "...",
  "fact": "...",
  "url": "https://..."
}
```

## 9.2 `/api/anecdotes`
Retour multi-scenes par annee/pays/langue (pipeline FR prioritaire).

## 9.3 `/api/ad-config`
- Lecture config encart pub.
- Update protege via token admin.

## 9.4 `/api/admin/events`
- Operations de moderation/analyse cache (usage admin).

## 10. Securite et gouvernance
1. Cles secrete uniquement cote function.
2. Aucune cle privee exposee au frontend.
3. Endpoints admin proteges par token.
4. Pas de collecte de donnees personnelles utilisateur dans le flux principal.

## 11. Deploiement
## 11.1 Build
- Commande: `npm run build`
- Output: `dist`

## 11.2 Cloudflare
- Config: `/Users/jean-brunoricard/dev/BeforeMe/wrangler.jsonc`
- Redirect SPA: `public/_redirects`
- Deploy:
  - `npm run cf:deploy`

## 11.3 DNS Cloudflare
1. Domaine ajoute dans Cloudflare.
2. DNS Cloudflare en mode DNS only.
3. CNAME `www` vers `<site>.pages.dev`.
4. Apex selon recommandation Cloudflare (flattening/CNAME).

## 12. Variables d environnement
- `DATABASE_URL`
- `DIRECT_URL` (optionnel selon setup Prisma)
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `WIKIDATA_ENDPOINT`
- `ADMIN_TOKEN`

## 13. Performance et qualite
1. App front legere sans framework lourd.
2. Cache base pour limiter appels externes.
3. Reponses serverless courtes et reutilisables.
4. Build TS strict + bundling Vite.

## 14. Versionning
- Depot Git present et actif.
- Convention recommandee:
  - `main` stable
  - branches `codex/*` pour changements
  - tags de release par jalon produit

## 15. Points a valider (PO)
1. Niveau exact de "veracite historique" attendu sur toutes les scenes.
2. Politique finale de moderation des scenes.
3. Format final du module publicitaire (Adsense puis regie ethique).
4. Priorite FR-only vs multi-pays complet.
5. Politique de purge/rotation cache.
