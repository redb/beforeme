import './style.css';
import { initGtm } from './gtm';
import { renderAdBreak } from './components/AdBreak';
import { VideoBackground } from './components/VideoBackground';
import { ReadingShade } from './components/ReadingShade';
import { fetchAnecdoteSlot, resetAnecdoteSessionMemory, type AnecdoteScope, type AnecdoteSlot } from './lib/anecdoteApi';
import { t, type Lang } from './lib/i18n';
import type { CountryCode } from './lib/locale';

const app = (() => {
  const node = document.querySelector<HTMLDivElement>('#app');
  if (!node) {
    throw new Error('App container not found');
  }
  return node;
})();

const CURRENT_YEAR = Math.floor(new Date().getFullYear());
const APP_VERSION = `V${__APP_VERSION__} (${__APP_BUILD_ID__})`;

const versionBadge = document.getElementById('version-badge');
if (versionBadge) {
  versionBadge.textContent = APP_VERSION;
}

const PUBLIC_LANG: Lang = 'fr';
const PUBLIC_COUNTRY: CountryCode = 'FR';
const PUBLIC_COUNTRY_LINE = 'en France';

/** noindex sur les vues resultat (?year=) — l accueil reste indexable (canonical fixe dans index.html). */
function applyRouteIndexingMeta(mode: 'home' | 'result') {
  let metaRobots = document.querySelector<HTMLMetaElement>('meta[name="robots"][data-avantmoi-route]');
  if (mode === 'result') {
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      metaRobots.setAttribute('data-avantmoi-route', '1');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', 'noindex, follow');
    return;
  }
  metaRobots?.remove();
}

interface StorySession {
  key: string;
  mirrorYear: number;
  lang: Lang;
  country: CountryCode;
  currentSlot: number;
  showAdBreak: boolean;
  pendingSlot: number | null;
  shareFeedback: string;
  slotCache: Map<number, AnecdoteSlot>;
  loadingSlots: Set<number>;
  failedSlots: Set<number>;
  isTransitioning: boolean;
  pendingReveal: boolean;
}

let session: StorySession | null = null;
interface AdConfigPayload {
  mode: 'label' | 'html' | 'image';
  label: string;
  html: string;
  imageUrl: string;
  linkUrl: string;
}

let adConfig: AdConfigPayload | null = null;
let adConfigLoading = false;
let adConfigLoaded = false;
let adConfigLoadedAt = 0;
const AD_CONFIG_REFRESH_MS = 30_000;
const prefetchedFirstSlots = new Map<string, AnecdoteSlot>();
const prefetchedFirstSlotPromises = new Map<string, Promise<void>>();
const FIRST_SCENE_PREFETCH_WAIT_MS = 1_200;
const pulseTimers: number[] = [];
let revealOnNextResult = false;
const videoBackground = new VideoBackground('.bgVideo', document.body);
const readingShade = new ReadingShade('.shadeOverlay');

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function normalizeInlineText(value: string): string {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function parseYearParam(raw: string | null): number | null {
  if (!raw) return null;
  const year = Number(raw);
  return Number.isInteger(year) ? year : null;
}

function monthIndexFromName(name: string, lang: Lang): number | null {
  const normalized = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');

  const frMonths = [
    'janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre'
  ];
  const enMonths = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];
  const table = lang === 'fr' ? frMonths : enMonths;
  const idx = table.findIndex((value) => value === normalized || value.startsWith(normalized));
  return idx >= 0 ? idx + 1 : null;
}

function isValidDateParts(year: number, month: number, day: number): boolean {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return false;
  if (year < 1900 || year > CURRENT_YEAR) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function isAgeInput(rawInput: string): boolean {
  return /^\d{1,3}$/.test(rawInput.trim());
}

function parseBirthYearInput(rawInput: string, lang: Lang): number | null {
  const trimmed = rawInput.trim();
  if (!trimmed) return null;

  if (/^\d{1,3}$/.test(trimmed)) {
    const age = Number(trimmed);
    if (!Number.isInteger(age) || age < 1 || age > 120) return null;
    return CURRENT_YEAR - age;
  }

  if (/^\d{4}$/.test(trimmed)) {
    const birthYear = Number(trimmed);
    if (!Number.isInteger(birthYear) || birthYear < 1900 || birthYear > CURRENT_YEAR) return null;
    return birthYear;
  }

  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const year = Number(isoMatch[1]);
    const month = Number(isoMatch[2]);
    const day = Number(isoMatch[3]);
    return isValidDateParts(year, month, day) ? year : null;
  }

  const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    const a = Number(slashMatch[1]);
    const b = Number(slashMatch[2]);
    const year = Number(slashMatch[3]);
    const day = lang === 'fr' ? a : b;
    const month = lang === 'fr' ? b : a;
    return isValidDateParts(year, month, day) ? year : null;
  }

  const frTextDate = trimmed.match(/^(\d{1,2})\s+([A-Za-zÀ-ÿ]+)\s+(\d{4})$/);
  if (frTextDate && lang === 'fr') {
    const day = Number(frTextDate[1]);
    const month = monthIndexFromName(frTextDate[2], 'fr');
    const year = Number(frTextDate[3]);
    return month && isValidDateParts(year, month, day) ? year : null;
  }

  const enTextDate = trimmed.match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/);
  if (enTextDate && lang !== 'fr') {
    const month = monthIndexFromName(enTextDate[1], 'en');
    const day = Number(enTextDate[2]);
    const year = Number(enTextDate[3]);
    return month && isValidDateParts(year, month, day) ? year : null;
  }

  return null;
}

