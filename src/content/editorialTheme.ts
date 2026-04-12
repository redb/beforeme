export const EDITORIAL_THEMES = [
  "transport",
  "communication",
  "école",
  "santé",
  "argent",
  "travail",
  "famille",
  "administration",
  "maison",
  "loisirs",
  "tabac_alcool"
] as const;

export type EditorialTheme = (typeof EDITORIAL_THEMES)[number];

export function normalizeEditorialTheme(value: string | null | undefined): EditorialTheme | null {
  const candidate = String(value || "").trim();
  return EDITORIAL_THEMES.includes(candidate as EditorialTheme) ? (candidate as EditorialTheme) : null;
}

export function parseSeenThemes(value: string | null): EditorialTheme[] {
  return String(value || "")
    .split(",")
    .map((item) => normalizeEditorialTheme(item))
    .filter((item): item is EditorialTheme => item !== null);
}
