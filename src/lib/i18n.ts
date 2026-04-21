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
  | 'notableBirthLine'
  | 'storyLabel'
  | 'storyWaiting'
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
  | 'shareTitle'
  | 'shareTextTemplate'
  | 'shareCopied'
  | 'shareFailed'
  | 'historicalInspired'
  | 'historicalSource'
  | 'historicalMoreSources'
  | 'storyUnavailable'
  | 'storyExhausted'
  | 'storyRetry'
  | 'ageConvertedHint'
  | 'yearCountdownPhaseBirth'
  | 'yearCountdownPhaseMirror'
  | 'birthCountryLabel';

const UI_STRINGS: Record<Lang, Record<UiKey, string>> = {
  fr: {
    siteTitle: 'AvantMoi.com',
    heroTitle: 'Rejoins ton année miroir',
    heroTagline: 'Tu vas savoir.',
    ageOrBirthYearLabel: 'ton année de naissance (ou ton âge)',
    ageOrBirthYearPlaceholder: 'Ton année de naissance ou ton âge, ex : 1968 ou 35',
    ageOrBirthYearPlaceholderMobile: 'année ou âge, ex : 1968 ou 35',
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
    notableBirthLine: '{name} naît en {year}. {age} ans plus tard, c’est ton année de naissance.',
    storyLabel: 'scene',
    storyWaiting: 'Un instant, la scène se prépare…',
    continue: 'continuer',
    restart: 'recommencer',
    disclaimer: 'scenes plausibles, pas une archive historique.',
    inputError: 'entre ton âge ou ton année de naissance.',
    yearError: 'entree invalide. verifie les valeurs.',
    locationError: 'entre un lieu valide ou un code pays (FR, US, BR...).',
    adLabel: '',
    adText: '',
    adBreakHint: 'le site reste gratuit grace aux sponsors',
    adSponsored: 'Proposé par avantmoi.com',
    legalLine: 'Expérience ludique sans prétention académique. Aucune donnée personnelle n’est collectée.',
    legalLink: 'Mentions Legales',
    sharePrompt: 'Envoie cette année à un ami',
    shareAction: 'Partager mon année miroir',
    shareTitle: 'AvantMoi — ton année miroir',
    shareTextTemplate:
      "J’ai exploré mon année miroir en {year} sur AvantMoi : des scènes courtes inspirées d’histoire réelle. Viens voir la tienne.",
    shareCopied: 'Lien copié dans le presse-papiers.',
    shareFailed: 'partage indisponible sur cet appareil.',
    historicalInspired: "inspire d'un evenement reel",
    historicalSource: 'source',
    historicalMoreSources: '+ {count} autres sources',
    storyUnavailable: 'Cette scène n’a pas pu être créée pour le moment.',
    storyExhausted: 'Tu as vu toutes les scènes pour cette année.',
    storyRetry: 'Réessayer',
    ageConvertedHint: 'Né(e) en {year} ? Corrige si besoin.',
    yearCountdownPhaseBirth: 'vers ta naissance',
    yearCountdownPhaseMirror: 'vers ton année miroir',
    birthCountryLabel: 'Pays des scènes (naissance / ancrage)'
  },
  en: {
    siteTitle: 'AvantMoi.com',
    heroTitle: 'Join your mirror year',
    heroTagline: 'You are about to know.',
    ageOrBirthYearLabel: 'your birth year (or your age)',
    ageOrBirthYearPlaceholder: 'Your birth year or age, e.g. 1968 or 35',
    ageOrBirthYearPlaceholderMobile: 'year or age, e.g. 1968 or 35',
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
    notableBirthLine: '{name} is born in {year}. {age} years later, that is your birth year.',
    storyLabel: 'scene',
    storyWaiting: 'One moment — the scene is loading…',
    continue: 'continue',
    restart: 'start again',
    disclaimer: 'plausible scenes, not a historical archive.',
    inputError: 'enter either your age or your birth year.',
    yearError: 'invalid input. check your values.',
    locationError: 'enter a valid location or country code (FR, US, BR...).',
    adLabel: '',
    adText: '',
    adBreakHint: 'the site stays free thanks to sponsors',
    adSponsored: 'Presented by avantmoi.com',
    legalLine: '©avantmoi.com — Playful experience with no academic claim. No personal data is collected.',
    legalLink: 'Legal Notice',
    sharePrompt: 'Send this year to a friend',
    shareAction: 'Share my mirror year',
    shareTitle: 'AvantMoi — your mirror year',
    shareTextTemplate:
      "I explored my mirror year on AvantMoi ({year}) — short scenes inspired by real history. Try yours.",
    shareCopied: 'Link copied to clipboard.',
    shareFailed: 'sharing is unavailable on this device.',
    historicalInspired: 'inspired by a real event',
    historicalSource: 'source',
    historicalMoreSources: '+ {count} more sources',
    storyUnavailable: 'This scene could not be created for now.',
    storyExhausted: 'You’ve seen all the scenes for this year.',
    storyRetry: 'Retry',
    ageConvertedHint: 'Born in {year}? Correct if needed.',
    yearCountdownPhaseBirth: 'toward your birth year',
    yearCountdownPhaseMirror: 'toward your mirror year',
    birthCountryLabel: 'Country for scenes (birth / anchor)'
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