function clearPulseState() {
  for (const timer of pulseTimers.splice(0)) {
    window.clearTimeout(timer);
  }

  document.body.classList.remove('warpPulse');
}

function getMotionProfile() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return {
    reducedMotion,
    pulsePeak: reducedMotion ? 1.12 : 1.3,
    pulseUpMs: reducedMotion ? 80 : 150,
    pulseTotalMs: reducedMotion ? 300 : 650,
    hideMs: reducedMotion ? 80 : 120,
    revealMs: reducedMotion ? 200 : 250,
    shadeRevealDelayMs: reducedMotion ? 30 : 120,
    shadeRevealMs: reducedMotion ? 120 : 180,
    shadeHideMs: reducedMotion ? 80 : 120
  };
}

function startTransition(onPeak: () => void) {
  const profile = getMotionProfile();
  clearPulseState();

  void videoBackground.startFromGesture();
  readingShade.fadeTo(0, profile.shadeHideMs, 'ease-in');
  document.body.style.setProperty('--pulse-max', String(profile.pulsePeak));
  document.body.style.setProperty('--pulse-duration', `${profile.pulseTotalMs}ms`);
  document.body.classList.remove('warpPulse');
  void document.body.offsetWidth;
  document.body.classList.add('warpPulse');

  pulseTimers.push(window.setTimeout(onPeak, profile.pulseUpMs));

  pulseTimers.push(
    window.setTimeout(() => {
      document.body.classList.remove('warpPulse');
    }, profile.pulseTotalMs)
  );

  return profile;
}

function showAnecdote() {
  const card = document.querySelector<HTMLElement>('.story-card');
  if (!card) {
    readingShade.setImmediate(0.65);
    videoBackground.setReadingPace();
    pulseTimers.push(
      window.setTimeout(() => {
        videoBackground.setHomeState();
      }, 160)
    );
    return;
  }

  const profile = getMotionProfile();
  card.classList.add('is-entering');

  requestAnimationFrame(() => {
    card.classList.add('is-visible');
  });

  pulseTimers.push(
    window.setTimeout(() => {
      readingShade.fadeTo(0.65, profile.shadeRevealMs, 'ease-out');
      videoBackground.setReadingPace();
      const settleMs = Math.max(profile.revealMs, profile.shadeRevealMs) + 40;
      pulseTimers.push(
        window.setTimeout(() => {
          videoBackground.setHomeState();
        }, settleMs)
      );
    }, profile.shadeRevealDelayMs)
  );

  const cleanupMs = profile.reducedMotion ? 220 : 280;
  pulseTimers.push(
    window.setTimeout(() => {
      card.classList.remove('is-entering', 'is-visible');
    }, cleanupMs)
  );
}

function setViewMode(mode: 'home' | 'result') {
  document.body.classList.toggle('view-home', mode === 'home');
  document.body.classList.toggle('view-result', mode === 'result');
}

function normalizeAdConfig(value: unknown): AdConfigPayload {
  const payload = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>;
  const mode = payload.mode === 'html' || payload.mode === 'image' ? payload.mode : 'label';
  const fallbackLabel = t('fr', 'adSponsored');
  const rawLabel = String(payload.label || '');
  const normalizedLabel = rawLabel.toLowerCase().trim();
  const hasLegacyLabel =
    normalizedLabel.includes('espace discret') || normalizedLabel.includes('encart sobre');
  const safeLabel = hasLegacyLabel || !rawLabel.trim() ? fallbackLabel : rawLabel;

  return {
    mode,
    label: safeLabel,
    html: String(payload.html || ''),
    imageUrl: String(payload.imageUrl || ''),
    linkUrl: String(payload.linkUrl || '')
  };
}

