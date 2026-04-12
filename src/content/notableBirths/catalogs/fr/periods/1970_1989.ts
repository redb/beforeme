import type { NotableBirthEntry } from "../../../types";

// Règle : birthDate[0:4] === String(year). Toutes les dates vérifiées.

export const FR_NOTABLE_BIRTH_BACKFILL_1970_1989: NotableBirthEntry[] = [
  // Mariah Carey : 27 mars 1970 ✓
  { year: 1970, lang: "fr", name: "Mariah Carey", birthDate: "1970-03-27", wikipediaUrl: "https://fr.wikipedia.org/wiki/Mariah_Carey", qid: "Q11638", theme: "loisirs", gestureRoot: "musicien", editorialScore: 86, achievement: "Elle vendra plus de 200 millions de disques et All I Want for Christmas Is You deviendra le titre de Noël le plus streamé de l'histoire." },
  // Tupac Shakur : 16 juin 1971 ✓
  { year: 1971, lang: "fr", name: "Tupac Shakur", birthDate: "1971-06-16", wikipediaUrl: "https://fr.wikipedia.org/wiki/Tupac_Shakur", qid: "Q551", theme: "loisirs", gestureRoot: "musicien", editorialScore: 88, achievement: "Il deviendra l'une des figures les plus influentes du hip-hop avec California Love, et continuera à se vendre après sa mort." },
  // Zinedine Zidane : 23 juin 1972 ✓
  { year: 1972, lang: "fr", name: "Zinedine Zidane", birthDate: "1972-06-23", wikipediaUrl: "https://fr.wikipedia.org/wiki/Zinedine_Zidane", qid: "Q25369", theme: "loisirs", gestureRoot: "sportif", editorialScore: 94, achievement: "Il sera élu meilleur joueur du monde trois fois, remportera le Mondial 98 avec la France et le Real Madrid en C1." },
  // Pharrell Williams : 5 avril 1973 ✓
  { year: 1973, lang: "fr", name: "Pharrell Williams", birthDate: "1973-04-05", wikipediaUrl: "https://fr.wikipedia.org/wiki/Pharrell_Williams", qid: "Q215775", theme: "loisirs", gestureRoot: "musicien", editorialScore: 82, achievement: "Il composera Happy pour le film Moi, moche et méchant 2, une des chansons les plus écoutées du XXIe siècle." },
  // Robbie Williams : 13 février 1974 ✓
  { year: 1974, lang: "fr", name: "Robbie Williams", birthDate: "1974-02-13", wikipediaUrl: "https://fr.wikipedia.org/wiki/Robbie_Williams_(chanteur)", qid: "Q216413", theme: "loisirs", gestureRoot: "musicien", editorialScore: 80, achievement: "Il deviendra l'artiste solo ayant vendu le plus de billets pour un concert en Europe, avec Angels comme hymne génération." },
  // David Beckham : 2 mai 1975 ✓
  { year: 1975, lang: "fr", name: "David Beckham", birthDate: "1975-05-02", wikipediaUrl: "https://fr.wikipedia.org/wiki/David_Beckham", qid: "Q10489", theme: "loisirs", gestureRoot: "sportif", editorialScore: 88, achievement: "Il deviendra autant une icône de mode qu'un joueur d'exception, transformant le football en marque mondiale." },
  // Reese Witherspoon : 22 mars 1976 ✓
  { year: 1976, lang: "fr", name: "Reese Witherspoon", birthDate: "1976-03-22", wikipediaUrl: "https://fr.wikipedia.org/wiki/Reese_Witherspoon", qid: "Q42822", theme: "loisirs", gestureRoot: "acteur", editorialScore: 76, achievement: "Elle remportera l'Oscar pour Walk the Line et fondera Hello Sunshine, produisant Big Little Lies et Wild." },
  // Kanye West : 8 juin 1977 ✓
  { year: 1977, lang: "fr", name: "Kanye West", birthDate: "1977-06-08", wikipediaUrl: "https://fr.wikipedia.org/wiki/Kanye_West", qid: "Q33213", theme: "loisirs", gestureRoot: "musicien", editorialScore: 84, achievement: "Il remportera 24 Grammy Awards et révolutionnera le hip-hop avec The College Dropout et Graduation." },
  // Kobe Bryant : 23 août 1978 ✓
  { year: 1978, lang: "fr", name: "Kobe Bryant", birthDate: "1978-08-23", wikipediaUrl: "https://fr.wikipedia.org/wiki/Kobe_Bryant", qid: "Q110086", theme: "loisirs", gestureRoot: "sportif", editorialScore: 88, achievement: "Il remportera 5 titres NBA avec les Lakers et 2 Oscars du court métrage, incarnant la Mamba Mentality." },
  // Pink : 8 septembre 1979 ✓
  { year: 1979, lang: "fr", name: "Pink", birthDate: "1979-09-08", wikipediaUrl: "https://fr.wikipedia.org/wiki/Pink_(chanteuse)", qid: "Q131324", theme: "loisirs", gestureRoot: "musicien", editorialScore: 78, achievement: "Elle vendra 90 millions de disques et imposera une image de femme forte et indépendante dans la pop mondiale." },
  // Kim Kardashian : 21 octobre 1980 ✓
  { year: 1980, lang: "fr", name: "Kim Kardashian", birthDate: "1980-10-21", wikipediaUrl: "https://fr.wikipedia.org/wiki/Kim_Kardashian", qid: "Q186355", theme: "loisirs", gestureRoot: "personnalite", editorialScore: 74, achievement: "Elle inventera le modèle d'influence moderne et bâtira un empire de marques valant plusieurs milliards de dollars." },
  // Beyoncé : 4 septembre 1981 ✓
  { year: 1981, lang: "fr", name: "Beyoncé", birthDate: "1981-09-04", wikipediaUrl: "https://fr.wikipedia.org/wiki/Beyonc%C3%A9", qid: "Q53006", theme: "loisirs", gestureRoot: "musicien", editorialScore: 94, achievement: "Elle remportera 32 Grammy Awards, un record absolu, et deviendra la plus grande performeuse live de sa génération." },
  // Prince William : 21 juin 1982 ✓
  { year: 1982, lang: "fr", name: "Prince William", birthDate: "1982-06-21", wikipediaUrl: "https://fr.wikipedia.org/wiki/Guillaume_de_Galles", qid: "Q36812", theme: "famille", gestureRoot: "famille_royale", editorialScore: 82, achievement: "Il deviendra prince de Galles et héritier du trône britannique, mariant Kate Middleton dans un mariage suivi par 2 milliards de téléspectateurs." },
  // Franck Ribéry : 7 avril 1983 ✓
  { year: 1983, lang: "fr", name: "Franck Ribéry", birthDate: "1983-04-07", wikipediaUrl: "https://fr.wikipedia.org/wiki/Franck_Rib%C3%A9ry", qid: "Q80562", theme: "loisirs", gestureRoot: "sportif", editorialScore: 82, achievement: "Il remportera 8 Bundesliga consécutives avec le Bayern Munich et terminera troisième au Ballon d'Or 2013." },
  // Katy Perry : 25 octobre 1984 ✓
  { year: 1984, lang: "fr", name: "Katy Perry", birthDate: "1984-10-25", wikipediaUrl: "https://fr.wikipedia.org/wiki/Katy_Perry", qid: "Q104567", theme: "loisirs", gestureRoot: "musicien", editorialScore: 80, achievement: "Elle placera cinq singles numéro un du même album, égalant Michael Jackson, et vendra plus de 143 millions de disques." },
  // Cristiano Ronaldo : 5 février 1985 ✓
  { year: 1985, lang: "fr", name: "Cristiano Ronaldo", birthDate: "1985-02-05", wikipediaUrl: "https://fr.wikipedia.org/wiki/Cristiano_Ronaldo", qid: "Q11571", theme: "loisirs", gestureRoot: "sportif", editorialScore: 94, achievement: "Il remportera 5 Ballons d'Or, 5 Ligues des champions et deviendra le meilleur buteur de l'histoire du football mondial." },
  // Lady Gaga : 28 mars 1986 ✓
  { year: 1986, lang: "fr", name: "Lady Gaga", birthDate: "1986-03-28", wikipediaUrl: "https://fr.wikipedia.org/wiki/Lady_Gaga", qid: "Q38111", theme: "loisirs", gestureRoot: "musicien", editorialScore: 90, achievement: "Elle remportera l'Oscar pour Shallow dans A Star Is Born et imposera ses performances live comme les plus spectaculaires de sa génération." },
  // Novak Djokovic : 22 mai 1987 ✓
  { year: 1987, lang: "fr", name: "Novak Djokovic", birthDate: "1987-05-22", wikipediaUrl: "https://fr.wikipedia.org/wiki/Novak_Djokovic", qid: "Q17718", theme: "loisirs", gestureRoot: "sportif", editorialScore: 90, achievement: "Il remportera 24 titres du Grand Chelem, un record absolu dans l'histoire du tennis masculin." },
  // Adele : 5 mai 1988 ✓
  { year: 1988, lang: "fr", name: "Adele", birthDate: "1988-05-05", wikipediaUrl: "https://fr.wikipedia.org/wiki/Adele_(chanteuse)", qid: "Q76480", theme: "loisirs", gestureRoot: "musicien", editorialScore: 90, achievement: "Elle remportera 15 Grammy Awards et 21 sera l'album le plus vendu des années 2010 dans le monde entier." },
  // Taylor Swift : 13 décembre 1989 ✓
  { year: 1989, lang: "fr", name: "Taylor Swift", birthDate: "1989-12-13", wikipediaUrl: "https://fr.wikipedia.org/wiki/Taylor_Swift", qid: "Q26876", theme: "loisirs", gestureRoot: "musicien", editorialScore: 92, achievement: "Elle deviendra la première artiste à figurer simultanément dans tous les top 10 américains et sera déclarée personnalité de l'année par Time." },
];
