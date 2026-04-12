import type { CandidateCore } from "./types";

export type SeedOverride = {
  pattern: RegExp;
  date?: string;
  placeName?: string;
  placeType?: "site" | "institution" | "city" | "country";
  extraSources: Array<{ label: string; url: string; authority?: boolean }>;
};

const FR_1975_SEEDS: CandidateCore[] = [
  {
    qid: "SEED-FR-1975-LOI-VEIL",
    title: "Loi Veil",
    date: "1975-01-17",
    wikipediaUrl: "https://fr.wikipedia.org/wiki/Loi_Veil",
    rupture_type: "LEGAL_REGULATORY",
    confidence: 0.9,
    placeHints: { p159Qid: "Q230472", p159Label: "Journal officiel de la Republique francaise" }
  },
  {
    qid: "SEED-FR-1975-DIVORCE",
    title: "Reforme du divorce en France",
    date: "1975-07-11",
    wikipediaUrl: "https://fr.wikipedia.org/wiki/R%C3%A9forme_du_divorce_en_France",
    rupture_type: "LEGAL_REGULATORY",
    confidence: 0.83,
    placeHints: { p159Qid: "Q185264", p159Label: "Tribunal judiciaire" }
  },
  {
    qid: "SEED-FR-1975-CARTE-ORANGE",
    title: "Carte orange",
    date: "1975-10-01",
    wikipediaUrl: "https://fr.wikipedia.org/wiki/Carte_orange",
    rupture_type: "INFRA_SERVICE",
    confidence: 0.86,
    placeHints: { p276Qid: "Q733302", p276Label: "Metro de Paris", p131Qid: "Q90", p131Label: "Paris" }
  },
  {
    qid: "SEED-FR-1975-HABY",
    title: "Loi Haby",
    date: "1975-07-11",
    wikipediaUrl: "https://fr.wikipedia.org/wiki/Loi_Haby",
    rupture_type: "LEGAL_REGULATORY",
    confidence: 0.84,
    placeHints: { p159Qid: "Q142", p159Label: "France" }
  },
  {
    qid: "SEED-FR-1975-API",
    title: "Allocation de parent isole",
    date: "1975-07-11",
    wikipediaUrl: "https://fr.wikipedia.org/wiki/Allocation_de_parent_isol%C3%A9",
    rupture_type: "LEGAL_REGULATORY",
    confidence: 0.78,
    placeHints: { p159Qid: "Q142", p159Label: "France" }
  },
  {
    qid: "SEED-FR-1975-LITTORAL",
    title: "Conservatoire du littoral",
    date: "1975-07-10",
    wikipediaUrl: "https://fr.wikipedia.org/wiki/Conservatoire_du_littoral",
    rupture_type: "LEGAL_REGULATORY",
    confidence: 0.82,
    placeHints: { p131Qid: "Q142", p131Label: "France" }
  },
  {
    qid: "SEED-FR-1975-HANDICAP",
    title: "Loi d'orientation en faveur des personnes handicapees",
    date: "1975-06-30",
    wikipediaUrl: "https://fr.wikipedia.org/wiki/Loi_d%27orientation_en_faveur_des_personnes_handicap%C3%A9es",
    rupture_type: "LEGAL_REGULATORY",
    confidence: 0.84,
    placeHints: { p131Qid: "Q142", p131Label: "France" }
  }
];