function ensureAdConfigLoaded(force = false) {
  const hasFreshConfig = adConfigLoaded && Date.now() - adConfigLoadedAt < AD_CONFIG_REFRESH_MS;
  if ((!force && hasFreshConfig) || adConfigLoading) {
    return;
  }

  adConfigLoading = true;

  const paths = ['/api/ad-config'];

  (async () => {
    for (const path of paths) {
      const response = await fetch(path);
      if (!response.ok) {
        continue;
      }
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.toLowerCase().includes('application/json')) {
        continue;
      }
      const payload = (await response.json()) as unknown;
      return normalizeAdConfig(payload);
    }
    return null;
  })()
    .then((payload) => {
      if (payload) {
        adConfig = payload;
      }
    })
    .catch(() => {
      // Keep default ad block when config API is unavailable.
    })
    .finally(() => {
      adConfigLoaded = true;
      adConfigLoadedAt = Date.now();
      adConfigLoading = false;
      render();
    });
}

function activateAdHtmlScripts(root: ParentNode = app) {
  const scriptNodes = Array.from(root.querySelectorAll<HTMLScriptElement>('.ad-html script'));

  for (const scriptNode of scriptNodes) {
    let shouldSkipInjection = false;

    if (scriptNode.src) {
      let normalizedSrc = scriptNode.src;
      try {
        normalizedSrc = new URL(scriptNode.getAttribute('src') || scriptNode.src, window.location.href).href;
      } catch {
        // Keep browser-resolved src when URL normalization fails.
      }

      const alreadyLoaded = document.querySelector<HTMLScriptElement>(`script[src="${CSS.escape(normalizedSrc)}"]`);
      if (alreadyLoaded) {
        shouldSkipInjection = true;
      }
    }

    if (shouldSkipInjection) {
      scriptNode.remove();
      continue;
    }

    const replacement = document.createElement('script');
    for (const { name, value } of Array.from(scriptNode.attributes)) {
      replacement.setAttribute(name, value);
    }
    replacement.text = scriptNode.text;
    scriptNode.replaceWith(replacement);
  }
}

function readRoute() {
  const params = new URLSearchParams(window.location.search);
  const year = parseYearParam(params.get('year'));

  return { lang: PUBLIC_LANG, country: PUBLIC_COUNTRY, year };
}

function updateUrl(params: { year?: number }) {
  const query = new URLSearchParams();

  if (typeof params.year === 'number') {
    query.set('year', String(params.year));
  }

  const nextQuery = query.toString();
  const next = nextQuery ? `${window.location.pathname}?${nextQuery}` : window.location.pathname;
  window.history.pushState({}, '', next);
}

function computeMirrorYearFromBirthYear(birthYear: number): number {
  return 2 * birthYear - CURRENT_YEAR;
}

function computeAgeBeforeBirth(mirrorYear: number): number {
  return Math.floor((CURRENT_YEAR - mirrorYear) / 2);
}

function createSessionKey(mirrorYear: number, lang: Lang, country: CountryCode): string {
  return `${mirrorYear}|${country}|${lang}`;
}

function createSession(mirrorYear: number, lang: Lang, country: CountryCode): StorySession {
  resetAnecdoteSessionMemory();
  const key = createSessionKey(mirrorYear, lang, country);

  const slotCache = new Map<number, AnecdoteSlot>();
  const prefetched = prefetchedFirstSlots.get(key);
  if (prefetched) {
    slotCache.set(1, prefetched);
    prefetchedFirstSlots.delete(key);
  }

  return {
    key,
    mirrorYear,
    lang,
    country,
    currentSlot: 1,
    showAdBreak: false,
    pendingSlot: null,
    shareFeedback: '',
    slotCache,
    loadingSlots: new Set(),
    failedSlots: new Set(),
    isTransitioning: false,
    pendingReveal: false
  };
}

function prefetchFirstSlot(mirrorYear: number, lang: Lang, country: CountryCode): Promise<void> {
  const key = createSessionKey(mirrorYear, lang, country);
  if (prefetchedFirstSlots.has(key)) {
    return Promise.resolve();
  }
  const pending = prefetchedFirstSlotPromises.get(key);
  if (pending) {
    return pending;
  }

  const task = fetchAnecdoteSlot({
    year: mirrorYear,
    lang,
    country,
    scope: 'global',
    slot: 1
  })
    .then((payload) => {
      if (payload) {
        prefetchedFirstSlots.set(key, payload);
      }
    })
    .catch(() => {
      // Keep runtime loading fallback if prefetch fails.
    })
    .finally(() => {
      prefetchedFirstSlotPromises.delete(key);
    });

  prefetchedFirstSlotPromises.set(key, task);
  return task;
}

