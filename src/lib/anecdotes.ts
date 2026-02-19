import type { Lang } from './i18n';
import type { CountryCode } from './locale';
import { createSeededRandom } from './seed';

export interface AnecdoteItem {
  id: string;
  text: string;
}

interface VibeTokens {
  market: string;
  snack: string;
  transport: string;
  street: string;
  sound: string;
  smell: string;
  object: string;
}

interface StoryParts {
  event: string;
  reaction: string;
  detail: string;
  vibe: VibeTokens;
}

interface BuildBatchInput {
  year: number;
  country: CountryCode;
  lang: Lang;
  batch: number;
  count?: number;
}

const DEFAULT_BATCH_SIZE = 20;

const VIBES: Record<Lang, Record<CountryCode, VibeTokens>> = {
  fr: {
    FR: {
      market: 'marche couvert',
      snack: 'pain chaud et confiture',
      transport: 'tram matinal',
      street: 'ruelle en pierre',
      sound: 'cloches et freins',
      smell: 'le beurre tiede',
      object: 'une clef en laiton'
    },
    US: {
      market: 'marche de quartier',
      snack: 'cafe filtre et tarte tiede',
      transport: 'bus de quartier',
      street: 'l angle de rue quadrille',
      sound: 'portes et semelles',
      smell: 'la pluie sur le beton',
      object: 'un ticket cartonne'
    },
    BR: {
      market: 'marche colore',
      snack: 'jus frais et pate salee',
      transport: 'bus ouvert',
      street: 'allee vive',
      sound: 'rires et percussions',
      smell: 'les fruits murs',
      object: 'un bracelet tresse'
    },
    MG: {
      market: 'marche de colline',
      snack: 'riz chaud et galette',
      transport: 'taxi collectif',
      street: 'pente rouge',
      sound: 'voix du matin',
      smell: 'le charbon doux',
      object: 'une ficelle de jute'
    },
    DE: {
      market: 'halle ordonnee',
      snack: 'pain sombre et soupe claire',
      transport: 'tram precis',
      street: 'place pavee',
      sound: 'sonnettes et portes',
      smell: 'le levain chaud',
      object: 'un carnet quadrille'
    },
    ES: {
      market: 'marche ombrage',
      snack: 'pain grille et huile douce',
      transport: 'tram de facades',
      street: 'ruelle blanche',
      sound: 'volets et chaises',
      smell: 'les agrumes tiedes',
      object: 'un eventail plie'
    },
    IT: {
      market: 'marche sous arcades',
      snack: 'pain chaud et herbes',
      transport: 'tram ancien',
      street: 'petite place pavee',
      sound: 'cuilleres et scooters',
      smell: 'le cafe moulu',
      object: 'une serviette brodee'
    },
    GB: {
      market: 'halle locale',
      snack: 'the chaud et pain beurre',
      transport: 'bus a etage',
      street: 'terrasse de briques',
      sound: 'pas rapides et vent',
      smell: 'la pluie fraiche',
      object: 'un parapluie plie'
    },
    CA: {
      market: 'marche interieur',
      snack: 'soupe fumante et tartine',
      transport: 'tram d hiver',
      street: 'allee bordee d arbres',
      sound: 'bottes et portes lourdes',
      smell: 'le pin humide',
      object: 'une mitaine oubliee'
    }
  },
  en: {
    FR: {
      market: 'covered market hall',
      snack: 'warm bread with jam',
      transport: 'early tram',
      street: 'stone lane',
      sound: 'bells and brakes',
      smell: 'warm butter in the air',
      object: 'a brass key'
    },
    US: {
      market: 'neighborhood market',
      snack: 'filter coffee and warm pie',
      transport: 'local bus',
      street: 'grid corner',
      sound: 'doors and quick footsteps',
      smell: 'rain on concrete',
      object: 'a cardboard ticket'
    },
    BR: {
      market: 'colorful market',
      snack: 'fresh juice and savory pastry',
      transport: 'open window bus',
      street: 'lively alley',
      sound: 'laughter and distant rhythm',
      smell: 'ripe fruit in warm air',
      object: 'a braided bracelet'
    },
    MG: {
      market: 'hillside market',
      snack: 'hot rice and flatbread',
      transport: 'shared taxi',
      street: 'red slope',
      sound: 'morning voices',
      smell: 'gentle charcoal smoke',
      object: 'a jute string loop'
    },
    DE: {
      market: 'orderly indoor hall',
      snack: 'dark bread and clear soup',
      transport: 'precise tram',
      street: 'paved square',
      sound: 'bells and sliding doors',
      smell: 'warm sourdough',
      object: 'a grid notebook'
    },
    ES: {
      market: 'shaded market lane',
      snack: 'toasted bread with soft oil',
      transport: 'facade tram',
      street: 'white narrow lane',
      sound: 'shutters and chairs on stone',
      smell: 'warm citrus air',
      object: 'a folded fan'
    },
    IT: {
      market: 'arcade market',
      snack: 'warm bread and herbs',
      transport: 'old tram',
      street: 'small paved square',
      sound: 'spoons and scooters',
      smell: 'ground coffee nearby',
      object: 'an embroidered napkin'
    },
    GB: {
      market: 'local covered hall',
      snack: 'hot tea and buttered bread',
      transport: 'double deck bus',
      street: 'brick terrace row',
      sound: 'quick steps and wind',
      smell: 'fresh rain in cool air',
      object: 'a folded umbrella'
    },
    CA: {
      market: 'indoor market',
      snack: 'steaming soup and toast',
      transport: 'winter tram',
      street: 'tree lined lane',
      sound: 'boots and heavy doors',
      smell: 'wet pine nearby',
      object: 'a lost mitten'
    }
  }
};

