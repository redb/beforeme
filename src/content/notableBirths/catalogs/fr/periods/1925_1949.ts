import type { NotableBirthEntry } from "../../../types";

// Complète global.ts qui ne couvre aucun Français avant 1950 (sauf 1913 Nixon).
// Priorité : personnalités françaises ou francophones de premier plan.
// Règle stricte : birthDate[0:4] === String(year).

export const FR_NOTABLE_BIRTH_BACKFILL_1925_1949: NotableBirthEntry[] = [
  // === PERSONNALITÉS FRANÇAISES PRIORITAIRES ===

  // Simone Veil : 13 juillet 1927 ✓
  { year: 1927, lang: "fr", name: "Simone Veil", birthDate: "1927-07-13", wikipediaUrl: "https://fr.wikipedia.org/wiki/Simone_Veil", qid: "Q233117", theme: "administration", gestureRoot: "politique", editorialScore: 96, achievement: "Elle fera voter la loi sur l'IVG en 1975 et entrera au Panthéon — l'une des femmes politiques les plus respectées de l'histoire française." },

  // Che Guevara : 14 juin 1928 ✓ (icône mondiale connue en France)
  { year: 1928, lang: "fr", name: "Che Guevara", birthDate: "1928-06-14", wikipediaUrl: "https://fr.wikipedia.org/wiki/Che_Guevara", qid: "Q5809", theme: "administration", gestureRoot: "politique", editorialScore: 88, achievement: "Il deviendra le symbole révolutionnaire le plus iconique du XXe siècle, son portrait sur tous les murs du monde." },

  // Audrey Hepburn : 4 mai 1929 ✓
  { year: 1929, lang: "fr", name: "Audrey Hepburn", birthDate: "1929-05-04", wikipediaUrl: "https://fr.wikipedia.org/wiki/Audrey_Hepburn", qid: "Q4739", theme: "loisirs", gestureRoot: "acteur", editorialScore: 92, achievement: "Elle sera la première artiste à remporter l'Oscar, le Tony, l'Emmy et le Grammy dans une carrière portée par Breakfast at Tiffany's." },

  // Clint Eastwood : 31 mai 1930 ✓
  { year: 1930, lang: "fr", name: "Clint Eastwood", birthDate: "1930-05-31", wikipediaUrl: "https://fr.wikipedia.org/wiki/Clint_Eastwood", qid: "Q43203", theme: "loisirs", gestureRoot: "acteur", editorialScore: 90, achievement: "Il incarnera l'homme sans nom dans les westerns de Leone et réalisera Unforgiven et Million Dollar Baby — deux Oscars du meilleur film." },

  // Jacques Chirac : 29 novembre 1932 ✓
  { year: 1932, lang: "fr", name: "Jacques Chirac", birthDate: "1932-11-29", wikipediaUrl: "https://fr.wikipedia.org/wiki/Jacques_Chirac", qid: "Q43274", theme: "administration", gestureRoot: "politique", editorialScore: 88, achievement: "Il sera président de la République française de 1995 à 2007 et reconnaîtra la responsabilité de la France dans la déportation des Juifs." },

  // François Truffaut : 6 février 1932 ✓
  { year: 1932, lang: "fr", name: "François Truffaut", birthDate: "1932-02-06", wikipediaUrl: "https://fr.wikipedia.org/wiki/Fran%C3%A7ois_Truffaut", qid: "Q35302", theme: "loisirs", gestureRoot: "realisateur", editorialScore: 90, achievement: "Il réalisera Les 400 coups et Jules et Jim, piliers de la Nouvelle Vague qui révolutionnera le cinéma mondial." },

  // Brigitte Bardot : 28 septembre 1934 ✓
  { year: 1934, lang: "fr", name: "Brigitte Bardot", birthDate: "1934-09-28", wikipediaUrl: "https://fr.wikipedia.org/wiki/Brigitte_Bardot", qid: "Q35832", theme: "loisirs", gestureRoot: "acteur", editorialScore: 92, achievement: "Elle incarnera le glamour français dans le monde entier et transformera Saint-Tropez en symbole de la liberté estivale." },

  // Elvis Presley : 8 janvier 1935 ✓
  { year: 1935, lang: "fr", name: "Elvis Presley", birthDate: "1935-01-08", wikipediaUrl: "https://fr.wikipedia.org/wiki/Elvis_Presley", qid: "Q303", theme: "loisirs", gestureRoot: "musicien", editorialScore: 96, achievement: "Il inventera le rock and roll grand public et restera le King de la musique américaine pour toujours." },

  // Dalida : 17 janvier 1933 ✓ — dans l'année 1933
  { year: 1933, lang: "fr", name: "Dalida", birthDate: "1933-01-17", wikipediaUrl: "https://fr.wikipedia.org/wiki/Dalida", qid: "Q239963", theme: "loisirs", gestureRoot: "musicien", editorialScore: 90, achievement: "Elle vendra plus de 170 millions de disques et chantera dans onze langues — la chanteuse francophone la plus vendue de tous les temps." },

  // Jack Nicholson : 22 avril 1937 ✓
  { year: 1937, lang: "fr", name: "Jack Nicholson", birthDate: "1937-04-22", wikipediaUrl: "https://fr.wikipedia.org/wiki/Jack_Nicholson", qid: "Q39792", theme: "loisirs", gestureRoot: "acteur", editorialScore: 90, achievement: "Il remportera trois Oscars et incarnera des rôles légendaires dans Shining, Vol au-dessus d'un nid de coucou et Batman." },

  // Francis Ford Coppola : 7 avril 1939 ✓
  { year: 1939, lang: "fr", name: "Francis Ford Coppola", birthDate: "1939-04-07", wikipediaUrl: "https://fr.wikipedia.org/wiki/Francis_Ford_Coppola", qid: "Q57413", theme: "loisirs", gestureRoot: "realisateur", editorialScore: 90, achievement: "Il réalisera Le Parrain et Apocalypse Now — deux films classés parmi les dix meilleurs de l'histoire du cinéma." },

  // John Lennon : 9 octobre 1940 ✓
  { year: 1940, lang: "fr", name: "John Lennon", birthDate: "1940-10-09", wikipediaUrl: "https://fr.wikipedia.org/wiki/John_Lennon", qid: "Q1203", theme: "loisirs", gestureRoot: "musicien", editorialScore: 96, achievement: "Il cofondra les Beatles et composera Imagine — l'hymne universel à la paix le plus chanté du XXe siècle." },

  // Bob Dylan : 24 mai 1941 ✓
  { year: 1941, lang: "fr", name: "Bob Dylan", birthDate: "1941-05-24", wikipediaUrl: "https://fr.wikipedia.org/wiki/Bob_Dylan", qid: "Q392", theme: "loisirs", gestureRoot: "musicien", editorialScore: 94, achievement: "Il recevra le Nobel de littérature 2016 et aura transformé la chanson de protestation en poésie universelle." },

  // Paul McCartney : 18 juin 1942 ✓
  { year: 1942, lang: "fr", name: "Paul McCartney", birthDate: "1942-06-18", wikipediaUrl: "https://fr.wikipedia.org/wiki/Paul_McCartney", qid: "Q2599", theme: "loisirs", gestureRoot: "musicien", editorialScore: 96, achievement: "Il composera Yesterday avec les Beatles — la chanson la plus reprise de toute l'histoire de la musique enregistrée." },

  // Mick Jagger : 26 juillet 1943 ✓
  { year: 1943, lang: "fr", name: "Mick Jagger", birthDate: "1943-07-26", wikipediaUrl: "https://fr.wikipedia.org/wiki/Mick_Jagger", qid: "Q128121", theme: "loisirs", gestureRoot: "musicien", editorialScore: 92, achievement: "Il fondera les Rolling Stones et tournera pendant 60 ans — le groupe de rock le plus durable et le plus rentable de l'histoire." },

  // George Lucas : 14 mai 1944 ✓
  { year: 1944, lang: "fr", name: "George Lucas", birthDate: "1944-05-14", wikipediaUrl: "https://fr.wikipedia.org/wiki/George_Lucas", qid: "Q38222", theme: "loisirs", gestureRoot: "realisateur", editorialScore: 88, achievement: "Il créera Star Wars et révolutionnera le cinéma, les effets spéciaux et le merchandising pour des générations entières." },

  // Bob Marley : 6 février 1945 ✓
  { year: 1945, lang: "fr", name: "Bob Marley", birthDate: "1945-02-06", wikipediaUrl: "https://fr.wikipedia.org/wiki/Bob_Marley", qid: "Q2715", theme: "loisirs", gestureRoot: "musicien", editorialScore: 94, achievement: "Il portera le reggae à travers le monde entier et composera Redemption Song — hymne universel à la liberté." },

  // Freddie Mercury : 5 septembre 1946 ✓
  { year: 1946, lang: "fr", name: "Freddie Mercury", birthDate: "1946-09-05", wikipediaUrl: "https://fr.wikipedia.org/wiki/Freddie_Mercury", qid: "Q11653", theme: "loisirs", gestureRoot: "musicien", editorialScore: 96, achievement: "Il chantera Bohemian Rhapsody et sa performance à Live Aid en 1985 sera élue le plus grand moment de l'histoire des concerts." },

  // David Bowie : 8 janvier 1947 ✓
  { year: 1947, lang: "fr", name: "David Bowie", birthDate: "1947-01-08", wikipediaUrl: "https://fr.wikipedia.org/wiki/David_Bowie", qid: "Q5383", theme: "loisirs", gestureRoot: "musicien", editorialScore: 94, achievement: "Il inventera Ziggy Stardust et redéfinira l'identité artistique pop — chaque album sera une transformation totale." },

  // Gérard Depardieu : 27 décembre 1948 ✓
  { year: 1948, lang: "fr", name: "Gérard Depardieu", birthDate: "1948-12-27", wikipediaUrl: "https://fr.wikipedia.org/wiki/G%C3%A9rard_Depardieu", qid: "Q53713", theme: "loisirs", gestureRoot: "acteur", editorialScore: 86, achievement: "Il tournera plus de 200 films et sera le plus grand acteur français de sa génération avec Cyrano de Bergerac." },

  // Meryl Streep : 22 juin 1949 ✓
  { year: 1949, lang: "fr", name: "Meryl Streep", birthDate: "1949-06-22", wikipediaUrl: "https://fr.wikipedia.org/wiki/Meryl_Streep", qid: "Q873", theme: "loisirs", gestureRoot: "acteur", editorialScore: 92, achievement: "Elle remportera trois Oscars — record absolu — et sera universellement reconnue comme la plus grande actrice de Hollywood." },

  // Simone Signoret : 25 mars 1921 ✗ — née en 1921, pas 1926+
  // À la place pour 1926 : Marilyn Monroe ✓
  { year: 1926, lang: "fr", name: "Marilyn Monroe", birthDate: "1926-06-01", wikipediaUrl: "https://fr.wikipedia.org/wiki/Marilyn_Monroe", qid: "Q4616", theme: "loisirs", gestureRoot: "acteur", editorialScore: 96, achievement: "Elle deviendra l'icône hollywoodienne absolue — la personnalité féminine la plus photographiée du XXe siècle." },

  // Pour 1936 : Ursula Andress née 19 mars 1936 ✓
  { year: 1936, lang: "fr", name: "Ursula Andress", birthDate: "1936-03-19", wikipediaUrl: "https://fr.wikipedia.org/wiki/Ursula_Andress", qid: "Q232629", theme: "loisirs", gestureRoot: "acteur", editorialScore: 74, achievement: "Elle incarnera la première Bond Girl de l'histoire en sortant de l'eau en bikini blanc dans James Bond contre Dr No." },

  // Pour 1938 : Claudia Cardinale née 15 avril 1938 ✓
  { year: 1938, lang: "fr", name: "Claudia Cardinale", birthDate: "1938-04-15", wikipediaUrl: "https://fr.wikipedia.org/wiki/Claudia_Cardinale", qid: "Q228622", theme: "loisirs", gestureRoot: "acteur", editorialScore: 80, achievement: "Elle sera la muse du cinéma européen des années 60, de Fellini à Leone, symbole de la femme libre de sa génération." },

  // Pour 1931 : James Dean né 8 février 1931 ✓
  { year: 1931, lang: "fr", name: "James Dean", birthDate: "1931-02-08", wikipediaUrl: "https://fr.wikipedia.org/wiki/James_Dean", qid: "Q83495", theme: "loisirs", gestureRoot: "acteur", editorialScore: 88, achievement: "Il deviendra le symbole éternel de la jeunesse rebelle avec La Fureur de vivre — mort à 24 ans au sommet de sa gloire." },
];
