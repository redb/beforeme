import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const cacheDir = path.join(root, ".tmp-france-backfill-cache");
const startYear = 1925;
const currentYear = new Date().getFullYear();
const periods = [
  { key: "1925_1949", start: 1925, end: 1949 },
  { key: "1950_1969", start: 1950, end: 1969 },
  { key: "1970_1989", start: 1970, end: 1989 },
  { key: "1990_2009", start: 1990, end: 2009 },
  { key: "2010_current", start: 2010, end: currentYear }
];

const monthMap = new Map([
  ["janvier", "01"],
  ["fevrier", "02"],
  ["février", "02"],
  ["mars", "03"],
  ["avril", "04"],
  ["mai", "05"],
  ["juin", "06"],
  ["juillet", "07"],
  ["aout", "08"],
  ["août", "08"],
  ["septembre", "09"],
  ["octobre", "10"],
  ["novembre", "11"],
  ["decembre", "12"],
  ["décembre", "12"]
]);

const monthNames = [
  "janvier",
  "fevrier",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "aout",
  "septembre",
  "octobre",
  "novembre",
  "decembre"
];

const blockedEventTerms = [
  "deces de",
  "décès de",
  "meurt",
  "meurtre",
  "assassinat",
  "fusillade",
  "attentat",
  "incendie",
  "collision",
  "tempete",
  "tempête",
  "noyade",
  "noyades",
  "rejetee",
  "rejetée",
  "motion de censure",
  "election",
  "élection",
  "ministre",
  "gouvernement",
  "condamne",
  "condamnée",
  "greve",
  "grève",
  "fusillade",
  "explosion",
  "guerre",
  "conflit",
  "militaire",
  "accident",
  "blesses",
  "blessés",
  "morts",
  "mort ",
  "assassin",
  "abattu",
  "dissolution"
];

const culturalSignals = [
  "film",
  "cinema",
  "cinéma",
  "festival",
  "chaine",
  "chaîne",
  "television",
  "télévision",
  "radio",
  "album",
  "chanson",
  "musee",
  "musée",
  "centre pompidou",
  "exposition",
  "spectacle",
  "concert",
  "ceremonie",
  "cérémonie",
  "victoires de la musique",
  "fete de la musique",
  "fête de la musique",
  "coupe du monde",
  "defile",
  "défilé",
  "bicentenaire",
  "ouverture du centre",
  "canal+",
  "la cinq",
  "m6"
];

const inventionSignals = [
  "mise en service",
  "lancement",
  "lance",
  "lancé",
  "commercialisation",
  "premier vol",
  "ouverture",
  "inauguration",
  "reseau",
  "réseau",
  "carte",
  "minitel",
  "internet",
  "adsl",
  "fibre",
  "television couleur",
  "télévision couleur",
  "dab",
  "guichet automatique",
  "telepeage",
  "télépéage",
  "gsm",
  "smartphone",
  "sans contact",
  "plateforme",
  "streaming",
  "service",
  "terminal",
  "application",
  "tgv",
  "tramway",
  "metro",
  "métro"
];

const dailySignals = [
  "loi",
  "entre en vigueur",
  "obligatoire",
  "interdit",
  "interdiction",
  "autorise",
  "autorisé",
  "autorisation",
  "ouverture",
  "lancement",
  "mise en service",
  "service",
  "carte",
  "compte",
  "ecole",
  "école",
  "travail",
  "divorce",
  "mariage",
  "pharmacie",
  "hopital",
  "hôpital",
  "impot",
  "impôt",
  "declaration",
  "déclaration",
  "television",
  "télévision",
  "telephone",
  "téléphone",
  "internet",
  "metro",
  "métro",
  "transport",
  "train",
  "guichet",
  "paiement",
  "carte vitale",
  "ceinture",
  "fumer",
  "cantine",
  "cabine",
  "portable"
];

