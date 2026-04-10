export type GrammarTopic =
  | "conjugaison"
  | "pc_imp"
  | "subjonctif"
  | "pronoms"
  | "articles_prepositions"
  | "connecteurs";

export interface GrammarExercise {
  id: string;
  topic: GrammarTopic;
  promptFr: string;
  answer: string;
  alternatives?: string[];
  explanationFr: string;
  explanationEn: string;
}

export const GRAMMAR_DRILLS: GrammarExercise[] = [
  {
    id: "g-01",
    topic: "conjugaison",
    promptFr: "Complétez : Si j’____ le temps, je réviserais le subjonctif. (avoir)",
    answer: "avais",
    explanationFr: "Avec si + imparfait, le second verbe est au conditionnel (hypothèse).",
    explanationEn: "si + imperfect → conditional in hypothetical present/future.",
  },
  {
    id: "g-02",
    topic: "conjugaison",
    promptFr: "Complétez : Il faut que tu ____ plus de synonymes. (réviser)",
    answer: "révises",
    explanationFr: "Après il faut que → subjonctif présent.",
    explanationEn: "il faut que triggers subjunctive.",
  },
  {
    id: "g-03",
    topic: "pc_imp",
    promptFr: "Choisissez : Quand j’____ petit, je ____ au parc chaque dimanche. (être / aller)",
    answer: "étais / allais",
    explanationFr: "Habit au passé → imparfait (être + allais).",
    explanationEn: "Habitual past uses imparfait.",
  },
  {
    id: "g-04",
    topic: "pc_imp",
    promptFr: "Choisissez : Hier, je ____ mon texte et je ____ fatigué(e). (finir / être)",
    answer: "ai fini / étais",
    explanationFr: "Action ponctuelle passée → passé composé ; état → imparfait ou PC selon nuance (ici état résultant acceptable aussi : j’ai été).",
    explanationEn: "Completed event: passé composé; state: often imparfait.",
  },
  {
    id: "g-05",
    topic: "subjonctif",
    promptFr: "Complétez : Bien qu’il ____ tard, il continue à parler. (être)",
    answer: "soit",
    explanationFr: "Bien que + subjonctif.",
    explanationEn: "Although + subjunctive.",
  },
  {
    id: "g-06",
    topic: "pronoms",
    promptFr: "Réécrivez : Je donne la liste à Marie. → Je ____ donne.",
    answer: "la lui",
    explanationFr: "COD 'la liste' + COI 'à Marie' → la lui.",
    explanationEn: "Double pronoun order in French.",
  },
  {
    id: "g-07",
    topic: "articles_prepositions",
    promptFr: "Choisissez : Elle est arrivée ____ Canada ____ hiver.",
    answer: "au / en",
    explanationFr: "au Canada ; en hiver.",
    explanationEn: "Prepositions with countries and seasons.",
  },
  {
    id: "g-08",
    topic: "connecteurs",
    promptFr: "Quel connecteur formel remplace 'mais' en dissertation ?",
    answer: "cependant",
    alternatives: ["néanmoins", "toutefois"],
    explanationFr: "Cependant / néanmoins / toutefois = registre écrit soutenu.",
    explanationEn: "Formal written contrast.",
  },
];
