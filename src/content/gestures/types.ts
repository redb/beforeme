import type { EditorialTheme } from "../editorialTheme";

export type GestureDirection = "possible_to_impossible" | "impossible_to_possible";

export type GestureCategory =
  | "school"
  | "food"
  | "transport"
  | "family"
  | "health"
  | "work"
  | "money"
  | "media"
  | "housing"
  | "public_space";

export type PlaceType = "site" | "institution" | "city" | "country";

export type GestureSource = {
  label: string;
  url: string;
  authority: boolean;
};

export type GestureRupture = {
  id: string;
  countryQid: string;
  lang: "fr" | "en";
  gestureKey: string;
  gestureLabel: string;
  theme: EditorialTheme;
  gestureRoot: string;
  /** Si défini, une seule carte de ce cluster par parcours (toutes familles éditoriales confondues). */
  editorialCluster?: string;
  editorialScore: number;
  category: GestureCategory;
  direction: GestureDirection;
  ruptureDate: string;
  ruptureYear: number;
  datePrecision: "day" | "month" | "year";
  placeName: string;
  placeType: PlaceType;
  placeQid?: string | null;
  triggerLabel: string;
  triggerType: "law" | "decree" | "opening" | "service_start" | "ban" | "public_rollout";
  beforeState: string;
  afterState: string;
  gestureChanged: string;
  materialAnchor: string;
  sceneText: string;
  fact: string;
  sources: GestureSource[];
  tags: string[];
  quality: {
    strictPlace: boolean;
    strictDate: boolean;
    dailyLife: boolean;
    sourceCount: number;
  };
};

export type GestureCatalog = {
  countryQid: string;
  defaultLang: "fr" | "en";
  supportedLangs: Array<"fr" | "en">;
  entries: GestureRupture[];
};