const EVENTS: Record<Lang, string[]> = {
  fr: [
    'un inconnu qui court apres un {transport} deja en marche en tenant un bouquet de clefs',
    'une voisine qui te confie une chaise pliante puis disparait dans la foule sans explication',
    'deux livreurs qui posent un miroir au milieu de {street} et la rue ralentit pour se regarder',
    'un enfant fait rouler une valise vide comme un tambour et les passants lui ouvrent le passage',
    'un vendeur qui allume une petite lampe en plein jour pour montrer une montre sans aiguilles',
    'un chien tire un tabouret jusqu a une file puis s assied en attendant son tour',
    'quelqu un qui accroche des rubans sur un velo et demande a chacun de choisir une couleur',
    'une porte qui s ouvre et une pile de chapeaux qui tombe sur le trottoir comme une pluie lente',
    'un musicien qui improvise avec deux cuilleres et un seau pendant que le {transport} attend',
    'une plante enorme qui entre dans un ascenseur minuscule et tout le hall retient son souffle',
    'un voisin qui te montre une carte pliee dans un sachet de pain et te dit de la garder une minute',
    'un facteur qui laisse un paquet leger sur un banc puis revient pour demander ton avis sur le ruban',
    'un passager qui descend du {transport} avec un reveil geant emballe dans une echarpe',
    'trois personnes qui deplacent une table au milieu de {street} pour verifier si le soleil y reste'
  ],
  en: [
    'a stranger running after a moving {transport} while holding a ring of keys',
    'a neighbor hands you a folding chair and vanishes into the crowd without a word',
    'two delivery workers place a mirror in the middle of {street} and the street slows down to look',
    'a child rolls an empty suitcase like a drum and people open a path without speaking',
    'a vendor turns on a tiny lamp in daylight to show a watch with no hands',
    'a dog drags a stool into a queue and then sits as if waiting for service',
    'someone ties ribbons to a bicycle and asks every passerby to choose a color',
    'a door opens and a stack of hats falls onto the sidewalk like slow rain',
    'a street musician taps two spoons on a bucket while a {transport} waits',
    'an oversized plant enters a tiny elevator and the whole lobby holds its breath',
    'a neighbor shows you a folded map hidden inside a bread bag and asks you to keep it for a minute',
    'a mail carrier leaves a light parcel on a bench, then returns to ask your opinion about the ribbon',
    'a passenger steps off a {transport} carrying a giant alarm clock wrapped in a scarf',
    'three people move a table into {street} just to check where the sun actually stays'
  ]
};

const REACTIONS: Record<Lang, string[]> = {
  fr: [
    'Tu vois des inconnus lever la main comme dans un vieux rituel, puis sourire entre eux.',
    'Les conversations s arretent net, puis repartent plus vite, avec un rire nerveux.',
    'Un groupe se forme en cercle, chacun donnant un avis different en pointant du doigt.',
    'Deux passants echangent un regard complice, puis se mettent a applaudir tres doucement.',
    'Une vendeuse quitte son etal, observe la scene, puis revient en hochant la tete.',
    'Un conducteur attend sans klaxonner, comme si cette minute avait sa propre regle.',
    'Tu entends des "attends" chuchotes, puis des pas qui se synchronisent sans ordre.',
    'Une file se decale d un seul mouvement, laissant un couloir vide au centre.',
    'Des fenetres s ouvrent en meme temps et des voix demandent ce qui se passe.',
    'Personne ne sait quoi faire, alors tout le monde fait semblant que c est normal.',
    'Un inconnu te demande "tu as vu ca" et repart avant ta reponse.',
    'Le silence tombe une seconde, puis tout le quartier reprend son souffle.'
  ],
  en: [
    'You see strangers raise a hand like an old ritual, then smile at each other.',
    'Conversations stop at once, then restart faster with a nervous laugh.',
    'A loose circle appears, everyone giving a different opinion while pointing.',
    'Two passersby trade a knowing look, then clap very softly.',
    'A vendor leaves a stall, watches the scene, then nods and returns.',
    'A driver waits without honking, as if this minute has its own rule.',
    'You hear quiet "wait" whispers, then footsteps syncing without any signal.',
    'A queue shifts in one movement, leaving an empty corridor in the middle.',
    'Windows open together and voices ask what is happening below.',
    'Nobody knows what to do, so everybody acts like this is normal.',
    'A stranger asks "did you see that" and leaves before you answer.',
    'Silence lands for a moment, then the whole block exhales.'
  ]
};

