import type { InventionEntry } from "../../../types";

export const FR_INVENTION_BACKFILL_1970_1989: InventionEntry[] = [
  {
    id: "fr-1971-scanner-medical",
    countryQid: "Q142", lang: "fr",
    itemKey: "passer-un-scanner",
    itemLabel: "passer un scanner médical",
    theme: "santé", gestureRoot: "scanner_medical",
    editorialScore: 88,
    objectType: "device", category: "device",
    releaseDate: "1971-10-01", releaseYear: 1971, datePrecision: "month",
    placeName: "Hôpital Atkinson Morley, Londres", placeType: "site", placeQid: null,
    triggerLabel: "Premier scanner médical (EMI CT scan)",
    beforeState: "Avant 1971, explorer l'intérieur du corps nécessite une opération chirurgicale ou se limite aux rayons X.",
    afterState: "Après 1971, le scanner permet de voir l'intérieur du cerveau et du corps sans incision.",
    objectChanged: "Tu peux t'allonger dans un anneau et voir ton corps de l'intérieur sans chirurgie.",
    materialAnchor: "Table de scanner, anneau rotatif et images en coupe",
    sceneText: "Octobre 1971, hôpital londonien. La première patiente entre dans l'anneau. Les images du cerveau apparaissent sur l'écran — sans ouvrir le crâne. La médecine vient de franchir un seuil.",
    fact: "En octobre 1971, le premier scanner médical (tomodensitomètre) est utilisé sur un patient humain à l'hôpital Atkinson Morley de Londres.",
    sources: [
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Tomodensitom%C3%A9trie", authority: false },
      { label: "Nobel Prize", url: "https://www.nobelprize.org/prizes/medicine/1979/summary/", authority: true }
    ],
    tags: ["sante", "scanner", "imagerie", "medecine"],
    quality: { strictPlace: true, strictDate: false, everydayUse: true, sourceCount: 2 }
  },
  {
    id: "fr-1979-tgv-paris-lyon",
    countryQid: "Q142", lang: "fr",
    itemKey: "prendre-le-tgv",
    itemLabel: "prendre le TGV entre Paris et Lyon",
    theme: "transport", gestureRoot: "tgv",
    editorialScore: 94,
    objectType: "infrastructure", category: "transport",
    releaseDate: "1981-09-27", releaseYear: 1981, datePrecision: "day",
    placeName: "Paris — Gare de Lyon", placeType: "site", placeQid: "Q746273",
    triggerLabel: "Inauguration de la ligne Paris-Lyon du TGV",
    beforeState: "Avant septembre 1981, Paris-Lyon prend 3h40 en train rapide.",
    afterState: "Après septembre 1981, le TGV relie Paris à Lyon en 2h40, puis en 2h en 1983.",
    objectChanged: "Tu peux aller à Lyon le matin, déjeuner sur place et rentrer à Paris le soir.",
    materialAnchor: "TGV orange, quai de départ et indicateur de vitesse",
    sceneText: "27 septembre 1981, gare de Lyon. Le train orange glisse sans bruit au départ. Deux heures quarante plus tard, Lyon. La France vient de changer d'échelle — les distances rétrécissent.",
    fact: "Le 27 septembre 1981, la ligne TGV Paris-Lyon est inaugurée, portant la France à la pointe du train à grande vitesse.",
    sources: [
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Ligne_%C3%A0_grande_vitesse_Paris%E2%80%93Lyon", authority: false },
      { label: "SNCF", url: "https://www.sncf.com/fr/groupe/histoire-du-groupe/histoire-tgv", authority: true }
    ],
    tags: ["tgv", "train", "paris", "lyon"],
    quality: { strictPlace: true, strictDate: true, everydayUse: true, sourceCount: 2 }
  },
  {
    id: "fr-1983-carte-vitale-precurseur",
    countryQid: "Q142", lang: "fr",
    itemKey: "utiliser-une-carte-a-puce",
    itemLabel: "utiliser une carte à puce dans la vie quotidienne",
    theme: "communication", gestureRoot: "carte_a_puce",
    editorialScore: 88,
    objectType: "payment_tool", category: "payment",
    releaseDate: "1982-01-01", releaseYear: 1982, datePrecision: "year",
    placeName: "France", placeType: "country", placeQid: "Q142",
    triggerLabel: "Déploiement de la carte à puce bancaire en France",
    beforeState: "Avant 1982, les cartes bancaires françaises utilisent une piste magnétique facilement copiable.",
    afterState: "Après 1982, la France est le premier pays au monde à déployer massivement la carte bancaire à puce.",
    objectChanged: "Tu pagues avec une carte dont la puce est plus sûre que la piste magnétique — une première mondiale.",
    materialAnchor: "Carte bancaire dorée, lecteur de puce et terminal de paiement",
    sceneText: "1982, caisse d'un commerce. La carte s'insère dans le lecteur, côté puce. Le paiement est sécurisé différemment. La France invente le standard mondial qui sera adopté partout trente ans plus tard.",
    fact: "En 1982, la France déploie la première carte bancaire à puce au monde, inventée par Roland Moreno en 1974.",
    sources: [
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Carte_%C3%A0_puce", authority: false },
      { label: "Banque de France", url: "https://www.banque-france.fr", authority: true }
    ],
    tags: ["carte-puce", "paiement", "banque", "invention-francaise"],
    quality: { strictPlace: false, strictDate: false, everydayUse: true, sourceCount: 2 }
  },
  {
    id: "fr-1984-cd-audio",
    countryQid: "Q142", lang: "fr",
    itemKey: "ecouter-un-cd-audio",
    itemLabel: "écouter de la musique sur un CD audio",
    theme: "loisirs", gestureRoot: "cd_audio",
    editorialScore: 86,
    objectType: "device", category: "media",
    releaseDate: "1982-10-01", releaseYear: 1982, datePrecision: "month",
    placeName: "Salon et chaîne hi-fi", placeType: "country", placeQid: "Q142",
    triggerLabel: "Lancement du CD audio (Sony et Philips)",
    beforeState: "Avant 1982, la musique se stocke sur disque vinyle ou cassette — fragile, dégradable, avec des craquements.",
    afterState: "Après 1982, le CD numérique offre un son parfait et un support quasi-indestructible.",
    objectChanged: "Tu peux poser un disque argenté sur le plateau et entendre ta musique sans aucun craquement.",
    materialAnchor: "Lecteur CD, plateau à ventouse et boîtier transparent",
    sceneText: "1982, salon. Le disque argenté glisse sur le plateau. La tête laser part, et le son sort sans souffle ni craquement. La musique vient d'entrer dans l'ère numérique — imperceptiblement, dans le silence.",
    fact: "En octobre 1982, le CD audio est lancé simultanément au Japon et en Europe par Sony et Philips.",
    sources: [
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Disque_compact", authority: false }
    ],
    tags: ["cd", "musique", "numerique", "audio"],
    quality: { strictPlace: false, strictDate: false, everydayUse: true, sourceCount: 1 }
  },
  {
    id: "fr-1989-internet-france",
    countryQid: "Q142", lang: "fr",
    itemKey: "se-connecter-a-internet-en-france",
    itemLabel: "accéder à Internet depuis la France",
    theme: "communication", gestureRoot: "internet_france",
    editorialScore: 92,
    objectType: "infrastructure", category: "network",
    releaseDate: "1988-01-01", releaseYear: 1988, datePrecision: "year",
    placeName: "France — réseau Renater", placeType: "country", placeQid: "Q142",
    triggerLabel: "Connexion de la France à Internet",
    beforeState: "Avant 1988, Internet est un réseau réservé à l'armée et à quelques universités américaines.",
    afterState: "Après 1988, des universités et centres de recherche français sont connectés à Internet.",
    objectChanged: "Tu peux envoyer un email à un chercheur américain en quelques secondes depuis un laboratoire français.",
    materialAnchor: "Terminal réseau, câble RJ45 et écran noir ligne de commande",
    sceneText: "1988, laboratoire de recherche français. Le terminal affiche une connexion. Un email part vers Berkeley. La réponse arrive en quelques secondes depuis l'autre côté de l'Atlantique. Internet vient d'atterrir en France.",
    fact: "En 1988, la France se connecte à Internet via le réseau académique, dix ans avant sa diffusion grand public.",
    sources: [
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Histoire_de_l%27Internet_en_France", authority: false }
    ],
    tags: ["internet", "reseau", "numerique", "universite"],
    quality: { strictPlace: false, strictDate: false, everydayUse: false, sourceCount: 1 }
  },
];
