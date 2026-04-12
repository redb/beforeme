import type { GestureCatalog } from "../../types";
import { FR_GESTURE_PERIOD_ENTRIES } from "./periods";

export const FR_GESTURE_CATALOG: GestureCatalog = {
  countryQid: "Q142",
  defaultLang: "fr",
  supportedLangs: ["fr"],
  entries: [
    {
      id: "fr-1910-saint-germain-metro",
      countryQid: "Q142",
      lang: "fr",
      gestureKey: "descendre-a-saint-germain-des-pres",
      gestureLabel: "descendre du métro à Saint-Germain-des-Prés",
      theme: "transport",
      gestureRoot: "descendre_du_metro",
      editorialScore: 62,
      category: "transport",
      direction: "impossible_to_possible",
      ruptureDate: "1910-01-09",
      ruptureYear: 1910,
      datePrecision: "day",
      placeName: "Station Saint-Germain-des-Prés",
      placeType: "site",
      placeQid: "Q781873",
      triggerLabel: "Ouverture de la station Saint-Germain-des-Prés",
      triggerType: "opening",
      beforeState: "Avant le 9 janvier 1910, les voyageurs traversent ce point de la ligne sans y descendre.",
      afterState: "Après le 9 janvier 1910, les voyageurs montent et descendent directement à cette station.",
      gestureChanged: "Tu peux descendre à Saint-Germain-des-Prés avec ton billet au lieu de rester dans la rame.",
      materialAnchor: "Quai de la ligne 4 et billet de métro",
      sceneText:
        "9 janvier 1910, station Saint-Germain-des-Prés. Avec ton billet, tu descends sur le quai neuf puis tu ressors boulevard Saint-Germain. Le quartier a maintenant sa station de métro.",
      fact: "Le 9 janvier 1910, la station Saint-Germain-des-Prés ouvre au public sur la ligne 4 du métro de Paris.",
      sources: [
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/Saint-Germain-des-Pr%C3%A9s_%28m%C3%A9tro_de_Paris%29",
          authority: false
        },
        {
          label: "Ville de Paris",
          url: "https://www.paris.fr/pages/le-metro-parisien-en-14-dates-16107",
          authority: false
        }
      ],
      tags: ["metro", "paris", "quartier", "trajet"],
      quality: {
        strictPlace: true,
        strictDate: true,
        dailyLife: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-1912-place-des-fetes-metro",
      countryQid: "Q142",
      lang: "fr",
      gestureKey: "descendre-a-place-des-fetes",
      gestureLabel: "descendre du métro à Place des Fêtes",
      theme: "transport",
      gestureRoot: "descendre_du_metro",
      editorialScore: 58,
      category: "transport",
      direction: "impossible_to_possible",
      ruptureDate: "1912-02-13",
      ruptureYear: 1912,
      datePrecision: "day",
      placeName: "Station Place des Fêtes",
      placeType: "site",
      placeQid: "Q1789135",
      triggerLabel: "Ouverture de la station Place des Fêtes",
      triggerType: "opening",
      beforeState: "Avant le 13 février 1912, les rames traversent Place des Fêtes sans y marquer l'arrêt.",
      afterState: "Après le 13 février 1912, les voyageurs montent et descendent à Place des Fêtes.",
      gestureChanged: "Tu peux descendre à Place des Fêtes au lieu de voir les rames passer sans arrêt.",
      materialAnchor: "Quai du métro et billet de voyage",
      sceneText:
        "13 février 1912, place des Fêtes. Avec ton billet, tu descends enfin à cette station au lieu de voir les rames passer sans arrêt. Le quartier est désormais desservi par le métro.",
      fact: "Le 13 février 1912, la station Place des Fêtes ouvre au public sur une branche de la ligne 7 du métro de Paris.",
      sources: [
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/Place_des_F%C3%AAtes_(m%C3%A9tro_de_Paris)",
          authority: false
        },
        {
          label: "Wikidata",
          url: "https://www.wikidata.org/wiki/Q1789135",
          authority: false
        }
      ],
      tags: ["metro", "paris", "quartier", "trajet"],
      quality: {
        strictPlace: true,
        strictDate: true,
        dailyLife: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-1959-scolarite-jusqua-16-ans",
      countryQid: "Q142",
      lang: "fr",
      gestureKey: "rester-a-l-ecole-jusqua-seize-ans",
      gestureLabel: "rester à l'école jusqu'à 16 ans",
      theme: "école",
      gestureRoot: "rester_a_l_ecole_jusqua_16_ans",
      editorialScore: 82,
      category: "school",
      direction: "possible_to_impossible",
      ruptureDate: "1959-01-06",
      ruptureYear: 1959,
      datePrecision: "day",
      placeName: "École et collège",
      placeType: "country",
      placeQid: "Q142",
      triggerLabel: "Ordonnance prolongeant la scolarité obligatoire jusqu'à 16 ans",
      triggerType: "law",
      beforeState: "Avant le 6 janvier 1959, quitter l'école à 14 ans reste la borne légale ordinaire.",
      afterState: "Après le 6 janvier 1959, l'obligation scolaire est prolongée jusqu'à 16 ans.",
      gestureChanged: "Tu ne peux plus quitter légalement l'école à 14 ans comme avant.",
      materialAnchor: "Cartable, cahier et pupitre d'école",
      sceneText:
        "6 janvier 1959, salle de classe. Le cartable te suit deux années de plus au lieu de s'arrêter à 14 ans. Le bureau d'école garde désormais des adolescents qu'on aurait vus partir plus tôt.",
      fact: "Le 6 janvier 1959, l'obligation scolaire est prolongée jusqu'à 16 ans en France.",
      sources: [
        {
          label: "Ministère de l'Éducation nationale",
          url: "https://www.education.gouv.fr/sites/default/files/imported_files/document/decret_n_59_57_du_6_janvier_1959_portant_reforme_de_l_enseignement_public_569618.pdf",
          authority: true
        },
        {
          label: "franceinfo",
          url: "https://www.radiofrance.fr/franceinfo/podcasts/l-ephemeride/6-janvier-1959-l-instruction-obligatoire-est-prolongee-jusqu-a-16-ans-4962045",
          authority: false
        }
      ],
      tags: ["ecole", "scolarite", "college", "adolescence"],
      quality: {
        strictPlace: false,
        strictDate: true,
        dailyLife: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-1964-deuxieme-chaine-television",
      countryQid: "Q142",
      lang: "fr",
      gestureKey: "choisir-entre-deux-chaines-de-television",
      gestureLabel: "choisir entre deux chaînes de télévision",
      theme: "loisirs",
      gestureRoot: "choisir_entre_deux_chaines",
      editorialScore: 72,
      category: "media",
      direction: "impossible_to_possible",
      ruptureDate: "1964-04-18",
      ruptureYear: 1964,
      datePrecision: "day",
      placeName: "Salon équipé d'un téléviseur",
      placeType: "country",
      placeQid: "Q142",
      triggerLabel: "Lancement officiel de la deuxième chaîne de la RTF",
      triggerType: "public_rollout",
      beforeState: "Avant le 18 avril 1964, le poste du salon n'offre qu'une seule chaîne nationale à regarder le soir.",
      afterState: "Après le 18 avril 1964, une deuxième chaîne publique permet enfin de choisir entre deux programmes.",
      gestureChanged: "Tu peux changer de chaîne au lieu de subir l'unique programme de la soirée.",
      materialAnchor: "Téléviseur noir et blanc et bouton de sélection de chaîne",
      sceneText:
        "18 avril 1964, dans le salon. Le bouton du téléviseur sert enfin à autre chose qu'à monter le son. Pour la première fois, la soirée télé devient un choix entre deux écrans possibles.",
      fact: "Le 18 avril 1964, la deuxième chaîne de la RTF est officiellement lancée en France.",
      sources: [
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/RTF_T%C3%A9l%C3%A9vision_2",
          authority: false
        },
        {
          label: "Encyclomédia",
          url: "https://www.encyclomedia.fr/la-chrono-des-medias/1960-1980/",
          authority: false
        }
      ],
      tags: ["television", "salon", "programme", "chaine"],
      quality: {
        strictPlace: false,
        strictDate: true,
        dailyLife: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-1965-travailler-sans-autorisation-du-mari",
      countryQid: "Q142",
      lang: "fr",
      gestureKey: "travailler-sans-autorisation-du-mari",
      gestureLabel: "travailler sans autorisation du mari",
      theme: "travail",
      gestureRoot: "travailler_sans_autorisation_du_mari",
      editorialScore: 96,
      category: "work",
      direction: "impossible_to_possible",
      ruptureDate: "1965-07-13",
      ruptureYear: 1965,
      datePrecision: "day",
      placeName: "Employeur, banque et vie civile",
      placeType: "country",
      placeQid: "Q142",
      triggerLabel: "Réforme des régimes matrimoniaux",
      triggerType: "law",
      beforeState: "Avant le 13 juillet 1965, une femme mariée ne travaille pas librement sans l'autorisation de son mari.",
      afterState: "Après le 13 juillet 1965, une femme mariée peut exercer un travail sans cette autorisation.",
      gestureChanged: "Tu peux signer pour travailler sans demander l'accord préalable de ton mari.",
      materialAnchor: "Contrat de travail, chéquier et stylo",
      sceneText:
        "13 juillet 1965, bureau d'embauche. Le contrat se signe sans attendre une permission maritale. Le travail et l'argent cessent un peu d'arriver par procuration masculine.",
      fact: "Le 13 juillet 1965, la réforme des régimes matrimoniaux permet à une femme mariée de travailler et d'ouvrir un compte sans l'autorisation de son mari.",
      sources: [
        {
          label: "Légifrance",
          url: "https://www.legifrance.gouv.fr/loda/id/LEGITEXT000006068258",
          authority: true
        },
        {
          label: "Mémoire du Sénat",
          url: "https://archives.senat.fr/en-2025-le-senat-fete-ses-150-ans/loi-n-65-570-du-13-juillet-1965-portant-reforme-des-regimes-matrimoniaux-quand-la-femme-peut-se-passer-de-la-permission-de-son-mari.html",
          authority: false
        }
      ],
      tags: ["travail", "femmes", "mariage", "autonomie"],
      quality: {
        strictPlace: false,
        strictDate: true,
        dailyLife: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-1967-pillule-neuwirth",
      countryQid: "Q142",
      lang: "fr",
      gestureKey: "prendre-la-pillule-contraceptive",
      gestureLabel: "prendre la pilule contraceptive",
      theme: "santé",
      gestureRoot: "prendre_la_pilule",
      editorialScore: 90,
      category: "health",
      direction: "impossible_to_possible",
      ruptureDate: "1967-12-28",
      ruptureYear: 1967,
      datePrecision: "day",
      placeName: "Cabinet médical et pharmacie",
      placeType: "institution",
      placeQid: null,
      triggerLabel: "Promulgation de la loi Neuwirth",
      triggerType: "law",
      beforeState: "Avant le 28 décembre 1967, la contraception orale reste interdite dans le cadre légal français.",
      afterState: "Après le 28 décembre 1967, la pilule contraceptive entre dans un cadre légal autorisé.",
      gestureChanged: "Tu peux demander une prescription de pilule dans un cadre légal reconnu.",
      materialAnchor: "Ordonnance et boîte de pilules",
      sceneText:
        "28 décembre 1967, cabinet médical. L'ordonnance n'est plus écrite pour contourner l'interdit : elle ouvre un accès légal à la pilule. Le geste entre dans la médecine ordinaire.",
      fact: "Le 28 décembre 1967, la loi Neuwirth autorise la contraception en France.",
      sources: [
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/Loi_Neuwirth",
          authority: false
        },
        {
          label: "Legifrance",
          url: "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000000692687",
          authority: true
        }
      ],
      tags: ["contraception", "pilule", "sante", "prescription"],
      quality: {
        strictPlace: true,
        strictDate: true,
        dailyLife: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-1968-retirer-au-distributeur",
      countryQid: "Q142",
      lang: "fr",
      gestureKey: "retirer-des-especes-a-un-distributeur",
      gestureLabel: "retirer des espèces à un distributeur automatique",
      theme: "argent",
      gestureRoot: "retirer_au_distributeur",
      editorialScore: 78,
      category: "money",
      direction: "impossible_to_possible",
      ruptureDate: "1968-07",
      ruptureYear: 1968,
      datePrecision: "month",
      placeName: "Façade de banque",
      placeType: "site",
      placeQid: null,
      triggerLabel: "Installation des premiers distributeurs automatiques de billets",
      triggerType: "service_start",
      beforeState: "Avant 1968, retirer de l'argent suppose encore de passer au guichet pendant les heures d'ouverture.",
      afterState: "Après 1968, une machine de rue peut délivrer des billets en dehors du comptoir.",
      gestureChanged: "Tu peux retirer des espèces à une machine au lieu d'attendre l'ouverture de l'agence.",
      materialAnchor: "Façade de banque, fente de retrait et billets",
      sceneText:
        "1968, devant une banque. La main ne glisse plus seulement un bordereau au guichet : elle récupère directement des billets dans une machine incrustée dans la façade. Le retrait sort des horaires de bureau.",
      fact: "En 1968, les premiers distributeurs automatiques de billets apparaissent en France et changent le geste du retrait d'espèces.",
      sources: [
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/Guichet_automatique_bancaire",
          authority: false
        },
        {
          label: "Le Figaro",
          url: "https://www.lefigaro.fr/societes/2017/06/27/20005-20170627ARTFIG00255-le-distributeur-de-billets-a-50-ans.php",
          authority: false
        }
      ],
      tags: ["argent", "banque", "dab", "retrait"],
      quality: {
        strictPlace: false,
        strictDate: false,
        dailyLife: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-1970-autorite-parentale-conjointe",
      countryQid: "Q142",
      lang: "fr",
      gestureKey: "agir-comme-parent-avec-autorite-conjointe",
      gestureLabel: "agir comme parent avec l'autorité parentale conjointe",
      theme: "famille",
      gestureRoot: "autorite_parentale_conjointe",
      editorialScore: 88,
      category: "family",
      direction: "impossible_to_possible",
      ruptureDate: "1970-06-04",
      ruptureYear: 1970,
      datePrecision: "day",
      placeName: "École, administration et vie familiale",
      placeType: "country",
      placeQid: "Q142",
      triggerLabel: "Loi relative à l'autorité parentale",
      triggerType: "law",
      beforeState: "Avant le 4 juin 1970, la puissance paternelle domine juridiquement l'organisation de la famille.",
      afterState: "Après le 4 juin 1970, l'autorité parentale conjointe remplace cette logique au profit des deux parents.",
      gestureChanged: "Tu peux agir comme parent au nom d'une autorité conjointe plutôt que sous la seule puissance paternelle.",
      materialAnchor: "Livret de famille et formulaire scolaire",
      sceneText:
        "4 juin 1970, table de cuisine. Le papier pour l'école ou l'administration n'appelle plus seulement la main du père comme principe. La parentalité commence à s'écrire à deux dans les actes ordinaires.",
      fact: "Le 4 juin 1970, la loi remplace la puissance paternelle par l'autorité parentale conjointe.",
      sources: [
        {
          label: "Légifrance",
          url: "https://www.legifrance.gouv.fr/loda/id/LEGITEXT000006068366",
          authority: true
        },
        {
          label: "INA",
          url: "https://fresques.ina.fr/elles-centrepompidou/fiche-media/ArtFem00125/loi-relative-a-l-autorite-parentale-conjointe.html",
          authority: false
        }
      ],
      tags: ["famille", "parents", "autorite", "ecole"],
      quality: {
        strictPlace: false,
        strictDate: true,
        dailyLife: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-1973-ceinture-avant",
      countryQid: "Q142",
      lang: "fr",
      gestureKey: "attacher-sa-ceinture-a-l-avant",
      gestureLabel: "attacher sa ceinture à l'avant",
      theme: "transport",
      gestureRoot: "attacher_sa_ceinture_a_l_avant",
      editorialScore: 84,
      category: "transport",
      direction: "possible_to_impossible",
      ruptureDate: "1973",
      ruptureYear: 1973,
      datePrecision: "year",
      placeName: "Voiture particulière",
      placeType: "country",
      placeQid: "Q142",
      triggerLabel: "Obligation du port de la ceinture à l'avant",
      triggerType: "law",
      beforeState: "Avant 1973, monter à l'avant d'une voiture sans boucler sa ceinture reste courant et légal dans de nombreuses situations.",
      afterState: "Après 1973, la ceinture à l'avant devient une obligation sur route.",
      gestureChanged: "Tu ne peux plus t'installer à l'avant sans boucler la ceinture comme avant.",
      materialAnchor: "Sangle de ceinture, boucle métallique et siège avant",
      sceneText:
        "1973, sur le siège avant. Le premier geste avant de démarrer n'est plus seulement de fermer la portière : la main tire la sangle et l'enclenche dans la boucle. La voiture impose un rituel de sécurité nouveau.",
      fact: "En 1973, le port de la ceinture de sécurité à l'avant devient obligatoire en France dans les voitures qui en sont équipées.",
      sources: [
        {
          label: "Sécurité routière",
          url: "https://www.securite-routiere.gouv.fr/connaitre-les-regles/le-vehicule/la-ceinture-de-securite",
          authority: true
        },
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/Ceinture_de_s%C3%A9curit%C3%A9",
          authority: false
        }
      ],
      tags: ["voiture", "ceinture", "securite", "route"],
      quality: {
        strictPlace: false,
        strictDate: false,
        dailyLife: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-1974-majorite-a-18-ans",
      countryQid: "Q142",
      lang: "fr",
      gestureKey: "signer-seul-a-dix-huit-ans",
      gestureLabel: "signer seul à 18 ans",
      theme: "administration",
      gestureRoot: "signer_seul_a_18_ans",
      editorialScore: 80,
      category: "family",
      direction: "impossible_to_possible",
      ruptureDate: "1974-07-05",
      ruptureYear: 1974,
      datePrecision: "day",
      placeName: "Banque, bail et vie civile",
      placeType: "country",
      placeQid: "Q142",
      triggerLabel: "Abaissement de la majorité civile à 18 ans",
      triggerType: "law",
      beforeState: "Avant le 5 juillet 1974, la majorité civile reste fixée à 21 ans.",
      afterState: "Après le 5 juillet 1974, elle est abaissée à 18 ans.",
      gestureChanged: "Tu peux signer seul certains actes civils à 18 ans au lieu d'attendre 21 ans.",
      materialAnchor: "Pièce d'identité, bail et formulaire à signer",
      sceneText:
        "5 juillet 1974, au comptoir d'une banque ou d'une agence. À 18 ans, la signature compte soudain pleinement sans aval parental. L'entrée dans la majorité arrive plus tôt dans les gestes ordinaires.",
      fact: "Le 5 juillet 1974, la majorité civile est abaissée de 21 à 18 ans en France.",
      sources: [
        {
          label: "INA",
          url: "https://www.ina.fr/ina-eclaire-actu/majorite-a-18-ans",
          authority: false
        },
        {
          label: "RTL",
          url: "https://www.rtl.fr/actu/debats-societe/la-majorite-civile-a-18-ans-date-du-5-juillet-1974-7780789069",
          authority: false
        }
      ],
      tags: ["majorite", "signature", "contrat", "jeunesse"],
      quality: {
        strictPlace: false,
        strictDate: true,
        dailyLife: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-1975-ivg",
      countryQid: "Q142",
      lang: "fr",
      gestureKey: "demander-une-ivg-a-l-hopital",
      gestureLabel: "demander une IVG à l'hôpital",
      theme: "santé",
      gestureRoot: "demander_une_ivg",
      editorialScore: 98,
      category: "health",
      direction: "impossible_to_possible",
      ruptureDate: "1975-01-17",
      ruptureYear: 1975,
      datePrecision: "day",
      placeName: "Hôpital public",
      placeType: "institution",
      placeQid: null,
      triggerLabel: "Promulgation de la loi Veil",
      triggerType: "law",
      beforeState: "Avant le 17 janvier 1975, une demande d'IVG ne suit pas une procédure médicale légalement autorisée.",
      afterState: "Après le 17 janvier 1975, une demande d'IVG entre dans un cadre médical défini.",
      gestureChanged: "Tu peux déposer une demande d'IVG à l'hôpital dans un cadre légal reconnu.",
      materialAnchor: "Dossier médical et guichet d'admission",
      sceneText:
        "17 janvier 1975, hôpital public. Au guichet, ton dossier n'est plus écarté d'emblée lorsque tu demandes une IVG. La demande entre dans un cadre médical autorisé.",
      fact: "Le 17 janvier 1975, la loi Veil autorise l'IVG dans un cadre médical défini.",
      sources: [
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/Loi_Veil",
          authority: false
        },
        {
          label: "Legifrance",
          url: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000693983",
          authority: true
        }
      ],
      tags: ["ivg", "hopital", "sante", "droit"],
      quality: {
        strictPlace: true,
        strictDate: true,
        dailyLife: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-1975-divorce-consentement-mutuel",
      countryQid: "Q142",
      lang: "fr",
      gestureKey: "divorcer-sans-invoquer-une-faute",
      gestureLabel: "divorcer sans invoquer une faute",
      theme: "famille",
      gestureRoot: "divorcer_sans_faute",
      editorialScore: 95,
      category: "family",
      direction: "impossible_to_possible",
      ruptureDate: "1975-07-11",
      ruptureYear: 1975,
      datePrecision: "day",
      placeName: "Tribunal judiciaire",
      placeType: "institution",
      placeQid: "Q185264",
      triggerLabel: "Réforme du divorce",
      triggerType: "law",
      beforeState: "Avant le 11 juillet 1975, la procédure de divorce repose principalement sur la preuve d'une faute.",
      afterState: "Après le 11 juillet 1975, la procédure admet le consentement mutuel.",
      gestureChanged: "Tu peux déposer un dossier de divorce sans prouver une faute d'abord.",
      materialAnchor: "Dossier de divorce et greffe du tribunal",
      sceneText:
        "11 juillet 1975, tribunal judiciaire. Au greffe, le dossier n'exige plus la preuve d'une faute pour avancer. Le divorce par consentement mutuel devient une voie ordinaire.",
      fact: "Le 11 juillet 1975, la réforme du divorce introduit le consentement mutuel en France.",
      sources: [
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/R%C3%A9forme_du_divorce_en_France",
          authority: false
        },
        {
          label: "Legifrance",
          url: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000693724",
          authority: true
        }
      ],
      tags: ["divorce", "tribunal", "famille", "procedure"],
      quality: {
        strictPlace: true,
        strictDate: true,
        dailyLife: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-1975-carte-orange",
      countryQid: "Q142",
      lang: "fr",
      gestureKey: "entrer-dans-le-metro-avec-un-abonnement-mensuel",
      gestureLabel: "entrer dans le métro avec un abonnement mensuel",
      theme: "transport",
      gestureRoot: "entrer_avec_un_abonnement_metro",
      editorialScore: 92,
      category: "transport",
      direction: "impossible_to_possible",
      ruptureDate: "1975-10-01",
      ruptureYear: 1975,
      datePrecision: "day",
      placeName: "Métro parisien",
      placeType: "site",
      placeQid: "Q733302",
      triggerLabel: "Mise en service de la carte orange",
      triggerType: "service_start",
      beforeState: "Avant le 1 octobre 1975, les voyageurs achètent des tickets séparés selon les trajets.",
      afterState: "Après le 1 octobre 1975, un abonnement mensuel unique permet les trajets répétés.",
      gestureChanged: "Tu peux passer au portillon avec une carte orange au lieu d'acheter un ticket à chaque trajet.",
      materialAnchor: "Portillon du métro et carte orange",
      sceneText:
        "1 octobre 1975, métro parisien. Tu présentes une carte orange au portillon au lieu d'acheter un ticket pour chaque trajet. L'abonnement mensuel entre dans les gestes ordinaires.",
      fact: "Le 1 octobre 1975, la carte orange entre en service dans les transports parisiens.",
      sources: [
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/Carte_orange",
          authority: false
        },
        {
          label: "RATP",
          url: "https://www.ratp.fr/groupe-ratp/histoire",
          authority: false
        }
      ],
      tags: ["metro", "abonnement", "transport", "paris"],
      quality: {
        strictPlace: true,
        strictDate: true,
        dailyLife: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-1981-radio-libre-fm",
      countryQid: "Q142",
      lang: "fr",
      gestureKey: "ecouter-une-radio-libre-sur-fm",
      gestureLabel: "écouter une radio libre sur la bande FM",
      theme: "communication",
      gestureRoot: "ecouter_une_radio_libre",
      editorialScore: 76,
      category: "media",
      direction: "impossible_to_possible",
      ruptureDate: "1981-11-09",
      ruptureYear: 1981,
      datePrecision: "day",
      placeName: "Poste radio FM",
      placeType: "country",
      placeQid: "Q142",
      triggerLabel: "Libération de la bande FM",
      triggerType: "law",
      beforeState: "Avant le 9 novembre 1981, le monopole public verrouille encore les radios locales privées sur la bande FM.",
      afterState: "Après le 9 novembre 1981, les radios libres commencent à émettre légalement.",
      gestureChanged: "Tu peux tourner le bouton et tomber sur une radio locale libre au lieu d'écouter seulement le paysage autorisé d'avant.",
      materialAnchor: "Poste FM, molette de fréquence et antenne",
      sceneText:
        "9 novembre 1981, sur un transistor. La molette capte soudain des voix locales qui n'étaient pas censées occuper légalement la bande. Le geste d'écoute devient plus libre, plus brouillon, plus vivant.",
      fact: "Le 9 novembre 1981, une loi met fin au monopole public sur la bande FM pour les radios locales privées et associatives.",
      sources: [
        {
          label: "Arcom",
          url: "https://www.csa.fr/Informer/Comment-recevoir-la-television-et-la-radio/Comment-ecouter-la-radio/Ecouter-sur-la-bande-FM/9-novembre-1981-liberation-de-la-bande-FM",
          authority: true
        },
        {
          label: "Télérama",
          url: "https://www.telerama.fr/radio/en-1981-dans-telerama-le-jour-ou-les-radios-pirates-sont-devenues-libres-6998699.php",
          authority: false
        }
      ],
      tags: ["radio", "fm", "transistor", "ondes"],
      quality: {
        strictPlace: false,
        strictDate: true,
        dailyLife: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-1982-minitel",
      countryQid: "Q142",
      lang: "fr",
      gestureKey: "consulter-l-annuaire-sur-minitel",
      gestureLabel: "consulter l'annuaire sur Minitel",
      theme: "communication",
      gestureRoot: "utiliser_le_minitel",
      editorialScore: 74,
      category: "media",
      direction: "impossible_to_possible",
      ruptureDate: "1982",
      ruptureYear: 1982,
      datePrecision: "year",
      placeName: "Domicile relié au réseau téléphonique",
      placeType: "country",
      placeQid: "Q142",
      triggerLabel: "Lancement commercial du Minitel",
      triggerType: "public_rollout",
      beforeState: "Avant 1982, la recherche d'un numéro passe par l'annuaire papier ou par le 12.",
      afterState: "À partir de 1982, le Minitel entre dans les foyers et permet de consulter l'annuaire sur la ligne téléphonique.",
      gestureChanged: "Tu peux chercher un numéro sur l'écran du Minitel au lieu d'ouvrir l'annuaire papier.",
      materialAnchor: "Terminal Minitel et combiné téléphonique",
      sceneText:
        "1982, à la maison. Le combiné reste sur sa base pendant que tu tapes sur le clavier du Minitel pour chercher un numéro sans ouvrir l'annuaire papier. La ligne téléphonique sert désormais aussi d'écran.",
      fact: "En 1982, le Minitel est lancé commercialement en France.",
      sources: [
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/Minitel",
          authority: false
        }
      ],
      tags: ["minitel", "annuaire", "telephone", "domicile"],
      quality: {
        strictPlace: false,
        strictDate: false,
        dailyLife: true,
        sourceCount: 1
      }
    },
    {
      id: "fr-1983-travailler-39-heures",
      countryQid: "Q142",
      lang: "fr",
      gestureKey: "travailler-sur-la-base-des-39-heures",
      gestureLabel: "travailler sur la base des 39 heures",
      theme: "travail",
      gestureRoot: "travailler_39_heures",
      editorialScore: 77,
      category: "work",
      direction: "possible_to_impossible",
      ruptureDate: "1983-02-01",
      ruptureYear: 1983,
      datePrecision: "day",
      placeName: "Bureau, atelier et feuille d'horaires",
      placeType: "country",
      placeQid: "Q142",
      triggerLabel: "Passage légal à la durée hebdomadaire de 39 heures",
      triggerType: "law",
      beforeState: "Avant 1983, la référence hebdomadaire de travail reste plus élevée dans le cadre légal ordinaire.",
      afterState: "Après 1983, la base légale descend à 39 heures.",
      gestureChanged: "Tu ne pointes plus sur la même base hebdomadaire qu'avant pour faire ta semaine normale.",
      materialAnchor: "Carte de pointage, pendule et feuille d'horaires",
      sceneText:
        "1983, à l'entrée de l'atelier ou du bureau. La semaine ordinaire se compte autrement sur la feuille d'horaires. Le temps de travail officiel recule d'un cran dans le rythme du quotidien.",
      fact: "En 1983, la durée légale hebdomadaire du travail passe à 39 heures en France.",
      sources: [
        {
          label: "Vie publique",
          url: "https://www.vie-publique.fr/eclairage/19474-les-lois-aubry-35-heures-rtt-tout-comprendre",
          authority: true
        },
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/Dur%C3%A9e_du_travail_en_France",
          authority: false
        }
      ],
      tags: ["travail", "horaires", "39-heures", "pointage"],
      quality: {
        strictPlace: false,
        strictDate: false,
        dailyLife: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-1984-telecarte-cabine",
      countryQid: "Q142",
      lang: "fr",
      gestureKey: "telephoner-depuis-une-cabine-avec-une-telecarte",
      gestureLabel: "téléphoner depuis une cabine avec une télécarte",
      theme: "communication",
      gestureRoot: "telephoner_avec_une_telecarte",
      editorialScore: 75,
      category: "media",
      direction: "impossible_to_possible",
      ruptureDate: "1984",
      ruptureYear: 1984,
      datePrecision: "year",
      placeName: "Cabine téléphonique",
      placeType: "site",
      placeQid: null,
      triggerLabel: "Lancement public de la télécarte",
      triggerType: "public_rollout",
      beforeState: "Avant 1984, l'appel depuis une cabine dépend surtout des pièces ou d'autres supports moins commodes.",
      afterState: "À partir de 1984, la télécarte remplace peu à peu la monnaie dans les cabines téléphoniques.",
      gestureChanged: "Tu peux appeler depuis une cabine avec une carte à puce au lieu de compter ta monnaie.",
      materialAnchor: "Cabine téléphonique, combiné gris et télécarte",
      sceneText:
        "1984, au coin d'une rue. La carte glisse dans la fente de la cabine à la place d'une poignée de pièces. L'appel public devient un geste de poche plutôt qu'un casse-tête de monnaie.",
      fact: "En 1984, la télécarte est lancée auprès du public pour les cabines téléphoniques françaises.",
      sources: [
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/T%C3%A9l%C3%A9carte",
          authority: false
        },
        {
          label: "Revue Solaris",
          url: "https://www.revue-solaris.com/articles/solaris-165-les-telecartes-sf-et-fantastique/",
          authority: false
        }
      ],
      tags: ["cabine", "telephone", "telecarte", "rue"],
      quality: {
        strictPlace: false,
        strictDate: false,
        dailyLife: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-1986-la-cinq-zapping",
      countryQid: "Q142",
      lang: "fr",
      gestureKey: "zapper-vers-la-cinq",
      gestureLabel: "zapper vers La Cinq",
      theme: "loisirs",
      gestureRoot: "zapper_vers_la_cinq",
      editorialScore: 70,
      category: "media",
      direction: "impossible_to_possible",
      ruptureDate: "1986-02-20",
      ruptureYear: 1986,
      datePrecision: "day",
      placeName: "Salon équipé d'un téléviseur",
      placeType: "country",
      placeQid: "Q142",
      triggerLabel: "Lancement de La Cinq",
      triggerType: "public_rollout",
      beforeState: "Avant le 20 février 1986, cette cinquième grande chaîne n'existe pas encore dans la routine du soir.",
      afterState: "Après le 20 février 1986, une nouvelle chaîne privée entre dans le zapping domestique.",
      gestureChanged: "Tu peux zapper vers La Cinq au lieu de rester limité aux chaînes précédentes.",
      materialAnchor: "Télécommande, bouton de chaîne et poste de salon",
      sceneText:
        "20 février 1986, dans le salon. Le pouce trouve une destination de plus sur la télécommande. Le zapping gagne une nouvelle étape dans la soirée familiale.",
      fact: "Le 20 février 1986, La Cinq commence à émettre en France.",
      sources: [
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/La_Cinq",
          authority: false
        }
      ],
      tags: ["television", "zapping", "chaine", "salon"],
      quality: {
        strictPlace: false,
        strictDate: true,
        dailyLife: true,
        sourceCount: 1
      }
    },
    {
      id: "fr-1987-m6-zapping",
      countryQid: "Q142",
      lang: "fr",
      gestureKey: "zapper-vers-m6",
      gestureLabel: "zapper vers M6",
      theme: "loisirs",
      gestureRoot: "zapper_vers_m6",
      editorialScore: 74,
      category: "media",
      direction: "impossible_to_possible",
      ruptureDate: "1987-03-01",
      ruptureYear: 1987,
      datePrecision: "day",
      placeName: "Salon équipé d'un téléviseur",
      placeType: "country",
      placeQid: "Q142",
      triggerLabel: "Premières images de M6",
      triggerType: "public_rollout",
      beforeState: "Avant le 1 mars 1987, cette sixième chaîne n'existe pas encore dans les gestes du soir devant le poste.",
      afterState: "Après le 1 mars 1987, M6 s'ajoute au paysage familier du zapping.",
      gestureChanged: "Tu peux faire défiler une chaîne de plus dans la soirée télé.",
      materialAnchor: "Télécommande, poste de télévision et logo M6",
      sceneText:
        "1 mars 1987, dans le salon. Une sixième chaîne apparaît dans le mouvement du poignet sur la télécommande. La soirée télé se fragmente encore un peu plus en choix rapides.",
      fact: "Le 1 mars 1987, M6 diffuse ses premières images.",
      sources: [
        {
          label: "Groupe M6",
          url: "https://www.groupem6.fr/fr/le-groupe/notre-histoire/",
          authority: true
        },
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/M6",
          authority: false
        }
      ],
      tags: ["television", "m6", "zapping", "salon"],
      quality: {
        strictPlace: false,
        strictDate: true,
        dailyLife: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-1988-demander-le-rmi",
      countryQid: "Q142",
      lang: "fr",
      gestureKey: "demander-le-rmi",
      gestureLabel: "demander le RMI",
      theme: "administration",
      gestureRoot: "demander_le_rmi",
      editorialScore: 79,
      category: "money",
      direction: "impossible_to_possible",
      ruptureDate: "1988-12-01",
      ruptureYear: 1988,
      datePrecision: "day",
      placeName: "CAF et services sociaux",
      placeType: "institution",
      placeQid: null,
      triggerLabel: "Création du revenu minimum d'insertion",
      triggerType: "law",
      beforeState: "Avant le 1 décembre 1988, cette allocation minimale nationale n'existe pas pour ouvrir un droit de dernier recours.",
      afterState: "Après le 1 décembre 1988, le RMI crée une demande possible auprès des services sociaux et de la CAF.",
      gestureChanged: "Tu peux déposer une demande de revenu minimum au lieu de n'avoir aucun dispositif national équivalent.",
      materialAnchor: "Dossier social, guichet de CAF et justificatifs",
      sceneText:
        "1 décembre 1988, au guichet social. Le dossier ne sert plus seulement à prouver le manque : il ouvre enfin un droit minimal reconnu à l'échelle nationale. L'attente administrative débouche sur une allocation nouvelle.",
      fact: "Le 1 décembre 1988, le revenu minimum d'insertion entre en vigueur en France.",
      sources: [
        {
          label: "Vie publique",
          url: "https://www.vie-publique.fr/eclairage/19488-revenu-minimum-dinsertion-rmi-revenu-de-solidarite-active-rsa",
          authority: true
        },
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/Revenu_minimum_d%27insertion",
          authority: false
        }
      ],
      tags: ["caf", "rmi", "allocation", "dossier"],
      quality: {
        strictPlace: true,
        strictDate: true,
        dailyLife: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-1989-fumer-dans-un-vol-interieur",
      countryQid: "Q142",
      lang: "fr",
      gestureKey: "fumer-dans-un-vol-interieur",
      gestureLabel: "fumer dans un vol intérieur",
      theme: "tabac_alcool",
      gestureRoot: "fumer_dans_un_vol_interieur",
      editorialScore: 72,
      category: "public_space",
      direction: "possible_to_impossible",
      ruptureDate: "1989",
      ruptureYear: 1989,
      datePrecision: "year",
      placeName: "Avion sur ligne intérieure",
      placeType: "country",
      placeQid: "Q142",
      triggerLabel: "Interdiction progressive de fumer sur les vols intérieurs",
      triggerType: "decree",
      beforeState: "Avant 1989, allumer une cigarette en avion reste encore permis sur certaines lignes intérieures.",
      afterState: "Après 1989, ce geste disparaît progressivement des vols intérieurs français.",
      gestureChanged: "Tu ne peux plus fumer librement pendant un vol intérieur comme avant.",
      materialAnchor: "Accoudoir d'avion, cendrier et hublot",
      sceneText:
        "1989, en cabine. Le petit cendrier intégré dans l'accoudoir cesse peu à peu d'avoir un usage normal. Le vol intérieur commence à devenir un espace sans fumée, même pour les passagers installés depuis longtemps.",
      fact: "À la fin des années 1980, fumer est progressivement interdit sur les vols intérieurs en France.",
      sources: [
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/Interdiction_de_fumer_en_France",
          authority: false
        },
        {
          label: "Le Monde",
          url: "https://www.lemonde.fr/archives/article/1989/11/04/a-partir-de-lundi-5-novembre-on-ne-fumera-plus-dans-les-trains_4128941_1819218.html",
          authority: false
        }
      ],
      tags: ["tabac", "avion", "interdiction", "cabine"],
      quality: {
        strictPlace: false,
        strictDate: false,
        dailyLife: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-1990-ceinture-arriere",
      countryQid: "Q142",
      lang: "fr",
      gestureKey: "attacher-sa-ceinture-a-l-arriere",
      gestureLabel: "attacher sa ceinture à l'arrière",
      theme: "transport",
      gestureRoot: "attacher_sa_ceinture_a_l_arriere",
      editorialScore: 83,
      category: "transport",
      direction: "possible_to_impossible",
      ruptureDate: "1990",
      ruptureYear: 1990,
      datePrecision: "year",
      placeName: "Banquette arrière d'une voiture",
      placeType: "country",
      placeQid: "Q142",
      triggerLabel: "Extension de l'obligation de la ceinture aux places arrière",
      triggerType: "law",
      beforeState: "Avant 1990, s'asseoir à l'arrière sans ceinture reste fréquent et encore admis.",
      afterState: "Après 1990, boucler la ceinture à l'arrière devient aussi une obligation.",
      gestureChanged: "Tu ne peux plus t'installer à l'arrière sans attacher la ceinture comme avant.",
      materialAnchor: "Banquette arrière, sangle et boucle de ceinture",
      sceneText:
        "1990, sur la banquette arrière. On ne s'affale plus simplement contre la portière : la main cherche la sangle et la clipse avant de partir. La sécurité quitte le siège avant pour gagner toute la voiture.",
      fact: "En 1990, le port de la ceinture de sécurité s'impose aussi aux places arrière en France.",
      sources: [
        {
          label: "Sécurité routière",
          url: "https://www.securite-routiere.gouv.fr/connaitre-les-regles/le-vehicule/la-ceinture-de-securite",
          authority: true
        },
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/Ceinture_de_s%C3%A9curit%C3%A9",
          authority: false
        }
      ],
      tags: ["voiture", "ceinture", "arriere", "securite"],
      quality: {
        strictPlace: false,
        strictDate: false,
        dailyLife: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-1991-publicite-tabac-interdite",
      countryQid: "Q142",
      lang: "fr",
      gestureKey: "voir-de-la-publicite-libre-pour-le-tabac",
      gestureLabel: "voir de la publicité libre pour le tabac",
      theme: "tabac_alcool",
      gestureRoot: "voir_publicite_tabac",
      editorialScore: 79,
      category: "public_space",
      direction: "possible_to_impossible",
      ruptureDate: "1991-01-10",
      ruptureYear: 1991,
      datePrecision: "day",
      placeName: "Kiosque, magazine et affichage publicitaire",
      placeType: "country",
      placeQid: "Q142",
      triggerLabel: "Promulgation de la loi Évin",
      triggerType: "law",
      beforeState: "Avant le 10 janvier 1991, la publicité pour le tabac circule encore librement dans l'espace public et la presse.",
      afterState: "Après le 10 janvier 1991, cette publicité est interdite par la loi Évin.",
      gestureChanged: "Tu ne peux plus voir des réclames de cigarettes s'étaler partout comme avant.",
      materialAnchor: "Affiche publicitaire, magazine et paquet de cigarettes",
      sceneText:
        "10 janvier 1991, kiosque à journaux. Les marques de cigarettes cessent de s'afficher comme des produits ordinaires dans le décor public. Le tabac perd une part de sa présence publicitaire quotidienne.",
      fact: "Le 10 janvier 1991, la loi Évin interdit la publicité directe ou indirecte en faveur du tabac.",
      sources: [
        {
          label: "Légifrance",
          url: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000344577",
          authority: true
        },
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/Loi_%C3%89vin",
          authority: false
        }
      ],
      tags: ["tabac", "publicite", "kiosque", "loi-evin"],
      quality: {
        strictPlace: false,
        strictDate: true,
        dailyLife: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-1992-itineris-gsm",
      countryQid: "Q142",
      lang: "fr",
      gestureKey: "telephoner-avec-un-mobile-gsm",
      gestureLabel: "téléphoner avec un mobile GSM",
      theme: "communication",
      gestureRoot: "telephoner_avec_un_mobile",
      editorialScore: 90,
      category: "media",
      direction: "impossible_to_possible",
      ruptureDate: "1992-07-01",
      ruptureYear: 1992,
      datePrecision: "day",
      placeName: "Réseau Itinéris",
      placeType: "institution",
      placeQid: null,
      triggerLabel: "Lancement d'Itinéris",
      triggerType: "public_rollout",
      beforeState: "Avant le 1 juillet 1992, la téléphonie mobile numérique grand public n'est pas encore lancée à l'échelle nationale.",
      afterState: "Après le 1 juillet 1992, il devient possible d'appeler sur le réseau GSM d'Itinéris en France.",
      gestureChanged: "Tu peux passer un appel sur un mobile GSM au lieu de dépendre d'une ligne fixe ou d'un téléphone de voiture.",
      materialAnchor: "Téléphone mobile et carte SIM",
      sceneText:
        "1 juillet 1992, réseau Itinéris. Le téléphone ne reste plus accroché au mur ni posé dans la voiture : tu peux appeler sur un mobile GSM. Le geste quitte la maison et passe dans la poche ou la main.",
      fact: "Le 1 juillet 1992, France Télécom lance Itinéris, premier réseau de téléphonie mobile numérique GSM en France.",
      sources: [
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/T%C3%A9l%C3%A9phonie_mobile_en_France",
          authority: false
        },
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/Histoire_du_t%C3%A9l%C3%A9phone_en_France",
          authority: false
        }
      ],
      tags: ["mobile", "gsm", "telephone", "itineris"],
      quality: {
        strictPlace: false,
        strictDate: true,
        dailyLife: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-1993-declarer-ses-revenus-en-ligne",
      countryQid: "Q142",
      lang: "fr",
      gestureKey: "declarer-ses-revenus-en-ligne",
      gestureLabel: "déclarer ses revenus en ligne",
      theme: "administration",
      gestureRoot: "declarer_ses_revenus_en_ligne",
      editorialScore: 66,
      category: "work",
      direction: "impossible_to_possible",
      ruptureDate: "1993",
      ruptureYear: 1993,
      datePrecision: "year",
      placeName: "Administration fiscale",
      placeType: "institution",
      placeQid: null,
      triggerLabel: "Premiers services fiscaux dématérialisés expérimentaux",
      triggerType: "public_rollout",
      beforeState: "Avant 1993, l'impôt sur le revenu passe uniquement par les formulaires papier et l'envoi postal ordinaire.",
      afterState: "Après 1993, les premiers parcours dématérialisés apparaissent dans l'administration fiscale française.",
      gestureChanged: "Tu peux commencer à traiter une partie de ta relation fiscale autrement que par le papier seul.",
      materialAnchor: "Formulaire fiscal, écran d'ordinateur et identifiants",
      sceneText:
        "1993, devant un écran administratif encore rare. Le formulaire d'impôt ne vit plus seulement sur la table du salon et dans l'enveloppe kraft. L'administration commence à entrouvrir une porte numérique.",
      fact: "Au début des années 1990, l'administration fiscale française amorce ses premiers services dématérialisés, prélude à la télédéclaration.",
      sources: [
        {
          label: "Vie publique",
          url: "https://www.vie-publique.fr/fiches/23846-impot-sur-le-revenu-comment-fonctionne-la-declaration-en-ligne",
          authority: true
        },
        {
          label: "Direction générale des Finances publiques",
          url: "https://www.impots.gouv.fr",
          authority: true
        }
      ],
      tags: ["impots", "administration", "numerique", "declaration"],
      quality: {
        strictPlace: true,
        strictDate: false,
        dailyLife: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-1994-internet-grand-public",
      countryQid: "Q142",
      lang: "fr",
      gestureKey: "se-connecter-a-internet-chez-soi",
      gestureLabel: "se connecter à Internet chez soi",
      theme: "communication",
      gestureRoot: "se_connecter_a_internet",
      editorialScore: 94,
      category: "media",
      direction: "impossible_to_possible",
      ruptureDate: "1994-02-15",
      ruptureYear: 1994,
      datePrecision: "day",
      placeName: "Modem domestique et ligne téléphonique",
      placeType: "country",
      placeQid: "Q142",
      triggerLabel: "Lancement grand public de World-NET",
      triggerType: "public_rollout",
      beforeState: "Avant le 15 février 1994, l'accès à Internet n'est pas encore proposé au grand public français dans ce format.",
      afterState: "Après le 15 février 1994, une offre d'accès Internet grand public devient accessible depuis une ligne téléphonique domestique.",
      gestureChanged: "Tu peux te connecter à Internet depuis chez toi avec un modem au lieu de rester hors réseau.",
      materialAnchor: "Modem, ordinateur et ligne téléphonique",
      sceneText:
        "15 février 1994, à la maison. Le modem siffle sur la ligne téléphonique pendant que l'ordinateur se connecte à Internet. L'écran du foyer s'ouvre désormais sur un réseau qui n'était pas encore accessible au grand public.",
      fact: "Le 15 février 1994, World-NET lance en France une offre d'accès à Internet pour le grand public.",
      sources: [
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/Worldnet",
          authority: false
        },
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/FranceNet",
          authority: false
        }
      ],
      tags: ["internet", "modem", "domicile", "worldnet"],
      quality: {
        strictPlace: false,
        strictDate: true,
        dailyLife: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-1995-carte-a-puce-et-code",
      countryQid: "Q142",
      lang: "fr",
      gestureKey: "payer-avec-une-carte-a-puce-et-un-code",
      gestureLabel: "payer avec une carte à puce et un code",
      theme: "argent",
      gestureRoot: "payer_avec_une_carte_a_puce",
      editorialScore: 81,
      category: "money",
      direction: "impossible_to_possible",
      ruptureDate: "1995",
      ruptureYear: 1995,
      datePrecision: "year",
      placeName: "Terminal de paiement chez un commerçant",
      placeType: "institution",
      placeQid: null,
      triggerLabel: "Généralisation du paiement par carte à puce avec code",
      triggerType: "public_rollout",
      beforeState: "Avant le milieu des années 1990, la carte bancaire ne passe pas encore partout par le couple puce et code secret au terminal.",
      afterState: "Après 1995, insérer la carte et taper son code devient un geste de caisse de plus en plus courant.",
      gestureChanged: "Tu peux régler un achat en insérant la carte et en composant ton code au lieu de signer ou d'utiliser d'autres gestes plus anciens.",
      materialAnchor: "Carte bancaire à puce, terminal et clavier numérique",
      sceneText:
        "1995, à la caisse. La carte s'enfonce dans le lecteur et les doigts tapent le code sur un petit clavier en plastique. Le paiement prend la forme d'une séquence électronique désormais familière.",
      fact: "Au milieu des années 1990, le paiement par carte à puce avec code secret se généralise en France.",
      sources: [
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/Carte_%C3%A0_puce",
          authority: false
        },
        {
          label: "La Dépêche",
          url: "https://www.ladepeche.fr/article/2002/07/09/366964-carte-bancaire-puce-10-ans-sante-fer.html",
          authority: false
        }
      ],
      tags: ["carte-bancaire", "puce", "code", "paiement"],
      quality: {
        strictPlace: true,
        strictDate: false,
        dailyLife: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-1996-fumer-dans-un-train",
      countryQid: "Q142",
      lang: "fr",
      gestureKey: "fumer-dans-un-train",
      gestureLabel: "fumer dans un train",
      theme: "tabac_alcool",
      gestureRoot: "fumer_dans_un_train",
      editorialScore: 78,
      category: "public_space",
      direction: "possible_to_impossible",
      ruptureDate: "1996",
      ruptureYear: 1996,
      datePrecision: "year",
      placeName: "Voiture de train",
      placeType: "country",
      placeQid: "Q142",
      triggerLabel: "Généralisation des restrictions anti-tabac dans les trains",
      triggerType: "decree",
      beforeState: "Avant le milieu des années 1990, fumer dans certaines voitures de train reste encore un geste banal pour une partie des voyageurs.",
      afterState: "Après 1996, ce geste se réduit fortement puis disparaît du voyage ordinaire.",
      gestureChanged: "Tu ne peux plus allumer une cigarette dans un train comme dans les compartiments d'avant.",
      materialAnchor: "Accoudoir de train, cendrier et vitre de compartiment",
      sceneText:
        "1996, dans une voiture de train. Le petit cendrier au bout de l'accoudoir devient un objet sans avenir. Le trajet cesse peu à peu d'être accompagné par la fumée dans le compartiment.",
      fact: "Au milieu des années 1990, les restrictions anti-tabac s'étendent dans les trains français et font reculer ce geste du voyage.",
      sources: [
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/Interdiction_de_fumer_en_France",
          authority: false
        },
        {
          label: "Le Monde",
          url: "https://www.lemonde.fr/archives/article/1989/11/04/a-partir-de-lundi-5-novembre-on-ne-fumera-plus-dans-les-trains_4128941_1819218.html",
          authority: false
        }
      ],
      tags: ["train", "tabac", "sncf", "voyage"],
      quality: {
        strictPlace: false,
        strictDate: false,
        dailyLife: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-1997-billet-sur-borne-sncf",
      countryQid: "Q142",
      lang: "fr",
      gestureKey: "acheter-son-billet-sur-une-borne-sncf",
      gestureLabel: "acheter son billet de train sur une borne",
      theme: "transport",
      gestureRoot: "acheter_un_billet_sur_borne",
      editorialScore: 74,
      category: "transport",
      direction: "impossible_to_possible",
      ruptureDate: "1997",
      ruptureYear: 1997,
      datePrecision: "year",
      placeName: "Gare SNCF",
      placeType: "institution",
      placeQid: "Q1665645",
      triggerLabel: "Déploiement des bornes libre-service en gare",
      triggerType: "public_rollout",
      beforeState: "Avant la fin des années 1990, acheter un billet de train passe d'abord par le guichet ou l'agence.",
      afterState: "Après 1997, les bornes en gare permettent de récupérer ou acheter un billet sans passer systématiquement par un agent.",
      gestureChanged: "Tu peux taper ton trajet sur une borne en gare au lieu de faire uniquement la queue au guichet.",
      materialAnchor: "Borne jaune SNCF, écran tactile et billet cartonné",
      sceneText:
        "1997, hall de gare. Le voyage s'achète désormais face à une machine jaune plutôt qu'au seul comptoir. Le billet sort d'une borne pendant que la file du guichet cesse d'être le passage obligé.",
      fact: "À la fin des années 1990, les bornes libre-service SNCF changent progressivement le geste d'achat et de retrait du billet en gare.",
      sources: [
        {
          label: "SNCF Gares & Connexions",
          url: "https://www.garesetconnexions.sncf/fr/gares-services/services-commerces/bornes-libre-service",
          authority: true
        },
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/SNCF",
          authority: false
        }
      ],
      tags: ["gare", "sncf", "borne", "billet"],
      quality: {
        strictPlace: true,
        strictDate: false,
        dailyLife: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-1998-carte-vitale-chez-le-medecin",
      countryQid: "Q142",
      lang: "fr",
      gestureKey: "presenter-sa-carte-vitale-chez-le-medecin",
      gestureLabel: "présenter sa carte Vitale chez le médecin",
      theme: "santé",
      gestureRoot: "presenter_sa_carte_vitale",
      editorialScore: 92,
      category: "health",
      direction: "impossible_to_possible",
      ruptureDate: "1998-04-02",
      ruptureYear: 1998,
      datePrecision: "day",
      placeName: "Cabinet médical et pharmacie",
      placeType: "institution",
      placeQid: null,
      triggerLabel: "Lancement du déploiement national de la carte Vitale",
      triggerType: "public_rollout",
      beforeState: "Avant avril 1998, le remboursement démarre surtout avec une feuille de soins papier à remplir et envoyer.",
      afterState: "Après avril 1998, la carte Vitale commence à remplacer ce passage papier dans les gestes courants.",
      gestureChanged: "Tu peux tendre la carte Vitale chez le médecin au lieu de repartir avec une feuille de soins à poster.",
      materialAnchor: "Carte Vitale, lecteur et feuille de soins",
      sceneText:
        "2 avril 1998, chez le médecin. La carte verte sort du portefeuille et prend la place de la feuille à remplir plus tard. Le remboursement commence à se jouer sur le lecteur plutôt qu'à la boîte aux lettres.",
      fact: "En avril 1998, la généralisation sur le terrain de la carte Vitale est lancée en France.",
      sources: [
        {
          label: "GIE SESAM-Vitale",
          url: "https://www.sesam-vitale.fr/web/sesam-vitale/actualites-details/-/blogs/les-20-ans-du-deploiement-national-de-la-carte-vitale",
          authority: true
        },
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/SESAM-Vitale",
          authority: false
        }
      ],
      tags: ["sante", "carte-vitale", "medecin", "remboursement"],
      quality: {
        strictPlace: true,
        strictDate: true,
        dailyLife: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-1999-pacs",
      countryQid: "Q142",
      lang: "fr",
      gestureKey: "se-pacser-au-tribunal",
      gestureLabel: "se pacser",
      theme: "famille",
      gestureRoot: "se_pacser",
      editorialScore: 85,
      category: "family",
      direction: "impossible_to_possible",
      ruptureDate: "1999-11-15",
      ruptureYear: 1999,
      datePrecision: "day",
      placeName: "Tribunal d'instance",
      placeType: "institution",
      placeQid: null,
      triggerLabel: "Création du pacte civil de solidarité",
      triggerType: "law",
      beforeState: "Avant le 15 novembre 1999, cette forme d'union civile n'existe pas en droit français.",
      afterState: "Après le 15 novembre 1999, un couple majeur peut conclure un PACS.",
      gestureChanged: "Tu peux officialiser une vie commune avec un PACS au lieu de n'avoir que les cadres antérieurs.",
      materialAnchor: "Déclaration conjointe, pièce d'identité et greffe",
      sceneText:
        "15 novembre 1999, au tribunal d'instance. Deux signatures suffisent désormais pour faire exister une union civile nouvelle. Le couple trouve une voie intermédiaire entre simple vie commune et mariage.",
      fact: "Le 15 novembre 1999, la loi créant le pacte civil de solidarité est promulguée.",
      sources: [
        {
          label: "Légifrance",
          url: "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000000761717",
          authority: true
        },
        {
          label: "info.gouv.fr",
          url: "https://www.info.gouv.fr/actualite/linfo-gouv-du-15-novembre-25-ans-du-pacs-et-biodiversite",
          authority: false
        }
      ],
      tags: ["pacs", "union", "tribunal", "couple"],
      quality: {
        strictPlace: true,
        strictDate: true,
        dailyLife: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-2008-fumer-dans-un-cafe",
      countryQid: "Q142",
      lang: "fr",
      gestureKey: "fumer-dans-un-cafe",
      gestureLabel: "fumer dans un café",
      theme: "tabac_alcool",
      gestureRoot: "fumer_dans_un_cafe",
      editorialScore: 88,
      category: "public_space",
      direction: "possible_to_impossible",
      ruptureDate: "2008-01-01",
      ruptureYear: 2008,
      datePrecision: "day",
      placeName: "Café et restaurant",
      placeType: "institution",
      placeQid: null,
      triggerLabel: "Extension de l'interdiction de fumer aux cafés et restaurants",
      triggerType: "ban",
      beforeState: "Avant le 1 janvier 2008, il est encore permis de fumer dans les cafés, bars et restaurants.",
      afterState: "Après le 1 janvier 2008, fumer y devient interdit.",
      gestureChanged: "Tu ne peux plus allumer une cigarette à ta table dans un café ou un restaurant.",
      materialAnchor: "Cendrier de table et paquet de cigarettes",
      sceneText:
        "1 janvier 2008, café. Le cendrier disparaît de la table et la cigarette reste dans le paquet. Le geste sort de la salle et passe sur le trottoir.",
      fact: "Le 1 janvier 2008, l'interdiction de fumer entre en vigueur dans les cafés, hôtels, restaurants, tabacs et discothèques.",
      sources: [
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/Interdiction_de_fumer_en_France",
          authority: false
        },
        {
          label: "Service-Public.fr",
          url: "https://www.service-public.fr/particuliers/vosdroits/F160",
          authority: true
        }
      ],
      tags: ["tabac", "cafe", "restaurant", "interdiction"],
      quality: {
        strictPlace: true,
        strictDate: true,
        dailyLife: true,
        sourceCount: 2
      }
    },
    ...FR_GESTURE_PERIOD_ENTRIES
  ]
};
