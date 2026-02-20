const DEFAULT_URL = 'https://avantmoi.com';
const MAX_SLOTS = 20;

const FACT_BY_LANG = {
  fr: 'scène plausible générée localement',
  en: 'plausible scene generated locally'
};

const FR_SCENES = [
  'Tu arrives à la gare et un homme court déjà sur le quai. Les autres se penchent pour regarder, puis reculent d’un même geste. Le sifflet tranche l’air et les portes claquent d’un coup. Tu sens que partir devient plus rapide que se dire au revoir.',
  'Tu entres dans une cantine et les plateaux glissent en silence jusqu’au fond. Une surveillante lève la main, tout le monde attend, puis avance d’un bloc. Le bruit des couverts reprend d’un seul coup sur les tables. Tu comprends que manger suit désormais un rythme réglé.',
  'Tu t’arrêtes devant une cabine vitrée où une file se forme sans discuter. Chacun parle vite, raccroche, puis cède sa place sans traîner. Le combiné cogne doucement contre le métal entre deux appels. Tu vois que la voix peut maintenant traverser la rue entière.',
  'Tu passes devant un magasin et tout le trottoir se tourne vers la vitrine. Des inconnus rient, se rapprochent, puis imitent le même mouvement. Un cliquetis sec revient à intervalles réguliers derrière le verre. Tu comprends qu’observer devient presque une activité collective.',
  'Tu montes dans un bus et tout le monde garde une pièce prête dans la main. Le conducteur hoche la tête, les voyageurs s’enchaînent, personne ne bloque l’allée. Un déclic métallique accompagne chaque passage près de toi. Tu sens que le trajet devient un geste automatique.',
  'Tu traverses un hall et une petite foule se tasse près d’un panneau lumineux. Les regards montent, s’arrêtent, puis repartent vers des directions opposées. Un grésillement court précède chaque changement d’affichage. Tu vois que s’orienter commence à passer par un signal partagé.',
  'Tu attends au coin d’une rue quand un voisin sort un objet inconnu de sa poche. Trois passants se figent, posent une question, puis tentent le même geste. Un petit cran sec répond à chaque essai dans sa main. Tu comprends que manipuler vite devient une habitude.',
  'Tu pousses une porte de café et les conversations baissent autour du comptoir. Une personne tente un geste, hésite, puis les autres reproduisent sans parler. Le tintement du verre couvre un instant les voix de la salle. Tu sens qu’un nouveau code social vient de s’installer.',
  'Tu entres dans un bureau public où chacun remplit la même case au même endroit. Les mains se tendent, les formulaires passent, puis la file avance sans appel. Le frottement des stylos raye le silence minute après minute. Tu vois que prouver son identité devient un réflexe.',
  'Tu longes un marché et un vendeur pose soudain un objet au centre de son étal. Les clients se rapprochent, touchent du bout des doigts, puis demandent le prix ensemble. Un claquement bref accompagne chaque démonstration devant toi. Tu comprends que tester avant d’acheter devient normal.',
  'Tu arrives sur une place et des enfants forment un cercle autour d’une nouveauté. Les adultes ralentissent, sourient, puis restent quelques secondes de plus que prévu. Un bourdonnement léger revient quand quelqu’un appuie dessus. Tu sens que rester dehors prend une autre forme.',
  'Tu attends à l’arrêt quand un plan apparaît derrière une vitre fraîchement posée. Les passants comparent leurs trajets, changent d’avis, puis se rangent autrement. Le papier craque sous les doigts quand quelqu’un suit une ligne. Tu vois que se déplacer devient une lecture collective.',
  'Tu entres dans une salle d’attente et tout le monde surveille la même porte. Une infirmière appelle un nom, la tête se lève, puis retombe aussitôt. Le battement sec d’un tampon rythme l’enchaînement des dossiers. Tu comprends que patienter devient une mécanique partagée.',
  'Tu passes devant un atelier où la porte reste ouverte sur la rue. Les passants s’arrêtent, observent un geste précis, puis repartent en l’imitant dans l’air. Un choc bref résonne à chaque étape sur l’établi. Tu sens que fabriquer attire désormais autant que posséder.',
  'Tu entres dans une bibliothèque et une table entière change de place en une minute. Les lecteurs lèvent les yeux, déplacent leurs sacs, puis se recalent sans protester. Le bois frotte doucement sur le sol ciré. Tu vois que l’espace public devient modulable au quotidien.',
  'Tu traverses une cour d’immeuble quand une voisine accroche un objet nouveau au mur. Deux portes s’ouvrent, trois têtes sortent, puis tout le palier se rapproche. Un petit coup sec marque chaque utilisation devant toi. Tu comprends que le voisinage partage désormais plus qu’un escalier.',
  'Tu attends ton tour au guichet et une bande de tickets descend en continu. Les mains prennent un numéro, reculent, puis surveillent l’affichage sans parler. Un bourdonnement bref accompagne chaque appel suivant. Tu sens que l’ordre d’attente devient visible pour tout le monde.',
  'Tu marches sur le boulevard quand une vitrine montre un usage en direct. Les passants s’arrêtent, échangent un regard, puis rentrent pour essayer. Un clic régulier revient derrière le rideau à moitié ouvert. Tu comprends que la curiosité suffit désormais à lancer une adoption.',
  'Tu arrives dans une salle de classe et un objet circule de rang en rang. Les élèves se penchent, testent à tour de rôle, puis rient en silence. Un frottement court revient quand on le passe à la table voisine. Tu vois que l’apprentissage prend soudain une forme tangible.',
  'Tu avances dans un couloir d’administration où chacun garde le même papier plié. Les agents vérifient, tamponnent, puis renvoient vers la porte suivante sans pause. Le bruit sec du cachet coupe l’air à cadence régulière. Tu comprends que franchir une étape dépend désormais d’un document.'
];

