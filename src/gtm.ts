const GTM_ATTR = 'data-avantmoi-gtm';

/**
 * Charge GTM depuis `/api/gtm-config` (admin), sinon variable de build `VITE_GTM_ID`.
 * Injection unique, après chargement du DOM (module en bas de body).
 */
export function initGtm(): void {
  void injectGtmWhenReady();
}

async function injectGtmWhenReady(): Promise<void> {
  if (document.querySelector(`script[${GTM_ATTR}]`)) {
    return;
  }

  let id = '';
  try {
    const res = await fetch('/api/gtm-config');
    if (res.ok) {
      const data = (await res.json()) as { gtmId?: string };
      id = String(data.gtmId || '').trim();
    }
  } catch {
    // hors ligne ou API indisponible
  }

  if (!id) {
    const env = import.meta.env.VITE_GTM_ID;
    id = typeof env === 'string' ? env.trim() : '';
  }

  if (!/^GTM-[A-Z0-9]+$/.test(id)) {
    return;
  }

  if (document.querySelector(`script[${GTM_ATTR}]`)) {
    return;
  }

  const w = window as Window & { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${id}`;
  script.setAttribute(GTM_ATTR, id);
  document.head.insertBefore(script, document.head.firstChild);

  const noscript = document.createElement('noscript');
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.googletagmanager.com/ns.html?id=${id}`;
  iframe.height = '0';
  iframe.width = '0';
  iframe.style.display = 'none';
  iframe.style.visibility = 'hidden';
  iframe.title = 'Google Tag Manager';
  noscript.appendChild(iframe);
  document.body.insertBefore(noscript, document.body.firstChild);
}
