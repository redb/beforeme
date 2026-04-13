import type { EditorialTheme } from "../editorialTheme";
import type { PlaceType, GestureSource } from "../gestures/types";

export type CulturalMomentCategory =
  | "work_release"
  | "public_premiere"
  | "venue_opening"
  | "foundational_event"
  | "symbolic_moment";

export type CulturalMomentEntry = {
  id: string;
  countryQid: string;
  lang: "fr" | "en";
  momentKey: string;
  momentLabel: string;
  label: string;
  category: CulturalMomentCategory;
  theme: EditorialTheme;
  gestureRoot: string;
  /** Si défini, une seule carte de ce cluster par parcours (gestes / inventions / culturels). */
  editorialCluster?: string;
  editorialScore: number;
  date: string;
  year: number;
  datePrecision: "day" | "month" | "year";
  placeName: string;
  placeType: PlaceType;
  placeQid?: string | null;
  triggerLabel: string;
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

export type CulturalMomentCatalog = {
  countryQid: string;
  defaultLang: "fr" | "en";
  supportedLangs: Array<"fr" | "en">;
  entries: CulturalMomentEntry[];
};
