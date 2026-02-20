import './style.css';
import { renderAdBreak } from './components/AdBreak';
import { VideoBackground } from './components/VideoBackground';
import { ReadingShade } from './components/ReadingShade';
import { fetchAnecdoteSlot, type AnecdoteScope, type AnecdoteSlot } from './lib/anecdoteApi';
import { t, type Lang } from './lib/i18n';
import {
  countryLabel,
  detectCountry,
  detectCountryFromGeolocation,
  detectLanguage,
  normalizeCountry,
  parseCountryInput,
  type CountryCode
} from './lib/locale';

const app = (() => {
  const node = document.querySelector<HTMLDivElement>('#app');
  if (!node) {
    throw new Error('App container not found');
  }
  return node;
})();

const CURRENT_YEAR = Math.floor(new Date().getFullYear());
const APP_VERSION = `V${__APP_VERSION__.split('.').slice(0, 2).join('.')}`;

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
const prefetchedFirstSlots = new Map<string, AnecdoteSlot>();
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

function parseYearParam(raw: string | null): number | null {
  if (!raw) return null;
  const year = Number(raw);
  return Number.isInteger(year) ? year : null;
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

function ensureAdConfigLoaded() {
  if (adConfigLoaded || adConfigLoading) {
    return;
  }

  adConfigLoading = true;

  const paths = ['/api/ad-config', '/.netlify/functions/ad-config'];

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
      adConfigLoading = false;
      render();
    });
}

function readRoute() {
  const params = new URLSearchParams(window.location.search);
  const lang = detectLanguage();
  const autoCountry = detectCountry();

  const country = normalizeCountry(params.get('country') ?? autoCountry);
  const year = parseYearParam(params.get('year'));

  return { lang, country, year };
}

function updateUrl(params: { year?: number; country: CountryCode }) {
  const query = new URLSearchParams();
  query.set('country', params.country);

  if (typeof params.year === 'number') {
    query.set('year', String(params.year));
  }

  const next = `${window.location.pathname}?${query.toString()}`;
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
    isTransitioning: false,
    pendingReveal: false
  };
}

