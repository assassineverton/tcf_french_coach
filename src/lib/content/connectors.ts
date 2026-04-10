export type ConnectorCategory =
  | "opinion"
  | "contrast"
  | "cause_effect"
  | "concession"
  | "polite_request"
  | "formal_email";

export interface ConnectorPhrase {
  id: string;
  fr: string;
  en: string;
  category: ConnectorCategory;
  register: "neutral" | "formal" | "oral";
}

/** 50+ high-frequency TCF connectors and useful phrases */
export const CONNECTORS: ConnectorPhrase[] = [
  { id: "c-01", fr: "À mon avis", en: "In my opinion", category: "opinion", register: "neutral" },
  { id: "c-02", fr: "Selon moi", en: "According to me / In my view", category: "opinion", register: "neutral" },
  { id: "c-03", fr: "Il me semble que", en: "It seems to me that", category: "opinion", register: "formal" },
  { id: "c-04", fr: "Je suis convaincu(e) que", en: "I am convinced that", category: "opinion", register: "formal" },
  { id: "c-05", fr: "Je pense que / je crois que", en: "I think / I believe", category: "opinion", register: "oral" },
  { id: "c-06", fr: "Il est indéniable que", en: "It is undeniable that", category: "opinion", register: "formal" },
  { id: "c-07", fr: "Force est de constater que", en: "We must acknowledge that", category: "opinion", register: "formal" },
  { id: "c-08", fr: "Personnellement", en: "Personally", category: "opinion", register: "oral" },
  { id: "c-09", fr: "D’un point de vue pragmatique", en: "From a practical standpoint", category: "opinion", register: "formal" },
  { id: "c-10", fr: "En définitive", en: "Ultimately / In the end", category: "opinion", register: "neutral" },
  { id: "c-11", fr: "En revanche", en: "On the other hand", category: "contrast", register: "formal" },
  { id: "c-12", fr: "Par contre", en: "However (oral)", category: "contrast", register: "oral" },
  { id: "c-13", fr: "Tandis que", en: "While / whereas", category: "contrast", register: "neutral" },
  { id: "c-14", fr: "Au contraire", en: "On the contrary", category: "contrast", register: "neutral" },
  { id: "c-15", fr: "Néanmoins", en: "Nevertheless", category: "contrast", register: "formal" },
  { id: "c-16", fr: "Cependant", en: "However", category: "contrast", register: "formal" },
  { id: "c-17", fr: "Toutefois", en: "However (written)", category: "contrast", register: "formal" },
  { id: "c-18", fr: "En même temps", en: "At the same time", category: "contrast", register: "oral" },
  { id: "c-19", fr: "À l’inverse", en: "Conversely", category: "contrast", register: "formal" },
  { id: "c-20", fr: "Plutôt que de", en: "Rather than", category: "contrast", register: "neutral" },
  { id: "c-21", fr: "Parce que / car", en: "Because", category: "cause_effect", register: "neutral" },
  { id: "c-22", fr: "En effet", en: "Indeed / That’s right", category: "cause_effect", register: "neutral" },
  { id: "c-23", fr: "C’est pourquoi", en: "That’s why", category: "cause_effect", register: "neutral" },
  { id: "c-24", fr: "Grâce à", en: "Thanks to", category: "cause_effect", register: "neutral" },
  { id: "c-25", fr: "À cause de", en: "Because of (negative)", category: "cause_effect", register: "neutral" },
  { id: "c-26", fr: "Étant donné que", en: "Given that", category: "cause_effect", register: "formal" },
  { id: "c-27", fr: "Du fait que", en: "Due to the fact that", category: "cause_effect", register: "formal" },
  { id: "c-28", fr: "Par conséquent", en: "Consequently", category: "cause_effect", register: "formal" },
  { id: "c-29", fr: "Donc", en: "So / therefore", category: "cause_effect", register: "oral" },
  { id: "c-30", fr: "Ainsi", en: "Thus", category: "cause_effect", register: "formal" },
  { id: "c-31", fr: "Il en résulte que", en: "It follows that", category: "cause_effect", register: "formal" },
  { id: "c-32", fr: "Bien que + subjonctif", en: "Although + subjunctive", category: "concession", register: "formal" },
  { id: "c-33", fr: "Quoique", en: "Although (formal)", category: "concession", register: "formal" },
  { id: "c-34", fr: "Même si", en: "Even if", category: "concession", register: "neutral" },
  { id: "c-35", fr: "Admettons que", en: "Let’s admit that", category: "concession", register: "oral" },
  { id: "c-36", fr: "Je reconnais que… toutefois", en: "I acknowledge… however", category: "concession", register: "formal" },
  { id: "c-37", fr: "Sans nier que", en: "Without denying that", category: "concession", register: "formal" },
  { id: "c-38", fr: "Il est vrai que… mais", en: "It is true that… but", category: "concession", register: "neutral" },
  { id: "c-39", fr: "Pour autant", en: "Even so / nonetheless", category: "concession", register: "formal" },
  { id: "c-40", fr: "Dans une certaine mesure", en: "To some extent", category: "concession", register: "formal" },
  { id: "c-41", fr: "Pourriez-vous… ?", en: "Could you…?", category: "polite_request", register: "formal" },
  { id: "c-42", fr: "J’aurais besoin de…", en: "I would need…", category: "polite_request", register: "neutral" },
  { id: "c-43", fr: "Serait-il possible de… ?", en: "Would it be possible to…?", category: "polite_request", register: "formal" },
  { id: "c-44", fr: "Je vous saurais gré de…", en: "I would be grateful if you…", category: "polite_request", register: "formal" },
  { id: "c-45", fr: "Je souhaiterais obtenir des précisions sur…", en: "I would like further details on…", category: "polite_request", register: "formal" },
  { id: "c-46", fr: "Madame, Monsieur,", en: "Dear Sir/Madam,", category: "formal_email", register: "formal" },
  { id: "c-47", fr: "Je me permets de vous contacter concernant…", en: "I am writing regarding…", category: "formal_email", register: "formal" },
  { id: "c-48", fr: "Je vous prie de bien vouloir…", en: "Please kindly…", category: "formal_email", register: "formal" },
  { id: "c-49", fr: "Dans l’attente de votre réponse, je vous prie d’agréer…", en: "Yours sincerely (formula)", category: "formal_email", register: "formal" },
  { id: "c-50", fr: "Veuillez trouver ci-joint…", en: "Please find attached…", category: "formal_email", register: "formal" },
  { id: "c-51", fr: "Je reste à votre disposition pour tout renseignement complémentaire.", en: "I remain available for further information.", category: "formal_email", register: "formal" },
  { id: "c-52", fr: "Cordialement,", en: "Kind regards,", category: "formal_email", register: "formal" },
  { id: "c-53", fr: "Pour commencer / pour conclure", en: "To begin / to conclude", category: "opinion", register: "neutral" },
  { id: "c-54", fr: "D’une part… d’autre part…", en: "On one hand… on the other…", category: "contrast", register: "formal" },
  { id: "c-55", fr: "En premier lieu / en second lieu", en: "Firstly / secondly", category: "cause_effect", register: "formal" },
];
