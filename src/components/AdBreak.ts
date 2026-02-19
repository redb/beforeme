import { t, type Lang } from '../lib/i18n';

export function renderAdBreak(lang: Lang): string {
  return `
    <section class="card ad-break" aria-label="ad-break">
      <button id="ad-break-continue" class="cta" type="button">${t(lang, 'continue')}</button>
      <p class="ad-break-note">(${t(lang, 'adBreakHint')})</p>
      <div class="ad-break-zone" aria-label="zone pub">[zone pub]</div>
    </section>
  `;
}