function prefetchFirstSlot(mirrorYear: number, lang: Lang, country: CountryCode) {
  const key = createSessionKey(mirrorYear, lang, country);
  if (prefetchedFirstSlots.has(key)) {
    return;
  }

  fetchAnecdoteSlot({
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
    });
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

function loadSlot(target: StorySession, slot: number) {
  if (target.slotCache.has(slot) || target.loadingSlots.has(slot)) {
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
      }

      target.loadingSlots.delete(slot);
      renderResult(target.mirrorYear, target.lang, target.country);
    })
    .catch(() => {
      if (!session || session.key !== target.key) {
        return;
      }

      target.loadingSlots.delete(slot);
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

  renderHome(route.lang, route.country);
}

function renderHome(lang: Lang, country: CountryCode) {
  setViewMode('home');
  videoBackground.setHomeState();
  readingShade.setImmediate(0.65);
  const locationLabel = t(lang, 'locationLabel').trim();
  const isCompactMobile = window.matchMedia('(max-width: 760px)').matches;
  const agePlaceholder = isCompactMobile ? t(lang, 'ageOrBirthYearPlaceholderMobile') : t(lang, 'ageOrBirthYearPlaceholder');
  const locationPlaceholder = isCompactMobile ? t(lang, 'locationPlaceholderMobile') : t(lang, 'locationPlaceholder');

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
                inputmode="numeric"
                pattern="[0-9]*"
                placeholder="${escapeHtml(agePlaceholder)}"
              />
            </label>
          </div>

          <div class="location-row">
            <label class="field">
              ${locationLabel ? `<span>${escapeHtml(locationLabel)}</span>` : ''}
              <input
                id="location-input"
                name="location"
                type="text"
                placeholder="${escapeHtml(locationPlaceholder)}"
                value=""
              />
            </label>
            <button
              id="locate-btn"
              class="ghost locate-btn"
              type="button"
              title="${escapeHtml(t(lang, 'locateTooltip'))}"
              aria-label="${escapeHtml(t(lang, 'locateTooltip'))}"
            >${escapeHtml(t(lang, 'locateAction'))}</button>
          </div>
          <p id="locate-feedback" class="feedback"></p>

          <p id="error" class="error" aria-live="assertive"></p>
          <button class="cta" type="submit">${escapeHtml(t(lang, 'cta'))}</button>
        </form>
      </section>

      ${renderFooterAd(lang)}
      ${renderSiteFooter(lang)}
    </main>
  `;

  const form = document.querySelector<HTMLFormElement>('#launch-form');
  const ageOrBirthYearInput = document.querySelector<HTMLInputElement>('#age-or-birth-year-input');
  const locationInput = document.querySelector<HTMLInputElement>('#location-input');
  const locateButton = document.querySelector<HTMLButtonElement>('#locate-btn');
  const locateFeedback = document.querySelector<HTMLParagraphElement>('#locate-feedback');
  const errorNode = document.querySelector<HTMLParagraphElement>('#error');
  const submitButton = form?.querySelector<HTMLButtonElement>('button[type="submit"]');

  if (!form || !ageOrBirthYearInput || !locationInput || !locateButton || !locateFeedback || !errorNode || !submitButton) {
    return;
  }

  ageOrBirthYearInput.addEventListener('input', () => {
    ageOrBirthYearInput.value = ageOrBirthYearInput.value.replace(/[^\d]/g, '');
  });

  locateButton.addEventListener('click', async () => {
    locateFeedback.textContent = '';

    const detected = await detectCountryFromGeolocation();
    if (!detected) {
      locateFeedback.textContent = t(lang, 'locateFailed');
      return;
    }

    locationInput.value = detected;
    locateFeedback.textContent = `${t(lang, 'locateSuccess')} (${countryLabel(lang, detected)})`;
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    errorNode.textContent = '';
    locateFeedback.textContent = '';

    const selectedLang = detectLanguage();
    const selectedCountryFallback = country;
    const rawInput = ageOrBirthYearInput.value.trim();
    const locationRaw = locationInput.value.trim();

    if (!rawInput) {
      errorNode.textContent = t(selectedLang, 'inputError');
      return;
    }

    let mirrorYear: number;
    const isBirthYear = /^\d{4}$/.test(rawInput);

    if (isBirthYear) {
      const birthYear = Number(rawInput);
      if (!Number.isInteger(birthYear) || birthYear < 1900 || birthYear > CURRENT_YEAR) {
        errorNode.textContent = t(selectedLang, 'yearError');
        return;
      }

      mirrorYear = computeMirrorYearFromBirthYear(birthYear);
    } else {
      const age = Number(rawInput);
      if (!Number.isInteger(age) || age < 1 || age > 120) {
        errorNode.textContent = t(selectedLang, 'yearError');
        return;
      }

      const birthYear = CURRENT_YEAR - age;
      mirrorYear = computeMirrorYearFromBirthYear(birthYear);
    }

    if (!Number.isInteger(mirrorYear) || mirrorYear < 1 || mirrorYear > CURRENT_YEAR) {
      errorNode.textContent = t(selectedLang, 'yearError');
      return;
    }

    if (locationRaw) {
      const parsed = parseCountryInput(locationRaw, selectedLang);
      if (!parsed) {
        errorNode.textContent = t(selectedLang, 'locationError');
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = t(selectedLang, 'ctaLoading');
      prefetchFirstSlot(mirrorYear, selectedLang, parsed);
      startTransition(() => {
        session = null;
        revealOnNextResult = true;
        updateUrl({ year: mirrorYear, country: parsed });
        render();
      });
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = t(selectedLang, 'ctaLoading');
    prefetchFirstSlot(mirrorYear, selectedLang, selectedCountryFallback);
    startTransition(() => {
      session = null;
      revealOnNextResult = true;
      updateUrl({ year: mirrorYear, country: selectedCountryFallback });
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
  setViewMode('result');
  const storySession = ensureSession(mirrorYear, lang, country);
  const ageBeforeBirth = computeAgeBeforeBirth(mirrorYear);
  const yearLine = t(lang, 'resultYearLine').replace('{year}', String(mirrorYear));
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
      updateUrl({ country });
      session = null;
      render();
    });

    return;
  }

  loadSlot(storySession, storySession.currentSlot);

  const slotData = storySession.slotCache.get(storySession.currentSlot) ?? null;
  const canShare = storySession.currentSlot >= 3;

  app.innerHTML = `
    <main class="shell">
      <section class="card result-head">
        <p class="kicker">${escapeHtml(t(lang, 'resultTitle'))}</p>
        <h1 class="year-display">${escapeHtml(yearLine)}</h1>
        <p class="year-subline">${escapeHtml(beforeBirthLine)}</p>
      </section>

      <section class="card story-card">
        <p class="story-label">${escapeHtml(t(lang, 'storyLabel'))} ${storySession.currentSlot}</p>
        <p class="story-text">${escapeHtml(slotData?.narrative ?? '...')}</p>

        ${
          slotData
            ? `<div class="historical-note">
                 <p class="historical-kicker">${escapeHtml(t(lang, 'historicalInspired'))}</p>
                 <p class="historical-summary">${escapeHtml(slotData.fact)}</p>
                 <a class="historical-link" href="${escapeHtml(slotData.url)}" target="_blank" rel="noopener noreferrer">
                   ${escapeHtml(t(lang, 'historicalSource'))}
                 </a>
               </div>`
            : ''
        }

        ${
          canShare
            ? `<div class="share-call">
                 <p>${escapeHtml(t(lang, 'sharePrompt'))}</p>
                 <button id="share-btn" class="ghost" type="button">${escapeHtml(t(lang, 'shareAction'))}</button>
                 <p class="feedback" id="share-feedback">${escapeHtml(storySession.shareFeedback)}</p>
               </div>`
            : ''
        }
      </section>

      <section class="result-actions-plain">
        <div class="buttons">
          <button id="restart" class="cta" type="button">${escapeHtml(t(lang, 'restart'))}</button>
          <button id="continue" class="ghost" type="button">${escapeHtml(t(lang, 'continue'))}</button>
        </div>
      </section>

      ${renderFooterAd(lang)}
      ${renderSiteFooter(lang)}
    </main>
  `;

  const continueButton = document.querySelector<HTMLButtonElement>('#continue');
  const restartButton = document.querySelector<HTMLButtonElement>('#restart');
  const shareButton = document.querySelector<HTMLButtonElement>('#share-btn');

  continueButton?.addEventListener('click', () => {
    nextAnecdote(storySession);
  });

  restartButton?.addEventListener('click', () => {
    updateUrl({ country });
    session = null;
    render();
  });

  shareButton?.addEventListener('click', async () => {
    const shareText = t(lang, 'shareTextTemplate').replace('{year}', String(storySession.mirrorYear));

    if (navigator.share) {
      try {
        await navigator.share({
          text: shareText,
          url: window.location.href
        });
        return;
      } catch {
        // Fall back to clipboard when native sharing is cancelled or unavailable.
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
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

  let content = `<p class="ad-main"><a class="ad-brand-link" href="https://morgao.com" target="_blank" rel="noopener noreferrer">${escapeHtml(config.label || fallbackLabel)}</a></p>`;

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
        <a href="https://avantmoi.com" target="_blank" rel="noopener noreferrer">©avantmoi.com ${APP_VERSION}</a>
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

render();