const FR_1910_SEEDS: CandidateCore[] = [
  {
    qid: "SEED-FR-1910-SAINT-GERMAIN",
    title: "Ouverture de Saint-Germain-des-Pres (metro de Paris)",
    date: "1910-01-09",
    dateCandidates: ["1910-01-09"],
    wikipediaUrl: "https://fr.wikipedia.org/wiki/Saint-Germain-des-Pr%C3%A9s_%28m%C3%A9tro_de_Paris%29",
    rupture_type: "INFRA_SERVICE",
    confidence: 0.86,
    placeHints: { p276Qid: "Q781873", p276Label: "Station Saint-Germain-des-Pres", p131Qid: "Q90", p131Label: "Paris" }
  },
  {
    qid: "SEED-FR-1910-VELDHIV",
    title: "Inauguration du Velodrome d'Hiver",
    date: "1910-02-13",
    dateCandidates: ["1910-02-13"],
    wikipediaUrl: "https://fr.wikipedia.org/wiki/V%C3%A9lodrome_d%27Hiver",
    rupture_type: "INFRA_SERVICE",
    confidence: 0.82,
    placeHints: { p276Qid: "Q1274969", p276Label: "Velodrome d'Hiver, rue Nelaton", p131Qid: "Q90", p131Label: "Paris" }
  },
  {
    qid: "SEED-FR-1910-PORTE-VERSAILLES",
    title: "Ouverture de Porte de Versailles (Nord-Sud)",
    date: "1910-11-05",
    dateCandidates: ["1910-11-05"],
    wikipediaUrl: "https://fr.wikipedia.org/wiki/Porte_de_Versailles_%28m%C3%A9tro_de_Paris%29",
    rupture_type: "INFRA_SERVICE",
    confidence: 0.85,
    placeHints: { p276Qid: "Q1969289", p276Label: "Station Porte de Versailles", p131Qid: "Q90", p131Label: "Paris" }
  }
];

const FR_1912_SEEDS: CandidateCore[] = [
  {
    qid: "SEED-FR-1912-PLACE-DES-FETES",
    title: "Ouverture de Place des Fetes (metro de Paris)",
    date: "1912-02-13",
    dateCandidates: ["1912-02-13"],
    wikipediaUrl: "https://fr.wikipedia.org/wiki/Place_des_F%C3%AAtes_(m%C3%A9tro_de_Paris)",
    rupture_type: "INFRA_SERVICE",
    confidence: 0.87,
    placeHints: { p276Qid: "Q1789135", p276Label: "Station Place des Fetes", p131Qid: "Q90", p131Label: "Paris" }
  }
];

const FR_1968_SEEDS: CandidateCore[] = [
  {
    qid: "SEED-FR-1968-CANNES",
    title: "Festival de Cannes 1968",
    date: "1968-05-18",
    dateCandidates: ["1968-05-18"],
    wikipediaUrl: "https://fr.wikipedia.org/wiki/Festival_de_Cannes_1968",
    rupture_type: "FIRST_PUBLIC_DEMO",
    confidence: 0.9,
    placeHints: { p276Qid: "Q1564807", p276Label: "Palais des Festivals", p131Qid: "Q39984", p131Label: "Cannes" }
  },
  {
    qid: "SEED-FR-1968-GRENELLE",
    title: "Accords de Grenelle",
    date: "1968-05-27",
    dateCandidates: ["1968-05-27"],
    wikipediaUrl: "https://fr.wikipedia.org/wiki/Accords_de_Grenelle",
    rupture_type: "STATE_CHANGE_EVENT",
    confidence: 0.82,
    placeHints: { p276Qid: "Q90", p276Label: "Paris", p131Qid: "Q90", p131Label: "Paris" }
  }
];