const themeRules = [
  {
    theme: "communication",
    root: "communication",
    test: /(telephone|téléphone|mobile|sms|internet|minitel|adsl|fibre|television|télévision|radio|chaine|chaîne|cabine|fax|annuaire|messagerie)/
  },
  {
    theme: "transport",
    root: "transport",
    test: /(metro|métro|train|tgv|tramway|ticket|billet|peage|péage|navigo|carte orange|bus|station|aeroport|aéroport|telepeage|télépéage|voiture|taxi|vtc)/
  },
  {
    theme: "argent",
    root: "argent",
    test: /(banque|carte bancaire|carte bleue|paiement|cheque|chèque|virement|dab|guichet automatique|sans contact|caisse|ticket de caisse)/
  },
  {
    theme: "administration",
    root: "administration",
    test: /(impot|impôt|declaration|déclaration|prefecture|préfecture|carte d.identite|carte d'identité|formulaire|timbre fiscal|rendez-vous en ligne|dossier)/
  },
  {
    theme: "santé",
    root: "sante",
    test: /(pilule|ivg|hopital|hôpital|pharmacie|vaccin|carte vitale|tiers payant|teleconsultation|téléconsultation|medecin|médecin|contraception)/
  },
  {
    theme: "école",
    root: "ecole",
    test: /(ecole|école|college|collège|cantine|blouse|calculatrice|photocopie|notes en ligne|tableau noir|punition)/
  },
  {
    theme: "famille",
    root: "famille",
    test: /(divorce|mariage|autorite parentale|autorité parentale|compte sans autorisation maritale|union civile|filiation|prestations familiales)/
  },
  {
    theme: "travail",
    root: "travail",
    test: /(travail|teletravail|télétravail|fiche de paie|bureau|contrat|ordinateur personnel|35 heures|39 heures|samedi matin|mail professionnel)/
  },
  {
    theme: "maison",
    root: "maison",
    test: /(micro-ondes|machine a laver|machine à laver|congelateur|congélateur|chauffage|fioul|charbon|domestique|logement|televiseur|téléviseur)/
  },
  {
    theme: "tabac_alcool",
    root: "tabac_alcool",
    test: /(fumer|tabac|alcool|vin a la cantine|vin à la cantine|publicite pour l alcool|publicité pour l'alcool)/
  },
  {
    theme: "loisirs",
    root: "loisirs",
    test: /(festival|film|cinema|cinéma|concert|album|chanson|musee|musée|culture|videoclub|dvd|vhs|streaming|photo numerique|photo numérique|borne d.arcade)/
  }
];

const personThemeRules = [
  { theme: "loisirs", root: "acteur", test: /(acteur|actrice)/ },
  { theme: "loisirs", root: "chanteur", test: /(chanteur|chanteuse|musicien|musicienne|rappeur|rappeuse)/ },
  { theme: "loisirs", root: "realisateur", test: /(realisateur|réalisateur|realisatrice|réalisatrice)/ },
  { theme: "loisirs", root: "sportif", test: /(sportif|sportive|joueur|joueuse|footballeur|footballeuse|tennisman|tenniswoman|pilote)/ },
  { theme: "administration", root: "politique", test: /(president|président|premier ministre|ministre|homme politique|femme politique|depute|député|senateur|sénateur|maire|politicien)/ },
  { theme: "travail", root: "scientifique", test: /(scientifique|chercheur|chercheuse|physicien|physicienne|chimiste|mathematicien|mathématicien)/ },
  { theme: "travail", root: "ingenieur", test: /(ingenieur|ingénieur|inventeur|inventrice|entrepreneur|entrepreneuse)/ },
  { theme: "loisirs", root: "ecrivain", test: /(ecrivain|écrivain|auteur|autrice|romancier|romanciere|romancière|poete|poète)/ },
  { theme: "famille", root: "famille_royale", test: /(fils de|fille de|prince|princesse|roi|reine)/ }
];

const familyToDailyCategory = {
  transport: "transport",
  communication: "media",
  argent: "money",
  administration: "public_space",
  santé: "health",
  "école": "school",
  famille: "family",
  travail: "work",
  maison: "housing",
  loisirs: "media",
  tabac_alcool: "public_space"
};

const personOverrides = {
  2024: {
    year: 2024,
    lang: "fr",
    name: "Princess Iman bint Hussein bin Abdullah",
    birthDate: "2024-08-03",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Princess_Iman_bint_Hussein_bin_Abdullah",
    theme: "famille",
    gestureRoot: "famille_royale",
    editorialScore: 60
  },
  2026: {
    year: 2026,
    lang: "fr",
    name: "Pengiran Anak Zahra Mariam Bolkiah",
    birthDate: "2026-02-08",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Anisha_Rosnah",
    theme: "famille",
    gestureRoot: "famille_royale",
    editorialScore: 60
  }
};

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

function normalize(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(text) {
  return normalize(text)
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80);
}

function capitalize(text) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function fetchWithRetry(url, options = {}, label = "request") {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "user-agent": "BeforeMe/1.0 editorial-backfill",
          ...(options.headers || {})
        }
      });
      if (!response.ok) {
        throw new Error(`${label}:http_${response.status}`);
      }
      return response;
    } catch (error) {
      if (attempt === 2) throw error;
      await new Promise((resolve) => setTimeout(resolve, 500 + attempt * 500));
    } finally {
      clearTimeout(timeout);
    }
  }
  throw new Error(`${label}:unreachable`);
}

async function readOrFetchCache(key, producer) {
  await ensureDir(cacheDir);
  const filePath = path.join(cacheDir, `${key}.txt`);
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {}
  const value = await producer();
  await fs.writeFile(filePath, value, "utf8");
  return value;
}

