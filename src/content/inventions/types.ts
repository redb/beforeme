import type { EditorialTheme } from "../editorialTheme";

export type InventionCategory =
  | "device"
  | "network"
  | "payment"
  | "transport"
  | "service"
  | "media";

export type PlaceType = "site" | "institution" | "city" | "country";

export type InventionSource = {
  label: string;
  url: string;
  authority: boolean;
};

export type InventionEntry = {
  id: string;
  countryQid: string;
  lang: "fr" | "en";
  itemKey: string;
  itemLabel: string;
  theme: EditorialTheme;
  gestureRoot: string;
  editorialScore: number;
  objectType: "service" | "device" | "infrastructure" | "media" | "payment_tool" | "domestic_object";
  category: InventionCategory;
  releaseDate: string;
  releaseYear: number;
  datePrecision: "day" | "month" | "year";
  placeName: string;
  placeType: PlaceType;
  placeQid?: string | null;
  triggerLabel: string;
  beforeState: string;
  afterState: string;
  objectChanged: string;
  materialAnchor: string;
  sceneText: string;
  fact: string;
  sources: InventionSource[];
  tags: string[];
  quality: {
    strictPlace: boolean;
    strictDate: boolean;
    everydayUse: boolean;
    sourceCount: number;
  };
};

export type InventionCatalog = {
  countryQid: string;
  defaultLang: "fr" | "en";
  supportedLangs: Array<"fr" | "en">;
  entries: InventionEntry[];
};
