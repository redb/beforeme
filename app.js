const YEAR_MIN = 1850;
const YEAR_MAX = new Date().getFullYear();

const form = document.querySelector("#beforeme-form");
const birthYearInput = document.querySelector("#birthYear");
const ageInput = document.querySelector("#age");
const assumption = document.querySelector("#assumption");
const formError = document.querySelector("#form-error");
const resultSection = document.querySelector("#result");
const mirrorYearEl = document.querySelector("#mirror-year");
const storyTitle = document.querySelector("#story-title");
const storyText = document.querySelector("#story-text");
const storySource = document.querySelector("#story-source");
const storyImage = document.querySelector("#story-image");
const newStoryButton = document.querySelector("#new-story");
const shareButton = document.querySelector("#share-main");
const shareBlock = document.querySelector("#share-block");
const fbLink = document.querySelector("#share-fb");
const liLink = document.querySelector("#share-li");
const pinLink = document.querySelector("#share-pin");
const copyCaptionButton = document.querySelector("#copy-caption");
const copyFeedback = document.querySelector("#copy-feedback");

let currentState = null;
const linksCacheByYear = new Map();

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  formError.textContent = "";
  copyFeedback.textContent = "";

  const parsed = parseInputs();

  if (parsed.error) {
    formError.textContent = parsed.error;
    return;
  }

  assumption.textContent = parsed.assumption;

  currentState = {
    ...parsed,
    mirrorYear: parsed.birthYear - parsed.age,
    shareUrl: "",
    imageUrl: ""
  };

  if (currentState.mirrorYear < YEAR_MIN) {
    formError.textContent = `L'année miroir obtenue (${currentState.mirrorYear}) est trop lointaine pour cette version. Essaie avec un âge plus petit.`;
    return;
  }

  mirrorYearEl.textContent = String(currentState.mirrorYear);
  resultSection.hidden = false;
  shareBlock.hidden = true;

  await loadAnecdote({ year: currentState.mirrorYear });
  updateShareLinks();
  updateQueryString();
});

newStoryButton.addEventListener("click", async () => {
  if (!currentState) return;
  await loadAnecdote({ year: currentState.mirrorYear, preferNew: true });
  updateShareLinks();
});

shareButton.addEventListener("click", async () => {
  if (!currentState) return;

  shareBlock.hidden = false;

  const shareData = {
    title: "BeforeMe",
    text: buildShareText(),
    url: currentState.shareUrl
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return;
    } catch {
      // User cancel falls back silently to visible links.
    }
  }
});

copyCaptionButton.addEventListener("click", async () => {
  if (!currentState) return;

  const text = `${buildShareText()} ${currentState.shareUrl}`;

  try {
    await navigator.clipboard.writeText(text);
    copyFeedback.textContent = "Texte copié. Tu peux le coller sur Insta ou TikTok.";
  } catch {
    copyFeedback.textContent = "Impossible de copier automatiquement. Copie manuellement ce texte depuis la page.";
  }
});

hydrateFromQuery();

function parseInputs() {
  const birthYearRaw = birthYearInput.value.trim();
  const ageRaw = ageInput.value.trim();

  const age = ageRaw ? Number(ageRaw) : NaN;
  const birthYear = birthYearRaw ? Number(birthYearRaw) : NaN;

  if (!Number.isFinite(age) && !Number.isFinite(birthYear)) {
    return { error: "Renseigne au moins ton âge ou ton année de naissance." };
  }

  if (Number.isFinite(age) && (age < 1 || age > 120)) {
    return { error: "Entre un âge valide entre 1 et 120 ans." };
  }

  if (Number.isFinite(birthYear) && (birthYear < YEAR_MIN || birthYear > YEAR_MAX)) {
    return { error: `Entre une année de naissance entre ${YEAR_MIN} et ${YEAR_MAX}.` };
  }

  if (Number.isFinite(age) && Number.isFinite(birthYear)) {
    return {
      age,
      birthYear,
      assumption: "Calcul direct avec ton année de naissance et ton âge."
    };
  }

  if (Number.isFinite(age)) {
    const guessedBirthYear = YEAR_MAX - age;
    return {
      age,
      birthYear: guessedBirthYear,
      assumption: `Année de naissance estimée à ${guessedBirthYear} (année actuelle ${YEAR_MAX} - âge).`
    };
  }

  const guessedAge = YEAR_MAX - birthYear;

  if (guessedAge < 1 || guessedAge > 120) {
    return { error: "Avec cette année de naissance, l'âge calculé sort de la plage 1-120." };
  }

  return {
    age: guessedAge,
    birthYear,
    assumption: `Âge estimé à ${guessedAge} ans (année actuelle ${YEAR_MAX} - année de naissance).`
  };
}