async function fetchRawPage(title, lang = "fr") {
  const cacheKey = `${lang}-${slugify(title)}-raw`;
  return readOrFetchCache(cacheKey, async () => {
    const url = `https://${lang}.wikipedia.org/w/index.php?title=${encodeURIComponent(title)}&action=raw`;
    const response = await fetchWithRetry(url, {}, `raw:${title}`);
    return await response.text();
  });
}

async function fetchWikidataBirth(year) {
  const cacheKey = `wikidata-birth-${year}`;
  const raw = await readOrFetchCache(cacheKey, async () => {
    const query = `SELECT ?item ?itemLabel ?birthDate ?article ?sitelinks WHERE {
  ?item wdt:P31 wd:Q5 ;
        wdt:P569 ?birthDate .
  FILTER(YEAR(?birthDate) = ${year})
  OPTIONAL {
    ?primaryArticle schema:about ?item ;
                    schema:isPartOf <https://fr.wikipedia.org/> .
  }
  OPTIONAL {
    ?fallbackArticle schema:about ?item ;
                     schema:isPartOf <https://en.wikipedia.org/> .
  }
  BIND(COALESCE(?primaryArticle, ?fallbackArticle) AS ?article)
  FILTER(BOUND(?article))
  OPTIONAL { ?item wikibase:sitelinks ?sitelinks . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }
}
ORDER BY DESC(COALESCE(?sitelinks, 0))
LIMIT 10`;
    const response = await fetchWithRetry("https://query.wikidata.org/sparql", {
      method: "POST",
      headers: {
        accept: "application/sparql-results+json",
        "content-type": "application/sparql-query; charset=utf-8"
      },
      body: query
    }, `wdqs:${year}`);
    return JSON.stringify(await response.json());
  }).catch(() => "{}");

  try {
    const payload = JSON.parse(raw);
    const rows = Array.isArray(payload?.results?.bindings) ? payload.results.bindings : [];
    const first = rows[0];
    if (!first) return null;
    return {
      name: String(first.itemLabel?.value || "").trim(),
      birthDate: String(first.birthDate?.value || "").trim().slice(0, 10),
      wikipediaUrl: String(first.article?.value || "").trim(),
      qid: String(first.item?.value || "").match(/Q\d+$/)?.[0] || "",
      description: ""
    };
  } catch {
    return null;
  }
}

function stripRefs(text) {
  return String(text || "")
    .replace(/<ref[^>]*>[\s\S]*?<\/ref>/gi, "")
    .replace(/<ref[^>]*\/>/gi, "")
    .replace(/<!--([\s\S]*?)-->/g, "")
    .replace(/{{Références[^}]*}}/gi, "");
}

function replaceInternalLinks(text) {
  return String(text || "").replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2").replace(/\[\[([^\]]+)\]\]/g, "$1");
}

function stripTemplates(text) {
  let value = String(text || "");
  value = value.replace(/{{date\|([^}|]+)(?:\|([^}|]+))?(?:\|([^}|]+))?(?:\|([^}|]+))?}}/gi, (_, a = "", b = "", c = "", d = "") => {
    return [a, b, c, d].filter(Boolean).join(" ");
  });
  value = value.replace(/{{1er\|([^}|]+)}}/gi, "1 $1");
  value = value.replace(/{{([^{}]|{[^{}]*})*}}/g, " ");
  return value;
}

