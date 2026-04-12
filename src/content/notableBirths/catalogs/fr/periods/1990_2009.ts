import type { NotableBirthEntry } from "../../../types";

// Ce fichier complète global.ts qui couvre déjà 1990–2000 et 2008.
// Seules les années réellement manquantes sont ici.
// Règle absolue : birthDate[0:4] === String(year), vérifiée individuellement.

export const FR_NOTABLE_BIRTH_BACKFILL_1990_2009: NotableBirthEntry[] = [
  // 2001 — Emma Chamberlain : 22 mai 2001 ✓ (YouTubeuse / influenceuse)
  {
    year: 2001, lang: "fr",
    name: "Emma Chamberlain",
    birthDate: "2001-05-22",
    wikipediaUrl: "https://fr.wikipedia.org/wiki/Emma_Chamberlain",
    qid: "Q57399023",
    theme: "loisirs", gestureRoot: "personnalite", editorialScore: 72,
    achievement: "Elle deviendra l'une des créatrices YouTube les plus influentes et ambassadrice Louis Vuitton à 20 ans."
  },
  // 2002 — Léon Marchand : 17 mai 2002 ✓
  {
    year: 2002, lang: "fr",
    name: "Léon Marchand",
    birthDate: "2002-05-17",
    wikipediaUrl: "https://fr.wikipedia.org/wiki/L%C3%A9on_Marchand",
    theme: "loisirs", gestureRoot: "sportif", editorialScore: 84,
    achievement: "Nageur francais, il devient multiple champion mondial et l'un des visages majeurs de la natation de sa generation."
  },

  // 2003 — Olivia Rodrigo : 20 février 2003 ✓
  {
    year: 2003, lang: "fr",
    name: "Olivia Rodrigo",
    birthDate: "2003-02-20",
    wikipediaUrl: "https://fr.wikipedia.org/wiki/Olivia_Rodrigo",
    qid: "Q55793669",
    theme: "loisirs", gestureRoot: "musicien", editorialScore: 86,
    achievement: "Son single drivers license battra tous les records de streams en 2021 et lui vaudra trois Grammy Awards à 18 ans."
  },
  // 2004 — Coco Gauff : 13 mars 2004 ✓
  {
    year: 2004, lang: "fr",
    name: "Coco Gauff",
    birthDate: "2004-03-13",
    wikipediaUrl: "https://fr.wikipedia.org/wiki/Coco_Gauff",
    qid: "Q55797596",
    theme: "loisirs", gestureRoot: "sportif", editorialScore: 86,
    achievement: "Elle remportera l'US Open 2023 à 19 ans et deviendra la meilleure joueuse de tennis de sa génération."
  },
  // 2005 — Leny Yoro : 13 novembre 2005 ✓
  {
    year: 2005, lang: "fr",
    name: "Leny Yoro",
    birthDate: "2005-11-13",
    wikipediaUrl: "https://fr.wikipedia.org/wiki/Leny_Yoro",
    theme: "loisirs", gestureRoot: "sportif", editorialScore: 78,
    achievement: "Defenseur central francais, il devient titulaire en Ligue 1 tres jeune puis signe a Manchester United."
  },

  // 2006 — Jacob Tremblay : 5 octobre 2006 ✓
  {
    year: 2006, lang: "fr",
    name: "Jacob Tremblay",
    birthDate: "2006-10-05",
    wikipediaUrl: "https://fr.wikipedia.org/wiki/Jacob_Tremblay",
    qid: "Q18908817",
    theme: "loisirs", gestureRoot: "acteur", editorialScore: 72,
    achievement: "Il jouera dans Room à 8 ans et sera nominé aux Golden Globes, l'une des plus jeunes révélations du cinéma mondial."
  },
  // 2007 — Lamine Yamal : 16 juillet 2007 ✓
  {
    year: 2007, lang: "fr",
    name: "Lamine Yamal",
    birthDate: "2007-07-16",
    wikipediaUrl: "https://fr.wikipedia.org/wiki/Lamine_Yamal",
    qid: "Q113618476",
    theme: "loisirs", gestureRoot: "sportif", editorialScore: 86,
    achievement: "Il deviendra champion d'Europe avec l'Espagne à 17 ans — plus jeune buteur et plus jeune sélectionné de l'histoire de l'Euro."
  },
  // 2009 — Walker Scobell : 5 janvier 2009 ✓
  {
    year: 2009, lang: "fr",
    name: "Walker Scobell",
    birthDate: "2009-01-05",
    wikipediaUrl: "https://fr.wikipedia.org/wiki/Walker_Scobell",
    theme: "loisirs", gestureRoot: "acteur", editorialScore: 66,
    achievement: "Il jouera Percy Jackson dans la série Amazon et deviendra l'un des jeunes acteurs les plus suivis de sa génération."
  },
];