async function loadAnecdote({ year, preferNew = false }) {
  storyTitle.textContent = `Chargement de ${year}...`;
  storyText.textContent = "On fouille dans les archives historiques.";
  storySource.textContent = "";
  storyImage.removeAttribute("src");
  newStoryButton.disabled = true;

  try {
    let story = null;

    if (preferNew) {
      story = await getLinkedStoryFromYearPage(year, true);
    }

    if (!story) {
      story = await getLinkedStoryFromYearPage(year, false);
    }

    if (!story) {
      story = await getYearSummary(year);
    }

    storyTitle.textContent = story.title;
    storyText.textContent = story.text;
    storySource.textContent = story.source;

    if (story.image) {
      storyImage.src = story.image;
      storyImage.alt = `Illustration: ${story.title}`;
      currentState.imageUrl = story.image;
    } else {
      currentState.imageUrl = "";
    }
  } catch {
    storyTitle.textContent = `Année ${year}`;
    storyText.textContent =
      "Impossible de récupérer une anecdote pour le moment. Clique sur le bouton pour réessayer.";
    storySource.textContent = "Source temporairement indisponible.";
    currentState.imageUrl = "";
  } finally {
    newStoryButton.disabled = false;
  }
}

async function getLinkedStoryFromYearPage(year, forceNew) {
  const cache = await getYearLinks(year);

  if (!cache.length) {
    return null;
  }

  const tryLimit = Math.min(10, cache.length);

  for (let i = 0; i < tryLimit; i += 1) {
    const title = pickRandomLink(cache, forceNew);
    if (!title) return null;

    const summary = await getPageSummary(title);

    if (!summary || summary.extract.length < 80) continue;

    return {
      title: summary.title,
      text: summary.extract,
      image: summary.thumbnail?.source || "",
      source: `Source: Wikipédia (${summary.title}).`
    };
  }

  return null;
}

function pickRandomLink(cache, forceNew) {
  const candidatePool = forceNew
    ? cache.filter((entry) => !entry.used)
    : cache;

  if (!candidatePool.length) return null;

  const randomIndex = Math.floor(Math.random() * candidatePool.length);
  const pick = candidatePool[randomIndex];
  pick.used = true;
  return pick.title;
}

async function getYearLinks(year) {
  if (linksCacheByYear.has(year)) {
    return linksCacheByYear.get(year);
  }

  const url = `https://fr.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(
    year
  )}&prop=links&format=json&origin=*`;

  const response = await fetch(url);
  const json = await response.json();

  const links = (json?.parse?.links || [])
    .filter((link) => link.ns === 0 && !/^\d{3,4}$/.test(link["*"]))
    .map((link) => ({ title: link["*"], used: false }));

  linksCacheByYear.set(year, links);
  return links;
}

async function getYearSummary(year) {
  const summary = await getPageSummary(String(year));

  if (!summary) {
    throw new Error("No year summary");
  }

  return {
    title: `Le monde en ${year}`,
    text: summary.extract,
    image: summary.thumbnail?.source || "",
    source: `Source: Wikipédia (${year}).`
  };
}

async function getPageSummary(title) {
  const url = `https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;

  const response = await fetch(url);
  if (!response.ok) return null;

  const json = await response.json();
  if (!json.extract) return null;
  return json;
}

function updateShareLinks() {
  const shareText = encodeURIComponent(buildShareText());
  currentState.shareUrl = `${window.location.origin}${window.location.pathname}?birthYear=${encodeURIComponent(
    String(currentState.birthYear)
  )}&age=${encodeURIComponent(String(currentState.age))}`;

  const url = encodeURIComponent(currentState.shareUrl);
  const media = encodeURIComponent(currentState.imageUrl || "https://beforeme.netlify.app/preview.jpg");

  fbLink.href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  liLink.href = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  pinLink.href = `https://pinterest.com/pin/create/button/?url=${url}&media=${media}&description=${shareText}`;
}

function buildShareText() {
  return `Avec BeforeMe, mon année miroir est ${currentState.mirrorYear}. Et toi, tu remontes jusqu'où ?`;
}

function updateQueryString() {
  const params = new URLSearchParams();
  params.set("birthYear", String(currentState.birthYear));
  params.set("age", String(currentState.age));
  window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
}

function hydrateFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const birthYear = params.get("birthYear");
  const age = params.get("age");

  if (birthYear) birthYearInput.value = birthYear;
  if (age) ageInput.value = age;

  if (birthYear || age) {
    form.requestSubmit();
  }
}
