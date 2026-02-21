export const RuptureType = {
  LEGAL_REGULATORY: "LEGAL_REGULATORY",
  INFRA_SERVICE: "INFRA_SERVICE",
  TECH_PUBLIC: "TECH_PUBLIC",
  FIRST_PUBLIC_DEMO: "FIRST_PUBLIC_DEMO",
  STATE_CHANGE_EVENT: "STATE_CHANGE_EVENT",
} as const;

export type RuptureType = typeof RuptureType[keyof typeof RuptureType];

export const ALLOWED_CLAIM_TEMPLATES: Record<RuptureType, string[]> = {
  [RuptureType.LEGAL_REGULATORY]: [
    "Ce jour-là, cette règle entre en vigueur et s'applique immédiatement.",
    "Cette interdiction devient effective et modifie les gestes autorisés.",
    "Cette obligation est officiellement appliquée dans l'espace public."
  ],
  [RuptureType.INFRA_SERVICE]: [
    "Ce service ouvre au public et change les trajets dès aujourd'hui.",
    "Cette infrastructure est mise en service et devient utilisable immédiatement.",
    "Cette ligne/ce lieu fonctionne désormais en conditions réelles."
  ],
  [RuptureType.TECH_PUBLIC]: [
    "Cette technologie est disponible pour le public à partir de ce moment.",
    "Ce lancement rend l'usage possible hors des cercles spécialisés.",
    "Ce produit/service devient accessible en usage quotidien."
  ],
  [RuptureType.FIRST_PUBLIC_DEMO]: [
    "Cette première démonstration est visible publiquement ce jour-là.",
    "Cette première diffusion a lieu devant un public réel.",
    "Cette première occurrence publique est observée dans un cadre ouvert."
  ],
  [RuptureType.STATE_CHANGE_EVENT]: [
    "Cet événement modifie immédiatement les usages de l'espace concerné.",
    "Cette rupture entraîne des adaptations visibles dans la vie courante.",
    "Ce fait provoque une réorganisation concrète et immédiate."
  ]
};

export const REQUIRED_MATERIAL_ELEMENTS: Record<RuptureType, string[]> = {
  [RuptureType.LEGAL_REGULATORY]: ["panneau", "affiche", "formulaire", "guichet", "tampon"],
  [RuptureType.INFRA_SERVICE]: ["quai", "ticket", "barrière", "horloge", "signalétique"],
  [RuptureType.TECH_PUBLIC]: ["terminal", "écran", "carte", "câble", "combiné"],
  [RuptureType.FIRST_PUBLIC_DEMO]: ["tribune", "micro", "projecteur", "rideau", "programme"],
  [RuptureType.STATE_CHANGE_EVENT]: ["sirène", "ruban", "barrière", "file", "haut-parleur"]
};
