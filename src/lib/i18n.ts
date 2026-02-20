export type Lang = 'fr' | 'en';

export type UiKey =
  | 'siteTitle'
  | 'heroTitle'
  | 'heroTagline'
  | 'ageOrBirthYearLabel'
  | 'ageOrBirthYearPlaceholder'
  | 'ageOrBirthYearPlaceholderMobile'
  | 'locationLabel'
  | 'locationPlaceholder'
  | 'locationPlaceholderMobile'
  | 'locateAction'
  | 'locateTooltip'
  | 'locateSuccess'
  | 'locateFailed'
  | 'cta'
  | 'ctaLoading'
  | 'resultTitle'
  | 'resultYearLine'
  | 'resultBeforeBirthLine'
  | 'storyLabel'
  | 'continue'
  | 'restart'
  | 'disclaimer'
  | 'inputError'
  | 'yearError'
  | 'locationError'
  | 'adLabel'
  | 'adText'
  | 'adBreakHint'
  | 'adSponsored'
  | 'legalLine'
  | 'legalLink'
  | 'sharePrompt'
  | 'shareAction'
  | 'shareTextTemplate'
  | 'shareCopied'
  | 'shareFailed'
  | 'historicalInspired'
  | 'historicalSource';

const UI_STRINGS: Record<Lang, Record<UiKey, string>> = {
  fr: {
    siteTitle: 'AvantMoi.com',
    heroTitle: 'Rejoins ton année miroir',
    heroTagline: 'Tu vas savoir.',
    ageOrBirthYearLabel: 'ton âge ou ton année de naissance',
    ageOrBirthYearPlaceholder: 'Entre ton âge ou ton année de naissance',
    ageOrBirthYearPlaceholderMobile: 'ton âge ou ton année',
    locationLabel: '',
    locationPlaceholder: 'Entre ton pays (monde par defaut)',
    locationPlaceholderMobile: 'Ton pays',
    locateAction: '⌖',
    locateTooltip: 'Utilise ta position pour pre-remplir le pays.',
    locateSuccess: 'lieu pre-rempli avec ta region detectee.',
    locateFailed: 'geolocalisation indisponible sur cet appareil.',
    cta: 'me propulser',
    ctaLoading: 'propulsion...',
    resultTitle: 'AvantMoi.com',
    resultYearLine: 'Tu es en {year}',
    resultBeforeBirthLine: '{age} ans avant ta naissance',
    storyLabel: 'scene',
    continue: 'continuer',
    restart: 'recommencer',
    disclaimer: 'scenes plausibles, pas une archive historique.',
    inputError: 'entre ton âge ou ton année de naissance.',
    yearError: 'entree invalide. verifie les valeurs.',
    locationError: 'entre un lieu valide ou un code pays (FR, US, BR...).',
    adLabel: '',
    adText: '',
    adBreakHint: 'le site reste gratuit grace aux sponsors',
    adSponsored: 'Proposé par morgao.com',
    legalLine: 'Expérience ludique sans prétention académique. Aucune donnée personnelle n’est collectée.',
    legalLink: 'Mentions Legales',
    sharePrompt: 'envoie cette année à un ami',
    shareAction: 'Partager mon année miroir',
    shareTextTemplate: 'Je viens de voir mon année miroir : {year}',
    shareCopied: 'lien copié dans le presse-papiers.',
    shareFailed: 'partage indisponible sur cet appareil.',
    historicalInspired: "inspire d'un evenement reel",
    historicalSource: 'source'
  },
  en: {
    siteTitle: 'AvantMoi.com',
    heroTitle: 'Join your mirror year',
    heroTagline: 'You are about to know.',
    ageOrBirthYearLabel: 'your age or your birth year',
    ageOrBirthYearPlaceholder: 'Enter your age or your birth year',
    ageOrBirthYearPlaceholderMobile: 'your age or year',
    locationLabel: '',
    locationPlaceholder: 'Enter your country (world by default)',
    locationPlaceholderMobile: 'Your country',
    locateAction: '⌖',
    locateTooltip: 'Use your location to prefill your country.',
    locateSuccess: 'location prefilled from detected region.',
    locateFailed: 'geolocation is unavailable on this device.',
    cta: 'launch me',
    ctaLoading: 'warping...',
    resultTitle: 'AvantMoi.com',
    resultYearLine: 'You are in {year}',
    resultBeforeBirthLine: '{age} years before your birth',
    storyLabel: 'scene',
    continue: 'continue',
    restart: 'start again',
    disclaimer: 'plausible scenes, not a historical archive.',
    inputError: 'enter either your age or your birth year.',
    yearError: 'invalid input. check your values.',
    locationError: 'enter a valid location or country code (FR, US, BR...).',
    adLabel: '',
    adText: '',
    adBreakHint: 'the site stays free thanks to sponsors',
    adSponsored: 'Presented by morgao.com',
    legalLine: '©avantmoi.com — Playful experience with no academic claim. No personal data is collected.',
    legalLink: 'Legal Notice',
    sharePrompt: 'show this year to someone',
    shareAction: 'Share my mirror year',
    shareTextTemplate: 'I just saw my mirror year: {year}',
    shareCopied: 'link copied to clipboard.',
    shareFailed: 'sharing is unavailable on this device.',
    historicalInspired: 'inspired by a real event',
    historicalSource: 'source'
  }
};

export function normalizeLang(value: string | null | undefined): Lang {
  return value === 'fr' ? 'fr' : 'en';
}

export function t(lang: Lang, key: UiKey): string {
  return UI_STRINGS[lang][key];
}

export const LANGUAGE_OPTIONS: Array<{ value: Lang; label: string }> = [
  { value: 'fr', label: 'Francais' },
  { value: 'en', label: 'English' }
];
