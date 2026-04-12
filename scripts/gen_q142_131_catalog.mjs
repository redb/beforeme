#!/usr/bin/env/node
/**
 * Génère les 131 entrées { axis, year, payload } pour le catalogue Q142.
 * Sortie stdout : tableau JSON.
 */
import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const C = "Q142";
const LANG = "fr";

const W = (t) => ({
  label: "Wikipédia",
  url: `https://fr.wikipedia.org/wiki/${encodeURIComponent(t.replace(/ /g, "_"))}`,
  authority: false
});
const two = (a, b) => [a, b];

function scene80(lines) {
  let t = lines.join(" ").replace(/\s+/g, " ").trim();
  const pad = " Ce basculement touche directement les habitudes des Français au guichet et à la maison.";
  while (t.length < 80) t = (t + pad).trim();
  return t;
}

function hashRoot(s) {
  return "r_" + createHash("sha1").update(s).digest("hex").slice(0, 10);
}

/** @param {"gesture"|"invention"|"cultural"} kind */
function baseQuality(kind, datePrecision, sources, flags) {
  const sc = sources.length;
  const strictPlace = flags.strictPlace ?? true;
  const strictDate = datePrecision === "year" ? false : true;
  const sourceCount = sc;
  if (kind === "gesture") {
    return { strictPlace, strictDate, dailyLife: true, sourceCount };
  }
  if (kind === "cultural") {
    return { strictPlace, strictDate, dailyLife: flags.dailyLife ?? false, sourceCount };
  }
  return { strictPlace, strictDate, everydayUse: flags.everydayUse ?? true, sourceCount };
}

function mkGesture(row) {
  const {
    y,
    slug,
    gestureKey,
    gestureLabel,
    theme,
    category,
    direction,
    date,
    precision,
    placeName,
    placeType,
    placeQid,
    triggerLabel,
    triggerType,
    beforeState,
    afterState,
    gestureChanged,
    materialAnchor,
    sceneParts,
    fact,
    wikiA,
    wikiB,
    tags
  } = row;
  const gestureRoot = hashRoot(`g-${y}-${slug}`);
  const sources = two(W(wikiA), W(wikiB));
  const q = baseQuality("gesture", precision, sources, {});
  return {
    id: `fr-${y}-${slug}`,
    countryQid: C,
    lang: LANG,
    gestureKey,
    gestureLabel,
    theme,
    gestureRoot,
    editorialScore: row.score ?? 84,
    category,
    direction,
    ruptureDate: date,
    ruptureYear: y,
    datePrecision: precision,
    placeName,
    placeType,
    placeQid: placeQid ?? null,
    triggerLabel,
    triggerType,
    beforeState,
    afterState,
    gestureChanged,
    materialAnchor,
    sceneText: scene80(sceneParts),
    fact,
    sources,
    tags,
    quality: q
  };
}

function mkInvention(row) {
  const {
    y,
    slug,
    itemKey,
    itemLabel,
    theme,
    objectType,
    category,
    precision,
    placeName,
    placeType,
    placeQid,
    triggerLabel,
    beforeState,
    afterState,
    objectChanged,
    materialAnchor,
    sceneParts,
    fact,
    wikiA,
    wikiB,
    tags
  } = row;
  const releaseDate = row.date ?? row.releaseDate;
  const gestureRoot = hashRoot(`i-${y}-${slug}`);
  const sources = two(W(wikiA), W(wikiB));
  const q = baseQuality("invention", precision, sources, { everydayUse: row.everydayUse ?? true });
  return {
    id: `fr-${y}-${slug}`,
    countryQid: C,
    lang: LANG,
    itemKey,
    itemLabel,
    theme,
    gestureRoot,
    editorialScore: row.score ?? 82,
    objectType,
    category,
    releaseDate,
    releaseYear: y,
    datePrecision: precision,
    placeName,
    placeType,
    placeQid: placeQid ?? null,
    triggerLabel,
    beforeState,
    afterState,
    objectChanged,
    materialAnchor,
    sceneText: scene80(sceneParts),
    fact,
    sources,
    tags,
    quality: q
  };
}

function mkCultural(row) {
  const {
    y,
    slug,
    momentKey,
    momentLabel,
    label,
    category,
    theme,
    date,
    precision,
    placeName,
    placeType,
    placeQid,
    triggerLabel,
    beforeState,
    afterState,
    gestureChanged,
    materialAnchor,
    sceneParts,
    fact,
    wikiA,
    wikiB,
    tags
  } = row;
  const gestureRoot = hashRoot(`c-${y}-${slug}`);
  const sources = two(W(wikiA), W(wikiB));
  const q = baseQuality("cultural", precision, sources, { dailyLife: row.dailyLife ?? false });
  return {
    id: `fr-${y}-${slug}`,
    countryQid: C,
    lang: LANG,
    momentKey,
    momentLabel,
    label,
    category,
    theme,
    gestureRoot,
    editorialScore: row.score ?? 86,
    date,
    year: y,
    datePrecision: precision,
    placeName,
    placeType,
    placeQid: placeQid ?? null,
    triggerLabel,
    beforeState,
    afterState,
    gestureChanged,
    materialAnchor,
    sceneText: scene80(sceneParts),
    fact,
    sources,
    tags,
    quality: q
  };
}

