import type { InventionEntry } from "../../../types";

export const FR_INVENTION_BACKFILL_1990_2009: InventionEntry[] = [
  {
    id: "fr-1991-world-wide-web",
    countryQid: "Q142", lang: "fr",
    itemKey: "naviguer-sur-le-web",
    itemLabel: "naviguer sur le World Wide Web",
    theme: "communication", gestureRoot: "world_wide_web",
    editorialScore: 96,
    objectType: "infrastructure", category: "network",
    releaseDate: "1991-08-06", releaseYear: 1991, datePrecision: "day",
    placeName: "CERN, Genève", placeType: "site", placeQid: "Q42970",
    triggerLabel: "Mise en ligne du premier site web par Tim Berners-Lee",
    beforeState: "Avant le 6 août 1991, Internet existe mais naviguer de page en page avec des liens n'est pas possible.",
    afterState: "Après le 6 août 1991, le Web existe : on peut cliquer sur un lien et atterrir sur une autre page.",
    objectChanged: "Tu peux cliquer sur un lien hypertexte et passer d'un document à un autre n'importe où dans le monde.",
    materialAnchor: "Navigateur web, URL dans la barre d'adresse et lien bleu souligné",
    sceneText: "6 août 1991, CERN. Tim Berners-Lee met en ligne le premier site web de l'histoire. Le clic sur un lien envoie vers une autre page. Ce geste — pointer, cliquer, lire — va devenir le geste numérique du XXIe siècle.",
    fact: "Le 6 août 1991, Tim Berners-Lee publie le premier site web de l'histoire depuis le CERN à Genève.",
    sources: [
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/World_Wide_Web", authority: false },
      { label: "CERN", url: "https://home.cern/fr/science/computing/birth-web", authority: true }
    ],
    tags: ["web", "internet", "berners-lee", "cern"],
    quality: { strictPlace: true, strictDate: true, everydayUse: true, sourceCount: 2 }
  },
  {
    id: "fr-1995-dvd-annonce",
    countryQid: "Q142", lang: "fr",
    itemKey: "regarder-un-dvd",
    itemLabel: "regarder un film en DVD chez soi",
    theme: "loisirs", gestureRoot: "dvd",
    editorialScore: 84,
    objectType: "device", category: "media",
    releaseDate: "1997-03-01", releaseYear: 1997, datePrecision: "month",
    placeName: "Salon français", placeType: "country", placeQid: "Q142",
    triggerLabel: "Lancement du DVD en France",
    beforeState: "Avant 1997, regarder un film à la maison passe par la cassette VHS, volumineuse et de qualité dégradée.",
    afterState: "Après 1997, le DVD offre une image et un son de qualité cinéma dans le salon.",
    objectChanged: "Tu peux regarder un film en qualité quasi-cinéma depuis ton canapé, avec accès aux scènes supprimées.",
    materialAnchor: "Boîtier DVD, lecteur et menu de navigation",
    sceneText: "1997, salon. Le disque fin glisse dans le lecteur. Le menu apparaît. Les bonus, les langues, les sous-titres — tout est là. La VHS prend la poussière dans le placard.",
    fact: "En mars 1997, les premiers lecteurs et films DVD sont commercialisés en France.",
    sources: [
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/DVD", authority: false }
    ],
    tags: ["dvd", "cinema", "salon", "video"],
    quality: { strictPlace: false, strictDate: false, everydayUse: true, sourceCount: 1 }
  },
  {
    id: "fr-1998-google",
    countryQid: "Q142", lang: "fr",
    itemKey: "chercher-quelque-chose-sur-google",
    itemLabel: "chercher quelque chose sur Google",
    theme: "communication", gestureRoot: "moteur_de_recherche",
    editorialScore: 94,
    objectType: "service", category: "network",
    releaseDate: "1998-09-04", releaseYear: 1998, datePrecision: "day",
    placeName: "Garage de Menlo Park, Californie", placeType: "site", placeQid: null,
    triggerLabel: "Fondation de Google",
    beforeState: "Avant 1998, trouver une information sur le web nécessite de naviguer dans des annuaires ou des moteurs moins pertinents.",
    afterState: "Après 1998, Google indexe le web et retourne les résultats les plus pertinents en quelques millisecondes.",
    objectChanged: "Tu peux taper n'importe quelle question dans une barre blanche et obtenir des milliers de réponses classées.",
    materialAnchor: "Barre de recherche blanche, logo coloré et résultats listés",
    sceneText: "4 septembre 1998, Californie. Larry Page et Sergey Brin fondent Google dans un garage. Dans quelques années, 'chercher sur Google' deviendra synonyme de 'chercher' — dans toutes les langues du monde.",
    fact: "Le 4 septembre 1998, Google est fondé par Larry Page et Sergey Brin, révolutionnant la recherche d'information en ligne.",
    sources: [
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Google", authority: false }
    ],
    tags: ["google", "recherche", "internet", "web"],
    quality: { strictPlace: true, strictDate: true, everydayUse: true, sourceCount: 1 }
  },
  {
    id: "fr-2001-wikipedia",
    countryQid: "Q142", lang: "fr",
    itemKey: "consulter-wikipedia",
    itemLabel: "consulter une encyclopédie en ligne gratuite",
    theme: "communication", gestureRoot: "wikipedia",
    editorialScore: 88,
    objectType: "service", category: "network",
    releaseDate: "2001-01-15", releaseYear: 2001, datePrecision: "day",
    placeName: "Web mondial", placeType: "country", placeQid: "Q142",
    triggerLabel: "Lancement de Wikipedia",
    beforeState: "Avant 2001, accéder à une encyclopédie complète demande d'acheter la Britannica ou le Larousse.",
    afterState: "Après 2001, Wikipedia offre gratuitement des millions d'articles dans toutes les langues.",
    objectChanged: "Tu peux accéder à une encyclopédie universelle gratuite depuis n'importe quel écran connecté.",
    materialAnchor: "Écran, lien Wikipedia et logo globe puzzle",
    sceneText: "15 janvier 2001, web. Wikipedia publie ses premiers articles. Gratuit, ouvert, modifiable par tous. En quelques années, ce sera l'encyclopédie la plus consultée de l'histoire humaine.",
    fact: "Le 15 janvier 2001, Wikipedia est lancé par Jimmy Wales et Larry Sanger — encyclopédie collaborative gratuite ouverte à tous.",
    sources: [
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Wikip%C3%A9dia", authority: false }
    ],
    tags: ["wikipedia", "encyclopedie", "internet", "savoir"],
    quality: { strictPlace: false, strictDate: true, everydayUse: true, sourceCount: 1 }
  },
  {
    id: "fr-2005-youtube",
    countryQid: "Q142", lang: "fr",
    itemKey: "regarder-une-video-sur-youtube",
    itemLabel: "regarder une vidéo sur YouTube",
    theme: "loisirs", gestureRoot: "youtube",
    editorialScore: 92,
    objectType: "service", category: "media",
    releaseDate: "2005-04-23", releaseYear: 2005, datePrecision: "day",
    placeName: "Web mondial", placeType: "country", placeQid: "Q142",
    triggerLabel: "Première vidéo mise en ligne sur YouTube",
    beforeState: "Avant 2005, partager une vidéo en ligne est complexe, coûteux et réservé aux professionnels.",
    afterState: "Après 2005, n'importe qui peut mettre en ligne une vidéo et la partager avec le monde entier.",
    objectChanged: "Tu peux mettre en ligne ta vidéo depuis ton ordinateur et la voir regardée par des milliers de personnes.",
    materialAnchor: "Barre de lecture YouTube, icône lecture rouge et barre de progression",
    sceneText: "23 avril 2005, San José. Jawed Karim poste la première vidéo YouTube — 18 secondes devant des éléphants. En quelques mois, des millions de personnes partagent leurs films amateurs. La vidéo grand public devient un geste ordinaire.",
    fact: "Le 23 avril 2005, la première vidéo est publiée sur YouTube, qui deviendra le plus grand site de vidéos du monde.",
    sources: [
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/YouTube", authority: false }
    ],
    tags: ["youtube", "video", "internet", "partage"],
    quality: { strictPlace: false, strictDate: true, everydayUse: true, sourceCount: 1 }
  },
  {
    id: "fr-2007-iphone",
    countryQid: "Q142", lang: "fr",
    itemKey: "utiliser-un-iphone",
    itemLabel: "utiliser un smartphone à écran tactile",
    theme: "communication", gestureRoot: "iphone_smartphone",
    editorialScore: 96,
    objectType: "device", category: "device",
    releaseDate: "2007-01-09", releaseYear: 2007, datePrecision: "day",
    placeName: "Macworld, San Francisco", placeType: "site", placeQid: null,
    triggerLabel: "Présentation du premier iPhone par Steve Jobs",
    beforeState: "Avant janvier 2007, téléphone, lecteur MP3 et navigateur web sont trois appareils séparés.",
    afterState: "Après janvier 2007, l'iPhone fusionne tout dans une dalle de verre tactile.",
    objectChanged: "Tu peux tenir l'internet, ta musique et ton téléphone dans une plaque de verre tenue à une main.",
    materialAnchor: "iPhone argenté, écran tactile et geste de défilement",
    sceneText: "9 janvier 2007, Macworld. Steve Jobs sort un rectangle de verre de sa poche. 'Un iPod, un téléphone, un communicateur internet.' La salle applaudit. Le monde qu'on connaît vient de changer.",
    fact: "Le 9 janvier 2007, Steve Jobs présente le premier iPhone — fusionnant téléphone, iPod et navigateur web dans un écran tactile.",
    sources: [
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/IPhone", authority: false },
      { label: "Apple", url: "https://www.apple.com/fr/iphone/", authority: true }
    ],
    tags: ["iphone", "smartphone", "apple", "tactile"],
    quality: { strictPlace: true, strictDate: true, everydayUse: true, sourceCount: 2 }
  },
];
