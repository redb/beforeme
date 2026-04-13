/**
 * Clé optionnelle partagée entre gestes, inventions et moments culturels pour éviter
 * deux scènes du même parcours sur le même fait / le même objet éditorial.
 * Format conseillé : `sujet_annee` ou `slug_evenement` (sans virgule).
 */
export type EditorialClusterCarrier = {
  editorialCluster?: string;
};

export function passesEditorialClusterFilter(entry: EditorialClusterCarrier, seenClusters: string[]): boolean {
  const c = String(entry.editorialCluster || "").trim();
  if (!c) return true;
  return !seenClusters.includes(c);
}