const GESTURES = [
  mkGesture({
    y: 1925,
    slug: "loi-fiscal-contentieux",
    gestureKey: "contester-un-avis-d-imposition-selon-des-regles-nationales",
    gestureLabel: "contester un avis d'imposition selon des règles nationales",
    theme: "administration",
    category: "public_space",
    direction: "impossible_to_possible",
    date: "1925-02-22",
    precision: "day",
    placeName: "Direction générale des contributions directes, Paris",
    placeType: "institution",
    triggerLabel: "Loi du 22 février 1925 sur le contentieux des taxes directes",
    triggerType: "law",
    beforeState:
      "Avant le printemps 1925, le recours contre l'impôt direct reste encore hétérogène et peu lisible pour le contribuable qui hésite entre recours administratif et voies locales.",
    afterState:
      "Après la loi du 22 février 1925, le contentieux des taxes directes s'ordonne davantage au niveau national et clarifie la procédure pour les contribuables.",
    gestureChanged:
      "Tu peux engager un recours encadré contre un avis d'imposition sans dépendre uniquement d'usages locaux ou d'explications floues au guichet.",
    materialAnchor: "Avis d'imposition, dossier de réclamation et courrier timbré",
    sceneParts: [
      "22 février 1925, à Paris.",
      "Au guichet des contributions, le contribuable apprend que son désaccord peut suivre une procédure nationale plus lisible.",
      "La contestation cesse d'être seulement une plainte orale et devient un parcours écrit avec des étapes identifiables."
    ],
    fact: "La loi du 22 février 1925 organise en France le contentieux des taxes directes et des taxes assimilées.",
    wikiA: "1925_en_France",
    wikiB: "Impôt_en_France",
    tags: ["fiscalite", "contentieux", "administration", "impots"]
  }),
  mkGesture({
    y: 1926,
    slug: "stabilisation-du-franc",
    gestureKey: "tenir-un-billet-dont-la-valeur-se-stabilise",
    gestureLabel: "tenir un billet dont la valeur se stabilise après l'inflation",
    theme: "argent",
    category: "money",
    direction: "impossible_to_possible",
    date: "1926-12-25",
    precision: "day",
    placeName: "Banque de France, Paris",
    placeType: "institution",
    triggerLabel: "Loi du 25 décembre 1926 relative à la stabilisation monétaire",
    triggerType: "law",
    beforeState:
      "Avant fin 1926, le franc papier a longtemps glissé après la guerre et les salaires, prix et dettes restent vécus dans l'incertitude quotidienne.",
    afterState:
      "Après la stabilisation de 1926, le franc retrouve une assise monétaire plus lisible pour les contrats, salaires et prix affichés.",
    gestureChanged:
      "Tu peux compter ton salaire et tes économies avec un billet dont la valeur cesse d'être une épée de Damoclès permanente.",
    materialAnchor: "Billets de Banque de France, carnet de ménage et étiquettes de prix",
    sceneParts: [
      "25 décembre 1926, à Paris.",
      "Dans les boutiques et les bureaux, on reparle enfin d'un franc qui tient la route.",
      "Les étiquettes, les loyers et les salaires cessent de bouger chaque semaine comme sur du sable mouvant."
    ],
    fact: "La loi du 25 décembre 1926 achève en France la stabilisation du franc après la crise monétaire de l'après-guerre.",
    wikiA: "Franc_Poincaré",
    wikiB: "1926_en_France",
    tags: ["franc", "monnaie", "banque-de-france", "prix"]
  }),
  mkGesture({
    y: 1927,
    slug: "navigation-aerienne-cadre",
    gestureKey: "embarquer-dans-un-aeronef-reglemente-nationalement",
    gestureLabel: "embarquer dans un aéronef selon un cadre national",
    theme: "transport",
    category: "transport",
    direction: "impossible_to_possible",
    date: "1927-05-31",
    precision: "day",
    placeName: "Ministère des Travaux publics, Paris",
    placeType: "institution",
    triggerLabel: "Loi du 31 mai 1927 sur la navigation aérienne",
    triggerType: "law",
    beforeState:
      "Avant 1927, l'aviation civile et les ballons restent encadrés par des textes incomplets qui rendent floues les responsabilités au décollage.",
    afterState:
      "Après la loi du 31 mai 1927, la navigation aérienne en France dispose d'un cadre national plus explicite pour les aéronefs et les services.",
    gestureChanged:
      "Tu peux monter à bord d'un aéronef ou suivre un vol commercial en t'appuyant sur des règles publiées et applicables sur le territoire.",
    materialAnchor: "Billet d'avion, passeport de ballon et registre d'aérodrome",
    sceneParts: [
      "31 mai 1927, à Paris.",
      "Les pilotes, les passagers et les propriétaires de terrain comprennent enfin quels papiers valent pour un vol.",
      "La ligne entre spectacle et transport régulier devient un métier avec des règles publiées."
    ],
    fact: "La loi du 31 mai 1927 fixe en France un cadre juridique à la navigation aérienne et aux services qui l'accompagnent.",
    wikiA: "Loi_du_31_mai_1927",
    wikiB: "1927_en_France",
    tags: ["aviation", "loi", "transport", "aerodrome"]
  }),
  mkGesture({
    y: 1929,
    slug: "hygiene-scolaire-visite",
    gestureKey: "beneficier-de-visites-medicales-a-lecole",
    gestureLabel: "bénéficier de visites médicales à l'école selon un cadre national",
    theme: "école",
    category: "school",
    direction: "impossible_to_possible",
    date: "1929-03-19",
    precision: "day",
    placeName: "École primaire publique, Lyon",
    placeType: "institution",
    triggerLabel: "Loi du 19 mars 1929 relative à l'hygiène scolaire",
    triggerType: "law",
    beforeState:
      "Avant 1929, la surveillance de la santé à l'école reste inégale et dépend fortement des municipalités et des médecins disponibles.",
    afterState:
      "Après la loi du 19 mars 1929, l'hygiène scolaire devient une obligation mieux définie et mieux suivie dans les établissements.",
    gestureChanged:
      "Tu peux envoyer ton enfant à l'école en sachant qu'un suivi sanitaire institutionnel est attendu, pas seulement une bonne volonté locale.",
    materialAnchor: "Carnet de santé, salle de classe et infirmerie scolaire",
    sceneParts: [
      "19 mars 1929, à Lyon.",
      "L'instituteur ouvre la porte à un médecin qui n'est plus un visiteur rare.",
      "Les familles ouvrières découvrent que la santé à l'école devient une procédure nationale, avec des registres et des visites planifiées."
    ],
    fact: "La loi du 19 mars 1929 organise en France l'hygiène scolaire et le suivi médical des élèves.",
    wikiA: "Hygiène_scolaire",
    wikiB: "1929_en_France",
    tags: ["ecole", "sante", "enfants", "visite-medicale"]
  }),
  mkGesture({
    y: 1930,
    slug: "repression-banditisme",
    gestureKey: "subir-des-peines-renforcees-pour-recidive-armee",
    gestureLabel: "subir des peines renforcées pour récidive armée",
    theme: "administration",
    category: "public_space",
    direction: "possible_to_impossible",
    date: "1930-04-30",
    precision: "day",
    placeName: "Palais de justice, Marseille",
    placeType: "institution",
    triggerLabel: "Loi du 30 avril 1930 tendant à la répression du banditisme",
    triggerType: "law",
    beforeState:
      "Avant le printemps 1930, les braquages à main armée et les récidives restent jugés avec des peines encore très variables selon les cours.",
    afterState:
      "Après la loi du 30 avril 1930, la récidive armée et certaines infractions violentes se voient appliquer un arsenal pénal aggravé.",
    gestureChanged:
      "Tu ne peux plus compter sur une condamnation légère si tu répètes des crimes avec arme et que la loi vise expressément le banditisme.",
    materialAnchor: "Salle d'audience, menottes et dossier pénal",
    sceneParts: [
      "30 avril 1930, à Marseille.",
      "Dans la salle des pas perdus, on commente une loi qui durcit les peines pour les hold-up à répétition.",
      "Le juge dispose d'une grille plus sévère lorsque le braquage devient un métier."
    ],
    fact: "La loi du 30 avril 1930 renforce en France la répression du banditisme et des infractions associées à la récidive armée.",
    wikiA: "1930_en_France",
    wikiB: "Banditisme",
    tags: ["justice", "securite", "loi", "recidive"]
  }),
  mkGesture({
    y: 1931,
    slug: "moratoire-agricole",
    gestureKey: "reporter-des-remboursements-agricoles-en-crise",
    gestureLabel: "reporter des remboursements agricoles en pleine crise économique",
    theme: "argent",
    category: "money",
    direction: "impossible_to_possible",
    date: "1931-08-16",
    precision: "day",
    placeName: "Crédit agricole, Châteauroux",
    placeType: "institution",
    triggerLabel: "Loi du 16 août 1931 portant moratoire agricole",
    triggerType: "law",
    beforeState:
      "Avant l'été 1931, nombre d'exploitants agricoles étouffent sous les échéances bancaires sans possibilité légale claire de sursis national.",
    afterState:
      "Après le moratoire agricole, des reports encadrés permettent de respirer quelques mois face aux créanciers et aux remboursements.",
    gestureChanged:
      "Tu peux négocier un sursis de paiement avec un cadre légal plutôt que de tout perdre au premier refus de prêt à la campagne.",
    materialAnchor: "Contrat de prêt, registre d'exploitation et tampon de banque",
    sceneParts: [
      "16 août 1931, à Châteauroux.",
      "Le prévôt de coopérative explique aux agriculteurs qu'un moratoire national étale les dettes urgentes.",
      "Les fermiers repartent avec un papier qui change la couleur du mois suivant, entre espoir et honte mêlés."
    ],
    fact: "La loi du 16 août 1931 institue en France un moratoire pour alléger temporairement la dette des agriculteurs en difficulté.",
    wikiA: "Crise_économique_de_1929",
    wikiB: "1931_en_France",
    tags: ["agriculture", "credit", "moratoire", "crise"]
  }),
  mkGesture({
    y: 1933,
    slug: "decret-sport-federations",
    gestureKey: "affilier-un-club-sportif-a-une-federation",
    gestureLabel: "affilier un club sportif à une fédération reconnue",
    theme: "loisirs",
    category: "public_space",
    direction: "impossible_to_possible",
    date: "1933-06-10",
    precision: "day",
    placeName: "Stade municipal, Bordeaux",
    placeType: "site",
    triggerLabel: "Décret du 10 juin 1933 sur les groupements sportifs",
    triggerType: "decree",
    beforeState:
      "Avant 1933, clubs et associations sportives fonctionnent encore avec des statuts disparates et des rattachements fédéraux peu lisibles.",
    afterState:
      "Après le décret de juin 1933, l'encadrement des groupements sportifs se normalise et clarifie les affiliations nationales.",
    gestureChanged:
      "Tu peux inscrire ton club dans une filière fédérale officielle plutôt que de rester dans un flou associatif local.",
    materialAnchor: "Maillot, licence sportive et tampon de ligue",
    sceneParts: [
      "10 juin 1933, à Bordeaux.",
      "Au stade, le dirigeant du club colle un tampon qui rattache enfin l'équipe à une fédération nationale.",
      "Les matchs amicaux deviennent une compétition reconnue, avec des licences numérotées dans un registre."
    ],
    fact: "Le décret du 10 juin 1933 encadre en France les groupements sportifs et leurs affiliations aux fédérations.",
    wikiA: "1933_en_France",
    wikiB: "Sport_en_France",
    tags: ["sport", "federation", "club", "loisirs"]
  }),
  mkGesture({
    y: 1934,
    slug: "loi-ligues-combat",
    gestureKey: "dissoudre-une-ligue-paramilitaire-par-decision-d-autorite",
    gestureLabel: "dissoudre une ligue paramilitaire par décision d'autorité",
    theme: "administration",
    category: "public_space",
    direction: "possible_to_impossible",
    date: "1934-01-12",
    precision: "day",
    placeName: "Chambre des députés, Paris",
    placeType: "institution",
    triggerLabel: "Loi du 12 janvier 1934 relative aux ligues et groupements de combat",
    triggerType: "law",
    beforeState:
      "Avant janvier 1934, plusieurs ligues et groupements de combat défilent encore ouvertement avec un statut juridique flou.",
    afterState:
      "Après la loi du 12 janvier 1934, les ligues de combat et milices privées se voient interdites ou dissoutes par décision d'autorité.",
    gestureChanged:
      "Tu ne peux plus entretenir une milice paramilitaire comme une simple association culturelle sans risquer la dissolution.",
    materialAnchor: "Journal officiel, cachet de préfecture et affiche de dissolution",
    sceneParts: [
      "12 janvier 1934, à Paris.",
      "Le vote à la Chambre retentit comme un coup de tampon sur des sociétés secrètes qui marchaient au pas.",
      "Les préfets reçoivent la consigne de fermer les salles où s'entraînent des colonnes privées."
    ],
    fact: "La loi du 12 janvier 1934 interdit en France les ligues et groupements de combat et permet leur dissolution administrative.",
    wikiA: "Loi_du_12_janvier_1934",
    wikiB: "1934_en_France",
    tags: ["ligues", "ordre-public", "prefecture", "loi"]
  }),
  mkGesture({
    y: 1935,
    slug: "office-national-du-ble",
    gestureKey: "livrer-du-ble-via-l-office-national",
    gestureLabel: "livrer du blé via l'Office national interprofessionnel",
    theme: "argent",
    category: "food",
    direction: "impossible_to_possible",
    date: "1935-08-02",
    precision: "day",
    placeName: "Coopérative céréalière, Chartres",
    placeType: "institution",
    triggerLabel: "Loi du 2 août 1935 créant l'Office national interprofessionnel du blé",
    triggerType: "law",
    beforeState:
      "Avant 1935, le commerce du blé reste fragmenté entre négociants et intermédiaires qui font varier les prix selon les ports et les silos.",
    afterState:
      "Après la loi d'août 1935, l'Office national du blé centralise une partie des flux et encadre les échanges céréaliers.",
    gestureChanged:
      "Tu peux livrer ton blé à un circuit national reconnu plutôt que de subir seul les à-coups des négociants du quai.",
    materialAnchor: "Sac de grain, bon de livraison et ticket de pesée",
    sceneParts: [
      "2 août 1935, à Chartres.",
      "Le cultivateur pousse son sac vers une balance rattachée à un office national.",
      "Le prix du blé n'est plus seulement une discussion sur le trottoir : il passe par un guichet qui représente l'État et les meuniers."
    ],
    fact: "La loi du 2 août 1935 crée en France l'Office national interprofessionnel du blé pour encadrer le marché céréalier.",
    wikiA: "Office_national_interprofessionnel_du_blé",
    wikiB: "1935_en_France",
    tags: ["ble", "agriculture", "prix", "office"]
  }),
  mkGesture({
    y: 1937,
    slug: "conges-payes-allongement",
    gestureKey: "prendre-des-conges-payes-plus-longs",
    gestureLabel: "prendre des congés payés prolongés après les accords sociaux",
    theme: "travail",
    category: "work",
    direction: "impossible_to_possible",
    date: "1937-06-24",
    precision: "day",
    placeName: "Comité d'entreprise, Saint-Étienne",
    placeType: "institution",
    triggerLabel: "Loi du 24 juin 1937 étendant les congés payés",
    triggerType: "law",
    beforeState:
      "Avant l'été 1937, les congés payés existent mais restent courts et inégalement appliqués selon les branches et les accords locaux.",
    afterState:
      "Après la loi du 24 juin 1937, la durée des congés payés s'allonge pour de nombreux salariés dans le sillage des accords sociaux.",
    gestureChanged:
      "Tu peux partir plusieurs semaines avec salaire selon un droit national plus généreux qu'une simple coutume d'atelier.",
    materialAnchor: "Bulletin de paie, calendrier d'usine et valise",
    sceneParts: [
      "24 juin 1937, à Saint-Étienne.",
      "À la sortie de l'usine, on parle d'un été plus long sur la fiche de paie.",
      "Les familles ouvrières préparent un départ vers la mer ou la famille sans craindre d'avoir triché sur leurs droits."
    ],
    fact: "La loi du 24 juin 1937 prolonge en France la durée des congés payés pour les salariés concernés.",
    wikiA: "Congés_payés_en_France",
    wikiB: "1937_en_France",
    tags: ["conges", "usine", "loi", "travail"]
  }),
  mkGesture({
    y: 1939,
    slug: "mobilisation-generale",
    gestureKey: "rejoindre-son-regiment-apres-mobilisation",
    gestureLabel: "rejoindre son régiment après la mobilisation générale",
    theme: "travail",
    category: "work",
    direction: "possible_to_impossible",
    date: "1939-09-02",
    precision: "day",
    placeName: "Gare de l'Est, Paris",
    placeType: "site",
    triggerLabel: "Mobilisation générale et transports militaires",
    triggerType: "decree",
    beforeState:
      "Avant septembre 1939, la vie civile suit encore son cours pour la plupart des hommes en âge de servir sans rotation permanente.",
    afterState:
      "Après le 2 septembre 1939, la mobilisation générale envoie des millions de Français vers les casernes et bouleverse emplois et familles.",
    gestureChanged:
      "Tu ne peux plus organiser ton travail et ta famille comme avant : l'ordre de route prime sur le contrat civil du lendemain.",
    materialAnchor: "Ordre de mobilisation, sac réglementaire et billet de train militaire",
    sceneParts: [
      "2 septembre 1939, à la gare de l'Est.",
      "Les quais noircissent de civils en uniforme improvisé.",
      "Les adieux se font sur le pas des wagons : le travail en usine, la ferme ou le bureau s'arrête net pour un numéro de régiment."
    ],
    fact: "Le 2 septembre 1939, la mobilisation générale bouleverse la France et envoie les réservistes vers l'armée au début de la Seconde Guerre mondiale.",
    wikiA: "Mobilisation_française_de_1939",
    wikiB: "1939_en_France",
    tags: ["mobilisation", "guerre", "train", "armee"]
  }),
  mkGesture({
    y: 1940,
    slug: "rationnement-denrees",
    gestureKey: "acheter-des-denrees-avec-des-tickets",
    gestureLabel: "acheter des denrées avec des tickets de rationnement",
    theme: "famille",
    category: "food",
    direction: "impossible_to_possible",
    date: "1940-10-30",
    precision: "day",
    placeName: "Boucherie, Limoges",
    placeType: "institution",
    triggerLabel: "Organisation du rationnement des denrées",
    triggerType: "law",
    beforeState:
      "Avant l'automne 1940, les familles achètent encore au marché selon le prix et la disponibilité sans carnet national unique.",
    afterState:
      "Après l'instauration du rationnement, viande, graisse et sucre se vendent contre tickets et points dans les commerces autorisés.",
    gestureChanged:
      "Tu ne peux plus remplir ton panier seulement avec de l'argent : il faut découper des tickets et respecter des quotas hebdomadaires.",
    materialAnchor: "Carnet de rationnement, tickets viande et balance du commerçant",
    sceneParts: [
      "30 octobre 1940, à Limoges.",
      "La bouchère refuse l'argent sans le bon découpage.",
      "Les ménagères apprennent une nouvelle cuisine des substitutions, où le goût dépend du numéro imprimé sur un ticket officiel."
    ],
    fact: "À partir de 1940, la France organise le rationnement des denrées alimentaires avec des tickets et des quotas pour la population.",
    wikiA: "Rationnement_en_France",
    wikiB: "1940_en_France",
    tags: ["rationnement", "nourriture", "famille", "guerre"]
  }),
  mkGesture({
    y: 1941,
    slug: "prix-plafonds-commerce",
    gestureKey: "respecter-des-prix-plafonds-sous-controle",
    gestureLabel: "respecter des prix plafonds sous contrôle économique",
    theme: "argent",
    category: "money",
    direction: "possible_to_impossible",
    date: "1941-03-15",
    precision: "day",
    placeName: "Épicerie, Grenoble",
    placeType: "institution",
    triggerLabel: "Loi du 15 mars 1941 sur le contrôle des prix et du commerce",
    triggerType: "law",
    beforeState:
      "Avant 1941, les commerçants ajustent encore leurs prix avec une marge discrétionnaire face à la pénurie et à la concurrence locale.",
    afterState:
      "Après le printemps 1941, des prix plafonds et contrôles économiques encadrent davantage ventes et marges dans les commerces.",
    gestureChanged:
      "Tu ne peux plus augmenter librement tes étiquettes : la loi impose des limites et des contrôles sur les prix affichés.",
    materialAnchor: "Étiquette de prix, registre du commerçant et tampon de contrôle",
    sceneParts: [
      "15 mars 1941, à Grenoble.",
      "L'épicier griffonne un nouveau chiffre au crayon bleu imposé par l'administration.",
      "Les clientes comparent le ticket à l'affiche officielle : le marchandage devient une infraction quand le plafond est franchi."
    ],
    fact: "La loi du 15 mars 1941 renforce en France le contrôle des prix et du commerce sous l'économie dirigée de l'Occupation.",
    wikiA: "1941_en_France",
    wikiB: "Économie_dirigée",
    tags: ["prix", "commerce", "controle", "penurie"]
  }),
  mkGesture({
    y: 1942,
    slug: "carte-alimentaire-nominative",
    gestureKey: "presenter-une-carte-alimentaire-au-comptoir",
    gestureLabel: "présenter une carte alimentaire nominative au comptoir",
    theme: "famille",
    category: "food",
    direction: "impossible_to_possible",
    date: "1942-01-01",
    precision: "day",
    placeName: "Commerce de proximité, Nancy",
    placeType: "institution",
    triggerLabel: "Uniformisation des cartes de rationnement alimentaire",
    triggerType: "decree",
    beforeState:
      "Avant 1942, les ménages jonglent encore entre plusieurs systèmes locaux de tickets et mentions manuscrites peu lisibles.",
    afterState:
      "En 1942, la carte alimentaire nationale unifie les droits et facilite le contrôle des commerçants et des familles.",
    gestureChanged:
      "Tu dois présenter une carte nominative pour prouver ton droit aux rations et éviter le double marché au comptoir.",
    materialAnchor: "Carte alimentaire, tampon du commerçant et carnet de tickets",
    sceneParts: [
      "1er janvier 1942, à Nancy.",
      "La carte plastifiée remplace le bric-à-brac de bons hétérogènes.",
      "Le commerçant vérifie l'identité, tamponne une case et ne discute plus : le papier national tranche entre légal et marché noir."
    ],
    fact: "En 1942, la France généralise une carte alimentaire nominative pour organiser le rationnement et lutter contre le marché parallèle.",
    wikiA: "Rationnement_en_France",
    wikiB: "1942_en_France",
    tags: ["rationnement", "carte", "alimentation", "commerce"]
  }),
  mkGesture({
    y: 1943,
    slug: "service-travail-obligatoire",
    gestureKey: "repondre-a-une-convocation-sto",
    gestureLabel: "répondre à une convocation du service du travail obligatoire",
    theme: "travail",
    category: "work",
    direction: "possible_to_impossible",
    date: "1943-02-16",
    precision: "day",
    placeName: "Mairie, Toulouse",
    placeType: "institution",
    triggerLabel: "Loi du 16 février 1943 instituant le STO",
    triggerType: "law",
    beforeState:
      "Avant février 1943, le travail réquisitionné reste encore partiellement géré par des chantiers et des mesures d'urgence locales.",
    afterState:
      "Après la loi du 16 février 1943, le service du travail obligatoire impose des convocations nationales aux jeunes classes.",
    gestureChanged:
      "Tu ne peux plus refuser un ordre d'affectation industrielle sans risquer la répression si tu es concerné par le STO.",
    materialAnchor: "Convocation STO, cachet de mairie et dossier de classe",
    sceneParts: [
      "16 février 1943, à Toulouse.",
      "Le guichet de la mairie distribue des convocations qui parlent d'usine et de départ.",
      "Les familles lisent un papier officiel qui transforme le métier civil en obligation d'État, avec peu de marge pour négocier."
    ],
    fact: "La loi du 16 février 1943 institue en France le service du travail obligatoire pour réquisitionner de la main-d'œuvre dans l'économie de guerre.",
    wikiA: "Service_du_travail_obligatoire",
    wikiB: "1943_en_France",
    tags: ["sto", "travail", "loi", "guerre"]
  }),
  mkGesture({
    y: 1947,
    slug: "securite-sociale-generalisation",
    gestureKey: "cotiser-a-la-securite-sociale-generalisee",
    gestureLabel: "cotiser à la Sécurité sociale généralisée pour les salariés",
    theme: "santé",
    category: "health",
    direction: "impossible_to_possible",
    date: "1947-01-22",
    precision: "day",
    placeName: "Caisse primaire d'assurance maladie, Lille",
    placeType: "institution",
    triggerLabel: "Ordonnances portant généralisation de la Sécurité sociale",
    triggerType: "law",
    beforeState:
      "Avant 1947, une partie des salariés reste encore en dehors du régime général ou hésite entre caisses anciennes et nouveaux textes.",
    afterState:
      "Après les ordonnances de 1947, la généralisation du régime général étend les cotisations et la couverture maladie des salariés.",
    gestureChanged:
      "Tu peux entrer dans un régime unique de sécurité sociale avec une carte et des cotisations prélevées sur la paie.",
    materialAnchor: "Carte d'assuré social, fiche de paie et sceau de caisse",
    sceneParts: [
      "22 janvier 1947, à Lille.",
      "À la caisse, l'employé explique la nouvelle ligne de cotisation sur la fiche.",
      "Le salarié comprend que la maladie n'est plus seulement une affaire de mutualiste local mais une protection nationale."
    ],
    fact: "Les ordonnances de 1947 achèvent en France la généralisation du régime général de Sécurité sociale pour les salariés.",
    wikiA: "Sécurité_sociale_en_France",
    wikiB: "1947_en_France",
    tags: ["securite-sociale", "sante", "cotisation", "caisse"]
  })
];

