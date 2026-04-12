import { incrementShareSignal } from "../lib/shareSignal";
import type { Env as ShareEnv } from "../lib/shareSignal";

function parseCountryQid(raw: string | null): string | null {
  const value = String(raw || "Q142").trim().toUpperCase();
  if (/^Q\d+$/.test(value)) return value;
  if (value === "FR") return "Q142";
  if (value === "US") return "Q30";
  if (value === "CA") return "Q16";
  if (value === "BR") return "Q155";
  if (value === "DE") return "Q183";
  if (value === "ES") return "Q29";
  if (value === "IT") return "Q38";
  if (value === "GB" || value === "UK") return "Q145";
  return null;
}

function noStoreHeaders(): HeadersInit {
  return {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "POST,OPTIONS",
    "access-control-allow-headers": "content-type"
  };
}

export async function onRequestOptions(): Promise<Response> {
  return new Response(null, { status: 204, headers: noStoreHeaders() });
}

/**
 * POST /api/share-signal
 * Body JSON : { entryId, year, country }
 *
 * Incrémente le compteur de partage pour une entrée éditoriale.
 * Fire-and-forget côté client — jamais bloquant.
 * Répond toujours 204 pour ne pas bloquer l'UX.
 */
export async function onRequestPost(context: { request: Request; env: ShareEnv }): Promise<Response> {
  try {
    const body = await context.request.json() as Record<string, unknown>;
    const entryId = typeof body.entryId === "string" ? body.entryId.trim() : "";
    const year = Number(body.year);
    const countryQid = parseCountryQid(typeof body.country === "string" ? body.country : null);

    if (!entryId || !Number.isInteger(year) || year < 1000 || year > 2100 || !countryQid) {
      return new Response(null, { status: 204, headers: noStoreHeaders() });
    }

    // Fire-and-forget : on ne bloque pas la réponse sur l'écriture R2
    void incrementShareSignal(context.env, countryQid, year, entryId);
  } catch {
    // parsing ou écriture échoués → silencieux
  }

  return new Response(null, { status: 204, headers: noStoreHeaders() });
}
