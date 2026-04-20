/// <reference types="vite/client" />

declare const __APP_VERSION__: string;
declare const __APP_BUILD_ID__: string;

interface ImportMetaEnv {
  /** Fallback GTM si l’API `/api/gtm-config` ne renvoie pas d’ID (build uniquement). */
  readonly VITE_GTM_ID?: string;
}