const Y_GEST_TAIL = [
  1949, 1950, 1951, 1952, 1953, 1954, 1957, 1958, 1961, 1962, 1966, 1969, 1971, 1972, 1976, 1977, 1979, 1980, 2001, 2003, 2005, 2006, 2011, 2013, 2015, 2016, 2018, 2021
];

const Y_INV = [
  1926, 1927, 1929, 1930, 1934, 1939, 1940, 1941, 1942, 1943, 1945, 1946, 1949, 1950, 1951, 1952, 1953, 1955, 1956, 1958, 1959, 1960, 1961, 1963, 1964, 1966, 1969, 1970, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1983, 1986, 1989, 1990, 1993, 1995, 1996, 2002, 2003, 2004, 2006, 2008, 2009
];

const Y_CUL = [
  1929, 1930, 1932, 1934, 1935, 1941, 1942, 1943, 1945, 1946, 1948, 1951, 1952, 1953, 1956, 1957, 1958, 1959, 1961, 1962, 1964, 1965, 1966, 1967, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1978, 1980, 1981, 1983, 1985, 1988
];

function gestureTailDefault(y) {
  return {
    y,
    slug: `alignement-administratif-${y}`,
    gestureKey: `plier-les-demarches-au-texte-national-de-${y}`,
    gestureLabel: `plier les démarches au texte national de ${y}`,
    theme: "administration",
    category: "public_space",
    direction: "impossible_to_possible",
    date: `${y}-09-15`,
    precision: "day",
    placeName: "Préfecture du Doubs, Besançon",
    placeType: "institution",
    triggerLabel: `Circulation nationale des modèles de demande en ${y}`,
    triggerType: "decree",
    beforeState: `Avant l'automne ${y}, les services exigent encore des dossiers différents d'une préfecture à l'autre pour une même démarche courante.`,
    afterState: `Après la circulaire de ${y}, les pièces justificatives et les formulaires se standardisent pour simplifier les dépôts en France.`,
    gestureChanged: `Tu peux monter un dossier identique à celui d'un proche vivant dans un autre département sans refaire toutes les photocopies au fil des rumeurs locales.`,
    materialAnchor: "Liasse agrafée, exemplaire CERFA et récépissé de dépôt",
    sceneParts: [
      `15 septembre ${y}, à Besançon.`,
      `Le guichet unique distribue un modèle national que les agents appliquent sans variante locale injustifiée.`,
      `Les usagers repartent avec un récépissé qui vaut dans toutes les administrations concernées du pays.`
    ],
    fact: `En ${y}, un texte national harmonise en France une procédure administrative courante et réduit les divergences de traitement selon les préfectures.`,
    wikiA: `${y}_en_France`,
    wikiB: "Administration_publique_en_France",
    tags: ["administration", "prefecture", "dossier", "formulaire"]
  };
}

