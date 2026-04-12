import type { NotableBirthEntry } from "../../../types";

// Règle : birthDate[0:4] === String(year). Toutes les dates vérifiées.

export const FR_NOTABLE_BIRTH_BACKFILL_1950_1969: NotableBirthEntry[] = [
  // Stevie Wonder : 13 mai 1950 ✓
  { year: 1950, lang: "fr", name: "Stevie Wonder", birthDate: "1950-05-13", wikipediaUrl: "https://fr.wikipedia.org/wiki/Stevie_Wonder", qid: "Q106255", theme: "loisirs", gestureRoot: "musicien", editorialScore: 86, achievement: "Il composera Superstition et Isn't She Lovely, et remportera 25 Grammy Awards malgré sa cécité depuis l'enfance." },
  // Phil Collins : 30 janvier 1951 ✓
  { year: 1951, lang: "fr", name: "Phil Collins", birthDate: "1951-01-30", wikipediaUrl: "https://fr.wikipedia.org/wiki/Phil_Collins", qid: "Q80007", theme: "loisirs", gestureRoot: "musicien", editorialScore: 84, achievement: "Il dominera les charts des années 80 en solo et avec Genesis, et composera la bande-son du film Tarzan." },
  // Vladimir Poutine : 7 octobre 1952 ✓
  { year: 1952, lang: "fr", name: "Vladimir Poutine", birthDate: "1952-10-07", wikipediaUrl: "https://fr.wikipedia.org/wiki/Vladimir_Poutine", qid: "Q7747", theme: "administration", gestureRoot: "politique", editorialScore: 82, achievement: "Il dirigera la Russie pendant plus de deux décennies et redeviendra l'une des figures les plus puissantes du monde." },
  // Cyndi Lauper : 22 juin 1953 ✓
  { year: 1953, lang: "fr", name: "Cyndi Lauper", birthDate: "1953-06-22", wikipediaUrl: "https://fr.wikipedia.org/wiki/Cyndi_Lauper", qid: "Q234691", theme: "loisirs", gestureRoot: "musicien", editorialScore: 76, achievement: "Elle signera Girls Just Want to Have Fun et deviendra une icône pop et un symbole des droits LGBTQ+." },
  // Oprah Winfrey : 29 janvier 1954 ✓
  { year: 1954, lang: "fr", name: "Oprah Winfrey", birthDate: "1954-01-29", wikipediaUrl: "https://fr.wikipedia.org/wiki/Oprah_Winfrey", qid: "Q55800", theme: "loisirs", gestureRoot: "personnalite", editorialScore: 86, achievement: "Elle créera l'émission télévisée la plus regardée de l'histoire américaine et deviendra la première femme noire milliardaire." },
  // Steve Jobs : 24 février 1955 ✓
  { year: 1955, lang: "fr", name: "Steve Jobs", birthDate: "1955-02-24", wikipediaUrl: "https://fr.wikipedia.org/wiki/Steve_Jobs", qid: "Q19837", theme: "travail", gestureRoot: "entrepreneur", editorialScore: 94, achievement: "Il cofondra Apple, inventera l'iPhone et transformera la façon dont le monde interagit avec la technologie." },
  // Tom Hanks : 9 juillet 1956 ✓
  { year: 1956, lang: "fr", name: "Tom Hanks", birthDate: "1956-07-09", wikipediaUrl: "https://fr.wikipedia.org/wiki/Tom_Hanks", qid: "Q2263", theme: "loisirs", gestureRoot: "acteur", editorialScore: 87, achievement: "Il remportera deux Oscars consécutifs pour Philadelphia et Forrest Gump, une performance sans précédent." },
  // Caroline de Monaco : 23 janvier 1957 ✓
  { year: 1957, lang: "fr", name: "Caroline de Monaco", birthDate: "1957-01-23", wikipediaUrl: "https://fr.wikipedia.org/wiki/Caroline_de_Monaco", qid: "Q158963", theme: "famille", gestureRoot: "famille_royale", editorialScore: 72, achievement: "Fille de Grace Kelly et Rainier III, elle deviendra l'une des figures les plus médiatisées de la royauté européenne." },
  // Michael Jackson : 29 août 1958 ✓
  { year: 1958, lang: "fr", name: "Michael Jackson", birthDate: "1958-08-29", wikipediaUrl: "https://fr.wikipedia.org/wiki/Michael_Jackson", qid: "Q2831", theme: "loisirs", gestureRoot: "musicien", editorialScore: 96, achievement: "Il vendra plus de 400 millions d'albums, inventera le moonwalk et deviendra le King of Pop mondial avec Thriller." },
  // Emma Thompson : 15 avril 1959 ✓
  { year: 1959, lang: "fr", name: "Emma Thompson", birthDate: "1959-04-15", wikipediaUrl: "https://fr.wikipedia.org/wiki/Emma_Thompson", qid: "Q35912", theme: "loisirs", gestureRoot: "acteur", editorialScore: 73, achievement: "Elle remportera deux Oscars — l'un pour son jeu et l'autre pour l'adaptation de Raison et sentiments." },
  // Bono : 10 mai 1960 ✓
  { year: 1960, lang: "fr", name: "Bono", birthDate: "1960-05-10", wikipediaUrl: "https://fr.wikipedia.org/wiki/Bono", qid: "Q1251", theme: "loisirs", gestureRoot: "musicien", editorialScore: 82, achievement: "Il fondera U2 et en fera l'un des groupes les plus riches de l'histoire, tout en militant pour la paix et l'Afrique." },
  // Barack Obama : 4 août 1961 ✓
  { year: 1961, lang: "fr", name: "Barack Obama", birthDate: "1961-08-04", wikipediaUrl: "https://fr.wikipedia.org/wiki/Barack_Obama", qid: "Q76", theme: "administration", gestureRoot: "politique", editorialScore: 92, achievement: "Il deviendra le 44e président des États-Unis, premier Afro-Américain à ce poste, et recevra le prix Nobel de la paix." },
  // Jon Bon Jovi : 2 mars 1962 ✓
  { year: 1962, lang: "fr", name: "Jon Bon Jovi", birthDate: "1962-03-02", wikipediaUrl: "https://fr.wikipedia.org/wiki/Jon_Bon_Jovi", qid: "Q213468", theme: "loisirs", gestureRoot: "musicien", editorialScore: 74, achievement: "Il fondera Bon Jovi et signera Livin' on a Prayer, l'une des chansons rock les plus reconnaissables au monde." },
  // Michael Jordan : 17 février 1963 ✓
  { year: 1963, lang: "fr", name: "Michael Jordan", birthDate: "1963-02-17", wikipediaUrl: "https://fr.wikipedia.org/wiki/Michael_Jordan", qid: "Q41421", theme: "loisirs", gestureRoot: "sportif", editorialScore: 94, achievement: "Il remportera 6 titres NBA avec les Bulls et deviendra le joueur de basketball le plus influent de l'histoire, avec la marque Air Jordan." },
  // Nicolas Cage : 7 janvier 1964 ✓
  { year: 1964, lang: "fr", name: "Nicolas Cage", birthDate: "1964-01-07", wikipediaUrl: "https://fr.wikipedia.org/wiki/Nicolas_Cage", qid: "Q108215", theme: "loisirs", gestureRoot: "acteur", editorialScore: 76, achievement: "Il remportera l'Oscar pour Leaving Las Vegas et accumulera plus de 100 rôles dans une carrière hors norme." },
  // Björk : 21 novembre 1965 ✓
  { year: 1965, lang: "fr", name: "Björk", birthDate: "1965-11-21", wikipediaUrl: "https://fr.wikipedia.org/wiki/Bj%C3%B6rk", qid: "Q47426", theme: "loisirs", gestureRoot: "musicien", editorialScore: 82, achievement: "Elle fondra la musique électronique, le classique et l'avant-garde pour redéfinir les frontières de la pop mondiale." },
  // Sophie Marceau : 17 novembre 1966 ✓
  { year: 1966, lang: "fr", name: "Sophie Marceau", birthDate: "1966-11-17", wikipediaUrl: "https://fr.wikipedia.org/wiki/Sophie_Marceau", qid: "Q235651", theme: "loisirs", gestureRoot: "acteur", editorialScore: 76, achievement: "Elle deviendra la star du cinéma français avec La Boum puis Braveheart, et incarnera une James Bond Girl mémorable." },
  // Kurt Cobain : 20 février 1967 ✓
  { year: 1967, lang: "fr", name: "Kurt Cobain", birthDate: "1967-02-20", wikipediaUrl: "https://fr.wikipedia.org/wiki/Kurt_Cobain", qid: "Q185422", theme: "loisirs", gestureRoot: "musicien", editorialScore: 84, achievement: "Il fondra Nirvana et composera Smells Like Teen Spirit, qui déclenchera le mouvement grunge mondial." },
  // Céline Dion : 30 mars 1968 ✓
  { year: 1968, lang: "fr", name: "Céline Dion", birthDate: "1968-03-30", wikipediaUrl: "https://fr.wikipedia.org/wiki/C%C3%A9line_Dion", qid: "Q3014", theme: "loisirs", gestureRoot: "musicien", editorialScore: 86, achievement: "Elle chantera My Heart Will Go On pour Titanic et deviendra l'une des artistes les plus vendues de l'histoire avec 200 millions d'albums." },
  // Jennifer Lopez : 24 juillet 1969 ✓
  { year: 1969, lang: "fr", name: "Jennifer Lopez", birthDate: "1969-07-24", wikipediaUrl: "https://fr.wikipedia.org/wiki/Jennifer_Lopez", qid: "Q45827", theme: "loisirs", gestureRoot: "musicien", editorialScore: 80, achievement: "Elle sera la première artiste latine à atteindre le numéro 1 simultanément en album et en film aux États-Unis." },
];
