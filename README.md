# BeforeMe

BeforeMe est une web app statique: l'utilisateur entre son année de naissance ou son âge, puis découvre son année miroir (`année de naissance - âge`) avec une anecdote et une image.

## Lancer en local

```bash
python3 -m http.server 4173
# puis ouvre http://localhost:4173
```

## Fonctionnalités

- Calcul de l'année miroir (avec estimation automatique si un seul champ est donné)
- Anecdote + image via API Wikipédia (FR)
- Bouton `Une autre anecdote`
- Partage social (Web Share API + liens FB/LinkedIn/Pinterest + copy caption Insta/TikTok)
- Zone publicitaire basse non intrusive (template AdSense prêt)

## GitHub

```bash
git init
git add .
git commit -m "feat: initial BeforeMe MVP"
# créer le repo GitHub puis:
git branch -M main
git remote add origin <URL_DU_REPO>
git push -u origin main
```

## Netlify

```bash
npx netlify status
npx netlify init
npx netlify deploy
npx netlify deploy --prod
```

Le projet inclut déjà un `netlify.toml` pour déployer le dossier racine en site statique.