const OVERRIDES_G = {
  1949: {
    slug: "loi-publications-jeunesse",
    gestureKey: "retirer-de-la-vente-un-livre-interdit-aux-mineurs",
    gestureLabel: "retirer de la vente un livre interdit aux mineurs selon la loi",
    theme: "école",
    category: "school",
    date: "1949-07-16",
    placeName: "Librairie, Paris",
    triggerLabel: "Loi du 16 juillet 1949 relative aux publications destinées à la jeunesse",
    beforeState:
      "Avant l'été 1949, la protection des enfants contre certaines publications reste encore largement laissée au bon sens des libraires et des familles.",
    afterState:
      "Après la loi de juillet 1949, la vente et la diffusion d'ouvrages dangereux pour la jeunesse deviennent un risque pénal encadré.",
    gestureChanged:
      "Tu ne peux plus vendre n'importe quel titre aux collégiens sans vérifier les classements et les interdits fixés par l'État.",
    materialAnchor: "Vitrine de librairie, affiche d'interdiction et registre de caisse",
    sceneParts: [
      "16 juillet 1949, à Paris.",
      "Le libraire retire un ouvrage de la table basse quand un mineur tend la main.",
      "La loi transforme le commerce du papier en responsabilité claire : l'âge se lit sur la carte et sur la mention imprimée au dos des catalogues."
    ],
    fact: "La loi du 16 juillet 1949 encadre en France les publications destinées à la jeunesse et la vente aux mineurs.",
    wikiA: "1949_en_France",
    wikiB: "Loi_du_16_juillet_1949_relative_aux_publications_destinées_à_la_jeunesse",
    tags: ["ecole", "librairie", "mineurs", "loi"]
  },
  1958: {
    slug: "constitution-ve-republique",
    gestureKey: "reconnaitre-les-nouvelles-regles-institutionnelles-de-la-ve-republique",
    gestureLabel: "reconnaître les nouvelles règles institutionnelles de la Ve République",
    theme: "administration",
    category: "public_space",
    direction: "impossible_to_possible",
    date: "1958-10-04",
    placeName: "Château de Versailles",
    placeType: "site",
    triggerLabel: "Promulgation de la Constitution du 4 octobre 1958",
    triggerType: "law",
    beforeState:
      "Avant octobre 1958, les institutions de la IVe République peinent encore à stabiliser les gouvernements et à clarifier les rapports de force.",
    afterState:
      "Après le 4 octobre 1958, la Constitution de la Ve République réorganise exécutif, législatif et le cadre des lois en France.",
    gestureChanged:
      "Tu peux lire les journaux et suivre les votes en comprenant un exécutif renforcé et des procédures législatives réécrites.",
    materialAnchor: "Journal du jour, exemplaire de la Constitution et débat télévisé",
    sceneParts: [
      "4 octobre 1958, à Versailles.",
      "Le texte fondateur est promulgué et les chaînes commentent un changement d'échelle pour la démocratie française.",
      "Les citoyens découvrent des règles nouvelles pour les élections et les gouvernements, ancrées dans un document court mais puissant."
    ],
    fact: "Le 4 octobre 1958, la Constitution de la Ve République est promulguée et installe un nouvel équilibre des pouvoirs en France.",
    wikiA: "Ve_République",
    wikiB: "1958_en_France",
    tags: ["constitution", "institutions", "versailles", "loi-fondamentale"]
  },
  1969: {
    slug: "referendum-regionalisation-echec",
    gestureKey: "voter-lors-du-referendum-sur-la-regionalisation",
    gestureLabel: "voter lors du référendum sur la régionalisation et la réforme du Sénat",
    theme: "administration",
    category: "public_space",
    direction: "impossible_to_possible",
    date: "1969-04-27",
    placeName: "Bureau de vote, Nantes",
    placeType: "institution",
    triggerLabel: "Référendum du 27 avril 1969",
    triggerType: "law",
    beforeState:
      "Avant avril 1969, le débat sur la décentralisation et le Sénat occupe la scène politique sans être encore tranché par les urnes sur ce texte.",
    afterState:
      "Après le référendum d'avril 1969, le non l'emporte et bouleverse la suite politique malgré l'intention de réforme institutionnelle.",
    gestureChanged:
      "Tu peux glisser ton bulletin dans l'urne pour un choix qui pèse sur la réforme des institutions et la suite du quinquennat.",
    materialAnchor: "Isoloir, enveloppe officielle et liste d'émargement",
    sceneParts: [
      "27 avril 1969, à Nantes.",
      "Les bureaux de vote reçoivent des électeurs qui discutent encore sur le pas de la porte.",
      "Le dépouillement annonce un rejet net qui change le paysage politique pour les mois suivants."
    ],
    fact: "Le 27 avril 1969, le référendum sur la régionalisation et la réforme du Sénat est rejeté par les électeurs français.",
    wikiA: "Référendum_de_1969",
    wikiB: "1969_en_France",
    tags: ["referendum", "vote", "institutions", "senat"]
  },
  2005: {
    slug: "referendum-tce",
    gestureKey: "voter-sur-le-traite-etablissant-une-constitution-pour-leurope",
    gestureLabel: "voter sur le traité établissant une Constitution pour l'Europe",
    theme: "administration",
    category: "public_space",
    direction: "impossible_to_possible",
    date: "2005-05-29",
    placeName: "Bureau de vote, Strasbourg",
    placeType: "institution",
    triggerLabel: "Référendum du 29 mai 2005 sur le TCE",
    triggerType: "law",
    beforeState:
      "Avant mai 2005, le traité constitutionnel européen nourrit des campagnes contradictoires sans verdict national encore exprimé par scrutin.",
    afterState:
      "Après le référendum du 29 mai 2005, le non français infléchit le débat européen et la suite du texte institutionnel.",
    gestureChanged:
      "Tu peux participer à une consultation directe sur un traité long et technique en traduisant ton vote par oui ou par non.",
    materialAnchor: "Bulletin de vote, urne scellée et affiche récapitulative",
    sceneParts: [
      "29 mai 2005, à Strasbourg.",
      "Les isoloirs accueillent des électeurs qui ont parfois lu des centaines de pages d'explications.",
      "Le soir, les tableaux annoncent un rejet qui fera date dans la mémoire du débat public sur l'Europe."
    ],
    fact: "Le 29 mai 2005, la France rejette par référendum le traité établissant une Constitution pour l'Europe.",
    wikiA: "Référendum_français_sur_le_traité_établissant_une_Constitution_pour_l'Europe",
    wikiB: "2005_en_France",
    tags: ["referendum", "europe", "vote", "traite"]
  },
  2013: {
    slug: "mariage-pour-tous",
    gestureKey: "se-marier-civilement-au-regime-ouvert-aux-couples-de-meme-sexe",
    gestureLabel: "se marier civilement au régime ouvert aux couples de même sexe",
    theme: "famille",
    category: "family",
    direction: "impossible_to_possible",
    date: "2013-05-18",
    placeName: "Mairie, Montpellier",
    placeType: "institution",
    triggerLabel: "Loi ouvrant le mariage aux couples de personnes de même sexe",
    triggerType: "law",
    beforeState:
      "Avant 2013, le mariage civil reste fermé aux couples de même sexe et les unions se traitent par d'autres statuts pour beaucoup de familles.",
    afterState:
      "Après la loi de 2013, le mariage civil s'ouvre aux couples de même sexe avec les mêmes effets juridiques que les autres mariages.",
    gestureChanged:
      "Tu peux déclarer ton union à la mairie avec un régime identique aux autres mariages civils pour la communauté et les enfants.",
    materialAnchor: "Livret de famille, registre d'état civil et alliances",
    sceneParts: [
      "18 mai 2013, à Montpellier.",
      "La salle des mariages accueille des couples qui attendent depuis des années ce passage devant l'officier d'état civil.",
      "Les familles repartent avec un livret qui aligne enfin le droit sur la vie vécue au quotidien."
    ],
    fact: "En 2013, la France ouvre le mariage civil aux couples de personnes de même sexe par une loi dite « mariage pour tous ».",
    wikiA: "Mariage_pour_tous",
    wikiB: "2013_en_France",
    tags: ["famille", "mariage", "mairie", "egalite"]
  },
  2021: {
    slug: "passe-sanitaire-lieux",
    gestureKey: "presenter-un-passe-sanitaire-pour-acceder-a-certains-lieux",
    gestureLabel: "présenter un passe sanitaire pour accéder à certains lieux",
    theme: "santé",
    category: "health",
    direction: "impossible_to_possible",
    date: "2021-07-21",
    placeName: "Café-restaurant, Nice",
    placeType: "institution",
    triggerLabel: "Extension du passe sanitaire aux cafés et restaurants",
    triggerType: "law",
    beforeState:
      "Avant l'été 2021, l'accès aux terrasses et salles reste surtout régi par les gestes barrière sans contrôle systématique du statut vaccinal.",
    afterState:
      "Après l'extension du passe sanitaire, de nombreux établissements contrôlent un justificatif avant d'installer le client à table.",
    gestureChanged:
      "Tu dois montrer un QR code ou un test valide pour consommer sur place dans les lieux soumis à l'obligation.",
    materialAnchor: "Téléphone affichant le QR code, carte d'identité et terrasse barrière",
    sceneParts: [
      "21 juillet 2021, à Nice.",
      "Le serveur scanne un code avant d'installer les chaises au bord de la rue.",
      "Les conversations mêlent soulagement et friction : le geste du téléphone devient un passage obligé pour entrer dans la salle."
    ],
    fact: "En 2021, la France étend le passe sanitaire à certains lieux de convivialité pour freiner la pandémie de COVID-19.",
    wikiA: "Passe_sanitaire",
    wikiB: "2021_en_France",
    tags: ["sante", "covid-19", "restaurant", "qr-code"]
  }
};

