import type { InventionEntry } from "../../../types";

export const FR_INVENTION_BACKFILL_1950_1969: InventionEntry[] = [
  {
    id: "fr-1954-vaccin-polio",
    countryQid: "Q142", lang: "fr",
    itemKey: "se-faire-vacciner-contre-la-polio",
    itemLabel: "se faire vacciner contre la poliomyélite",
    theme: "santé", gestureRoot: "vaccin_polio",
    editorialScore: 94,
    objectType: "service", category: "service",
    releaseDate: "1954-04-26", releaseYear: 1954, datePrecision: "day",
    placeName: "France", placeType: "country", placeQid: "Q142",
    triggerLabel: "Essais cliniques du vaccin Salk contre la polio",
    beforeState: "Avant 1954, la poliomyélite paralyse et tue des milliers d'enfants chaque année.",
    afterState: "Après 1954, le vaccin Salk ouvre la voie à l'éradication mondiale de la polio.",
    objectChanged: "Tu peux protéger ton enfant contre la polio avec une injection, sans craindre la paralysie.",
    materialAnchor: "Seringue, vaccin et carnet de santé",
    sceneText: "26 avril 1954. La nouvelle des essais massifs du vaccin Salk arrive aussi en France, ou la polio inquietait les familles chaque ete. Pour les parents francais, l'idee qu'une injection puisse eviter la paralysie cesse d'etre theorique.",
    fact: "Le 26 avril 1954, les premiers essais cliniques massifs du vaccin contre la polio (vaccin Salk) débutent aux États-Unis.",
    sources: [
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Vaccin_contre_la_poliomy%C3%A9lite", authority: false }
    ],
    tags: ["vaccin", "polio", "sante", "enfants"],
    quality: { strictPlace: false, strictDate: true, everydayUse: true, sourceCount: 1 }
  },
  {
    id: "fr-1957-spoutnik-satellite",
    countryQid: "Q142", lang: "fr",
    itemKey: "ecouter-le-signal-d-un-satellite",
    itemLabel: "capter le signal d'un satellite artificiel",
    theme: "communication", gestureRoot: "satellite_spatial",
    editorialScore: 88,
    objectType: "infrastructure", category: "network",
    releaseDate: "1957-10-04", releaseYear: 1957, datePrecision: "day",
    placeName: "France", placeType: "country", placeQid: "Q142",
    triggerLabel: "Lancement de Spoutnik 1 par l'URSS",
    beforeState: "Avant le 4 octobre 1957, aucun objet artificiel ne tourne autour de la Terre.",
    afterState: "Après le 4 octobre 1957, l'ère spatiale commence et les satellites vont révolutionner communications, météo et navigation.",
    objectChanged: "Tu pourras bientôt recevoir des émissions de télévision et des prévisions météo transmises depuis l'espace.",
    materialAnchor: "Récepteur radio, antenne et signal radio orbital",
    sceneText: "4 octobre 1957, en France. Le bip de Spoutnik sort des postes de radio comme un son venu d'un autre age. Dans les foyers et les ecoles, on comprend que le ciel est devenu un territoire technique.",
    fact: "Le 4 octobre 1957, l'URSS lance Spoutnik 1, premier satellite artificiel de l'histoire.",
    sources: [
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Spoutnik_1", authority: false }
    ],
    tags: ["espace", "satellite", "spoutnik", "urss"],
    quality: { strictPlace: false, strictDate: true, everydayUse: false, sourceCount: 1 }
  },
  {
    id: "fr-1962-telstar-television-satellite",
    countryQid: "Q142", lang: "fr",
    itemKey: "regarder-une-emission-tv-par-satellite",
    itemLabel: "regarder une émission télévisée transmise par satellite",
    theme: "communication", gestureRoot: "tv_satellite",
    editorialScore: 86,
    objectType: "infrastructure", category: "media",
    releaseDate: "1962-07-23", releaseYear: 1962, datePrecision: "day",
    placeName: "France — station de Pleumeur-Bodou", placeType: "site", placeQid: null,
    triggerLabel: "Première transmission télévisée transatlantique via Telstar",
    beforeState: "Avant juillet 1962, les images télévisées ne peuvent pas traverser l'Atlantique en direct.",
    afterState: "Après juillet 1962, les émissions TV peuvent être diffusées depuis l'autre bout du monde via satellite.",
    objectChanged: "Tu peux regarder en direct des images filmées sur un autre continent grâce à un relais spatial.",
    materialAnchor: "Antenne parabolique, écran TV et signal transatlantique",
    sceneText: "23 juillet 1962, station de Pleumeur-Bodou. L'antenne pivote vers le ciel. Sur l'écran, des images en direct depuis les États-Unis. Pour la première fois, la télévision traverse l'Atlantique par l'espace.",
    fact: "Le 23 juillet 1962, le satellite Telstar réalise la première retransmission télévisée transatlantique en direct, captée en France depuis Pleumeur-Bodou.",
    sources: [
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Telstar", authority: false },
      { label: "INA", url: "https://www.ina.fr/ina-eclaire-actu/telstar-la-premiere-retransmission-television-par-satellite", authority: true }
    ],
    tags: ["satellite", "television", "telstar", "transatlantique"],
    quality: { strictPlace: true, strictDate: true, everydayUse: true, sourceCount: 2 }
  },
  {
    id: "fr-1965-premier-ordinateur-entreprise",
    countryQid: "Q142", lang: "fr",
    itemKey: "travailler-avec-un-ordinateur-en-entreprise",
    itemLabel: "travailler avec un ordinateur dans une entreprise française",
    theme: "travail", gestureRoot: "ordinateur_entreprise",
    editorialScore: 84,
    objectType: "device", category: "device",
    releaseDate: "1965-01-01", releaseYear: 1965, datePrecision: "year",
    placeName: "Entreprise française", placeType: "institution", placeQid: null,
    triggerLabel: "Démocratisation de l'ordinateur dans les grandes entreprises françaises",
    beforeState: "Avant 1965, le traitement de l'information dans les entreprises passe par des machines mécaniques ou des tableaux à la main.",
    afterState: "Après 1965, les ordinateurs IBM et Bull entrent dans les grandes entreprises et administrations françaises.",
    objectChanged: "Tu travailles sur des données traitées par ordinateur au lieu de tout calculer manuellement.",
    materialAnchor: "Ordinateur à cartes perforées, imprimante matricielle et salle climatisée",
    sceneText: "1965, salle informatique. La machine à cartes perforées accepte ta demande. Des heures plus tard, l'imprimante crache les résultats. L'entreprise entre dans l'ère du traitement automatique.",
    fact: "Dans les années 1960, les premiers ordinateurs (IBM, Bull) entrent dans les grandes entreprises et administrations françaises.",
    sources: [
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Histoire_de_l%27informatique_en_France", authority: false }
    ],
    tags: ["ordinateur", "informatique", "entreprise", "bull"],
    quality: { strictPlace: true, strictDate: false, everydayUse: true, sourceCount: 1 }
  },
];
