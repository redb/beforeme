# Cahier technique - AvantMoi v1 Stable

## 1. Objet

AvantMoi projette un visiteur dans une annee miroir et affiche une scene historique strictement sourcee.

La v1 publique est :
- France uniquement
- francais uniquement
- une scene a la fois
- Cloudflare uniquement

## 2. Regles metier

### 2.1 Calcul annee miroir
- `currentYear = Math.floor(new Date().getFullYear())`
- si age :
  - `birthYear = currentYear - age`
  - `mirrorYear = birthYear - age`
- si annee de naissance :
  - `mirrorYear = 2 * birthYear - currentYear`

### 2.2 Validation front
- champ unique
- age valide : entier `1..120`
- annee de naissance valide : `1900..currentYear`
- annee future rejetee

## 3. Architecture

### 3.1 Front
- stack : Vite + TypeScript vanilla
- entree publique : `/`
- route resultat : `/?year=YYYY`
- fichier principal : `/Users/jean-brunoricard/dev/BeforeMe/src/main.ts`
- client API public unique : `/Users/jean-brunoricard/dev/BeforeMe/src/lib/anecdoteApi.ts`

### 3.2 Backend serverless
- plateforme : Cloudflare Pages Functions
- runtime : Workers
- endpoint public classement :
  - `/api/candidates-ranked`
- endpoint public scene :
  - `/api/scene`
- endpoints admin :
  - `/api/ad-config`
  - `/api/admin/*`

### 3.3 Persistance
- base : PostgreSQL
- ORM : Prisma
- cache scene stable : Cloudflare R2
- meta cache et statut : table `event_cache`

## 4. Chaine publique canonique

### 4.1 Classement
Le front appelle :

```txt
/api/candidates-ranked?year=YYYY&country=Q142&lang=fr&limit=20
```

Le backend renvoie des candidats classes et strictement eligibles.

### 4.2 Scene
Le front demande ensuite une scene candidate :

```txt
/api/scene?year=YYYY&country=Q142&lang=fr&qid=Q...&mode=fast
```

Le backend :
1. lit R2
2. repare DB si besoin
3. pose un lock explicite
4. genere la structure
5. valide
6. ecrit R2
7. marque `ready`

## 5. Contrat scene

Le contrat public stable contient :
- `date`
- `date_precision`
- `place`
- `fact`
- `before_state`
- `after_state`
- `gesture_changed`
- `material_anchor`
- `rupture_test`
- `narrative_text`
- `sources`
- `evidence`

Le front n affiche jamais une scene non sourcee.

## 6. UX publique

### 6.1 Home
- `AvantMoi.com`
- un seul champ
- pas de selecteur pays
- pas de geolocalisation
- pas de langue publique exposee

### 6.2 Resultat
- `Tu es en {annee} en France`
- une seule carte
- bouton `continuer`
- pub douce apres 5 scenes
- partage apres 3 scenes

### 6.3 Etats d erreur
- `202` : attente propre
- `422` : candidat invalide, le client essaie le suivant
- `503` / `504` : indisponibilite amont, pas de faux fallback

## 7. Admin

- URL fixe : `/morgao/`
- Google login uniquement
- `robots.txt` + meta noindex
- modules :
  - stats Google Analytics
  - config pub
  - inspection des scenes et statuts

## 8. Observabilite et robustesse

Par defaut :
- validation inputs
- rate limiting sur endpoints publics critiques
- timeout sur appels externes
- retries limites
- logs JSON structures
- ownership strict sur lock de generation

## 9. Deploiement

- build Vite : `npm run build`
- build Cloudflare : `npm run build:cf`
- preview local : `npm run cf:dev`
- deploy : `npm run cf:deploy`

## 10. Hors perimetre public v1

Peuvent rester dans le repo sans faire partie du chemin public :
- anciens endpoints historiques
- anciens helpers experimentaux
- code multi-pays non expose
- code EN non expose