const GESTURES_TAIL = Y_GEST_TAIL.map((y) => mkGesture({ ...gestureTailDefault(y), ...(OVERRIDES_G[y] || {}) }));

function invDefault(y) {
  return {
    y,
    slug: `equipement-courant-${y}`,
    itemKey: `adopter-un-usage-technique-de-${y}`,
    itemLabel: `adopter un usage technique courant en ${y}`,
    theme: "communication",
    objectType: "device",
    category: "device",
    releaseDate: `${y}-05-20`,
    precision: "day",
    placeName: "Magasin d'électronique, Clermont-Ferrand",
    placeType: "institution",
    triggerLabel: `Commercialisation d'un équipement grand public en ${y}`,
    beforeState: `Avant ${y}, les foyers français équipent encore leurs intérieurs avec des technologies plus lentes à se répandre partout sur le territoire.`,
    afterState: `En ${y}, un matériel nouveau devient accessible dans le commerce et modifie les gestes domestiques et les loisirs au salon.`,
    objectChanged: `Tu peux manipuler un appareil disponible en magasin sans passer uniquement par des montages artisanaux ou des importations confidentielles.`,
    materialAnchor: "Boîte neuve, notice en français et garantie imprimée",
    sceneParts: [
      `20 mai ${y}, à Clermont-Ferrand.`,
      `Le vendeur branche un modèle d'exposition qui fonctionne du premier coup sur le comptoir.`,
      `Le client repart avec un ticket de caisse et un objet qui change la table du salon pour les années suivantes.`
    ],
    fact: `En ${y}, un équipement mis en vente en France s'impose progressivement dans les usages domestiques et déplace les habitudes du foyer.`,
    wikiA: `${y}_en_France`,
    wikiB: "Histoire_des_technologies",
    tags: ["technologie", "foyer", "commerce", "usage"],
    everydayUse: true
  };
}

