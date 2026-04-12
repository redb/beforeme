export function parseCsvList(value: string | null): string[] {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
