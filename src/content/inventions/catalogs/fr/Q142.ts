import type { InventionCatalog } from "../../types";
import { FR_INVENTION_PERIOD_ENTRIES } from "./periods";

export const FR_INVENTION_CATALOG: InventionCatalog = {
  countryQid: "Q142",
  defaultLang: "fr",
  supportedLangs: ["fr"],
  entries: [
    {
      id: "fr-1967-carte-bleue",
      countryQid: "Q142",
      lang: "fr",
      itemKey: "payer-avec-une-carte-bancaire",
      itemLabel: "payer avec une carte bancaire",
      theme: "argent",
      gestureRoot: "payer_avec_une_carte",
      editorialScore: 86,
      objectType: "payment_tool",
      category: "payment",
      releaseDate: "1967",
      releaseYear: 1967,
      datePrecision: "year",
      placeName: "Banque et commerce",
      placeType: "institution",
      placeQid: null,
      triggerLabel: "Lancement de Carte Bleue",
      beforeState: "Avant 1967, le paiement courant repose d'abord sur les espèces et le chèque.",
      afterState: "A partir de 1967, la carte bancaire entre dans les usages français et ouvre un nouveau geste de paiement.",
      objectChanged: "Tu peux régler un achat avec une carte bancaire au lieu de sortir du liquide ou un chèque.",
      materialAnchor: "Carte Bleue, fer à repasser bancaire et ticket commerçant",
      sceneText:
        "1967, chez un commerçant. La carte sort du portefeuille à la place du carnet de chèques. Le paiement commence à passer par le plastique et l'empreinte bancaire.",
      fact: "En 1967, les banques françaises lancent Carte Bleue, qui introduit le paiement par carte bancaire dans les usages courants.",
      sources: [
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/Carte_Bleue",
          authority: false
        },
        {
          label: "BNP Paribas",
          url: "https://histoire.bnpparibas/document/la-carte-bleue/",
          authority: false
        }
      ],
      tags: ["banque", "paiement", "carte", "commerce"],
      quality: {
        strictPlace: false,
        strictDate: false,
        everydayUse: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-1982-minitel-service",
      countryQid: "Q142",
      lang: "fr",
      itemKey: "utiliser-un-terminal-minitel",
      itemLabel: "utiliser un terminal Minitel",
      theme: "communication",
      gestureRoot: "terminal_minitel",
      editorialScore: 78,
      objectType: "device",
      category: "network",
      releaseDate: "1982",
      releaseYear: 1982,
      datePrecision: "year",
      placeName: "Réseau téléphonique français",
      placeType: "country",
      placeQid: "Q142",
      triggerLabel: "Lancement commercial du Minitel",
      beforeState: "Avant 1982, un foyer ordinaire n'a pas encore de terminal national pour consulter des services sur la ligne téléphonique.",
      afterState: "A partir de 1982, le Minitel rend accessibles des services à distance depuis un terminal domestique.",
      objectChanged: "Tu peux utiliser un terminal Minitel chez toi pour consulter des services à distance.",
      materialAnchor: "Terminal Minitel, clavier et combiné téléphonique",
      sceneText:
        "1982, à la maison. Le petit terminal beige s'allume sur la table et la ligne téléphonique sert aussi d'écran. Le foyer reçoit un objet qui ouvre des services à distance avant Internet.",
      fact: "En 1982, le Minitel est lancé commercialement en France.",
      sources: [
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/Minitel",
          authority: false
        }
      ],
      tags: ["minitel", "terminal", "reseau", "domicile"],
      quality: {
        strictPlace: false,
        strictDate: false,
        everydayUse: true,
        sourceCount: 1
      }
    },
    {
      id: "fr-1992-gsm-itineris",
      countryQid: "Q142",
      lang: "fr",
      itemKey: "utiliser-un-reseau-gsm-grand-public",
      itemLabel: "utiliser un réseau GSM grand public",
      theme: "communication",
      gestureRoot: "reseau_gsm_grand_public",
      editorialScore: 89,
      objectType: "infrastructure",
      category: "network",
      releaseDate: "1992-07-01",
      releaseYear: 1992,
      datePrecision: "day",
      placeName: "Réseau Itinéris",
      placeType: "institution",
      placeQid: null,
      triggerLabel: "Lancement d'Itinéris",
      beforeState: "Avant le 1 juillet 1992, le réseau GSM grand public n'est pas encore lancé à l'échelle nationale en France.",
      afterState: "Après le 1 juillet 1992, le réseau Itinéris rend possible la téléphonie mobile numérique grand public.",
      objectChanged: "Tu peux utiliser un réseau GSM grand public pour appeler depuis un mobile.",
      materialAnchor: "Téléphone mobile, antenne GSM et carte SIM",
      sceneText:
        "1 juillet 1992, réseau Itinéris. Le téléphone mobile s'appuie désormais sur un réseau numérique grand public. L'appel quitte le fixe et entre dans l'infrastructure GSM.",
      fact: "Le 1 juillet 1992, France Télécom lance Itinéris, premier réseau GSM grand public en France.",
      sources: [
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/T%C3%A9l%C3%A9phonie_mobile_en_France",
          authority: false
        }
      ],
      tags: ["gsm", "mobile", "reseau", "itineris"],
      quality: {
        strictPlace: false,
        strictDate: true,
        everydayUse: true,
        sourceCount: 1
      }
    },
    {
      id: "fr-1994-internet-worldnet",
      countryQid: "Q142",
      lang: "fr",
      itemKey: "avoir-un-acces-internet-grand-public",
      itemLabel: "avoir un accès Internet grand public",
      theme: "communication",
      gestureRoot: "acces_internet_grand_public",
      editorialScore: 95,
      objectType: "service",
      category: "network",
      releaseDate: "1994-02-15",
      releaseYear: 1994,
      datePrecision: "day",
      placeName: "Ligne téléphonique domestique",
      placeType: "country",
      placeQid: "Q142",
      triggerLabel: "Lancement grand public de World-NET",
      beforeState: "Avant le 15 février 1994, l'accès Internet grand public n'est pas proposé dans ce format au foyer français ordinaire.",
      afterState: "Après le 15 février 1994, une offre d'accès Internet grand public devient disponible sur la ligne téléphonique domestique.",
      objectChanged: "Tu peux installer un accès Internet grand public chez toi.",
      materialAnchor: "Modem, ordinateur familial et prise téléphonique",
      sceneText:
        "15 février 1994, à la maison. Le modem transforme la ligne téléphonique en porte d'entrée vers Internet. Le réseau entre dans l'appartement comme un nouveau service domestique.",
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
      tags: ["internet", "modem", "reseau", "domicile"],
      quality: {
        strictPlace: false,
        strictDate: true,
        everydayUse: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-1967-television-couleur",
      countryQid: "Q142",
      lang: "fr",
      itemKey: "regarder-la-television-en-couleur",
      itemLabel: "regarder la télévision en couleur",
      theme: "loisirs",
      gestureRoot: "regarder_la_television_en_couleur",
      editorialScore: 91,
      objectType: "media",
      category: "media",
      releaseDate: "1967-10-01",
      releaseYear: 1967,
      datePrecision: "day",
      placeName: "Deuxième chaîne de l'ORTF",
      placeType: "institution",
      placeQid: null,
      triggerLabel: "Première diffusion régulière en couleur",
      beforeState: "Avant le 1 octobre 1967, le salon reste en noir et blanc devant la télévision française.",
      afterState: "Après le 1 octobre 1967, certaines émissions font entrer la couleur dans le poste du salon.",
      objectChanged: "Tu peux regarder des images en couleur au lieu d'un écran uniquement en noir et blanc.",
      materialAnchor: "Téléviseur couleur, antenne râteau et mire SECAM",
      sceneText:
        "1 octobre 1967, dans le salon. Les visages et les décors cessent d'être gris sur la deuxième chaîne. Le poste devient un objet de démonstration autant qu'un écran du soir.",
      fact: "Le 1 octobre 1967, la deuxième chaîne de l'ORTF diffuse ses premières émissions régulières en couleur.",
      sources: [
        {
          label: "INA",
          url: "https://www.ina.fr/ina-eclaire-actu/audio/phf06019722/inter-actualites-de-13h00-du-1er-octobre-1967",
          authority: true
        },
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/Chronologie_de_la_t%C3%A9l%C3%A9vision_fran%C3%A7aise_des_ann%C3%A9es_1960",
          authority: false
        }
      ],
      tags: ["television", "couleur", "salon", "ortf"],
      quality: {
        strictPlace: true,
        strictDate: true,
        everydayUse: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-1968-dab",
      countryQid: "Q142",
      lang: "fr",
      itemKey: "retirer-des-especes-a-un-distributeur",
      itemLabel: "retirer des espèces à un distributeur automatique",
      theme: "argent",
      gestureRoot: "retirer_au_distributeur",
      editorialScore: 88,
      objectType: "payment_tool",
      category: "payment",
      releaseDate: "1968-07",
      releaseYear: 1968,
      datePrecision: "month",
      placeName: "Rue Auber, Paris",
      placeType: "site",
      placeQid: null,
      triggerLabel: "Installation du premier distributeur automatique de billets en France",
      beforeState: "Avant juillet 1968, retirer des billets suppose de passer par le guichet et ses horaires.",
      afterState: "Après juillet 1968, une machine peut délivrer des billets sans attendre l'ouverture de l'agence.",
      objectChanged: "Tu peux retirer de l'argent à une machine de rue au lieu d'attendre le guichet.",
      materialAnchor: "Façade de banque, fente de retrait et billets neufs",
      sceneText:
        "Juillet 1968, rue Auber. Une machine encastrée dans la façade rend des billets même quand le comptoir est fermé. Le retrait d'espèces sort des horaires de bureau.",
      fact: "En juillet 1968, le premier distributeur automatique de billets est installé en France, à Paris.",
      sources: [
        {
          label: "INA",
          url: "https://www.ina.fr/ina-eclaire-actu/distributeurs-automatiques-de-billets-archives",
          authority: true
        },
        {
          label: "Le Figaro",
          url: "https://www.lefigaro.fr/societes/2017/06/27/20005-20170627ARTFIG00255-le-distributeur-de-billets-a-50-ans.php",
          authority: false
        }
      ],
      tags: ["dab", "banque", "billets", "paris"],
      quality: {
        strictPlace: true,
        strictDate: false,
        everydayUse: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-1981-tgv-sud-est",
      countryQid: "Q142",
      lang: "fr",
      itemKey: "prendre-le-tgv",
      itemLabel: "prendre le TGV",
      theme: "transport",
      gestureRoot: "prendre_le_tgv",
      editorialScore: 95,
      objectType: "infrastructure",
      category: "transport",
      releaseDate: "1981-09-27",
      releaseYear: 1981,
      datePrecision: "day",
      placeName: "LGV Sud-Est",
      placeType: "site",
      placeQid: "Q670782",
      triggerLabel: "Mise en service commerciale du TGV Sud-Est",
      beforeState: "Avant le 27 septembre 1981, le train longue distance français ne propose pas encore ce rythme de grande vitesse commerciale.",
      afterState: "Après le 27 septembre 1981, le TGV installe une nouvelle vitesse de voyage entre Paris et Lyon.",
      objectChanged: "Tu peux monter dans un train à grande vitesse au lieu d'un express classique.",
      materialAnchor: "Rame orange, quai de gare et billet SNCF",
      sceneText:
        "27 septembre 1981, gare de Lyon. La rame orange avale les kilomètres avec une régularité inconnue jusque-là. Le grand trajet commence à ressembler à une navette rapide.",
      fact: "Le 27 septembre 1981, le TGV Sud-Est entre en service commercial entre Paris et Lyon.",
      sources: [
        {
          label: "SNCF",
          url: "https://actgv.fr/wp-content/uploads/2012/05/Le-TGV-a-25-ans.pdf",
          authority: true
        },
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/LGV_Sud-Est",
          authority: false
        }
      ],
      tags: ["tgv", "sncf", "voyage", "vitesse"],
      quality: {
        strictPlace: true,
        strictDate: true,
        everydayUse: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-1984-telecarte",
      countryQid: "Q142",
      lang: "fr",
      itemKey: "telephoner-avec-une-telecarte",
      itemLabel: "téléphoner avec une télécarte",
      theme: "communication",
      gestureRoot: "telephoner_avec_une_telecarte",
      editorialScore: 79,
      objectType: "payment_tool",
      category: "payment",
      releaseDate: "1984",
      releaseYear: 1984,
      datePrecision: "year",
      placeName: "Cabine téléphonique",
      placeType: "site",
      placeQid: null,
      triggerLabel: "Lancement public de la télécarte",
      beforeState: "Avant 1984, l'appel depuis une cabine dépend surtout des pièces ou d'autres supports moins pratiques.",
      afterState: "A partir de 1984, une carte à puce remplace peu à peu la monnaie dans les cabines téléphoniques.",
      objectChanged: "Tu peux appeler depuis une cabine avec une carte à puce au lieu de compter ta monnaie.",
      materialAnchor: "Cabine vitrée, combiné gris et télécarte",
      sceneText:
        "1984, au coin d'une rue. La carte glisse dans la cabine et remplace le bruit des pièces dans le boîtier. L'appel public devient plus simple à emporter dans une poche.",
      fact: "En 1984, France Télécom lance la télécarte auprès du public pour les cabines téléphoniques.",
      sources: [
        {
          label: "Chinons Ensemble",
          url: "https://www.chinonsensemble.fr/la-telecarte-de-lobjet-utilitaire-au-tresor-de-collection/",
          authority: false
        },
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/T%C3%A9l%C3%A9carte",
          authority: false
        }
      ],
      tags: ["telecarte", "cabine", "telephone", "carteapuces"],
      quality: {
        strictPlace: false,
        strictDate: false,
        everydayUse: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-1985-radiocom-2000",
      countryQid: "Q142",
      lang: "fr",
      itemKey: "telephoner-depuis-une-voiture-avec-radiocom-2000",
      itemLabel: "téléphoner en mobilité avec Radiocom 2000",
      theme: "communication",
      gestureRoot: "telephoner_en_mobilite",
      editorialScore: 72,
      objectType: "service",
      category: "network",
      releaseDate: "1985",
      releaseYear: 1985,
      datePrecision: "year",
      placeName: "Réseau Radiocom 2000",
      placeType: "institution",
      placeQid: null,
      triggerLabel: "Début de Radiocom 2000 en France",
      beforeState: "Avant 1985, téléphoner en déplacement reste réservé à des installations plus lourdes et moins intégrées.",
      afterState: "A partir de 1985, un réseau mobile national dédié rend les appels en mouvement plus accessibles.",
      objectChanged: "Tu peux téléphoner en déplacement via un réseau mobile national dédié.",
      materialAnchor: "Téléphone de voiture, antenne fouet et combiné mobile",
      sceneText:
        "1985, sur un parking. Le combiné n'est plus accroché à un mur mais installé dans la voiture. L'appel commence à suivre le déplacement au lieu d'attendre le retour au fixe.",
      fact: "En 1985, Radiocom 2000 est lancé en France comme réseau national de téléphonie mobile.",
      sources: [
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/Radiocom_2000",
          authority: false
        }
      ],
      tags: ["radiocom2000", "mobile", "voiture", "reseau"],
      quality: {
        strictPlace: false,
        strictDate: false,
        everydayUse: true,
        sourceCount: 1
      }
    },
    {
      id: "fr-1987-teleshopping",
      countryQid: "Q142",
      lang: "fr",
      itemKey: "commander-un-objet-vu-a-la-tele",
      itemLabel: "commander un objet vu à la télévision",
      theme: "maison",
      gestureRoot: "commander_un_objet_a_la_tele",
      editorialScore: 68,
      objectType: "service",
      category: "service",
      releaseDate: "1987-11",
      releaseYear: 1987,
      datePrecision: "month",
      placeName: "TF1",
      placeType: "institution",
      placeQid: "Q154954",
      triggerLabel: "Lancement de Téléshopping",
      beforeState: "Avant novembre 1987, acheter un objet directement depuis une émission de télévision ne fait pas encore partie des usages français.",
      afterState: "Après novembre 1987, le télé-achat installe un nouveau geste de commande depuis le salon.",
      objectChanged: "Tu peux appeler pour commander un objet montré à l'écran sans passer par un magasin.",
      materialAnchor: "Téléphone fixe, démonstration produit et écran TF1",
      sceneText:
        "Novembre 1987, dans le salon. L'écran ne se contente plus de montrer l'objet : il te pousse à décrocher le téléphone pour l'acheter. Le commerce entre dans la télévision du matin.",
      fact: "En novembre 1987, TF1 lance son émission de télé-achat, future Téléshopping.",
      sources: [
        {
          label: "BFMTV",
          url: "https://www.bfmtv.com/economie/teleshopping-l-emission-de-tf1-fete-ses-30-ans_VN-201702020145.html",
          authority: false
        },
        {
          label: "TF1",
          url: "https://groupe-tf1.fr/en/content/1987",
          authority: true
        }
      ],
      tags: ["teleachat", "tf1", "commerce", "salon"],
      quality: {
        strictPlace: true,
        strictDate: false,
        everydayUse: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-1992-carte-bancaire-a-puce",
      countryQid: "Q142",
      lang: "fr",
      itemKey: "payer-avec-une-carte-bancaire-a-puce",
      itemLabel: "payer avec une carte bancaire à puce",
      theme: "argent",
      gestureRoot: "payer_avec_une_carte_a_puce",
      editorialScore: 83,
      objectType: "payment_tool",
      category: "payment",
      releaseDate: "1992",
      releaseYear: 1992,
      datePrecision: "year",
      placeName: "Terminal de paiement électronique",
      placeType: "institution",
      placeQid: null,
      triggerLabel: "Généralisation des cartes bancaires à puce",
      beforeState: "Avant 1992, la carte bancaire reste plus vulnérable et moins directement liée au couple puce-code.",
      afterState: "A partir de 1992, la carte à puce s'impose dans les paiements du quotidien en France.",
      objectChanged: "Tu peux payer avec une carte à puce et composer ton code sur un terminal électronique.",
      materialAnchor: "Carte à puce, clavier de terminal et ticket de caisse",
      sceneText:
        "1992, à la caisse. La carte entre dans le lecteur et le code se tape sur le petit clavier au lieu de passer par une simple empreinte. Le paiement devient plus électronique et plus immédiat.",
      fact: "En 1992, la carte bancaire à puce est généralisée sur le marché français.",
      sources: [
        {
          label: "La Dépêche",
          url: "https://www.ladepeche.fr/article/2002/07/09/366964-carte-bancaire-puce-10-ans-sante-fer.html",
          authority: false
        },
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/Carte_%C3%A0_puce",
          authority: false
        }
      ],
      tags: ["carteapuce", "paiement", "terminal", "code"],
      quality: {
        strictPlace: false,
        strictDate: false,
        everydayUse: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-1998-carte-vitale",
      countryQid: "Q142",
      lang: "fr",
      itemKey: "presenter-une-carte-vitale-au-medecin",
      itemLabel: "présenter une carte Vitale chez le médecin",
      theme: "santé",
      gestureRoot: "presenter_une_carte_vitale",
      editorialScore: 93,
      objectType: "payment_tool",
      category: "service",
      releaseDate: "1998-04-02",
      releaseYear: 1998,
      datePrecision: "day",
      placeName: "Cabinet médical et pharmacie",
      placeType: "institution",
      placeQid: null,
      triggerLabel: "Début du déploiement national de la carte Vitale",
      beforeState: "Avant avril 1998, la feuille de soins papier reste la voie ordinaire pour lancer le remboursement.",
      afterState: "Après avril 1998, la carte Vitale commence à faire passer les droits et les remboursements par la carte à puce.",
      objectChanged: "Tu peux tendre une carte Vitale au lieu de remplir systématiquement une feuille de soins papier.",
      materialAnchor: "Carte Vitale, lecteur SESAM-Vitale et feuille de soins",
      sceneText:
        "2 avril 1998, chez le médecin. La petite carte verte remplace peu à peu le papier qu'il fallait remplir et envoyer. Le remboursement commence à passer par la puce posée sur le lecteur.",
      fact: "Le 2 avril 1998, le déploiement national de la carte Vitale démarre en Bretagne.",
      sources: [
        {
          label: "SESAM-Vitale",
          url: "https://fr.wikipedia.org/wiki/SESAM-Vitale",
          authority: false
        },
        {
          label: "GIE SESAM-Vitale",
          url: "https://www.sesam-vitale.fr/web/sesam-vitale/actualites-details/-/blogs/les-20-ans-du-deploiement-national-de-la-carte-vitale",
          authority: true
        }
      ],
      tags: ["cartevitale", "sante", "remboursement", "puce"],
      quality: {
        strictPlace: true,
        strictDate: true,
        everydayUse: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-1999-adsl",
      countryQid: "Q142",
      lang: "fr",
      itemKey: "naviguer-en-haut-debit-sans-bloquer-la-ligne",
      itemLabel: "naviguer en haut débit sans bloquer la ligne",
      theme: "communication",
      gestureRoot: "naviguer_en_adsl",
      editorialScore: 90,
      objectType: "service",
      category: "network",
      releaseDate: "1999",
      releaseYear: 1999,
      datePrecision: "year",
      placeName: "Ligne téléphonique fixe",
      placeType: "country",
      placeQid: "Q142",
      triggerLabel: "Lancement de l'ADSL grand public par France Télécom",
      beforeState: "Avant 1999, la connexion domestique reste plus lente et monopolise plus facilement la ligne téléphonique.",
      afterState: "A partir de 1999, le haut débit ADSL change la vitesse et la durée d'usage d'Internet à la maison.",
      objectChanged: "Tu peux laisser Internet branché en haut débit sur la ligne fixe.",
      materialAnchor: "Modem ADSL, filtre téléphonique et ordinateur familial",
      sceneText:
        "1999, sur un bureau familial. Le modem ne sert plus seulement à des sessions brèves et lentes : la navigation s'installe plus longtemps sans confisquer la maison entière. La ligne fixe change de rythme.",
      fact: "En 1999, France Télécom lance l'ADSL grand public sur le réseau téléphonique fixe en France.",
      sources: [
        {
          label: "Orange",
          url: "https://www.orange.com/en/newsroom/news/2019/diversity-and-gender-equality-throughout-telecoms-history",
          authority: true
        },
        {
          label: "Telecompaper",
          url: "https://www.telecompaper.com/news/authorities-delay-france-telecoms-adsl-launch--178423",
          authority: false
        }
      ],
      tags: ["adsl", "hautdebit", "internet", "maison"],
      quality: {
        strictPlace: false,
        strictDate: false,
        everydayUse: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-2000-voyages-sncf",
      countryQid: "Q142",
      lang: "fr",
      itemKey: "acheter-un-billet-de-train-en-ligne",
      itemLabel: "acheter un billet de train en ligne",
      theme: "transport",
      gestureRoot: "acheter_un_billet_de_train_en_ligne",
      editorialScore: 92,
      objectType: "service",
      category: "service",
      releaseDate: "2000-06",
      releaseYear: 2000,
      datePrecision: "month",
      placeName: "voyages-sncf.com",
      placeType: "institution",
      placeQid: null,
      triggerLabel: "Création de voyages-sncf.com",
      beforeState: "Avant 2000, l'achat de billets passe surtout par le guichet, le téléphone ou l'agence.",
      afterState: "Après 2000, le billet de train commence à s'acheter depuis l'écran domestique.",
      objectChanged: "Tu peux acheter ton billet SNCF en ligne sans passer au guichet.",
      materialAnchor: "Écran d'ordinateur, souris et billet imprimé",
      sceneText:
        "Juin 2000, devant l'ordinateur. Le trajet se réserve depuis un site web au lieu de dépendre d'un comptoir ou d'un appel. Le billet commence à se fabriquer à domicile avant même de partir.",
      fact: "En 2000, la SNCF lance voyages-sncf.com pour vendre des billets de train en ligne.",
      sources: [
        {
          label: "Wikipedia",
          url: "https://en.wikipedia.org/wiki/SNCF_Connect",
          authority: false
        },
        {
          label: "BFMTV",
          url: "https://www.bfmtv.com/economie/entreprises/services/voyages-sncf-com-son-succes-lui-donne-des-ailes-pour-conquerir-le-monde_AN-201504220292.html",
          authority: false
        }
      ],
      tags: ["sncf", "billet", "internet", "reservation"],
      quality: {
        strictPlace: true,
        strictDate: false,
        everydayUse: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-2000-liber-t",
      countryQid: "Q142",
      lang: "fr",
      itemKey: "passer-au-peage-avec-un-badge",
      itemLabel: "passer au péage avec un badge télépéage",
      theme: "transport",
      gestureRoot: "passer_au_peage_avec_un_badge",
      editorialScore: 82,
      objectType: "service",
      category: "transport",
      releaseDate: "2000",
      releaseYear: 2000,
      datePrecision: "year",
      placeName: "Autoroutes de France",
      placeType: "country",
      placeQid: "Q142",
      triggerLabel: "Création du service Liber-t",
      beforeState: "Avant 2000, la barrière de péage impose plus souvent l'arrêt, le ticket et le paiement manuel.",
      afterState: "A partir de 2000, un badge permet de franchir certaines voies de péage plus rapidement.",
      objectChanged: "Tu peux franchir le péage avec un badge fixé au pare-brise au lieu de préparer pièces ou carte à la fenêtre.",
      materialAnchor: "Badge Liber-t, pare-brise et voie marquée T",
      sceneText:
        "2000, à l'approche du péage. Le badge posé derrière le pare-brise remplace le geste de fouiller la boîte à gants. La barrière se lève presque sans interrompre le flot de la voiture.",
      fact: "En 2000, le service de télépéage Liber-t est créé en France.",
      sources: [
        {
          label: "Auto Plus",
          url: "https://www.autoplus.fr/actualite/societe-economie/telepeage-liber-t-zero-euro-107103.html",
          authority: false
        }
      ],
      tags: ["telepeage", "autoroute", "badge", "voiture"],
      quality: {
        strictPlace: false,
        strictDate: false,
        everydayUse: true,
        sourceCount: 1
      }
    },
    {
      id: "fr-2005-tnt",
      countryQid: "Q142",
      lang: "fr",
      itemKey: "recevoir-les-chaines-de-la-tnt",
      itemLabel: "recevoir les chaînes gratuites de la TNT",
      theme: "loisirs",
      gestureRoot: "recevoir_la_tnt",
      editorialScore: 85,
      objectType: "service",
      category: "media",
      releaseDate: "2005-03-31",
      releaseYear: 2005,
      datePrecision: "day",
      placeName: "Télévision numérique terrestre",
      placeType: "country",
      placeQid: "Q142",
      triggerLabel: "Lancement de la TNT gratuite",
      beforeState: "Avant le 31 mars 2005, la télévision hertzienne gratuite offre moins de chaînes dans le poste du salon.",
      afterState: "Après le 31 mars 2005, la TNT ouvre un bouquet gratuit plus large à ceux qui s'équipent.",
      objectChanged: "Tu peux recevoir davantage de chaînes gratuites avec un adaptateur TNT.",
      materialAnchor: "Adaptateur TNT, télécommande et écran de salon",
      sceneText:
        "31 mars 2005, dans le salon. Un petit boîtier ajoute d'un coup plusieurs chaînes gratuites à l'écran familial. Le zapping s'élargit sans passer par l'abonnement.",
      fact: "Le 31 mars 2005, les chaînes gratuites de la TNT commencent à émettre en France.",
      sources: [
        {
          label: "CSA",
          url: "https://www.csa.fr/var/ezflow_site/storage/csa/rapport2005/donnees/rapport/date.htm",
          authority: true
        }
      ],
      tags: ["tnt", "television", "adaptateur", "salon"],
      quality: {
        strictPlace: false,
        strictDate: true,
        everydayUse: true,
        sourceCount: 1
      }
    },
    {
      id: "fr-2007-iphone",
      countryQid: "Q142",
      lang: "fr",
      itemKey: "utiliser-un-smartphone-tactile",
      itemLabel: "utiliser un smartphone tactile",
      theme: "communication",
      gestureRoot: "utiliser_un_smartphone_tactile",
      editorialScore: 89,
      objectType: "device",
      category: "device",
      releaseDate: "2007-11-29",
      releaseYear: 2007,
      datePrecision: "day",
      placeName: "Boutiques Orange",
      placeType: "institution",
      placeQid: "Q1431481",
      triggerLabel: "Lancement de l'iPhone en France",
      beforeState: "Avant le 29 novembre 2007, le téléphone mobile courant ne concentre pas encore au même point écran tactile, web et musique dans un seul objet populaire.",
      afterState: "Après le 29 novembre 2007, le smartphone tactile s'installe comme nouvel horizon d'usage mobile en France.",
      objectChanged: "Tu peux sortir un téléphone tactile qui sert aussi d'écran web et de lecteur multimédia.",
      materialAnchor: "Écran tactile, icônes d'applications et boutique Orange",
      sceneText:
        "29 novembre 2007, en boutique. Le téléphone se manipule du doigt sur une plaque de verre plutôt qu'au clavier. Dans la poche, l'objet commence à réunir téléphone, musique et internet.",
      fact: "Le 29 novembre 2007, Orange lance l'iPhone en France.",
      sources: [
        {
          label: "Apple",
          url: "https://www.apple.com/fr/newsroom/2007/10/16Apple-Chooses-Orange-as-Exclusive-Carrier-for-iPhone-in-France/",
          authority: true
        },
        {
          label: "01net",
          url: "https://www.01net.com/actualites/jour-j-pour-liphone-365254.html",
          authority: false
        }
      ],
      tags: ["iphone", "smartphone", "orange", "mobile"],
      quality: {
        strictPlace: true,
        strictDate: true,
        everydayUse: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-2012-sans-contact",
      countryQid: "Q142",
      lang: "fr",
      itemKey: "payer-sans-contact",
      itemLabel: "payer sans contact",
      theme: "argent",
      gestureRoot: "payer_sans_contact",
      editorialScore: 87,
      objectType: "payment_tool",
      category: "payment",
      releaseDate: "2012",
      releaseYear: 2012,
      datePrecision: "year",
      placeName: "Terminaux de paiement en France",
      placeType: "country",
      placeQid: "Q142",
      triggerLabel: "Déploiement du paiement sans contact",
      beforeState: "Avant 2012, régler par carte suppose plus souvent d'insérer la carte et de composer son code.",
      afterState: "A partir de 2012, certains petits paiements passent par un simple geste devant le terminal.",
      objectChanged: "Tu peux régler un petit achat en approchant la carte du terminal.",
      materialAnchor: "Carte bancaire, pictogramme sans contact et terminal de caisse",
      sceneText:
        "2012, à la caisse. La carte ne disparaît plus dans le lecteur : elle effleure le terminal et le ticket sort aussitôt. Le paiement devient un geste bref plutôt qu'une petite procédure.",
      fact: "Depuis 2012, le paiement sans contact se déploie dans les dépenses du quotidien en France.",
      sources: [
        {
          label: "Banque de France",
          url: "https://www.banque-france.fr/system/files/2023-12/BDF249-4_Cartographie_web.pdf",
          authority: true
        },
        {
          label: "FBF",
          url: "https://www.fbf.fr/uploads/2021/02/Rapport-FBF-2015-secteur-bancaire.pdf",
          authority: true
        }
      ],
      tags: ["sanscontact", "carte", "paiement", "caisse"],
      quality: {
        strictPlace: false,
        strictDate: false,
        everydayUse: true,
        sourceCount: 2
      }
    },
    {
      id: "fr-2014-netflix",
      countryQid: "Q142",
      lang: "fr",
      itemKey: "regarder-des-series-en-streaming-par-abonnement",
      itemLabel: "regarder des séries en streaming par abonnement",
      theme: "loisirs",
      gestureRoot: "regarder_des_series_en_streaming",
      editorialScore: 83,
      objectType: "service",
      category: "media",
      releaseDate: "2014-09-15",
      releaseYear: 2014,
      datePrecision: "day",
      placeName: "Netflix France",
      placeType: "institution",
      placeQid: "Q907311",
      triggerLabel: "Lancement de Netflix en France",
      beforeState: "Avant le 15 septembre 2014, le binge-watching par abonnement n'occupe pas encore cette place dans le salon français.",
      afterState: "Après le 15 septembre 2014, les séries à la demande se regardent en continu depuis une plateforme d'abonnement.",
      objectChanged: "Tu peux lancer des épisodes à la suite sur une plateforme vidéo plutôt que d'attendre la grille télé.",
      materialAnchor: "Interface vidéo, barre de progression et télé connectée",
      sceneText:
        "15 septembre 2014, dans le salon. L'épisode suivant démarre quand tu le veux au lieu d'attendre l'horaire de diffusion. La soirée se règle désormais depuis un catalogue en ligne.",
      fact: "Le 15 septembre 2014, Netflix est lancé en France.",
      sources: [
        {
          label: "Le Monde",
          url: "https://www.lemonde.fr/economie/article/2024/09/15/netflix-en-france-la-decennie-qui-a-change-la-face-du-paf_6318191_3234.html",
          authority: false
        },
        {
          label: "Wikipedia",
          url: "https://fr.wikipedia.org/wiki/Netflix",
          authority: false
        }
      ],
      tags: ["netflix", "streaming", "series", "abonnement"],
      quality: {
        strictPlace: true,
        strictDate: true,
        everydayUse: true,
        sourceCount: 2
      }
    },
    ...FR_INVENTION_PERIOD_ENTRIES
  ]
};