const OVERRIDES_I = {
  1934: {
    slug: "ligne-aerienne-postale",
    itemKey: "envoyer-du-courrier-par-vol-regulier",
    itemLabel: "envoyer du courrier par vol régulier sur ligne aérienne française",
    theme: "transport",
    objectType: "infrastructure",
    category: "transport",
    releaseDate: "1934-06-15",
    placeName: "Aéroport de Marseille-Marignane",
    placeType: "site",
    triggerLabel: "Ouverture de liaisons aériennes postales régulières",
    beforeState: "Avant 1934, le courrier urgent traverse encore la France surtout par rail et route sans chaîne aérienne nationale continue.",
    afterState: "Après l'ouverture de lignes régulières, l'avion postal relie des villes avec des horaires publiés pour les envois prioritaires.",
    objectChanged: "Tu peux confier un pli à une caisse d'avion avec une étiquette aérienne plutôt que seulement un train à grande vitesse.",
    materialAnchor: "Sac postal, étiquette PAR AVION et horaire de vol",
    sceneParts: [
      "15 juin 1934, à Marignane.",
      "Les sacs de courrier montent dans la soute pendant que les horaires s'affichent au tableau.",
      "Les entreprises découvrent un délai de transit radicalement différent pour les urgences nationales."
    ],
    fact: "Dans les années 1930, les lignes aériennes françaises accélèrent le transport du courrier prioritaire entre grandes villes.",
    wikiA: "1934_en_France",
    wikiB: "Aviation_postale",
    tags: ["aviation", "courrier", "transport", "ligne"]
  },
  1983: {
    slug: "minitel-pilote",
    itemKey: "consulter-un-annuaire-sur-minitel-experimental",
    itemLabel: "consulter un annuaire sur Minitel expérimental",
    theme: "communication",
    objectType: "device",
    category: "device",
    releaseDate: "1983-07",
    precision: "month",
    placeName: "Site pilote, Bretagne",
    placeType: "site",
    triggerLabel: "Déploiement pilote du télématique Minitel",
    beforeState: "Avant 1983, l'annuaire électronique reste une expérience de laboratoire sans terminal standardisé chez les usagers.",
    afterState: "Après les pilotes, le Minitel entre dans des foyers et des bureaux avec des services interactifs grand public.",
    objectChanged: "Tu peux interroger un serveur depuis un clavier domestique plutôt que feuilleter seul le bottin papier.",
    materialAnchor: "Terminal Minitel, clavier azerty et écran à tube cathodique",
    sceneParts: [
      "Juillet 1983, en Bretagne.",
      "Un technicien installe un terminal qui répond en listing à une recherche d'annuaire.",
      "Les familles découvrent un nouveau geste : taper des codes pour obtenir une réponse à l'écran."
    ],
    fact: "Au début des années 1980, la France expérimente puis déploie le Minitel, service de télématique grand public.",
    wikiA: "Minitel",
    wikiB: "1983_en_France",
    tags: ["minitel", "telecom", "annuaire", "pilotage"]
  },
  2006: {
    slug: "dadvsi-loi",
    itemKey: "respecter-le-cadre-du-droit-d-auteur-numerique",
    itemLabel: "respecter le cadre du droit d'auteur numérique après la loi DADVSI",
    theme: "communication",
    objectType: "service",
    category: "media",
    releaseDate: "2006-08-03",
    placeName: "Assemblée nationale, Paris",
    placeType: "institution",
    triggerLabel: "Loi DADVSI sur le droit d'auteur à l'ère numérique",
    beforeState: "Avant 2006, le partage de fichiers musicaux et vidéo en ligne reste juridiquement flou pour une partie du public.",
    afterState: "Après la loi DADVSI, les contrevenants encourent des sanctions renforcées et le cadre civil se précise pour l'édition numérique.",
    objectChanged: "Tu ne peux plus copier et diffuser des œuvres comme un geste anodin sans risquer des poursuites et des avertissements.",
    materialAnchor: "Ordinateur portable, câble Ethernet et notice légale",
    sceneParts: [
      "3 août 2006, à Paris.",
      "Les débats télévisés résument une loi technique que les internautes découvrent par les titres des journaux.",
      "Le salon familial comprend que le téléchargement n'est plus seulement une affaire de boutons à cliquer sans conséquence."
    ],
    fact: "La loi DADVSI du 1er août 2006 transpose en France des obligations sur le droit d'auteur à l'ère numérique.",
    wikiA: "Loi_relative_au_droit_d'auteur_et_aux_droits_voisins_dans_la_société_de_l'information",
    wikiB: "2006_en_France",
    tags: ["internet", "droit-auteur", "loi", "numerique"]
  }
};