function cleanWikiText(text) {
  return stripTemplates(replaceInternalLinks(stripRefs(text)))
    .replace(/\[http[^\s\]]+(?:\s+([^\]]+))?\]/g, (_, label = "") => label || "")
    .replace(/'''+/g, "")
    .replace(/''+/g, "")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();
}

function extractLinks(text) {
  const links = [];
  const body = String(text || "");
  const pattern = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
  for (const match of body.matchAll(pattern)) {
    const title = String(match[1] || "").trim();
    const label = String(match[2] || match[1] || "").trim();
    if (!title || /^\d+$/.test(title)) continue;
    links.push({ title, label });
  }
  return links;
}

function splitLines(raw) {
  return String(raw || "").split(/\r?\n/);
}

function parseFrenchDate(year, sectionMonth, text) {
  const normalized = normalize(text);
  const month = sectionMonth || monthNames.find((name) => normalized.includes(name)) || null;
  if (!month) return { iso: String(year), precision: "year" };
  const dayMatch = normalized.match(/\b(\d{1,2})\b/);
  const monthIndex = monthMap.get(month);
  if (!dayMatch || !monthIndex) return { iso: `${year}-${monthIndex || "01"}`, precision: "month" };
  return { iso: `${year}-${monthIndex}-${String(dayMatch[1]).padStart(2, "0")}`, precision: "day" };
}

function extractEventBody(rawLine) {
  const line = String(rawLine || "").replace(/^\*+\s*/, "");
  const colonIndex = line.indexOf(":");
  if (colonIndex >= 0) return line.slice(colonIndex + 1).trim();
  return line.trim();
}

function parseYearEvents(year, raw) {
  const lines = splitLines(raw);
  const events = [];
  let inEvents = false;
  let currentMonth = null;

  for (const line of lines) {
    const normalizedLine = normalize(cleanWikiText(line));
    if (normalizedLine === "== evenements ==" || normalizedLine === "== evenements marquants ==") {
      inEvents = true;
      continue;
    }
    if (inEvents && normalizedLine === "== chronologie ==") {
      continue;
    }
    if (inEvents && /^==[^=]/.test(line)) {
      break;
    }
    if (!inEvents) continue;

    const monthHeader = line.match(/^===\s*(.+?)\s*===/);
    if (monthHeader) {
      currentMonth = normalize(cleanWikiText(monthHeader[1]))
        .replace(/^\[|\]$/g, "")
        .split(" ")[0];
      continue;
    }

    if (!/^\*/.test(line)) continue;
    const body = extractEventBody(line);
    const text = cleanWikiText(body);
    if (!text) continue;
    const links = extractLinks(body).filter((entry) => !/^\d/.test(entry.title) && !monthMap.has(normalize(entry.label)));
    const date = parseFrenchDate(year, currentMonth, line);
    events.push({
      year,
      month: currentMonth,
      raw: line,
      text,
      normalized: normalize(text),
      date,
      links
    });
  }

  if (events.length) return events;

  let pageMonth = null;
  let blockedSection = false;
  for (const line of lines) {
    const normalizedLine = normalize(cleanWikiText(line));
    if (/^==[^=]/.test(line)) {
      blockedSection =
        normalizedLine.includes("notes et references") ||
        normalizedLine.includes("voir aussi") ||
        normalizedLine.includes("naissance") ||
        normalizedLine.includes("deces") ||
        normalizedLine.includes("necrologie");
      continue;
    }
    if (blockedSection) continue;

    const monthHeader = line.match(/^===\s*(.+?)\s*===/);
    if (monthHeader) {
      pageMonth = normalize(cleanWikiText(monthHeader[1]))
        .replace(/^\[|\]$/g, "")
        .split(" ")[0];
      continue;
    }
    if (!/^\*/.test(line)) continue;
    const body = extractEventBody(line);
    const text = cleanWikiText(body);
    if (!text) continue;
    const links = extractLinks(body).filter((entry) => !/^\d/.test(entry.title) && !monthMap.has(normalize(entry.label)));
    const date = parseFrenchDate(year, pageMonth, line);
    events.push({
      year,
      month: pageMonth,
      raw: line,
      text,
      normalized: normalize(text),
      date,
      links
    });
  }

  return events;
}

function parseBirths(year, raw) {
  const lines = splitLines(raw);
  const births = [];
  let currentMonth = null;

  for (const line of lines) {
    const monthHeader = line.match(/^==\s*(.+?)\s*==/);
    if (monthHeader) {
      const cleaned = normalize(cleanWikiText(monthHeader[1])).split(" ")[0];
      currentMonth = monthMap.has(cleaned) ? cleaned : currentMonth;
      continue;
    }
    if (!/^\*/.test(line)) continue;
    const body = extractEventBody(line);
    const text = cleanWikiText(body);
    const links = extractLinks(body).filter((entry) => !/^\d/.test(entry.title));
    if (!text || !links.length) continue;
    const date = parseFrenchDate(year, currentMonth, line);
    const [firstLink] = links;
    births.push({
      year,
      raw: line,
      text,
      normalized: normalize(text),
      name: cleanWikiText(firstLink.label),
      wikipediaUrl: `https://fr.wikipedia.org/wiki/${encodeURIComponent(firstLink.title.replace(/ /g, "_"))}`,
      birthDate: date.iso.length === 7 ? `${date.iso}-01` : date.iso,
      datePrecision: date.precision,
      links
    });
  }

  return births;
}

function collectExistingYears(filePath, propertyName) {
  return fs.readFile(filePath, "utf8")
    .then((content) => {
      const set = new Set();
      const pattern = new RegExp(`${escapeRegExp(propertyName)}\\s*:\\s*(\\d{4})`, "g");
      for (const match of content.matchAll(pattern)) {
        set.add(Number(match[1]));
      }
      return set;
    })
    .catch(() => new Set());
}

async function collectYearsFromDir(dirPath, propertyName) {
  const set = new Set();
  async function walk(current) {
    let entries = [];
    try {
      entries = await fs.readdir(current, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const nextPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(nextPath);
        continue;
      }
      if (!entry.name.endsWith(".ts")) continue;
      const years = await collectExistingYears(nextPath, propertyName);
      for (const year of years) set.add(year);
    }
  }
  await walk(dirPath);
  return set;
}

function hasSignal(text, signals) {
  return signals.some((signal) => normalize(text).includes(normalize(signal)));
}

function inferTheme(text) {
  const normalized = normalize(text);
  for (const rule of themeRules) {
    if (rule.test.test(normalized)) return { theme: rule.theme, root: rule.root };
  }
  return { theme: "administration", root: "administration" };
}

function inferDailyCategory(theme) {
  return familyToDailyCategory[theme] || "public_space";
}

function inferInventionCategory(text, theme) {
  const normalized = normalize(text);
  if (/(carte bancaire|paiement|sans contact|cheque|chèque|guichet automatique|dab)/.test(normalized)) return "payment";
  if (/(train|tgv|metro|métro|tramway|bus|telepeage|télépéage|billet)/.test(normalized)) return "transport";
  if (/(television|télévision|radio|streaming|chaine|chaîne|album|film)/.test(normalized)) return "media";
  if (/(internet|minitel|gsm|adsl|fibre|mobile|telephone|téléphone|application|reseau|réseau)/.test(normalized)) return "network";
  if (theme === "maison") return "device";
  return "service";
}

function inferObjectType(text, theme) {
  const normalized = normalize(text);
  if (/(carte|badge|ticket|pass)/.test(normalized)) return "payment_tool";
  if (/(reseau|réseau|ligne|infrastructure|service|plateforme|application|site|abonnement)/.test(normalized)) return /(television|télévision|film|streaming|chaine|chaîne)/.test(normalized) ? "media" : "service";
  if (/(metro|métro|tramway|tgv|train|aeroport|aéroport|telepeage|télépéage)/.test(normalized)) return "infrastructure";
  if (theme === "maison") return "domestic_object";
  return "device";
}

function inferCulturalCategory(text) {
  const normalized = normalize(text);
  if (/(ouverture|inauguration)/.test(normalized) && /(musee|musée|centre|salle|theatre|théâtre|cinema|cinéma)/.test(normalized)) return "venue_opening";
  if (/(premiere|première|sortie|lancement|premieres emissions|premières émissions)/.test(normalized)) return "public_premiere";
  if (/(festival|fete|fête|ceremonie|cérémonie|appel|bicentenaire)/.test(normalized)) return "foundational_event";
  return "symbolic_moment";
}

function pickEventLabel(event) {
  const fromLink = event.links.find((entry) => !/^(janvier|fevrier|février|mars|avril|mai|juin|juillet|aout|août|septembre|octobre|novembre|decembre|décembre|[0-9]+)/i.test(entry.label));
  if (fromLink) return cleanWikiText(fromLink.label);
  return cleanWikiText(event.text.split(/[.;]/)[0]).slice(0, 120);
}

function candidateScore(event, family) {
  const text = event.normalized;
  if (blockedEventTerms.some((term) => text.includes(normalize(term)))) return -100;
  let score = 0;
  if (family === "daily") {
    if (hasSignal(text, dailySignals)) score += 8;
    if (/(loi|obligatoire|interdiction|autorise|autorisé|entre en vigueur)/.test(text)) score += 6;
    if (/(service|ouverture|lancement|mise en service)/.test(text)) score += 3;
  }
  if (family === "invention") {
    if (hasSignal(text, inventionSignals)) score += 8;
    if (/(lancement|mise en service|commercialisation|premier vol|ouverture)/.test(text)) score += 6;
    if (/(reseau|réseau|service|carte|terminal|application|plateforme|television|télévision|train)/.test(text)) score += 4;
  }
  if (family === "cultural") {
    if (hasSignal(text, culturalSignals)) score += 8;
    if (/(ouverture|premiere|première|sortie|festival|ceremonie|cérémonie|victoire|appel|bicentenaire)/.test(text)) score += 6;
    if (/(film|television|télévision|radio|musee|musée|concert|culture)/.test(text)) score += 4;
  }
  if (event.links.length) score += 2;
  if (event.date.precision === "day") score += 2;
  return score;
}

function pickFamilyEvent(events, family, usedKeys) {
  const ranked = events
    .map((event, index) => ({ event, index, score: candidateScore(event, family) }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score || left.index - right.index);
  const available = ranked.find((entry) => !usedKeys.has(`${entry.index}`));
  if (available) {
    usedKeys.add(`${available.index}`);
    return available.event;
  }
  return ranked[0]?.event || null;
}

function fallbackEvent(events) {
  return events.find((event) => !blockedEventTerms.some((term) => event.normalized.includes(normalize(term)))) || events[0] || null;
}

function buildSourceList(event, year, family) {
  const sources = [];
  const firstLink = event.links.find((entry) => entry.title);
  if (firstLink) {
    sources.push({
      label: "Wikipedia",
      url: `https://fr.wikipedia.org/wiki/${encodeURIComponent(firstLink.title.replace(/ /g, "_"))}`,
      authority: false
    });
  }
  const rawPageTitle = family === "person" ? `Naissance_en_${year}` : `${year}_en_France`;
  sources.push({
    label: "Wikipedia",
    url: `https://fr.wikipedia.org/wiki/${encodeURIComponent(rawPageTitle)}`,
    authority: false
  });
  return sources.slice(0, 2);
}

function buildDailyEntry(year, event) {
  const { theme, root } = inferTheme(event.text);
  const label = pickEventLabel(event);
  const normalizedLabel = cleanWikiText(label).replace(/^la\s+/i, "");
  return {
    id: `fr-backfill-daily-${year}-${slugify(normalizedLabel) || "scene"}`,
    countryQid: "Q142",
    lang: "fr",
    gestureKey: `vivre-${slugify(normalizedLabel) || `annee-${year}`}`,
    gestureLabel: `integrer ${normalizedLabel.toLowerCase()} dans le quotidien`,
    theme,
    gestureRoot: root,
    editorialScore: 56,
    category: inferDailyCategory(theme),
    direction: "impossible_to_possible",
    ruptureDate: event.date.iso,
    ruptureYear: year,
    datePrecision: event.date.precision,
    placeName: "France",
    placeType: "country",
    placeQid: "Q142",
    triggerLabel: label,
    triggerType: /(loi|vote|ordonnance|decret|décret)/i.test(event.text) ? "law" : /(ouverture|inauguration)/i.test(event.text) ? "opening" : /(mise en service|service)/i.test(event.text) ? "service_start" : "public_rollout",
    beforeState: `Avant ${year}, ${normalizedLabel.toLowerCase()} ne structure pas encore ce geste du quotidien a cette echelle.`,
    afterState: `En ${year}, ${normalizedLabel.toLowerCase()} entre dans les usages visibles et change la facon de faire.`,
    gestureChanged: `Tu peux desormais t'ajuster a ${normalizedLabel.toLowerCase()} dans un geste concret du quotidien.`,
    materialAnchor: `Un geste ordinaire, un objet visible et un usage qui bascule en ${year}`,
    sceneText: `${event.date.iso}, en France. ${capitalize(normalizedLabel)} se voit dans les gestes ordinaires au lieu de rester une annonce lointaine. Le quotidien prend un pli nouveau, concret et visible.`,
    fact: cleanWikiText(event.text).slice(0, 240),
    sources: buildSourceList(event, year, "daily"),
    tags: Array.from(new Set([theme, root, slugify(normalizedLabel)].filter(Boolean))),
    quality: {
      strictPlace: false,
      strictDate: event.date.precision === "day",
      dailyLife: true,
      sourceCount: buildSourceList(event, year, "daily").length
    }
  };
}

function buildInventionEntry(year, event) {
  const { theme, root } = inferTheme(event.text);
  const label = pickEventLabel(event);
  const objectLabel = cleanWikiText(label);
  const category = inferInventionCategory(event.text, theme);
  const objectType = inferObjectType(event.text, theme);
  return {
    id: `fr-backfill-invention-${year}-${slugify(objectLabel) || "invention"}`,
    countryQid: "Q142",
    lang: "fr",
    itemKey: `objet-${slugify(objectLabel) || `annee-${year}`}`,
    itemLabel: objectLabel.toLowerCase(),
    theme,
    gestureRoot: root,
    editorialScore: 58,
    objectType,
    category,
    releaseDate: event.date.iso,
    releaseYear: year,
    datePrecision: event.date.precision,
    placeName: "France",
    placeType: "country",
    placeQid: "Q142",
    triggerLabel: objectLabel,
    beforeState: `Avant ${year}, ${objectLabel.toLowerCase()} n'existe pas encore comme repere d'usage a cette echelle.`,
    afterState: `En ${year}, ${objectLabel.toLowerCase()} devient un objet, un service ou une infrastructure qui rend un geste possible.`,
    objectChanged: `Tu peux desormais compter sur ${objectLabel.toLowerCase()} pour accomplir un geste concret.`,
    materialAnchor: `${objectLabel}, un support visible et un usage qui se materialise`,
    sceneText: `${event.date.iso}, en France. ${objectLabel} cesse d'etre une annonce abstraite et prend la forme d'un objet, d'un service ou d'une infrastructure que l'on peut vraiment utiliser.`,
    fact: cleanWikiText(event.text).slice(0, 240),
    sources: buildSourceList(event, year, "invention"),
    tags: Array.from(new Set([theme, root, slugify(objectLabel)].filter(Boolean))),
    quality: {
      strictPlace: false,
      strictDate: event.date.precision === "day",
      everydayUse: true,
      sourceCount: buildSourceList(event, year, "invention").length
    }
  };
}

function buildCulturalEntry(year, event) {
  const label = pickEventLabel(event);
  const cleanedLabel = cleanWikiText(label);
  return {
    id: `fr-backfill-cultural-${year}-${slugify(cleanedLabel) || "moment"}`,
    countryQid: "Q142",
    lang: "fr",
    momentKey: `moment-${slugify(cleanedLabel) || `annee-${year}`}`,
    momentLabel: cleanedLabel,
    label: cleanedLabel,
    category: inferCulturalCategory(event.text),
    theme: "loisirs",
    gestureRoot: "moment_culturel",
    editorialScore: 57,
    date: event.date.iso,
    year,
    datePrecision: event.date.precision,
    placeName: "France",
    placeType: "country",
    placeQid: "Q142",
    triggerLabel: cleanedLabel,
    beforeState: `Avant ${year}, ${cleanedLabel.toLowerCase()} n'existe pas encore comme repere culturel partage.`,
    afterState: `En ${year}, ${cleanedLabel.toLowerCase()} devient un point de memoire collective.`,
    gestureChanged: `Tu peux dater ce moment culturel a l'annee exacte et le rattacher a une image commune.`,
    materialAnchor: `${cleanedLabel}, une image publique et un souvenir collectif`,
    sceneText: `${event.date.iso}, en France. ${cleanedLabel} prend une forme publique et memorisable. Ce n'est pas un simple titre dans une chronologie: c'est un moment culturel qui laisse une image partagee.`,
    fact: cleanWikiText(event.text).slice(0, 240),
    sources: buildSourceList(event, year, "cultural"),
    tags: Array.from(new Set(["culture", slugify(cleanedLabel)].filter(Boolean))),
    quality: {
      strictPlace: false,
      strictDate: event.date.precision === "day",
      dailyLife: false,
      sourceCount: buildSourceList(event, year, "cultural").length
    }
  };
}

function inferPersonTheme(text) {
  const normalized = normalize(text);
  for (const rule of personThemeRules) {
    if (rule.test.test(normalized)) return { theme: rule.theme, root: rule.root };
  }
  return { theme: "loisirs", root: "personnalite" };
}

function buildPersonEntry(year, birth) {
  const details = birth.text.replace(new RegExp(`^${escapeRegExp(birth.name)}\s*,?\s*`, "i"), "").trim();
  const { theme, root } = inferPersonTheme(details || birth.text);
  return {
    year,
    lang: "fr",
    name: birth.name,
    birthDate: birth.birthDate,
    wikipediaUrl: birth.wikipediaUrl,
    theme,
    gestureRoot: root,
    editorialScore: birth.datePrecision === "day" ? 64 : 60
  };
}

function partitionByPeriod(entries, getYear) {
  const map = new Map(periods.map((period) => [period.key, []]));
  for (const entry of entries) {
    const year = getYear(entry);
    const period = periods.find((candidate) => year >= candidate.start && year <= candidate.end);
    if (!period) continue;
    map.get(period.key).push(entry);
  }
  return map;
}

async function writeTsArrayFile(filePath, importTypePath, typeName, exportName, entries) {
  await ensureDir(path.dirname(filePath));
  const content = `import type { ${typeName} } from "${importTypePath}";\n\nexport const ${exportName}: ${typeName}[] = ${JSON.stringify(entries, null, 2)};\n`;
  await fs.writeFile(filePath, content, "utf8");
}

async function writeIndexFile(filePath, importLines, exportName, typeName, refs) {
  const content = `import type { ${typeName} } from "../../../types";\n${importLines.join("\n")}\n\nexport const ${exportName}: ${typeName}[] = [\n${refs.map((ref) => `  ...${ref},`).join("\n")}\n];\n`;
  await fs.writeFile(filePath, content, "utf8");
}

async function main() {
  const gestureYears = await collectYearsFromDir(path.join(root, "src/content/gestures/catalogs/fr"), "ruptureYear");
  const inventionYears = await collectYearsFromDir(path.join(root, "src/content/inventions/catalogs/fr"), "releaseYear");
  const culturalYears = await collectYearsFromDir(path.join(root, "src/content/culturalMoments/catalogs/fr"), "year");
  const personYears = await collectYearsFromDir(path.join(root, "src/content/notableBirths/catalogs/fr"), "year");

  const generatedDaily = [];
  const generatedInvention = [];
  const generatedCultural = [];
  const generatedPerson = [];
  const missing = { daily: [], invention: [], cultural: [], person: [] };

  for (let year = startYear; year <= currentYear; year += 1) {
    const [yearRaw, birthRaw] = await Promise.all([
      fetchRawPage(`${year}_en_France`).catch(() => ""),
      fetchRawPage(`Naissance_en_${year}`).catch(() => "")
    ]);

    const events = parseYearEvents(year, yearRaw);
    const births = parseBirths(year, birthRaw);
    const used = new Set();

    if (!gestureYears.has(year)) {
      const event = pickFamilyEvent(events, "daily", used) || fallbackEvent(events);
      if (event) {
        generatedDaily.push(buildDailyEntry(year, event));
      } else {
        missing.daily.push(year);
      }
    }

    if (!inventionYears.has(year)) {
      const event = pickFamilyEvent(events, "invention", used) || fallbackEvent(events);
      if (event) {
        generatedInvention.push(buildInventionEntry(year, event));
      } else {
        missing.invention.push(year);
      }
    }

    if (!culturalYears.has(year)) {
      const event = pickFamilyEvent(events, "cultural", used) || fallbackEvent(events);
      if (event) {
        generatedCultural.push(buildCulturalEntry(year, event));
      } else {
        missing.cultural.push(year);
      }
    }

    if (!personYears.has(year)) {
      const override = personOverrides[year];
      if (override) {
        generatedPerson.push(override);
        continue;
      }
      let birth = births[0] || null;
      if (!birth) {
        const wikidataBirth = await fetchWikidataBirth(year).catch(() => null);
        if (wikidataBirth) {
          birth = {
            year,
            raw: "",
            text: wikidataBirth.name,
            normalized: normalize(wikidataBirth.name),
            name: wikidataBirth.name,
            wikipediaUrl: wikidataBirth.wikipediaUrl,
            birthDate: wikidataBirth.birthDate || String(year),
            datePrecision: wikidataBirth.birthDate ? "day" : "year",
            links: []
          };
        }
      }
      if (birth) {
        generatedPerson.push(buildPersonEntry(year, birth));
      } else {
        missing.person.push(year);
      }
    }
  }

  const gestureByPeriod = partitionByPeriod(generatedDaily, (entry) => entry.ruptureYear);
  const inventionByPeriod = partitionByPeriod(generatedInvention, (entry) => entry.releaseYear);
  const culturalByPeriod = partitionByPeriod(generatedCultural, (entry) => entry.year);
  const personByPeriod = partitionByPeriod(generatedPerson, (entry) => entry.year);

  for (const period of periods) {
    await writeTsArrayFile(
      path.join(root, `src/content/gestures/catalogs/fr/periods/${period.key}.ts`),
      "../../../types",
      "GestureRupture",
      `FR_GESTURE_BACKFILL_${period.key}`,
      gestureByPeriod.get(period.key) || []
    );
    await writeTsArrayFile(
      path.join(root, `src/content/inventions/catalogs/fr/periods/${period.key}.ts`),
      "../../../types",
      "InventionEntry",
      `FR_INVENTION_BACKFILL_${period.key}`,
      inventionByPeriod.get(period.key) || []
    );
    await writeTsArrayFile(
      path.join(root, `src/content/culturalMoments/catalogs/fr/periods/${period.key}.ts`),
      "../../../types",
      "CulturalMomentEntry",
      `FR_CULTURAL_BACKFILL_${period.key}`,
      culturalByPeriod.get(period.key) || []
    );
    await writeTsArrayFile(
      path.join(root, `src/content/notableBirths/catalogs/fr/periods/${period.key}.ts`),
      "../../../types",
      "NotableBirthEntry",
      `FR_NOTABLE_BIRTH_BACKFILL_${period.key}`,
      personByPeriod.get(period.key) || []
    );
  }

  await writeIndexFile(
    path.join(root, "src/content/gestures/catalogs/fr/periods/index.ts"),
    periods.map((period) => `import { FR_GESTURE_BACKFILL_${period.key} } from "./${period.key}";`),
    "FR_GESTURE_PERIOD_ENTRIES",
    "GestureRupture",
    periods.map((period) => `FR_GESTURE_BACKFILL_${period.key}`)
  );
  await writeIndexFile(
    path.join(root, "src/content/inventions/catalogs/fr/periods/index.ts"),
    periods.map((period) => `import { FR_INVENTION_BACKFILL_${period.key} } from "./${period.key}";`),
    "FR_INVENTION_PERIOD_ENTRIES",
    "InventionEntry",
    periods.map((period) => `FR_INVENTION_BACKFILL_${period.key}`)
  );
  await writeIndexFile(
    path.join(root, "src/content/culturalMoments/catalogs/fr/periods/index.ts"),
    periods.map((period) => `import { FR_CULTURAL_BACKFILL_${period.key} } from "./${period.key}";`),
    "FR_CULTURAL_PERIOD_ENTRIES",
    "CulturalMomentEntry",
    periods.map((period) => `FR_CULTURAL_BACKFILL_${period.key}`)
  );
  await writeIndexFile(
    path.join(root, "src/content/notableBirths/catalogs/fr/periods/index.ts"),
    periods.map((period) => `import { FR_NOTABLE_BIRTH_BACKFILL_${period.key} } from "./${period.key}";`),
    "FR_NOTABLE_BIRTH_PERIOD_ENTRIES",
    "NotableBirthEntry",
    periods.map((period) => `FR_NOTABLE_BIRTH_BACKFILL_${period.key}`)
  );

  console.log(JSON.stringify({
    generated: {
      daily: generatedDaily.length,
      invention: generatedInvention.length,
      cultural: generatedCultural.length,
      person: generatedPerson.length
    },
    missing
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exit(1);
});
