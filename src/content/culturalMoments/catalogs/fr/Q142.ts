import type { CulturalMomentCatalog } from "../../types";
import { FR_CULTURAL_PERIOD_ENTRIES } from "./periods";

export const FR_CULTURAL_CATALOG: CulturalMomentCatalog = {
  countryQid: "Q142",
  defaultLang: "fr",
  supportedLangs: ["fr"],
  entries: [
    {
      id: "fr-1954-appel-abbe-pierre",
      countryQid: "Q142",
      lang: "fr",
      momentKey: "appel-abbe-pierre",
      momentLabel: "appel de l'Abbe Pierre",
      label: "appel de l'Abbe Pierre",
      category: "foundational_event",
      theme: "famille",
      gestureRoot: "appel_abbe_pierre",
      editorialScore: 86,
      date: "1954-02-01",
      year: 1954,
      datePrecision: "day",
      placeName: "France",
      placeType: "country",
      placeQid: "Q142",
      triggerLabel: "Appel de l'Abbe Pierre",
      beforeState: "Avant le 1 fevrier 1954, l'urgence du logement d'hiver n'a pas encore ce visage national dans les discussions quotidiennes.",
      afterState: "Apres le 1 fevrier 1954, l'appel devient un repere collectif sur la solidarite et le logement.",
      gestureChanged: "Tu peux te souvenir d'une nuit ou la radio pousse tout un pays a reagir.",
      materialAnchor: "Poste radio, appel diffuse et couvertures",
      sceneText:
        "1 fevrier 1954, dans les foyers. Une voix a la radio provoque une vague d'emotion et d'action. L'hiver devient un sujet commun qui change la maniere de regarder la rue.",
      fact: "Le 1 fevrier 1954, l'Abbe Pierre lance son appel radiodiffuse qui marque la vie collective francaise.",
      sources: [
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/Appel_de_l%27abb%C3%A9_Pierre",
          authority: false
        }
      ],
      tags: ["solidarite", "radio", "logement", "hiver"],
      quality: {
        strictPlace: true,
        strictDate: true,
        dailyLife: false,
        sourceCount: 1
      }
    },
    {
      id: "fr-1963-rtf-television-2",
      countryQid: "Q142",
      lang: "fr",
      momentKey: "rtf-television-2",
      momentLabel: "arrivee de la deuxieme chaine",
      label: "arrivee de la deuxieme chaine",
      category: "public_premiere",
      theme: "loisirs",
      gestureRoot: "rtf_television_2",
      editorialScore: 78,
      date: "1963-04-21",
      year: 1963,
      datePrecision: "day",
      placeName: "France",
      placeType: "country",
      placeQid: "Q142",
      triggerLabel: "Premiere emission de RTF Television 2",
      beforeState: "Avant le 21 avril 1963, la television francaise n'offre qu'une chaine nationale reguliere.",
      afterState: "Apres le 21 avril 1963, une deuxieme chaine apparait dans les conversations du soir.",
      gestureChanged: "Tu peux parler d'une nouvelle chaine qui vient d'apparaitre a l'ecran.",
      materialAnchor: "Television noir et blanc et bouton de selection",
      sceneText:
        "21 avril 1963, dans les salons. Une deuxieme chaine est mentionnee pour la premiere fois a la tele. Le paysage audiovisuel commence a se dedoubler.",
      fact: "Le 21 avril 1963, RTF Television 2 commence a emettre.",
      sources: [
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/RTF_T%C3%A9l%C3%A9vision_2",
          authority: false
        }
      ],
      tags: ["television", "rtf", "chaine", "culture"],
      quality: {
        strictPlace: true,
        strictDate: true,
        dailyLife: false,
        sourceCount: 1
      }
    },
    {
      id: "fr-1968-nuit-barricades",
      countryQid: "Q142",
      lang: "fr",
      momentKey: "nuit-des-barricades",
      momentLabel: "nuit des barricades",
      label: "nuit des barricades",
      category: "symbolic_moment",
      theme: "administration",
      gestureRoot: "nuit_des_barricades",
      editorialScore: 84,
      date: "1968-05-10",
      year: 1968,
      datePrecision: "day",
      placeName: "Quartier Latin, Paris",
      placeType: "city",
      placeQid: "Q90",
      triggerLabel: "Nuit des barricades",
      beforeState: "Avant le 10 mai 1968, les manifestations etudiantes n'ont pas encore bascule dans cette nuit de choc.",
      afterState: "Apres le 10 mai 1968, les evenements deviennent un repere culturel et politique majeur.",
      gestureChanged: "Tu peux te souvenir d'une nuit qui a change l'ambiance des rues et des discussions partout en France.",
      materialAnchor: "Paves, rues et radios allumees",
      sceneText:
        "10 mai 1968, a Paris. Les barricades, la fumee et les radios allumees fixent une image qui devient un repere de memoire collective. La culture de l'epoque prend un tournant visible.",
      fact: "Le 10 mai 1968, la nuit des barricades marque un tournant de Mai 68.",
      sources: [
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/Nuit_des_barricades",
          authority: false
        }
      ],
      tags: ["mai-68", "paris", "manifestation", "culture"],
      quality: {
        strictPlace: true,
        strictDate: true,
        dailyLife: false,
        sourceCount: 1
      }
    },
    {
      id: "fr-1977-centre-pompidou",
      countryQid: "Q142",
      lang: "fr",
      momentKey: "centre-pompidou",
      momentLabel: "ouverture du Centre Pompidou",
      label: "ouverture du Centre Pompidou",
      category: "venue_opening",
      theme: "loisirs",
      gestureRoot: "centre_pompidou",
      editorialScore: 80,
      date: "1977-01-31",
      year: 1977,
      datePrecision: "day",
      placeName: "Centre Pompidou, Paris",
      placeType: "site",
      placeQid: "Q134437",
      triggerLabel: "Ouverture du Centre Pompidou",
      beforeState: "Avant le 31 janvier 1977, ce grand centre d'art moderne n'existe pas au coeur de Paris.",
      afterState: "Apres le 31 janvier 1977, le centre devient un repere culturel qui attire des foules nouvelles.",
      gestureChanged: "Tu peux aller voir l'art moderne dans un batiment qui devient un symbole parisien.",
      materialAnchor: "Facade tubulaire, piazza et escalator exterieur",
      sceneText:
        "31 janvier 1977, à Beaubourg. La grande structure apparaît comme un objet culturel inédit, et les files se forment. Paris se dote d'un nouveau lieu pour regarder, discuter, flâner.",
      fact: "Le 31 janvier 1977, le Centre Pompidou ouvre au public à Paris.",
      sources: [
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/Centre_national_d%27art_et_de_culture_Georges-Pompidou",
          authority: false
        }
      ],
      tags: ["art", "musee", "paris", "culture"],
      quality: {
        strictPlace: true,
        strictDate: true,
        dailyLife: false,
        sourceCount: 1
      }
    },
    {
      id: "fr-1989-bicentenaire",
      countryQid: "Q142",
      lang: "fr",
      momentKey: "bicentenaire-1789",
      momentLabel: "bicentenaire de la Revolution francaise",
      label: "bicentenaire de la Revolution francaise",
      category: "symbolic_moment",
      theme: "administration",
      gestureRoot: "bicentenaire_1789",
      editorialScore: 82,
      date: "1989-07-14",
      year: 1989,
      datePrecision: "day",
      placeName: "Paris",
      placeType: "city",
      placeQid: "Q90",
      triggerLabel: "Celebration du bicentenaire",
      beforeState: "Avant le 14 juillet 1989, le bicentenaire n'a pas encore donne lieu a cette grande mise en scene nationale.",
      afterState: "Apres le 14 juillet 1989, l'annee 1989 devient un repere culturel marquant autour de la Revolution.",
      gestureChanged: "Tu peux te souvenir d'un 14 juillet exceptionnel et des images qui ont fait le tour du monde.",
      materialAnchor: "Champs-Elysees, defile et costumes",
      sceneText:
        "14 juillet 1989, Paris. Le defile et les tableaux vivants transforment la fete nationale en spectacle mondial. L'annee 1989 devient un repere de memoire collective.",
      fact: "Le 14 juillet 1989, la France celebre le bicentenaire de la Revolution avec de grandes ceremonies a Paris.",
      sources: [
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/Bicentenaire_de_la_R%C3%A9volution_fran%C3%A7aise",
          authority: false
        }
      ],
      tags: ["bicentenaire", "revolution", "paris", "culture"],
      quality: {
        strictPlace: true,
        strictDate: true,
        dailyLife: false,
        sourceCount: 1
      }
    },
    {
      id: "fr-1982-fete-de-la-musique",
      countryQid: "Q142",
      lang: "fr",
      momentKey: "fete-de-la-musique",
      momentLabel: "premiere Fete de la musique",
      label: "premiere Fete de la musique",
      category: "foundational_event",
      theme: "loisirs",
      gestureRoot: "fete_de_la_musique",
      editorialScore: 84,
      date: "1982-06-21",
      year: 1982,
      datePrecision: "day",
      placeName: "France",
      placeType: "country",
      placeQid: "Q142",
      triggerLabel: "Premiere Fete de la musique",
      beforeState: "Avant le 21 juin 1982, il n'existe pas de rendez-vous national ou la musique envahit gratuitement les rues.",
      afterState: "Apres le 21 juin 1982, le 21 juin devient un soir ou la musique se joue partout dans l'espace public.",
      gestureChanged: "Tu peux sortir jouer ou ecouter de la musique gratuite dans la rue ce soir-la.",
      materialAnchor: "Guitares, amplis et rues pietonnes",
      sceneText:
        "21 juin 1982, dans la rue. Des groupes s'installent sur les trottoirs et les places sans scene officielle. La musique devient une occupation collective du soir d'ete.",
      fact: "Le 21 juin 1982, la premiere Fete de la musique est organisee en France.",
      sources: [
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/F%C3%AAte_de_la_musique",
          authority: false
        }
      ],
      tags: ["musique", "rue", "ete", "culture"],
      quality: {
        strictPlace: true,
        strictDate: true,
        dailyLife: false,
        sourceCount: 1
      }
    },
    {
      id: "fr-1984-canal-plus",
      countryQid: "Q142",
      lang: "fr",
      momentKey: "canal-plus",
      momentLabel: "lancement de Canal+",
      label: "lancement de Canal+",
      category: "work_release",
      theme: "loisirs",
      gestureRoot: "canal_plus",
      editorialScore: 86,
      date: "1984-11-04",
      year: 1984,
      datePrecision: "day",
      placeName: "France",
      placeType: "country",
      placeQid: "Q142",
      triggerLabel: "Lancement de Canal+",
      beforeState: "Avant le 4 novembre 1984, le paysage tele francais ne compte pas de grande chaine a peage nationale.",
      afterState: "Apres le 4 novembre 1984, une chaine cryptee s'installe dans les habitudes du soir.",
      gestureChanged: "Tu peux t'abonner a une chaine payante nationale et la decoder chez toi.",
      materialAnchor: "Decodeur, telecommande et ecran crypte",
      sceneText:
        "4 novembre 1984, dans le salon. L'ecran se brouille puis se decode avec un boitier. La television devient un service auquel on s'abonne.",
      fact: "Le 4 novembre 1984, Canal+ commence a emettre en France.",
      sources: [
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/Canal%2B",
          authority: false
        }
      ],
      tags: ["television", "abonnement", "canal+", "decodeur"],
      quality: {
        strictPlace: true,
        strictDate: true,
        dailyLife: false,
        sourceCount: 1
      }
    },
    {
      id: "fr-1986-jean-de-florette-cinema",
      countryQid: "Q142",
      lang: "fr",
      momentKey: "jean-de-florette-premiere",
      momentLabel: "sortie de Jean de Florette en salles",
      label: "sortie de Jean de Florette en salles",
      category: "public_premiere",
      theme: "loisirs",
      gestureRoot: "jean_de_florette_film",
      editorialCluster: "jean_de_florette_1986",
      editorialScore: 88,
      date: "1986-08-27",
      year: 1986,
      datePrecision: "day",
      placeName: "Salles de cinéma, France",
      placeType: "country",
      placeQid: "Q142",
      triggerLabel: "Sortie nationale du film Jean de Florette (Claude Berri)",
      beforeState:
        "Avant l'été 1986, l'adaptation au cinéma de L'Eau des collines n'a pas encore rempli les salles ni structuré le débat culturel de la rentrée.",
      afterState:
        "Après le 27 août 1986, le film devient un phénomène de fréquentation et de conversation — premier volet du diptyque avec Manon des sources.",
      gestureChanged:
        "Tu peux faire la queue pour une séance où salle comble et critiques s'accordent sur un événement cinématographique national.",
      materialAnchor: "Affiche de film, salle obscure et projecteur 35 mm",
      sceneText:
        "27 août 1986, cinéma. Les salles affichent complet pour le retour de Pagnol à l'écran. Montand, Depardieu, Auteuil : la France entière découvre le drame provençal le plus commenté de l'année.",
      fact: "Le 27 août 1986, Jean de Florette de Claude Berri sort en France — adaptation majeure de Marcel Pagnol, premier volet du diptyque avec Manon des sources.",
      sources: [
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/Jean_de_Florette_(film)",
          authority: false
        }
      ],
      tags: ["cinema", "berri", "pagnol", "provence"],
      quality: {
        strictPlace: false,
        strictDate: true,
        dailyLife: false,
        sourceCount: 1
      }
    },
    {
      id: "fr-1987-m6",
      countryQid: "Q142",
      lang: "fr",
      momentKey: "m6",
      momentLabel: "premieres emissions de M6",
      label: "premieres emissions de M6",
      category: "public_premiere",
      theme: "loisirs",
      gestureRoot: "m6",
      editorialScore: 82,
      date: "1987-03-01",
      year: 1987,
      datePrecision: "day",
      placeName: "France",
      placeType: "country",
      placeQid: "Q142",
      triggerLabel: "Premieres emissions de M6",
      beforeState: "Avant le 1 mars 1987, M6 n'existe pas encore dans les reperes televisuels.",
      afterState: "Apres le 1 mars 1987, une nouvelle chaine s'ajoute aux references du quotidien.",
      gestureChanged: "Tu peux citer une nouvelle chaine qui vient de demarrer et changer les discussions du soir.",
      materialAnchor: "Telecommande et logo M6",
      sceneText:
        "1 mars 1987, devant le poste. Les bandes annonces d'une nouvelle chaine circulent et les discussions changent de reperes. Une nouvelle case s'ajoute a la carte mentale de la tele.",
      fact: "Le 1 mars 1987, M6 diffuse ses premieres images.",
      sources: [
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/M6",
          authority: false
        }
      ],
      tags: ["television", "m6", "chaine", "culture"],
      quality: {
        strictPlace: true,
        strictDate: true,
        dailyLife: false,
        sourceCount: 1
      }
    },
    {
      id: "fr-1998-coupe-du-monde",
      countryQid: "Q142",
      lang: "fr",
      momentKey: "coupe-du-monde-1998",
      momentLabel: "victoire de la France en Coupe du monde",
      label: "victoire de la France en Coupe du monde",
      category: "symbolic_moment",
      theme: "loisirs",
      gestureRoot: "coupe_du_monde_1998",
      editorialScore: 94,
      date: "1998-07-12",
      year: 1998,
      datePrecision: "day",
      placeName: "Stade de France",
      placeType: "site",
      placeQid: "Q132243",
      triggerLabel: "Finale de la Coupe du monde 1998",
      beforeState: "Avant le 12 juillet 1998, la France n'a encore jamais gagne la Coupe du monde de football.",
      afterState: "Apres le 12 juillet 1998, la victoire devient un repere collectif durable.",
      gestureChanged: "Tu peux te souvenir d'une nuit ou tout le pays fete une victoire sportive historique.",
      materialAnchor: "Echarpe bleue, drapeau et ecran geant",
      sceneText:
        "12 juillet 1998, soiree d'ete. Les drapeaux sortent aux fenetres et les rues se remplissent de klaxons. La victoire devient un souvenir collectif qui se raconte encore des annees apres.",
      fact: "Le 12 juillet 1998, la France remporte la Coupe du monde de football au Stade de France.",
      sources: [
        {
          label: "FIFA",
          url: "https://www.fifa.com/tournaments/mens/worldcup/1998france",
          authority: true
        },
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/Coupe_du_monde_de_football_1998",
          authority: false
        }
      ],
      tags: ["football", "coupe-du-monde", "stade-de-france", "culture"],
      quality: {
        strictPlace: true,
        strictDate: true,
        dailyLife: false,
        sourceCount: 2
      }
    },
    ...FR_CULTURAL_PERIOD_ENTRIES
  ]
};
