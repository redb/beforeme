import type { CandidateCore, CandidateWithSources, CandidateSource } from "./types";
import { findSeedOverride } from "./seedOverrides";

const AUTHORITY_DOMAINS = [
  "legifrance.gouv.fr",
  "conseil-constitutionnel.fr",
  "service-public.fr",
  "info.gouv.fr",
  "vie-publique.fr",
  "assemblee-nationale.fr",
  "senat.fr",
  "gouvernement.fr",
  "securite-routiere.gouv.fr"
];

function hostFromUrl(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return "";
  }
}

function isAuthorityUrl(url: string): boolean {
  const host = hostFromUrl(url);
  return AUTHORITY_DOMAINS.some((domain) => host === domain || host.endsWith(`.${domain}`));
}

function dedupeSources(items: CandidateSource[]): CandidateSource[] {
  const seen = new Set<string>();
  const out: CandidateSource[] = [];
  for (const item of items) {
    const key = item.url.trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

export function enrichSources(items: CandidateCore[]): CandidateWithSources[] {
  return items.map((item) => {
    const override = findSeedOverride({ title: item.title, wikipediaUrl: item.wikipediaUrl });
    const sources: CandidateSource[] = [
      {
        label: "Wikipedia",
        url: item.wikipediaUrl,
        authority: isAuthorityUrl(item.wikipediaUrl)
      },
      {
        label: "Wikidata",
        url: `https://www.wikidata.org/wiki/${item.qid}`,
        authority: false
      }
    ];

    for (const extra of override?.extraSources || []) {
      sources.push({
        label: extra.label,
        url: extra.url,
        authority: extra.authority === true || isAuthorityUrl(extra.url)
      });
    }

    const normalized = dedupeSources(sources);
    const flags: string[] = [];
    if (normalized.some((source) => source.authority)) {
      flags.push("has_authority_source");
    }
    if (normalized.length >= 2) {
      flags.push("has_multiple_sources");
    }

    return {
      ...item,
      sources: normalized,
      sourceFlags: flags
    };
  });
}
