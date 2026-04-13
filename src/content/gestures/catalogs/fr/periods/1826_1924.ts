import type { GestureRupture } from "../../../types";

// Ce fichier couvre 1826-1924.
// Direction "impossible_to_possible" : gestes qui deviennent possibles (nouvelles libertés, infrastructures…)
// Direction "possible_to_impossible" : gestes qui disparaissent (suppression, interdiction, remplacement…)

export const FR_GESTURE_BACKFILL_1826_1924: GestureRupture[] = [

  // ── APPARITIONS ─────────────────────────────────────────────────────────────

  {
    id: "fr-1833-ecole-primaire-guizot",
    countryQid: "Q142", lang: "fr",
    gestureKey: "envoyer-ses-enfants-a-lecole-primaire-publique",
    gestureLabel: "envoyer ses enfants à l'école primaire publique",
    theme: "administration", gestureRoot: "ecole_primaire",
    editorialScore: 94,
    category: "school", direction: "impossible_to_possible",
    ruptureDate: "1833-06-28", ruptureYear: 1833, datePrecision: "day",
    placeName: "École primaire communale", placeType: "institution", placeQid: null,
    triggerLabel: "Loi Guizot rendant obligatoire une école primaire dans chaque commune",
    triggerType: "law",
    beforeState: "Avant 1833, l'instruction primaire dépend de l'initiative locale ou religieuse — beaucoup de communes rurales n'ont pas d'école.",
    afterState: "Après juin 1833, chaque commune de plus de 500 habitants doit ouvrir une école primaire de garçons avec un instituteur rémunéré par la commune.",
    gestureChanged: "Tu peux conduire ton fils à une école communale officielle, avec un maître formé et payé, même dans un village.",
    materialAnchor: "Pupitre de bois, ardoise, bâton de craie, brevet d'instituteur",
    sceneText: "1833, dans un village de France. Un instituteur arrive avec sa patente et ouvre la salle communale. Les pères hésitent à lâcher les bras valides, mais la loi dit que l'école doit être là. Pour la première fois, l'État s'engage à ce que chaque commune ait son maître.",
    fact: "La loi Guizot du 28 juin 1833 oblige chaque commune de plus de 500 habitants à entretenir une école primaire et un instituteur, posant les bases de l'instruction publique en France.",
    sources: [
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Loi_Guizot", authority: false },
      { label: "Gallica BnF", url: "https://gallica.bnf.fr/ark:/12148/bpt6k6238483x", authority: true }
    ],
    tags: ["ecole", "guizot", "instruction", "commune"],
    quality: { strictPlace: false, strictDate: true, dailyLife: true, sourceCount: 2 }
  },

  {
    id: "fr-1848-suffrage-universel-masculin",
    countryQid: "Q142", lang: "fr",
    gestureKey: "voter-sans-condition-de-fortune",
    gestureLabel: "voter sans condition de fortune ni de cens",
    theme: "administration", gestureRoot: "suffrage_universel",
    editorialScore: 97,
    category: "public_space", direction: "impossible_to_possible",
    ruptureDate: "1848-03-05", ruptureYear: 1848, datePrecision: "day",
    placeName: "Urnes communales, France", placeType: "institution", placeQid: null,
    triggerLabel: "Décret instaurant le suffrage universel masculin en France",
    triggerType: "decree",
    beforeState: "Avant mars 1848, le droit de vote en France est réservé aux hommes payant un certain impôt (suffrage censitaire) — environ 250 000 électeurs sur 36 millions d'habitants.",
    afterState: "Après mars 1848, tout Français mâle de 21 ans peut voter, quelle que soit sa fortune ou son statut — 9 millions d'électeurs potentiels.",
    gestureChanged: "Tu peux te rendre à l'urne sans présenter de quittance d'impôt, simplement comme citoyen inscrit sur les listes.",
    materialAnchor: "Bulletin de vote, urne en bois, liste électorale communale",
    sceneText: "Mars 1848, dans un village de France. Jamais autant d'hommes ne se sont rendus à la mairie en même temps. Le paysan sans terre, le compagnon sans atelier — ils ont un bulletin comme le notaire. La salle sent le papier et la nouveauté.",
    fact: "Le décret du 5 mars 1848 du Gouvernement provisoire instaure le suffrage universel masculin en France, faisant passer le corps électoral de 250 000 à 9 millions de citoyens.",
    sources: [
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Suffrage_universel_en_France", authority: false },
      { label: "Conseil constitutionnel", url: "https://www.conseil-constitutionnel.fr/les-grandes-dates-de-la-democratie-francaise/1848-le-suffrage-universel", authority: true }
    ],
    tags: ["vote", "suffrage", "democratie", "1848"],
    quality: { strictPlace: false, strictDate: true, dailyLife: true, sourceCount: 2 }
  },

  {
    id: "fr-1864-droit-de-greve",
    countryQid: "Q142", lang: "fr",
    gestureKey: "faire-greve-sans-risquer-la-prison",
    gestureLabel: "faire grève sans risquer la prison",
    theme: "travail", gestureRoot: "droit_de_greve",
    editorialScore: 93,
    category: "work", direction: "impossible_to_possible",
    ruptureDate: "1864-05-25", ruptureYear: 1864, datePrecision: "day",
    placeName: "Ateliers et manufactures de France", placeType: "institution", placeQid: null,
    triggerLabel: "Loi supprimant le délit de coalition ouvrière",
    triggerType: "law",
    beforeState: "Avant mai 1864, se mettre en grève est un délit pénal — la coalition d'ouvriers pour refuser le travail est passible de prison.",
    afterState: "Après mai 1864, les ouvriers peuvent cesser collectivement le travail sans être poursuivis au pénal pour coalition.",
    gestureChanged: "Tu peux, avec tes collègues, poser tes outils et refuser de travailler pour obtenir de meilleures conditions, sans que le patron te fasse arrêter.",
    materialAnchor: "Atelier vide, piquet de grève informel, pétition d'ouvriers",
    sceneText: "1864, dans une manufacture de textile. Les métiers s'arrêtent. Il y a une semaine, ça valait de la prison. Aujourd'hui, les hommes restent devant l'atelier, les bras croisés. La coalition n'est plus un crime. C'est un mot nouveau dans la bouche des ouvriers : grève.",
    fact: "La loi du 25 mai 1864, votée sous Napoléon III, supprime le délit de coalition ouvrière et reconnaît implicitement le droit de grève, sans le nommer explicitement.",
    sources: [
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Droit_de_gr%C3%A8ve_en_France", authority: false },
      { label: "Légifrance histoire", url: "https://www.legifrance.gouv.fr/", authority: true }
    ],
    tags: ["greve", "travail", "ouvrier", "droit"],
    quality: { strictPlace: false, strictDate: true, dailyLife: true, sourceCount: 2 }
  },

  {
    id: "fr-1872-carte-postale",
    countryQid: "Q142", lang: "fr",
    gestureKey: "envoyer-une-carte-postale-illustree",
    gestureLabel: "envoyer une carte postale illustrée par la poste",
    theme: "communication", gestureRoot: "carte_postale",
    editorialScore: 83,
    category: "media", direction: "impossible_to_possible",
    ruptureDate: "1872-01-01", ruptureYear: 1872, datePrecision: "year",
    placeName: "Bureaux de poste de France", placeType: "institution", placeQid: null,
    triggerLabel: "Adoption de la carte postale en France par la poste officielle",
    triggerType: "service_start",
    beforeState: "Avant 1872, on ne peut envoyer par la poste qu'une lettre sous enveloppe, plus coûteuse et plus longue à rédiger.",
    afterState: "Après 1872, un carton illustré peut être posté pour moins cher qu'une lettre, rendant la correspondance accessible à tous.",
    gestureChanged: "Tu peux acheter une carte postale dans un bureau de poste ou une boutique, griffonner quelques mots au dos et l'envoyer sans enveloppe.",
    materialAnchor: "Carte postale illustrée, timbre, bureau de poste",
    sceneText: "1872, dans un bureau de poste français. La petite carte à l'illustration colorée passe par-dessus le guichet. Quelques mots écrits d'une main rapide, un timbre, et voilà : la correspondance change d'échelle. Le message court ne nécessite plus de feuille, d'encre et d'enveloppe.",
    fact: "À partir de 1872, la France adopte officiellement la carte postale dans son réseau postal, démocratisant la correspondance courte et bon marché.",
    sources: [
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Carte_postale", authority: false },
      { label: "La Poste histoire", url: "https://legroupe.laposte.fr/notre-histoire", authority: true }
    ],
    tags: ["carte-postale", "poste", "communication", "courrier"],
    quality: { strictPlace: false, strictDate: false, dailyLife: true, sourceCount: 2 }
  },

  {
    id: "fr-1882-ecole-gratuite-obligatoire",
    countryQid: "Q142", lang: "fr",
    gestureKey: "envoyer-ses-enfants-a-lecole-gratuite-et-obligatoire",
    gestureLabel: "envoyer ses enfants à l'école primaire gratuite et obligatoire",
    theme: "administration", gestureRoot: "ecole_jules_ferry",
    editorialScore: 98,
    category: "school", direction: "impossible_to_possible",
    ruptureDate: "1882-03-28", ruptureYear: 1882, datePrecision: "day",
    placeName: "École primaire publique, France", placeType: "institution", placeQid: null,
    triggerLabel: "Lois Ferry rendant l'école primaire gratuite et obligatoire",
    triggerType: "law",
    beforeState: "Avant 1882, l'école primaire n'est ni entièrement gratuite ni obligatoire — beaucoup d'enfants travaillent aux champs ou à l'atelier.",
    afterState: "Après mars 1882, tout enfant de 6 à 13 ans doit fréquenter l'école, qui est gratuite et laïque — les crucifix quittent les classes.",
    gestureChanged: "Tu dois inscrire tes enfants à l'école et les y envoyer chaque matin — c'est une obligation légale, plus une option selon les moyens.",
    materialAnchor: "Pupitres de bois, tableau noir, manuels républicains, liste d'appel",
    sceneText: "28 mars 1882, école de village. La maîtresse décloue le crucifix au mur et le pose dans le couloir. À la place, la République. Les enfants sont là, tous — même les filles d'artisans qui aidaient à l'atelier. L'obligation vient d'entrer dans le quotidien.",
    fact: "La loi du 28 mars 1882 rend l'école primaire obligatoire et laïque pour les enfants de 6 à 13 ans, complétant la loi Ferry de 1881 qui l'avait rendue gratuite.",
    sources: [
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Jules_Ferry", authority: false },
      { label: "Ministère Éducation nationale", url: "https://www.education.gouv.fr/cid21936/1882-l-ecole-laique-et-obligatoire.html", authority: true }
    ],
    tags: ["ecole", "ferry", "laicite", "obligation"],
    quality: { strictPlace: false, strictDate: true, dailyLife: true, sourceCount: 2 }
  },

  {
    id: "fr-1884-syndicats-legalises",
    countryQid: "Q142", lang: "fr",
    gestureKey: "adherer-a-un-syndicat-ouvrier-legal",
    gestureLabel: "adhérer à un syndicat ouvrier sans risquer de poursuites",
    theme: "travail", gestureRoot: "syndicats",
    editorialScore: 91,
    category: "work", direction: "impossible_to_possible",
    ruptureDate: "1884-03-21", ruptureYear: 1884, datePrecision: "day",
    placeName: "Ateliers et manufactures de France", placeType: "institution", placeQid: null,
    triggerLabel: "Loi Waldeck-Rousseau légalisant les syndicats professionnels",
    triggerType: "law",
    beforeState: "Avant mars 1884, toute association ouvrière à caractère professionnel est illégale et ses membres risquent la prison.",
    afterState: "Après mars 1884, les syndicats peuvent se déclarer librement et représenter les travailleurs dans leurs relations avec les employeurs.",
    gestureChanged: "Tu peux te syndiquer dans ton métier, payer une cotisation et être représenté dans les conflits avec ton patron.",
    materialAnchor: "Carte de syndiqué, statuts de syndicat, permanence ouvrière",
    sceneText: "1884, dans une arrière-salle de café. Pour la première fois, les hommes signent leur adhésion sans regarder par-dessus l'épaule. Le papier est légal. Le syndicat peut exister, avoir une adresse, défendre des conditions. L'organisation ouvrière sort de la clandestinité.",
    fact: "La loi Waldeck-Rousseau du 21 mars 1884 légalise les syndicats professionnels en France, mettant fin à plus de quatre-vingts ans d'interdiction des associations ouvrières.",
    sources: [
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Loi_Waldeck-Rousseau", authority: false },
      { label: "Musée du Travail", url: "https://www.museesdenantes.fr/", authority: false }
    ],
    tags: ["syndicat", "travail", "ouvrier", "droit"],
    quality: { strictPlace: false, strictDate: true, dailyLife: true, sourceCount: 2 }
  },

  {
    id: "fr-1890-journee-8-heures-revendication",
    countryQid: "Q142", lang: "fr",
    gestureKey: "manifester-pour-la-journee-de-8-heures",
    gestureLabel: "manifester le 1er Mai pour la journée de 8 heures",
    theme: "travail", gestureRoot: "premier_mai",
    editorialScore: 87,
    category: "work", direction: "impossible_to_possible",
    ruptureDate: "1890-05-01", ruptureYear: 1890, datePrecision: "day",
    placeName: "Paris et grandes villes de France", placeType: "city", placeQid: "Q90",
    triggerLabel: "Premier 1er Mai ouvrier en France",
    triggerType: "public_rollout",
    beforeState: "Avant mai 1890, il n'existe pas de journée de mobilisation ouvrière coordonnée à l'échelle nationale.",
    afterState: "Après le 1er mai 1890, le 1er Mai devient annuellement la journée de revendication ouvrière pour les 8 heures de travail.",
    gestureChanged: "Tu peux te joindre à un cortège ouvrier dans les rues, arborer un triangle rouge ou une fleur, et revendiquer une limite au temps de travail.",
    materialAnchor: "Cocarde rouge, triangle des 8h-8h-8h, tract syndical",
    sceneText: "1er mai 1890, Paris. Des milliers d'ouvriers défilent avec les trois 8 — huit heures de travail, huit heures de sommeil, huit heures pour soi. C'est la première fois que la revendication est aussi visible, aussi coordonnée, aussi nationale.",
    fact: "Le 1er mai 1890, la France connaît ses premières manifestations du 1er Mai ouvrier, réclamant la journée de 8 heures dans le sillage de la résolution de l'Internationale socialiste de 1889.",
    sources: [
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/F%C3%AAte_du_Travail", authority: false },
      { label: "Archives CGT", url: "https://www.cgt.fr/", authority: false }
    ],
    tags: ["premier-mai", "travail", "ouvrier", "8-heures"],
    quality: { strictPlace: true, strictDate: true, dailyLife: false, sourceCount: 2 }
  },

  {
    id: "fr-1901-associations-loi-1901",
    countryQid: "Q142", lang: "fr",
    gestureKey: "creer-une-association-librement-sans-autorisation",
    gestureLabel: "créer une association librement sans autorisation préfectorale",
    theme: "administration", gestureRoot: "association_loi_1901",
    editorialScore: 90,
    category: "public_space", direction: "impossible_to_possible",
    ruptureDate: "1901-07-01", ruptureYear: 1901, datePrecision: "day",
    placeName: "France", placeType: "country", placeQid: "Q142",
    triggerLabel: "Loi sur la liberté d'association",
    triggerType: "law",
    beforeState: "Avant juillet 1901, toute association doit être autorisée par le gouvernement — les associations non autorisées sont illégales.",
    afterState: "Après juillet 1901, deux personnes suffisent pour créer une association déclarée en préfecture sans demander l'autorisation préalable.",
    gestureChanged: "Tu peux créer un club, une société sportive ou une amicale avec d'autres citoyens en déclarant simplement l'association à la préfecture.",
    materialAnchor: "Statuts manuscrits, récépissé de déclaration, compte bancaire associatif",
    sceneText: "1901, dans un café de province. Trois hommes décident de créer une société de musique. Ils rédigent leurs statuts sur une feuille, envoient la lettre à la préfecture et attendent le récépissé. Pas d'autorisation, pas de permission — juste une déclaration. La liberté d'association vient d'être posée par écrit.",
    fact: "La loi du 1er juillet 1901 reconnaît la liberté d'association en France sans autorisation préalable, fondant un cadre juridique encore utilisé par plus d'un million d'associations aujourd'hui.",
    sources: [
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Loi_du_1er_juillet_1901_relative_au_contrat_d%27association", authority: false },
      { label: "Légifrance", url: "https://www.legifrance.gouv.fr/loda/id/LEGITEXT000006069570", authority: true }
    ],
    tags: ["association", "liberte", "republique", "droit"],
    quality: { strictPlace: false, strictDate: true, dailyLife: true, sourceCount: 2 }
  },

  {
    id: "fr-1910-retraites-ouvrieres-paysannes",
    countryQid: "Q142", lang: "fr",
    gestureKey: "cotiser-pour-une-retraite-ouvriere",
    gestureLabel: "cotiser pour toucher une retraite ouvrière à 65 ans",
    theme: "travail", gestureRoot: "retraite_ouvriere",
    editorialScore: 88,
    category: "work", direction: "impossible_to_possible",
    ruptureDate: "1910-04-05", ruptureYear: 1910, datePrecision: "day",
    placeName: "France", placeType: "country", placeQid: "Q142",
    triggerLabel: "Loi sur les retraites ouvrières et paysannes",
    triggerType: "law",
    beforeState: "Avant avril 1910, aucun mécanisme légal unifié ne garantit de revenu aux ouvriers et paysans trop vieux pour travailler.",
    afterState: "Après avril 1910, une retraite obligatoire par capitalisation est instituée pour les ouvriers et paysans — même si l'âge de 65 ans reste difficile à atteindre.",
    gestureChanged: "Tu peux cotiser obligatoirement à une caisse de retraite et espérer toucher une pension à 65 ans.",
    materialAnchor: "Livret de caisse de retraite, fiche de cotisation, coupons de rente",
    sceneText: "1910, dans une usine de province. Le patron retient quelques centimes sur la paie et les verse à la caisse. L'ouvrier a un livret. Il ne vivra peut-être pas jusqu'à 65 ans, mais l'idée est là : un droit à vieillir sans mendier.",
    fact: "La loi du 5 avril 1910 instaure les retraites ouvrières et paysannes en France, premier régime de retraite obligatoire, avec une pension à 65 ans pour les travailleurs manuels.",
    sources: [
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Retraite_en_France", authority: false },
      { label: "Sénat histoire", url: "https://www.senat.fr/rap/l02-382/l02-3822.html", authority: true }
    ],
    tags: ["retraite", "ouvrier", "cotisation", "vieillesse"],
    quality: { strictPlace: false, strictDate: true, dailyLife: true, sourceCount: 2 }
  },

  {
    id: "fr-1919-journee-8-heures-loi",
    countryQid: "Q142", lang: "fr",
    gestureKey: "ne-travailler-que-8-heures-par-jour-par-la-loi",
    gestureLabel: "ne travailler que 8 heures par jour, garanti par la loi",
    theme: "travail", gestureRoot: "journee_8h",
    editorialScore: 92,
    category: "work", direction: "impossible_to_possible",
    ruptureDate: "1919-04-23", ruptureYear: 1919, datePrecision: "day",
    placeName: "Usines et ateliers de France", placeType: "institution", placeQid: null,
    triggerLabel: "Loi instaurant la journée de travail de 8 heures et la semaine de 48 heures",
    triggerType: "law",
    beforeState: "Avant avril 1919, la durée légale du travail n'est pas limitée — 10, 12 heures ou plus sont courantes dans l'industrie.",
    afterState: "Après avril 1919, la loi limite le travail à 8 heures par jour et 48 heures par semaine dans tous les établissements industriels et commerciaux.",
    gestureChanged: "Tu peux partir de l'usine après 8 heures de travail sans que le patron puisse te retenir légalement au-delà.",
    materialAnchor: "Horloge pointeuse, règlement d'usine affiché, sirène de fin de poste",
    sceneText: "23 avril 1919, dans une usine française. La sirène sonne à 17 heures pour la première fois d'une façon différente. Ce n'est plus une faveur du patron — c'est la loi. Huit heures, pas plus. La revendication des trente ans de luttes ouvrières vient d'entrer dans le code.",
    fact: "La loi du 23 avril 1919 limite la journée de travail à 8 heures et la semaine à 48 heures dans l'industrie française, aboutissement d'une revendication ouvrière depuis 1890.",
    sources: [
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Journ%C3%A9e_de_8_heures", authority: false },
      { label: "Légifrance", url: "https://www.legifrance.gouv.fr/", authority: true }
    ],
    tags: ["travail", "8-heures", "droit", "industrie"],
    quality: { strictPlace: false, strictDate: true, dailyLife: true, sourceCount: 2 }
  },

  // ── DISPARITIONS ─────────────────────────────────────────────────────────────

  {
    id: "fr-1830-disparition-corporations-de-metier",
    countryQid: "Q142", lang: "fr",
    gestureKey: "entrer-dans-un-metier-via-la-corporation",
    gestureLabel: "entrer dans un métier artisanal par la corporation et les jurandes",
    theme: "travail", gestureRoot: "corporations_metier",
    editorialScore: 86,
    category: "work", direction: "possible_to_impossible",
    ruptureDate: "1791-03-02", ruptureYear: 1791, datePrecision: "day",
    placeName: "Boutiques et ateliers de France", placeType: "institution", placeQid: null,
    triggerLabel: "Loi Le Chapelier supprimant les corporations de métier",
    triggerType: "law",
    beforeState: "Sous l'Ancien Régime, pour exercer un métier artisanal, tout apprenti devait passer par une corporation reconnue : années d'apprentissage, chef-d'œuvre, maîtrise.",
    afterState: "Après 1791 et l'application progressive de la loi Le Chapelier, les corporations sont abolies — chacun peut exercer n'importe quel métier librement.",
    gestureChanged: "Tu ne peux plus entrer dans un métier par la voie de la corporation et recevoir ta maîtrise : l'accès aux métiers est désormais libre mais sans cadre collectif.",
    materialAnchor: "Chef-d'œuvre de maître, registre de la corporation, lettre de maîtrise",
    sceneText: "1791-1830, dans les ateliers de France. Les enseignes des corporations disparaissent. Il n'y a plus de jurandes pour évaluer le chef-d'œuvre, plus de lettre de maîtrise à attendre des années. La liberté de commerce est là — mais avec elle, la protection de la corporation s'en va aussi.",
    fact: "La loi Le Chapelier du 2 mars 1791 abolit les corporations de métier en France, mettant fin à un système d'organisation professionnelle vieux de plusieurs siècles.",
    sources: [
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Loi_Le_Chapelier", authority: false },
      { label: "BnF Gallica", url: "https://gallica.bnf.fr/", authority: true }
    ],
    tags: ["corporation", "metier", "artisanat", "abolition"],
    quality: { strictPlace: false, strictDate: true, dailyLife: true, sourceCount: 2 }
  },

  {
    id: "fr-1840-disparition-diligence-longue-distance",
    countryQid: "Q142", lang: "fr",
    gestureKey: "voyager-en-diligence-a-cheval-sur-les-routes-de-france",
    gestureLabel: "voyager longue distance en diligence tirée par des chevaux",
    theme: "transport", gestureRoot: "diligence",
    editorialScore: 88,
    category: "transport", direction: "possible_to_impossible",
    ruptureDate: "1842-06-15", ruptureYear: 1842, datePrecision: "year",
    placeName: "Routes royales et impériales de France", placeType: "site", placeQid: null,
    triggerLabel: "Extension du réseau ferroviaire qui rend la diligence longue distance obsolète",
    triggerType: "service_start",
    beforeState: "Avant les années 1840, la diligence à chevaux est le principal moyen de transport longue distance en France — Paris–Lyon prenait plusieurs jours.",
    afterState: "À partir des années 1840-1850, le chemin de fer remplace progressivement les diligences sur les grandes routes. Les compagnies ferment leurs relais.",
    gestureChanged: "Tu ne peux plus prendre la diligence Paris–Lyon ou Paris–Marseille : les lignes de grandes diligences sont fermées, remplacées par le train.",
    materialAnchor: "Coche de voyage, relais de poste, billet de diligence",
    sceneText: "Années 1840, relais de poste sur la route de Lyon. Les chevaux sont là, mais le voyageur prend maintenant le train. Les palefreniers trouvent moins de travail. Les auberges des relais se vident. La diligence longue distance n'est plus qu'un souvenir sur les grandes routes.",
    fact: "Dans les années 1840-1850, l'extension du réseau ferroviaire français rend obsolètes les grandes diligences sur les axes principaux, mettant fin à des siècles de transport hippomobile longue distance.",
    sources: [
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Diligence_(v%C3%A9hicule)", authority: false },
      { label: "Musée de la voiture", url: "https://www.chateaudecompiegne.fr/", authority: false }
    ],
    tags: ["diligence", "cheval", "transport", "disparition"],
    quality: { strictPlace: false, strictDate: false, dailyLife: true, sourceCount: 2 }
  },

  {
    id: "fr-1870-disparition-duel-legal",
    countryQid: "Q142", lang: "fr",
    gestureKey: "regler-un-differend-par-un-duel-a-lepee-ou-au-pistolet",
    gestureLabel: "régler un différend personnel par un duel à l'épée ou au pistolet",
    theme: "administration", gestureRoot: "duel",
    editorialScore: 84,
    category: "public_space", direction: "possible_to_impossible",
    ruptureDate: "1894-01-01", ruptureYear: 1894, datePrecision: "year",
    placeName: "Bois de Boulogne et terrains de duel, Paris", placeType: "site", placeQid: null,
    triggerLabel: "Déclin et condamnation sociale progressive du duel en France",
    triggerType: "ban",
    beforeState: "Tout au long du XIXe siècle, le duel est pratiqué par les hommes d'honneur, les journalistes, les politiques et les militaires pour régler les insultes publiques.",
    afterState: "À la fin du XIXe siècle, les duels deviennent rares, ridiculisés, puis quasi-inexistants — la justice ordinaire prend la place de la satisfaction personnelle.",
    gestureChanged: "Tu ne peux plus, après une offense publique, envoyer vos témoins, choisir vos armes et te battre au petit matin dans le bois sans être considéré comme un criminel ou un anachronisme.",
    materialAnchor: "Épée de duel, pistolets à silex, carte de visite de témoin",
    sceneText: "Fin XIXe siècle, bois de Boulogne, tôt le matin. Deux hommes, deux témoins, deux pistolets. Le protocole est minutieux. Mais les journaux commencent à se moquer plutôt qu'à s'émouvoir. La satisfaction personnelle par le duel perd son sérieux — et bientôt son terrain.",
    fact: "Le duel, pratiqué couramment en France tout au long du XIXe siècle notamment par les journalistes et politiques, décline progressivement à partir des années 1880-1900, remplacé par les voies juridiques.",
    sources: [
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Duel", authority: false },
      { label: "Gallica BnF", url: "https://gallica.bnf.fr/", authority: true }
    ],
    tags: ["duel", "honneur", "XIXe", "disparition"],
    quality: { strictPlace: true, strictDate: false, dailyLife: false, sourceCount: 2 }
  },

  {
    id: "fr-1900-disparition-tramway-cheval-paris",
    countryQid: "Q142", lang: "fr",
    gestureKey: "prendre-le-tramway-tire-par-des-chevaux-dans-paris",
    gestureLabel: "prendre le tramway tiré par des chevaux dans Paris",
    theme: "transport", gestureRoot: "tramway_cheval",
    editorialScore: 85,
    category: "transport", direction: "possible_to_impossible",
    ruptureDate: "1913-01-01", ruptureYear: 1913, datePrecision: "year",
    placeName: "Paris", placeType: "city", placeQid: "Q90",
    triggerLabel: "Remplacement progressif des tramways hippomobiles par des tramways électriques",
    triggerType: "service_start",
    beforeState: "Jusqu'à la fin du XIXe siècle, des tramways à traction hippomobile parcourent les rues de Paris — des wagons sur rails tirés par deux chevaux.",
    afterState: "À partir de 1900 et jusqu'en 1913, les derniers tramways à chevaux disparaissent de Paris, remplacés par des tramways électriques puis par le métro.",
    gestureChanged: "Tu ne peux plus monter dans un tramway tiré par des chevaux dans Paris : les bêtes ont été remplacées par l'électricité et le métal.",
    materialAnchor: "Wagon de tramway, chevaux attelés, rails dans les pavés parisiens",
    sceneText: "Paris, début du XXe siècle. Les derniers tramways à chevaux ralentissent, puis disparaissent des rues. Les bêtes ont été vendues, les rails couverts d'asphalte. Ce qui restait de vivant dans le transport urbain — le souffle, le crottin, le claquement des sabots — s'efface sous l'électricité.",
    fact: "Entre 1900 et 1913, les tramways hippomobiles de Paris sont progressivement remplacés par des tramways électriques et le nouveau métro, mettant fin à un siècle de traction animale en ville.",
    sources: [
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Tramway_de_Paris", authority: false },
      { label: "RATP histoire", url: "https://www.ratp.fr/groupe-ratp/ratp-et-vous/histoire", authority: true }
    ],
    tags: ["tramway", "cheval", "paris", "disparition"],
    quality: { strictPlace: true, strictDate: false, dailyLife: true, sourceCount: 2 }
  },

  {
    id: "fr-1914-disparition-pneumatique-paris",
    countryQid: "Q142", lang: "fr",
    gestureKey: "envoyer-un-pneumatique-par-le-reseau-souterrain-parisien",
    gestureLabel: "envoyer un pneumatique par le réseau souterrain de tubes à air comprimé",
    theme: "communication", gestureRoot: "pneumatique",
    editorialScore: 89,
    category: "media", direction: "possible_to_impossible",
    ruptureDate: "1984-03-30", ruptureYear: 1984, datePrecision: "day",
    placeName: "Bureaux de poste parisiens", placeType: "institution", placeQid: null,
    triggerLabel: "Fermeture du réseau pneumatique de Paris en 1984",
    triggerType: "ban",
    beforeState: "De 1866 à 1984, le réseau pneumatique parisien permettait d'envoyer de petites lettres (les 'petits bleus') à travers Paris en quelques heures via des tubes à air comprimé.",
    afterState: "Après le 30 mars 1984, le réseau pneumatique est définitivement fermé, remplacé par le téléphone et le fax.",
    gestureChanged: "Tu ne peux plus aller au bureau de poste, déposer ton petit bleu et le savoir arrivé à son destinataire parisien en moins de deux heures par les tubes souterrains.",
    materialAnchor: "Papier pelure bleu, enveloppe spéciale pneumatique, guichet de dépôt",
    sceneText: "Paris, des décennies durant. Le petit bleu — papier fin, enveloppe légère — part du bureau de poste et file sous les rues dans un réseau de tubes soufflés à l'air comprimé. Quelques heures, et la lettre est à l'autre bout de Paris. En 1984, le dernier tube est soufflé. Le réseau ferme.",
    fact: "Le réseau pneumatique parisien, qui fonctionnait depuis 1866, est définitivement fermé le 30 mars 1984, après 118 ans de service pour les envois urgents de courrier intra-parisien.",
    sources: [
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Poste_pneumatique_de_Paris", authority: false },
      { label: "La Poste patrimoine", url: "https://legroupe.laposte.fr/notre-histoire", authority: true }
    ],
    tags: ["pneumatique", "poste", "paris", "disparition"],
    quality: { strictPlace: true, strictDate: true, dailyLife: true, sourceCount: 2 }
  },

  {
    id: "fr-1920-disparition-traction-animale-agriculture",
    countryQid: "Q142", lang: "fr",
    gestureKey: "labourer-ses-champs-au-cheval-ou-au-bœuf",
    gestureLabel: "labourer ses champs avec un cheval ou un bœuf attelé à la charrue",
    theme: "travail", gestureRoot: "labour_animal",
    editorialScore: 83,
    category: "work", direction: "possible_to_impossible",
    ruptureDate: "1945-01-01", ruptureYear: 1945, datePrecision: "year",
    placeName: "Campagnes de France", placeType: "country", placeQid: "Q142",
    triggerLabel: "Mécanisation rapide de l'agriculture française après 1945",
    triggerType: "public_rollout",
    beforeState: "Jusqu'aux années 1940, la grande majorité des paysans français labourent avec des chevaux ou des bœufs — le cheval de trait est au cœur du monde rural.",
    afterState: "À partir des années 1950-1960, le tracteur à moteur remplace massivement la traction animale dans les champs français.",
    gestureChanged: "Tu ne peux plus labourer tes champs avec tes bœufs ou tes chevaux comme la génération précédente : le tracteur est devenu la norme et les bêtes de trait se raréfient.",
    materialAnchor: "Charrue brabant, joug de bœufs, collier de cheval de trait",
    sceneText: "Campagne française, années 1940-1950. Le bœuf tire encore la charrue chez le voisin. Mais le tracteur arrive au village, et les enfants qui héritent ne reprennent plus les bêtes. En dix ans, les étables de travail se vident. Le rythme du sillon change de nature.",
    fact: "Après 1945, la modernisation de l'agriculture française remplace en moins d'une génération la traction animale par le tracteur à moteur, transformant le paysage et le travail paysan.",
    sources: [
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Cheval_de_trait", authority: false },
      { label: "Musée national des arts et traditions populaires", url: "https://www.mnhn.fr/", authority: false }
    ],
    tags: ["agriculture", "cheval", "labour", "disparition"],
    quality: { strictPlace: false, strictDate: false, dailyLife: true, sourceCount: 2 }
  },

];