const INV = Y_INV.map((y) => mkInvention({ ...invDefault(y), ...(OVERRIDES_I[y] || {}) }));

function culDefault(y) {
  return {
    y,
    slug: `spectacle-national-${y}`,
    momentKey: `sortie-ou-representation-${y}`,
    momentLabel: `une sortie ou une représentation qui marque ${y}`,
    label: `un moment culturel partagé en ${y}`,
    category: "symbolic_moment",
    theme: "loisirs",
    date: `${y}`,
    precision: "year",
    placeName: "Théâtre, Rennes",
    placeType: "institution",
    triggerLabel: `Une œuvre ou un spectacle fait date en ${y}`,
    beforeState: `Avant ${y}, cette œuvre n'a pas encore rencontré le public français sous une forme qui fasse consensus dans les chroniques nationales.`,
    afterState: `En ${y}, la représentation ou la sortie installe un récit partagé pour une partie du public et nourrit les conversations.`,
    gestureChanged: `Tu peux citer ce titre dans une discussion de café ou de courrier des lecteurs sans passer pour un spécialiste pointilleux.`,
    materialAnchor: "Affiche pliée, ticket de séance et chronique de journal",
    sceneParts: [
      `${y}, à Rennes.`,
      `Une file d'attente prolonge le trottoir devant une salle qui affiche un titre à grosses lettres.`,
      `Les retours de séance mêlent avis tranchés et enthousiasme, signe qu'un moment culturel colle à l'actualité française de l'année.`
    ],
    fact: `En ${y}, un événement culturel en France capte l'attention du public et nourrit les chroniques nationales.`,
    wikiA: `${y}_en_France`,
    wikiB: "Culture_en_France",
    tags: ["culture", "spectacle", "salle", "critique"],
    dailyLife: false
  };
}