const DETAILS: Record<Lang, string[]> = {
  fr: [
    'L air porte {smell}, quelqu un croque {snack}, et le bruit de {sound} rebondit contre les vitrines.',
    'Tu touches {object}; c est froid, un peu lourd, et ca garde la chaleur de ta paume.',
    'Pres de {market}, les sacs froissent, les roues grincent, et une tasse tinte sur un comptoir.',
    'Au coin de {street}, un rideau bouge, des miettes tombent, et tes pas ralentissent tout seuls.',
    'Tu gardes la scene en tete: une odeur simple, un bruit court, et un detail impossible a oublier.',
    'Une brise de {smell} traverse le trottoir pendant qu un papier tourne autour de tes chaussures.',
    'Quelqu un te tend {snack}, la vapeur monte, et le metal du {transport} vibre encore derriere toi.',
    'Tu recules d un pas, tu entends {sound}, et tu vois un gant perdu glisser sous un banc.'
  ],
  en: [
    'The air carries {smell}, someone bites into {snack}, and the sound of {sound} bounces off shop windows.',
    'You touch {object}; it feels cool, slightly heavy, and keeps the warmth of your palm.',
    'Near the {market}, bags rustle, wheels creak, and a cup rings on a counter.',
    'At the edge of {street}, a curtain moves, crumbs fall, and your pace slows on its own.',
    'You keep the scene in your head: a simple smell, a short sound, and one detail you cannot shake.',
    'A draft of {smell} crosses the pavement while a paper circle spins around your shoes.',
    'Someone hands you {snack}, steam rises, and the metal of the {transport} still trembles behind you.',
    'You step back, you hear {sound}, and you notice a lost glove sliding under a bench.'
  ]
};

const STORY_TEMPLATES: Record<Lang, Array<(parts: StoryParts) => string>> = {
  fr: [
    (parts) =>
      `Tu vois ${parts.event}. ${parts.reaction} Tu avances, puis tu recules pour verifier que tu n as rien invente. ${parts.detail}`,
    (parts) =>
      `Tu tombes sur ${parts.event}. ${parts.reaction} Tu restes pres de ${parts.vibe.street}. ${parts.detail}`,
    (parts) =>
      `Tu assistes a ${parts.event}. ${parts.reaction} Tu suis le mouvement quelques metres, attire sans raison claire. ${parts.detail}`,
    (parts) =>
      `Tu passes devant ${parts.event}. ${parts.reaction} Tu regardes autour de toi pour voir si quelqu un joue une blague. ${parts.detail}`
  ],
  en: [
    (parts) =>
      `You see ${parts.event}. ${parts.reaction} You move forward, then step back to check that you did not imagine it. ${parts.detail}`,
    (parts) =>
      `You run into ${parts.event}. ${parts.reaction} You stay near ${parts.vibe.street}. ${parts.detail}`,
    (parts) =>
      `You witness ${parts.event}. ${parts.reaction} You follow the motion for a few steps, pulled in for no clear reason. ${parts.detail}`,
    (parts) =>
      `You pass by ${parts.event}. ${parts.reaction} You glance around to see if someone is staging a prank. ${parts.detail}`
  ]
};

function fillTokens(template: string, vibe: VibeTokens): string {
  return template
    .replaceAll('{market}', vibe.market)
    .replaceAll('{snack}', vibe.snack)
    .replaceAll('{transport}', vibe.transport)
    .replaceAll('{street}', vibe.street)
    .replaceAll('{sound}', vibe.sound)
    .replaceAll('{smell}', vibe.smell)
    .replaceAll('{object}', vibe.object);
}

function shuffleWithRandom<T>(list: T[], random: () => number): T[] {
  const items = [...list];

  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

export function buildAnecdoteBatch(input: BuildBatchInput): AnecdoteItem[] {
  const count = input.count ?? DEFAULT_BATCH_SIZE;
  const seedKey = `${input.year}|${input.country}|${input.lang}|batch:${input.batch}`;
  const random = createSeededRandom(seedKey);
  const vibe = VIBES[input.lang][input.country];

  const events = shuffleWithRandom(EVENTS[input.lang].map((entry) => fillTokens(entry, vibe)), random);
  const reactions = shuffleWithRandom(REACTIONS[input.lang], random);
  const details = shuffleWithRandom(DETAILS[input.lang].map((entry) => fillTokens(entry, vibe)), random);
  const templates = STORY_TEMPLATES[input.lang];

  const results: AnecdoteItem[] = [];

  for (let index = 0; index < count; index += 1) {
    const event = events[index % events.length];
    const reaction = reactions[(index + Math.floor(random() * reactions.length)) % reactions.length];
    const detail = details[(index * 2 + Math.floor(random() * details.length)) % details.length];
    const template = templates[Math.floor(random() * templates.length)];

    results.push({
      id: `${input.year}-${input.country}-${input.lang}-b${input.batch}-i${index}`,
      text: template({ event, reaction, detail, vibe })
    });
  }

  return results;
}