async function waitForPrefetchOrTimeout(task: Promise<void>, timeoutMs: number) {
  await Promise.race([
    task,
    new Promise<void>((resolve) => {
      globalThis.setTimeout(resolve, timeoutMs);
    })
  ]);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

/** Durée max par phase de compte à rebours (répartie sur toutes les années affichées). */
const COUNTDOWN_MAX_PHASE_MS = 1_400;
/** Pause entre « jusqu’à la naissance » et « jusqu’à l’année miroir ». */
const COUNTDOWN_PAUSE_MS = 320;

async function animateYearRange(
  yearEl: HTMLElement,
  fromYear: number,
  toYear: number,
  maxDurationMs: number
): Promise<void> {
  if (fromYear < toYear) {
    return;
  }
  if (fromYear === toYear) {
    yearEl.textContent = String(toYear);
    return;
  }
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    yearEl.textContent = String(toYear);
    await sleep(120);
    return;
  }
  const steps = fromYear - toYear + 1;
  const stepMs = Math.min(95, Math.max(22, Math.floor(maxDurationMs / Math.max(1, steps))));
  for (let y = fromYear; y >= toYear; y--) {
    yearEl.textContent = String(y);
    if (y > toYear) {
      await sleep(stepMs);
    }
  }
}

function mountYearCountdownOverlay(): {
  root: HTMLElement;
  yearEl: HTMLElement;
  phaseEl: HTMLElement;
} {
  const root = document.createElement('div');
  root.className = 'year-countdown-overlay';
  root.setAttribute('role', 'status');
  root.setAttribute('aria-live', 'polite');
  const inner = document.createElement('div');
  inner.className = 'year-countdown-inner';
  const phaseEl = document.createElement('p');
  phaseEl.className = 'year-countdown-phase';
  const yearEl = document.createElement('div');
  yearEl.className = 'year-countdown-year';
  yearEl.textContent = String(CURRENT_YEAR);
  inner.appendChild(phaseEl);
  inner.appendChild(yearEl);
  root.appendChild(inner);
  document.body.appendChild(root);
  return { root, yearEl, phaseEl };
}

async function runMirrorLaunchCountdown(lang: Lang, birthYear: number, mirrorYear: number): Promise<void> {
  const { root, yearEl, phaseEl } = mountYearCountdownOverlay();
  document.body.classList.add('year-countdown-active', 'year-countdown-phase-birth');
  try {
    phaseEl.textContent = t(lang, 'yearCountdownPhaseBirth');
    await animateYearRange(yearEl, CURRENT_YEAR, birthYear, COUNTDOWN_MAX_PHASE_MS);
    await sleep(COUNTDOWN_PAUSE_MS);

    document.body.classList.remove('year-countdown-phase-birth');
    document.body.classList.add('year-countdown-phase-mirror');
    phaseEl.textContent = t(lang, 'yearCountdownPhaseMirror');
    if (mirrorYear < birthYear) {
      await animateYearRange(yearEl, birthYear - 1, mirrorYear, COUNTDOWN_MAX_PHASE_MS);
    } else {
      yearEl.textContent = String(mirrorYear);
      await sleep(200);
    }
  } finally {
    document.body.classList.remove('year-countdown-active', 'year-countdown-phase-birth', 'year-countdown-phase-mirror');
    root.remove();
  }
}

function ensureSession(mirrorYear: number, lang: Lang, country: CountryCode): StorySession {
  const key = createSessionKey(mirrorYear, lang, country);

  if (!session || session.key !== key) {
    session = createSession(mirrorYear, lang, country);
  }

  return session;
}

function scopeForSlot(slot: number): AnecdoteScope {
  const cycleIndex = (slot - 1) % 5;
  return cycleIndex < 3 ? 'global' : 'local';
}

function loadSlot(target: StorySession, slot: number, options: { force?: boolean } = {}) {
  if (target.slotCache.has(slot) || target.loadingSlots.has(slot)) {
    return;
  }
  if (target.failedSlots.has(slot) && !options.force) {
    return;
  }

  target.loadingSlots.add(slot);

  fetchAnecdoteSlot({
    year: target.mirrorYear,
    lang: target.lang,
    country: target.country,
    scope: scopeForSlot(slot),
    slot
  })
    .then((payload) => {
      if (!session || session.key !== target.key) {
        return;
      }

      if (payload) {
        target.slotCache.set(slot, payload);
        target.failedSlots.delete(slot);
      } else {
        target.failedSlots.add(slot);
      }

      target.loadingSlots.delete(slot);
      renderResult(target.mirrorYear, target.lang, target.country);
    })
    .catch(() => {
      if (!session || session.key !== target.key) {
        return;
      }

      target.loadingSlots.delete(slot);
      target.failedSlots.add(slot);
      renderResult(target.mirrorYear, target.lang, target.country);
    });
}

