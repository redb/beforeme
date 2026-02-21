"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REQUIRED_MATERIAL_ELEMENTS = exports.ALLOWED_CLAIM_TEMPLATES = exports.RuptureType = void 0;
exports.RuptureType = {
    LEGAL_REGULATORY: "LEGAL_REGULATORY",
    INFRA_SERVICE: "INFRA_SERVICE",
    TECH_PUBLIC: "TECH_PUBLIC",
    FIRST_PUBLIC_DEMO: "FIRST_PUBLIC_DEMO",
    STATE_CHANGE_EVENT: "STATE_CHANGE_EVENT",
};
exports.ALLOWED_CLAIM_TEMPLATES = {
    [exports.RuptureType.LEGAL_REGULATORY]: [
        "Ce jour-là, cette règle entre en vigueur et s'applique immédiatement.",
        "Cette interdiction devient effective et modifie les gestes autorisés.",
        "Cette obligation est officiellement appliquée dans l'espace public."
    ],
    [exports.RuptureType.INFRA_SERVICE]: [
        "Ce service ouvre au public et change les trajets dès aujourd'hui.",
        "Cette infrastructure est mise en service et devient utilisable immédiatement.",
        "Cette ligne/ce lieu fonctionne désormais en conditions réelles."
    ],
    [exports.RuptureType.TECH_PUBLIC]: [
        "Cette technologie est disponible pour le public à partir de ce moment.",
        "Ce lancement rend l'usage possible hors des cercles spécialisés.",
        "Ce produit/service devient accessible en usage quotidien."
    ],
    [exports.RuptureType.FIRST_PUBLIC_DEMO]: [
        "Cette première démonstration est visible publiquement ce jour-là.",
        "Cette première diffusion a lieu devant un public réel.",
        "Cette première occurrence publique est observée dans un cadre ouvert."
    ],
    [exports.RuptureType.STATE_CHANGE_EVENT]: [
        "Cet événement modifie immédiatement les usages de l'espace concerné.",
        "Cette rupture entraîne des adaptations visibles dans la vie courante.",
        "Ce fait provoque une réorganisation concrète et immédiate."
    ]
};
exports.REQUIRED_MATERIAL_ELEMENTS = {
    [exports.RuptureType.LEGAL_REGULATORY]: ["panneau", "affiche", "formulaire", "guichet", "tampon"],
    [exports.RuptureType.INFRA_SERVICE]: ["quai", "ticket", "barrière", "horloge", "signalétique"],
    [exports.RuptureType.TECH_PUBLIC]: ["terminal", "écran", "carte", "câble", "combiné"],
    [exports.RuptureType.FIRST_PUBLIC_DEMO]: ["tribune", "micro", "projecteur", "rideau", "programme"],
    [exports.RuptureType.STATE_CHANGE_EVENT]: ["sirène", "ruban", "barrière", "file", "haut-parleur"]
};
