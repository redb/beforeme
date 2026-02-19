import type { Lang } from './i18n';

export type CountryCode = 'FR' | 'US' | 'BR' | 'MG' | 'DE' | 'ES' | 'IT' | 'GB' | 'CA';

const COUNTRY_CODES: CountryCode[] = ['FR', 'US', 'BR', 'MG', 'DE', 'ES', 'IT', 'GB', 'CA'];

const COUNTRY_LABELS: Record<Lang, Record<CountryCode, string>> = {
  fr: {
    FR: 'France',
    US: 'Etats-Unis',
    BR: 'Bresil',
    MG: 'Madagascar',
    DE: 'Allemagne',
    ES: 'Espagne',
    IT: 'Italie',
    GB: 'Royaume-Uni',
    CA: 'Canada'
  },
  en: {
    FR: 'France',
    US: 'United States',
    BR: 'Brazil',
    MG: 'Madagascar',
    DE: 'Germany',
    ES: 'Spain',
    IT: 'Italy',
    GB: 'United Kingdom',
    CA: 'Canada'
  }
};

const TIMEZONE_TO_COUNTRY: Array<{ prefix: string; code: CountryCode }> = [
  { prefix: 'Europe/Paris', code: 'FR' },
  { prefix: 'Europe/Berlin', code: 'DE' },
  { prefix: 'Europe/Madrid', code: 'ES' },
  { prefix: 'Europe/Rome', code: 'IT' },
  { prefix: 'Europe/London', code: 'GB' },
  { prefix: 'Indian/Antananarivo', code: 'MG' },
  { prefix: 'America/Sao_Paulo', code: 'BR' },
  { prefix: 'America/Toronto', code: 'CA' },
  { prefix: 'America/Montreal', code: 'CA' },
  { prefix: 'America/Vancouver', code: 'CA' },
  { prefix: 'America/Halifax', code: 'CA' },
  { prefix: 'America/Winnipeg', code: 'CA' },
  { prefix: 'America/Edmonton', code: 'CA' },
  { prefix: 'America/New_York', code: 'US' },
  { prefix: 'America/Chicago', code: 'US' },
  { prefix: 'America/Denver', code: 'US' },
  { prefix: 'America/Los_Angeles', code: 'US' },
  { prefix: 'America/Phoenix', code: 'US' },
  { prefix: 'America/Anchorage', code: 'US' },
  { prefix: 'Pacific/Honolulu', code: 'US' }
];

const COUNTRY_BOUNDS: Record<CountryCode, { minLat: number; maxLat: number; minLon: number; maxLon: number }> = {
  FR: { minLat: 41.0, maxLat: 51.8, minLon: -5.8, maxLon: 9.8 },
  US: { minLat: 24.0, maxLat: 49.8, minLon: -125.0, maxLon: -66.0 },
  BR: { minLat: -34.0, maxLat: 5.6, minLon: -74.0, maxLon: -34.0 },
  MG: { minLat: -26.2, maxLat: -11.8, minLon: 43.0, maxLon: 51.6 },
  DE: { minLat: 47.2, maxLat: 55.2, minLon: 5.8, maxLon: 15.2 },
  ES: { minLat: 35.6, maxLat: 44.1, minLon: -10.0, maxLon: 4.5 },
  IT: { minLat: 36.4, maxLat: 47.5, minLon: 6.0, maxLon: 18.8 },
  GB: { minLat: 49.9, maxLat: 59.1, minLon: -8.7, maxLon: 2.2 },
  CA: { minLat: 41.5, maxLat: 84.0, minLon: -141.0, maxLon: -52.0 }
};

export function detectLanguage(): Lang {
  const language = navigator.language.toLowerCase();
  return language.startsWith('fr') ? 'fr' : 'en';
}

function detectCountryFromTimeZone(): CountryCode | null {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  if (!timeZone) return null;

  const match = TIMEZONE_TO_COUNTRY.find((entry) => timeZone.startsWith(entry.prefix));
  return match?.code ?? null;
}

export function detectCountry(): CountryCode {
  const fromTimeZone = detectCountryFromTimeZone();
  if (fromTimeZone) {
    return fromTimeZone;
  }

  const candidates = [
    navigator.language,
    ...(navigator.languages || []),
    Intl.DateTimeFormat().resolvedOptions().locale
  ].filter(Boolean) as string[];

  for (const value of candidates) {
    const match = value.toUpperCase().match(/[-_]([A-Z]{2})\b/);
    if (!match) continue;
    const region = match[1] as CountryCode;
    if (COUNTRY_CODES.includes(region)) {
      return region;
    }
  }

  return 'FR';
}

function findCountryFromCoordinates(latitude: number, longitude: number): CountryCode | null {
  const entries = Object.entries(COUNTRY_BOUNDS) as Array<[CountryCode, { minLat: number; maxLat: number; minLon: number; maxLon: number }]>;

  for (const [code, bounds] of entries) {
    const insideLatitude = latitude >= bounds.minLat && latitude <= bounds.maxLat;
    const insideLongitude = longitude >= bounds.minLon && longitude <= bounds.maxLon;

    if (insideLatitude && insideLongitude) {
      return code;
    }
  }

  return null;
}

export function detectCountryFromGeolocation(): Promise<CountryCode | null> {
  if (!navigator.geolocation) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve(findCountryFromCoordinates(latitude, longitude));
      },
      () => resolve(null),
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  });
}

export function normalizeCountry(value: string | null | undefined): CountryCode {
  if (!value) return 'FR';
  const upper = value.toUpperCase() as CountryCode;
  return COUNTRY_CODES.includes(upper) ? upper : 'FR';
}

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function parseCountryInput(value: string, lang: Lang): CountryCode | null {
  const raw = value.trim();
  if (!raw) return null;

  const upper = raw.toUpperCase();
  if (/^[A-Z]{2}$/.test(upper) && COUNTRY_CODES.includes(upper as CountryCode)) {
    return upper as CountryCode;
  }

  const chunks = upper.split(/[^A-Z]+/).filter(Boolean);
  for (const chunk of chunks) {
    if (chunk.length === 2 && COUNTRY_CODES.includes(chunk as CountryCode)) {
      return chunk as CountryCode;
    }
  }

  const normalized = normalizeText(raw);
  for (const code of COUNTRY_CODES) {
    if (normalizeText(COUNTRY_LABELS[lang][code]) === normalized) {
      return code;
    }
  }

  return null;
}

export function countryLabel(lang: Lang, code: CountryCode): string {
  return COUNTRY_LABELS[lang][code];
}

export function countryOptions(lang: Lang): Array<{ value: CountryCode; label: string }> {
  return COUNTRY_CODES.map((code) => ({ value: code, label: COUNTRY_LABELS[lang][code] }));
}