function nextAnecdote(storySession: StorySession) {
  if (storySession.isTransitioning) {
    return;
  }

  const nextSlot = storySession.currentSlot + 1;
  loadSlot(storySession, nextSlot);

  const profile = getMotionProfile();
  const card = document.querySelector<HTMLElement>('.story-card');
  if (card) {
    card.style.setProperty('--story-hide-ms', `${profile.hideMs}ms`);
    card.classList.add('is-hiding');
  }
  readingShade.fadeTo(0, profile.shadeHideMs, 'ease-in');

  storySession.isTransitioning = true;

  pulseTimers.push(
    window.setTimeout(() => {
      startTransition(() => {
        if (!session || session.key !== storySession.key) {
          return;
        }

        if ((nextSlot - 1) % 5 === 0) {
          storySession.showAdBreak = true;
          storySession.pendingSlot = nextSlot;
          storySession.pendingReveal = false;
          storySession.shareFeedback = '';
          storySession.isTransitioning = false;
          renderResult(storySession.mirrorYear, storySession.lang, storySession.country);
          return;
        }

        storySession.currentSlot = nextSlot;
        storySession.showAdBreak = false;
        storySession.pendingSlot = null;
        storySession.pendingReveal = true;
        storySession.shareFeedback = '';
        storySession.isTransitioning = false;
        loadSlot(storySession, storySession.currentSlot);
        renderResult(storySession.mirrorYear, storySession.lang, storySession.country);
      });
    }, profile.hideMs)
  );
}

function render() {
  const route = readRoute();
  document.title = t(route.lang, 'siteTitle');
  ensureAdConfigLoaded();

  if (typeof route.year === 'number') {
    const animateStory = revealOnNextResult;
    revealOnNextResult = false;
    renderResult(route.year, route.lang, route.country, { animateStory });
    return;
  }

  renderHome(route.lang);
}

function renderHome(lang: Lang) {
  setViewMode('home');
  videoBackground.setHomeState();
  readingShade.setImmediate(0.65);
  const isCompactMobile = window.matchMedia('(max-width: 760px)').matches;
  const agePlaceholder = isCompactMobile ? t(lang, 'ageOrBirthYearPlaceholderMobile') : t(lang, 'ageOrBirthYearPlaceholder');

  app.innerHTML = `
    <main class="shell">
      <section class="hero card">
        <p class="kicker">AvantMoi.com</p>
        <h1>${escapeHtml(t(lang, 'heroTitle'))}</h1>
        <p class="tagline">${escapeHtml(t(lang, 'heroTagline'))}</p>
      </section>

      <section class="card form-card">
        <form id="launch-form" novalidate>
          <div class="single-input">
            <label class="field">
              <input
                id="age-or-birth-year-input"
                name="ageOrBirthYear"
                type="text"
                inputmode="text"
                placeholder="${escapeHtml(agePlaceholder)}"
              />
            </label>
          </div>

          <p id="error" class="error" aria-live="assertive"></p>
          <button class="cta" type="submit">${escapeHtml(t(lang, 'cta'))}</button>
        </form>
      </section>

      ${renderFooterAd(lang)}
      ${renderSiteFooter(lang)}
    </main>
  `;
  activateAdHtmlScripts();

  const form = document.querySelector<HTMLFormElement>('#launch-form');
  const ageOrBirthYearInput = document.querySelector<HTMLInputElement>('#age-or-birth-year-input');
  const errorNode = document.querySelector<HTMLParagraphElement>('#error');
  const submitButton = form?.querySelector<HTMLButtonElement>('button[type="submit"]');

  if (!form || !ageOrBirthYearInput || !errorNode || !submitButton) {
    return;
  }

  ageOrBirthYearInput.addEventListener('input', () => {
    ageOrBirthYearInput.value = ageOrBirthYearInput.value.replace(/[^\dA-Za-zÀ-ÿ/\-\s,]/g, '');
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorNode.textContent = '';
    const selectedLang = PUBLIC_LANG;
    const rawInput = ageOrBirthYearInput.value.trim();

    if (!rawInput) {
      errorNode.textContent = t(selectedLang, 'inputError');
      return;
    }

    // Si l'utilisateur a entré un âge (1-3 chiffres), on convertit en année
    // et on lui demande de confirmer avant de lancer, car l'âge est ambigu
    // d'un an selon que l'anniversaire a eu lieu ou non cette année.
    if (isAgeInput(rawInput)) {
      const birthYear = parseBirthYearInput(rawInput, selectedLang);
      if (!birthYear) {
        errorNode.textContent = t(selectedLang, 'yearError');
        return;
      }
      // Remplace l'âge par l'année dans le champ et affiche le hint
      ageOrBirthYearInput.value = String(birthYear);
      errorNode.textContent = t(selectedLang, 'ageConvertedHint').replace('{year}', String(birthYear));
      errorNode.style.color = 'var(--color-accent, #a0c4ff)';
      ageOrBirthYearInput.focus();
      ageOrBirthYearInput.select();
      return;
    }

    const birthYear = parseBirthYearInput(rawInput, selectedLang);
    if (!birthYear) {
      errorNode.textContent = t(selectedLang, 'yearError');
      errorNode.style.color = '';
      return;
    }

    const mirrorYear = computeMirrorYearFromBirthYear(birthYear);

    if (!Number.isInteger(mirrorYear) || mirrorYear < 1 || mirrorYear > CURRENT_YEAR) {
      errorNode.textContent = t(selectedLang, 'yearError');
      errorNode.style.color = '';
      return;
    }

    errorNode.style.color = '';
    submitButton.disabled = true;
    submitButton.textContent = t(selectedLang, 'ctaLoading');
    const prefetchTask = prefetchFirstSlot(mirrorYear, selectedLang, PUBLIC_COUNTRY);
    await runMirrorLaunchCountdown(selectedLang, birthYear, mirrorYear);
    await waitForPrefetchOrTimeout(prefetchTask, FIRST_SCENE_PREFETCH_WAIT_MS);
    startTransition(() => {
      session = null;
      revealOnNextResult = true;
      updateUrl({ year: mirrorYear });
      render();
    });
  });
}

