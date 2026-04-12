import type { EditorialTheme } from "../editorialTheme";

export type NotableBirthEntry = {
  year: number;
  lang: "fr" | "en";
  name: string;
  birthDate: string;
  wikipediaUrl: string;
  qid?: string;
  theme: EditorialTheme;
  gestureRoot: string;
  editorialScore: number;
  achievement?: string; // fait d'armes court, affiché dans la narrative
};

export type NotableBirthCatalog = {
  lang: "fr" | "en";
  entries: NotableBirthEntry[];
};