const EN_SCENES = [
  'You reach the station as someone already runs along the platform edge. People lean forward, then step back in one motion. A whistle cuts the air and doors slam shut together. You feel departures becoming faster than goodbyes.',
  'You walk into a canteen and trays slide forward without a word. A supervisor raises a hand, everyone pauses, then moves as one line. Cutlery noise returns all at once across the tables. You realize meals now follow a shared tempo.',
  'You stop at a glass booth where a queue forms without discussion. Each person speaks quickly, hangs up, then yields the spot. The receiver taps metal softly between two calls. You see voices now travel beyond the next corner.',
  'You pass a storefront and the whole sidewalk turns toward one display. Strangers laugh, move closer, then copy the same gesture. A dry click repeats behind the glass at steady intervals. You feel watching becoming a public habit.',
  'You board a bus and everyone keeps a coin ready in hand. The driver nods, riders move through, and no one blocks the aisle. A metallic click marks each pass near your shoulder. You sense commuting turning into pure routine.',
  'You cross a hall where a small crowd gathers by a bright board. Eyes lift, pause, then split toward different exits. A brief buzz comes before each line changes. You see orientation shifting into a shared visual reflex.',
  'You wait at a corner when someone pulls an unfamiliar object from a pocket. Passersby freeze, ask one question, then try the same move. A tiny snap answers each attempt in the palm. You feel quick handling becoming normal.',
  'You open a cafe door and voices drop around the counter. One person tries a move, hesitates, then others repeat it in silence. Glass chimes briefly over the room’s low conversation. You sense a new social code settling in place.',
  'You enter a public office where every form points to the same empty box. Hands extend papers, exchange glances, then the line keeps moving. Pen scratches fill the room minute after minute. You realize proof of identity is becoming routine.',
  'You walk through a market as a vendor places a new item at center stage. Customers lean in, touch it, then ask the same question. A short clap-like sound follows each demonstration. You feel testing before buying turning ordinary.',
  'You arrive at a square where children circle around a new street object. Adults slow down, smile, then stay longer than planned. A faint hum returns whenever someone presses it. You feel outdoor time taking a different shape.',
  'You wait at a stop when a fresh route map appears behind glass. People compare paths, change plans, then queue in a new order. Paper crackles as someone traces one line with a finger. You see movement becoming shared reading.',
  'You enter a waiting room where everyone watches the same door. A nurse calls one name, heads rise, then drop again. A stamp hits paper at steady intervals across the desk. You realize waiting now works like a visible machine.',
  'You pass an open workshop where one precise gesture faces the street. People stop, watch closely, then mimic it while walking away. A short knock sounds each time it lands on the bench. You feel making things becoming public theater.',
  'You step into a library and a whole table changes place in under a minute. Readers look up, shift bags, then settle again without protest. Wood glides softly across the floorboards. You see public space becoming flexible in daily life.',
  'You cross a building courtyard as a neighbor mounts a new object on the wall. Doors open, faces appear, then the landing fills quickly. A small knock marks each use in turn. You feel neighbors sharing more than a staircase now.',
  'You wait at a service desk while a strip of numbers rolls down. Hands take one ticket, step back, then watch the board in silence. A brief buzz comes before each next call. You see waiting order becoming visible to everyone.',
  'You walk down the avenue when a shop window shows a live use demo. Passersby stop, exchange one look, then enter to try. A regular click repeats behind a half-open curtain. You feel curiosity alone now triggers adoption.',
  'You enter a classroom and one object moves desk to desk in silence. Students lean in, test it once, then pass it along smiling. A short rub sounds at each transfer. You see learning suddenly becoming something you can handle.',
  'You move through an office corridor where everyone holds the same folded sheet. Clerks check, stamp, then point to the next door without pause. The stamp’s dry beat cuts the air repeatedly. You realize progress now depends on one document.'
];

function hashString(input) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffledIndices(length, random) {
  const indices = Array.from({ length }, (_, index) => index);
  for (let i = indices.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    const temp = indices[i];
    indices[i] = indices[j];
    indices[j] = temp;
  }
  return indices;
}

function scenesForLang(lang) {
  return lang === 'fr' ? FR_SCENES : EN_SCENES;
}

export function buildFallbackSlots({ year, country, lang, scope }) {
  const scenes = scenesForLang(lang);
  const random = mulberry32(hashString(`${year}|${country}|${lang}|${scope}`));
  const order = shuffledIndices(scenes.length, random);

  const slots = [];
  for (let slot = 1; slot <= MAX_SLOTS; slot += 1) {
    const index = order[(slot - 1) % order.length];
    slots.push({
      slot,
      narrative: scenes[index],
      fact: FACT_BY_LANG[lang] || FACT_BY_LANG.en,
      url: DEFAULT_URL
    });
  }

  return slots;
}

export function buildFallbackBatch({ year, country, lang }) {
  const slots = buildFallbackSlots({ year, country, lang, scope: 'historical' });
  return {
    year,
    country,
    items: slots.map((slot, idx) => ({
      scene: slot.narrative,
      fact: slot.fact,
      sourceUrl: slot.url,
      eventQid: `LOCAL-${year}-${country}-${lang}-${idx + 1}`,
      title: lang === 'fr' ? `Scène locale ${idx + 1}` : `Local scene ${idx + 1}`
    }))
  };
}