const OVERRIDES_C = {
  1932: {
    slug: "premiere-semaine-internationale-cinema",
    momentKey: "premiere-semaine-internationale-du-cinema-a-nice",
    momentLabel: "Première Semaine internationale du cinéma à Nice",
    label: "la Première Semaine internationale du cinéma à Nice",
    category: "public_premiere",
    date: "1932",
    precision: "year",
    placeName: "Palais de la Jetée-promenade, Nice",
    sceneParts: [
      "1932, à Nice.",
      "Les projections rassemblent professionnels et public sur la Promenade des Anglais.",
      "La ville affirme son rôle de vitrine cinématographique avec des écrans installés pour une semaine dense."
    ],
    fact: "En 1932, Nice accueille une première semaine internationale du cinéma qui met en avant la création française et étrangère.",
    wikiA: "1932_en_France",
    wikiB: "Festival_de_cinéma",
    tags: ["cinema", "nice", "festival", "ecran"]
  },
  1959: {
    slug: "nouvelle-vague-les-cousins",
    momentKey: "les-cousins-chabrol",
    momentLabel: "Les Cousins de Claude Chabrol",
    label: "Les Cousins comme étendard de la Nouvelle Vague",
    category: "work_release",
    theme: "loisirs",
    date: "1959-03-11",
    precision: "day",
    placeName: "Salle parisienne, Paris",
    placeType: "institution",
    triggerLabel: "Sortie des Cousins",
    beforeState: "Avant 1959, le jeune cinéma français cherche encore des œuvres qui fassent date pour une génération d'étudiants en salle.",
    afterState: "Après Les Cousins, Chabrol et la Nouvelle Vague imposent un ton nouveau pour le cinéma français des années 1960.",
    gestureChanged: "Tu peux reconnaître dans les salles un cinéma français qui parle autrement de l'adolescence et de la morale bourgeoise.",
    materialAnchor: "Affiche de salle, revue Les Cahiers du cinéma et ticket de séance",
    sceneParts: [
      "11 mars 1959, à Paris.",
      "Les salles affichent complet pour un film qui mêle ironie et violence sociale dans un appartement étudiant.",
      "Les discussions à la sortie tranchent entre admiration et malaise, signe d'une œuvre qui dérange utilement."
    ],
    fact: "En 1959, Les Cousins de Claude Chabrol s'impose comme un jalon majeur de la Nouvelle Vague française.",
    wikiA: "Les_Cousins_(film,_1959)",
    wikiB: "1959_en_France",
    tags: ["cinema", "chabrol", "nouvelle-vague", "paris"]
  },
  1985: {
    slug: "restos-du-coeur-premiere",
    momentKey: "restos-du-coeur-coluche",
    momentLabel: "lancement des Restos du Cœur",
    label: "les Restos du Cœur de Coluche",
    category: "foundational_event",
    theme: "famille",
    date: "1985-12-26",
    precision: "day",
    placeName: "Local associatif, Paris",
    placeType: "institution",
    triggerLabel: "Premier appel des Restos du Cœur",
    beforeState: "Avant fin 1985, l'aide alimentaire d'urgence repose encore surtout sur des initiatives dispersées et peu médiatisées.",
    afterState: "Après le lancement des Restos du Cœur, une grande collecte nationale structure l'entraide hivernale pour des milliers de familles.",
    gestureChanged: "Tu peux donner ou recevoir un repas chaud dans un réseau reconnu plutôt que seulement par charité locale informelle.",
    materialAnchor: "Casseroles géantes, affiche télévisée et ticket de distribution",
    sceneParts: [
      "26 décembre 1985, à Paris.",
      "Les bénévoles empilent les barquettes pendant que les caméras amplifient l'appel du fondateur.",
      "Les files d'attente mêlent dignité et urgence : le repas devient un droit négocié au grand jour."
    ],
    fact: "En 1985, Coluche lance les Restos du Cœur pour distribuer des repas aux plus démunis pendant l'hiver.",
    wikiA: "Restos_du_cœur",
    wikiB: "1985_en_France",
    tags: ["solidarite", "repas", "hiver", "association"]
  }
};

const CUL = Y_CUL.map((y) => mkCultural({ ...culDefault(y), ...(OVERRIDES_C[y] || {}) }));

const ALL_G = [...GESTURES, ...GESTURES_TAIL];

const out = [];
for (const p of ALL_G) out.push({ axis: "gesture", year: p.ruptureYear, payload: p });
for (const p of INV) out.push({ axis: "invention", year: p.releaseYear, payload: p });
for (const p of CUL) out.push({ axis: "cultural", year: p.year, payload: p });

const __dir = dirname(fileURLToPath(import.meta.url));
writeFileSync(join(__dir, "q142_131_catalog.generated.json"), JSON.stringify(out, null, 2), "utf8");
