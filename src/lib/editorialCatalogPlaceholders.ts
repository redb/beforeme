/**
 * Cartes « gabarit » produites par scripts/generate_france_editorial_backfill.mjs
 * et scripts/gen_q142_131_catalog.mjs pour combler des années sans entrée spécifique.
 * Elles ne doivent pas être proposées comme scènes éditoriales.
 */

export function isCatalogPlaceholderInvention(entry: { id: string; itemKey: string }): boolean {
  return (
    entry.id.includes("-equipement-courant-") ||
    /^adopter-un-usage-technique-de-\d{4}$/.test(entry.itemKey)
  );
}

export function isCatalogPlaceholderGesture(entry: { id: string; gestureKey: string }): boolean {
  return (
    entry.id.includes("-alignement-administratif-") ||
    /^plier-les-demarches-au-texte-national-de-\d{4}$/.test(entry.gestureKey)
  );
}

export function isCatalogPlaceholderCultural(entry: { id: string; momentKey: string }): boolean {
  return (
    entry.id.includes("-spectacle-national-") || /^sortie-ou-representation-\d{4}$/.test(entry.momentKey)
  );
}