function renderResult(
  mirrorYear: number,
  lang: Lang,
  country: CountryCode,
  options: { animateStory?: boolean } = {}
) {
  applyRouteIndexingMeta('result');
  setViewMode('result');
  const storySession = ensureSession(mirrorYear, lang, country);
  const ageBeforeBirth = computeAgeBeforeBirth(mirrorYear);
  const yearLine = `${t(lang, 'resultYearLine').replace('{year}', String(mirrorYear))} ${PUBLIC_COUNTRY_LINE}`;
  const beforeBirthLine = t(lang, 'resultBeforeBirthLine').replace('{age}', String(ageBeforeBirth));
  document.title = yearLine;

  if (storySession.showAdBreak) {
    readingShade.setImmediate(0.65);
    app.innerHTML = `
      <main class="shell">
        <section class="card result-head">
          <p class="kicker">${escapeHtml(t(lang, 'resultTitle'))}</p>
          <h1 class="year-display">${escapeHtml(yearLine)}</h1>
          <p class="year-subline">${escapeHtml(beforeBirthLine)}</p>
        </section>

        ${renderAdBreak(lang)}

        <section class="card result-actions">
          <div class="buttons">
            <button id="restart" class="ghost" type="button">${escapeHtml(t(lang, 'restart'))}</button>
          </div>
        </section>

        ${renderFooterAd(lang)}
        ${renderSiteFooter(lang)}
      </main>
    `;
    activateAdHtmlScripts();

    const adContinue = document.querySelector<HTMLButtonElement>('#ad-break-continue');
    const restartButton = document.querySelector<HTMLButtonElement>('#restart');

    adContinue?.addEventListener('click', () => {
      if (storySession.pendingSlot === null || storySession.isTransitioning) {
        return;
      }

      const nextSlot = storySession.pendingSlot;
      loadSlot(storySession, nextSlot);
      storySession.isTransitioning = true;
      readingShade.fadeTo(0, getMotionProfile().shadeHideMs, 'ease-in');

      startTransition(() => {
        if (!session || session.key !== storySession.key) {
          return;
        }
        storySession.currentSlot = nextSlot;
        storySession.pendingSlot = null;
        storySession.showAdBreak = false;
        storySession.pendingReveal = true;
        storySession.shareFeedback = '';
        storySession.isTransitioning = false;
        loadSlot(storySession, storySession.currentSlot);
        renderResult(storySession.mirrorYear, storySession.lang, storySession.country);
      });
    });

    restartButton?.addEventListener('click', () => {
      updateUrl({});
      session = null;
      render();
    });

    return;
  }

  loadSlot(storySession, storySession.currentSlot);

  const slotData = storySession.slotCache.get(storySession.currentSlot) ?? null;
  const isLoading = storySession.loadingSlots.has(storySession.currentSlot);
  const noScene = !slotData && !isLoading;
  const canShare = storySession.currentSlot >= 3;
  /** Échec de chargement : proposer Réessayer (toute scène). */
  const showRetry = noScene && !isLoading && storySession.failedSlots.has(storySession.currentSlot);
  /**
   * Quatre scènes par parcours (slots 1–4) : après la 4e scène chargée, on ferme le cycle (message + pas de « continuer »).
   * Ne pas confondre avec un échec API sur les slots 1–3 (sinon « continuer » reste disponible vers la scène 4).
   */
  const storyRoundComplete = Boolean(slotData) && storySession.currentSlot === 4;
  const hideContinue = storyRoundComplete;

  const storyContent = slotData
    ? slotData.narrative
    : isLoading
      ? t(lang, 'storyWaiting')
      : t(lang, 'storyUnavailable');
  const sourceLabel = t(lang, 'historicalSource');
  const sourceEntries = slotData
    ? (
      slotData.sources?.length
        ? slotData.sources
        : [{ label: sourceLabel, url: slotData.url }]
    ).filter((entry) => entry.url && entry.url.trim())
    : [];
  const primarySource = sourceEntries[0] ?? null;
  const extraSourcesCount = Math.max(0, sourceEntries.length - 1);
  const extraSourcesLabel = extraSourcesCount
    ? t(lang, 'historicalMoreSources').replace('{count}', String(extraSourcesCount))
    : '';
  const storyFact =
    slotData?.fact && normalizeInlineText(slotData.fact) !== normalizeInlineText(storyContent)
      ? slotData.fact
      : '';

  app.innerHTML = `
    <main class="shell">
      <section class="card result-head">
        <p class="kicker">${escapeHtml(t(lang, 'resultTitle'))}</p>
        <h1 class="year-display">${escapeHtml(yearLine)}</h1>
        <p class="year-subline">${escapeHtml(beforeBirthLine)}</p>
      </section>

      <section class="card story-card">
        <p class="story-label">${escapeHtml(t(lang, 'storyLabel'))} ${storySession.currentSlot}</p>
        <p class="story-text">${escapeHtml(storyContent)}</p>

        ${
          showRetry
            ? `<div class="result-actions-plain" style="margin-top:0.75rem">
                 <button id="retry-scene-btn" class="ghost" type="button">${escapeHtml(t(lang, 'storyRetry'))}</button>
               </div>`
            : ''
        }

        ${
          slotData
            ? `<div class="historical-note">
                 <p class="historical-kicker">${escapeHtml(t(lang, 'historicalInspired'))}</p>
                 ${storyFact ? `<p class="historical-summary">${escapeHtml(storyFact)}</p>` : ''}
                 ${
                   primarySource
                     ? `<p class="historical-meta">
                          <a class="historical-link" href="${escapeHtml(primarySource.url)}" target="_blank" rel="noopener noreferrer">
                            ${escapeHtml(primarySource.label || sourceLabel)}
                          </a>
                          ${extraSourcesCount ? `<span class="historical-more">${escapeHtml(extraSourcesLabel)}</span>` : ''}
                        </p>`
                     : ''
                 }
               </div>`
            : ''
        }
      </section>

      <section class="result-actions-plain">
        ${
          canShare
            ? `<div class="share-call">
                 ${
                   storyRoundComplete
                     ? `<p class="share-invite">${escapeHtml(t(lang, 'sharePrompt'))}</p>`
                     : ''
                 }
                 <button id="share-btn" class="${storyRoundComplete ? 'share-btn share-btn--pulse' : 'ghost'}" type="button">${escapeHtml(t(lang, 'shareAction'))}</button>
                 <p class="feedback" id="share-feedback">${escapeHtml(storySession.shareFeedback)}</p>
               </div>`
            : ''
        }
        <div class="buttons">
          <button id="restart" class="cta" type="button">${escapeHtml(t(lang, 'restart'))}</button>
          ${
            hideContinue
              ? ''
              : `<button id="continue" class="ghost" type="button">${escapeHtml(t(lang, 'continue'))}</button>`
          }
        </div>
      </section>

      ${renderFooterAd(lang)}
      ${renderSiteFooter(lang)}
    </main>
  `;
  activateAdHtmlScripts();

  const continueButton = document.querySelector<HTMLButtonElement>('#continue');
  const restartButton = document.querySelector<HTMLButtonElement>('#restart');
  const shareButton = document.querySelector<HTMLButtonElement>('#share-btn');
  const retrySceneButton = document.querySelector<HTMLButtonElement>('#retry-scene-btn');

  retrySceneButton?.addEventListener('click', () => {
    if (!storySession.loadingSlots.has(storySession.currentSlot)) {
      storySession.failedSlots.delete(storySession.currentSlot);
      loadSlot(storySession, storySession.currentSlot, { force: true });
      renderResult(storySession.mirrorYear, storySession.lang, storySession.country);
    }
  });

  continueButton?.addEventListener('click', () => {
    nextAnecdote(storySession);
  });

  restartButton?.addEventListener('click', () => {
    if (storySession.currentSlot === 4) {
      const y = storySession.mirrorYear;
      const lang = storySession.lang;
      const country = storySession.country;
      session = createSession(y, lang, country);
      loadSlot(session, 1);
      updateUrl({ year: y });
      revealOnNextResult = true;
      renderResult(y, lang, country);
      return;
    }
    updateUrl({});
    session = null;
    render();
  });

  shareButton?.addEventListener('click', async () => {
    const shareTitle = t(lang, 'shareTitle');
    const shareText = t(lang, 'shareTextTemplate').replace('{year}', String(storySession.mirrorYear));
    const shareUrl = `${window.location.origin}/share/${storySession.mirrorYear}`;
    const slotToShare = storySession.slotCache.get(storySession.currentSlot) ?? null;
    const entryId = slotToShare?.editorialId ?? slotToShare?.eventQid ?? null;

    // Fire-and-forget — jamais bloquant, jamais affiché
    if (entryId) {
      void fetch('/api/share-signal', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          entryId,
          year: storySession.mirrorYear,
          country: 'Q142'
        })
      }).catch(() => undefined);
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl
        });
        return;
      } catch {
        // Fall back to clipboard when native sharing is cancelled or unavailable.
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareTitle}\n\n${shareText}\n\n${shareUrl}`);
      storySession.shareFeedback = t(lang, 'shareCopied');
    } catch {
      storySession.shareFeedback = t(lang, 'shareFailed');
    }

    renderResult(storySession.mirrorYear, storySession.lang, storySession.country);
  });

  const shouldAnimateStory = options.animateStory || storySession.pendingReveal;
  if (shouldAnimateStory) {
    if (slotData) {
      storySession.pendingReveal = false;
      readingShade.setImmediate(0);
      showAnecdote();
    } else {
      storySession.pendingReveal = true;
      readingShade.setImmediate(0);
    }
  } else {
    storySession.pendingReveal = false;
    readingShade.setImmediate(0.65);
  }
}

function renderFooterAd(lang: Lang) {
  const fallbackLabel = t(lang, 'adSponsored');
  const config = adConfig ?? {
    mode: 'label',
    label: fallbackLabel,
    html: '',
    imageUrl: '',
    linkUrl: ''
  };

  let content = `<p class="ad-main"><a class="ad-brand-link" href="https://avantmoi.com" target="_blank" rel="noopener noreferrer">${escapeHtml(config.label || fallbackLabel)}</a></p>`;

  if (config.mode === 'html' && config.html.trim()) {
    content = `<div class="ad-html">${config.html}</div>`;
  } else if (config.mode === 'image' && config.imageUrl.trim()) {
    const imageMarkup = `<img class="ad-image" src="${escapeHtml(config.imageUrl)}" alt="${escapeHtml(fallbackLabel)}" />`;
    content = config.linkUrl.trim()
      ? `<a class="ad-image-link" href="${escapeHtml(config.linkUrl)}" target="_blank" rel="noopener noreferrer">${imageMarkup}</a>`
      : imageMarkup;
  }

  return `
    <aside class="card ad-slot" aria-label="ad-slot">
      ${content}
    </aside>
  `;
}

function renderSiteFooter(lang: Lang) {
  return `
    <footer class="site-footer">
      <p>
        <a href="https://avantmoi.com" target="_blank" rel="noopener noreferrer">©avantmoi.com</a>
        — ${escapeHtml(t(lang, 'legalLine'))}
        <a href="/mentions-legales.html">${escapeHtml(t(lang, 'legalLink'))}</a>
      </p>
    </footer>
  `;
}

window.addEventListener('popstate', () => {
  clearPulseState();
  session = null;
  render();
});

window.addEventListener('focus', () => {
  ensureAdConfigLoaded(true);
});

initGtm();
render();