export const SEED_OVERRIDES: SeedOverride[] = [
  {
    pattern: /saint-germain-des-pr/i,
    date: "1910-01-09",
    placeName: "Station Saint-Germain-des-Pres",
    placeType: "site",
    extraSources: [
      { label: "Ville de Paris", url: "https://www.paris.fr/pages/le-metro-parisien-en-14-dates-16107" },
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Saint-Germain-des-Pr%C3%A9s_%28m%C3%A9tro_de_Paris%29" }
    ]
  },
  {
    pattern: /velodrome_d.?hiver/i,
    date: "1910-02-13",
    placeName: "Velodrome d'Hiver, rue Nelaton",
    placeType: "site",
    extraSources: [{ label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/V%C3%A9lodrome_d%27Hiver" }]
  },
  {
    pattern: /porte_de_versailles_%28m%C3%A9tro_de_paris%29|porte_de_versailles_%28m.*paris%29/i,
    date: "1910-11-05",
    placeName: "Station Porte de Versailles",
    placeType: "site",
    extraSources: [
      { label: "RATP", url: "https://www.ratp.fr/groupe-ratp/histoire" },
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Porte_de_Versailles_%28m%C3%A9tro_de_Paris%29" }
    ]
  },
  {
    pattern: /place_des_f.*(?:m%C3%A9tro_de_paris|métro_de_paris|metro_de_paris)|place des f[eê]tes/i,
    date: "1912-02-13",
    placeName: "Station Place des Fêtes",
    placeType: "site",
    extraSources: [
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Place_des_F%C3%AAtes_(m%C3%A9tro_de_Paris)" }
    ]
  },
  {
    pattern: /festival_de_cannes_1968/i,
    date: "1968-05-18",
    placeName: "Palais des Festivals",
    placeType: "site",
    extraSources: [{ label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Festival_de_Cannes_1968" }]
  },
  {
    pattern: /accords_de_grenelle/i,
    date: "1968-05-27",
    placeName: "Ministere du Travail, rue de Grenelle",
    placeType: "institution",
    extraSources: [
      { label: "Vie publique", url: "https://www.vie-publique.fr", authority: true },
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Accords_de_Grenelle" }
    ]
  },
  {
    pattern: /loi_veil/i,
    date: "1975-01-17",
    placeName: "Journal officiel de la Republique francaise",
    placeType: "institution",
    extraSources: [
      { label: "Legifrance", url: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000693983", authority: true },
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Loi_Veil" }
    ]
  },
  {
    pattern: /reforme_du_divorce_en_france/i,
    date: "1975-07-11",
    placeName: "Tribunal judiciaire",
    placeType: "institution",
    extraSources: [
      { label: "Legifrance", url: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000693724", authority: true },
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/R%C3%A9forme_du_divorce_en_France" }
    ]
  },
  {
    pattern: /carte_orange/i,
    date: "1975-10-01",
    placeName: "Portique du metro parisien",
    placeType: "site",
    extraSources: [
      { label: "RATP", url: "https://www.ratp.fr/groupe-ratp/histoire" },
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Carte_orange" }
    ]
  },
  {
    pattern: /loi_haby/i,
    date: "1975-07-11",
    placeName: "College public",
    placeType: "institution",
    extraSources: [
      { label: "Legifrance", url: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000693721", authority: true },
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Loi_Haby" }
    ]
  },
  {
    pattern: /allocation_de_parent_isol/i,
    date: "1975-07-11",
    placeName: "Guichet de la CAF",
    placeType: "institution",
    extraSources: [
      { label: "Vie publique", url: "https://www.vie-publique.fr", authority: true },
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Allocation_de_parent_isol%C3%A9" }
    ]
  },
  {
    pattern: /conservatoire_du_littoral/i,
    date: "1975-07-10",
    placeName: "Parcelle littorale protegee",
    placeType: "site",
    extraSources: [
      { label: "Legifrance", url: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000693692", authority: true },
      { label: "Conservatoire", url: "https://www.conservatoire-du-littoral.fr" },
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Conservatoire_du_littoral" }
    ]
  },
  {
    pattern: /autorit%C3%A9_parentale_en_france|autorite_parentale_en_france/i,
    date: "1970-06-04",
    placeName: "Mairie et services scolaires",
    placeType: "institution",
    extraSources: [
      { label: "Legifrance", url: "https://www.legifrance.gouv.fr", authority: true },
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Autorit%C3%A9_parentale_en_France" }
    ]
  },
  {
    pattern: /loi_d.?orientation_en_faveur_des_personnes_handicap/i,
    date: "1975-06-30",
    placeName: "Ecole et guichet administratif",
    placeType: "institution",
    extraSources: [
      { label: "Legifrance", url: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000693508", authority: true },
      { label: "Wikipedia", url: "https://fr.wikipedia.org/wiki/Loi_d%27orientation_en_faveur_des_personnes_handicap%C3%A9es" }
    ]
  }
];

export function seedCandidatesForYearCountry(year: number, countryQid: string): CandidateCore[] {
  if (countryQid === "Q142" && year === 1910) return [...FR_1910_SEEDS];
  if (countryQid === "Q142" && year === 1912) return [...FR_1912_SEEDS];
  if (countryQid === "Q142" && year === 1968) return [...FR_1968_SEEDS];
  if (countryQid === "Q142" && year === 1975) return [...FR_1975_SEEDS];
  return [];
}

export function findSeedOverride(input: { title?: string; wikipediaUrl?: string }): SeedOverride | null {
  const title = String(input.title || "");
  const url = String(input.wikipediaUrl || "");
  for (const rule of SEED_OVERRIDES) {
    if (rule.pattern.test(url) || rule.pattern.test(title)) return rule;
  }
  return null;
}
