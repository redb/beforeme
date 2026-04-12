/**
 * shareSignal — stockage et lecture des compteurs de partage par entrée éditoriale.
 *
 * Clé R2 : share-signal/v1/{countryQid}/{year}/{entryId}.json
 * Payload : { entryId, shareCount, lastSharedAt }
 *
 * Usage :
 *   await incrementShareSignal(env, "Q142", 1968, "fr-1968-retirer-au-distributeur")
 *   const bonus = await buildShareBonusMap(env, "Q142", 1968)
 *   // bonus.get("fr-1968-retirer-au-distributeur") === 14 (log2 du shareCount)
 */

type R2BucketLike = {
  get(key: string): Promise<{ json(): Promise<unknown> } | null>;
  put(key: string, value: string, options?: { httpMetadata?: Record<string, string> }): Promise<void>;
  list(options?: { prefix?: string }): Promise<{ objects: Array<{ key: string }> }>;
};

export type Env = {
  R2?: R2BucketLike;
};

type ShareRecord = {
  entryId: string;
  shareCount: number;
  lastSharedAt: string;
};

function r2Key(countryQid: string, year: number, entryId: string): string {
  return `share-signal/v1/${countryQid}/${year}/${entryId}.json`;
}

function r2Prefix(countryQid: string, year: number): string {
  return `share-signal/v1/${countryQid}/${year}/`;
}

function parseRecord(raw: unknown): ShareRecord | null {
  const obj = raw as Record<string, unknown> | null;
  if (!obj || typeof obj.entryId !== "string" || typeof obj.shareCount !== "number") return null;
  return {
    entryId: obj.entryId,
    shareCount: Math.max(0, Math.round(obj.shareCount)),
    lastSharedAt: typeof obj.lastSharedAt === "string" ? obj.lastSharedAt : new Date().toISOString()
  };
}

/**
 * Incrémente le compteur de partage d'une entrée.
 * Fire-and-forget depuis les endpoints — jamais sur le chemin critique de la réponse.
 */
export async function incrementShareSignal(
  env: Env,
  countryQid: string,
  year: number,
  entryId: string
): Promise<void> {
  if (!env.R2 || !entryId) return;
  const key = r2Key(countryQid, year, entryId);
  let current: ShareRecord = { entryId, shareCount: 0, lastSharedAt: new Date().toISOString() };
  try {
    const obj = await env.R2.get(key);
    if (obj) {
      const parsed = parseRecord(await obj.json());
      if (parsed) current = parsed;
    }
  } catch {
    // lecture échouée → on repart de 0
  }
  const updated: ShareRecord = {
    entryId,
    shareCount: current.shareCount + 1,
    lastSharedAt: new Date().toISOString()
  };
  try {
    await env.R2.put(key, JSON.stringify(updated), {
      httpMetadata: { contentType: "application/json; charset=utf-8" }
    });
  } catch {
    // écriture échouée → silencieux, non-bloquant
  }
}

/**
 * Construit une map entryId → bonus de score basé sur les partages.
 * Bonus = floor(log2(shareCount + 1)) × 3, plafonné à 30.
 * Exemple : 1 partage → 3, 3 → 6, 7 → 9, 15 → 12, …, 1023 → 30.
 *
 * Lecture groupée via list() pour une année donnée — une seule passe R2.
 * Timeout soft : si R2 ne répond pas en 800ms, retourne une map vide.
 */
export async function buildShareBonusMap(
  env: Env,
  countryQid: string,
  year: number
): Promise<Map<string, number>> {
  const bonus = new Map<string, number>();
  if (!env.R2) return bonus;

  const prefix = r2Prefix(countryQid, year);

  try {
    const listed = await Promise.race([
      env.R2.list({ prefix }),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 800))
    ]);
    if (!listed) return bonus;

    const reads = listed.objects.map(async (obj) => {
      try {
        const raw = await env.R2.get!(obj.key);
        if (!raw) return;
        const record = parseRecord(await raw.json());
        if (!record || record.shareCount <= 0) return;
        const b = Math.min(30, Math.floor(Math.log2(record.shareCount + 1)) * 3);
        bonus.set(record.entryId, b);
      } catch {
        // entrée illisible → ignorée
      }
    });

    await Promise.allSettled(reads);
  } catch {
    // liste échouée → retourne map vide, la sélection fonctionne sans bonus
  }

  return bonus;
}
