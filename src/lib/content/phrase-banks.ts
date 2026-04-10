import type { ConnectorCategory } from "./connectors";

export const PHRASE_BANK_SECTIONS: {
  id: ConnectorCategory;
  titleFr: string;
  titleEn: string;
  phrases: { fr: string; en: string }[];
}[] = [
  {
    id: "opinion",
    titleFr: "Donner son avis",
    titleEn: "Opinion",
    phrases: [
      { fr: "Je suis plutôt favorable à l’idée que…", en: "I’m rather in favor of the idea that…" },
      { fr: "Je ne suis pas totalement convaincu(e) par…", en: "I’m not fully convinced by…" },
      { fr: "Mon expérience m’a appris que…", en: "My experience has taught me that…" },
    ],
  },
  {
    id: "contrast",
    titleFr: "Comparer / opposer",
    titleEn: "Contrast",
    phrases: [
      { fr: "D’un côté… de l’autre…", en: "On one side… on the other…" },
      { fr: "Cette solution présente l’avantage de… ; elle présente toutefois l’inconvénient de…", en: "Pros/cons in one sentence" },
      { fr: "Contrairement à ce que l’on pourrait croire…", en: "Contrary to what one might think…" },
    ],
  },
  {
    id: "cause_effect",
    titleFr: "Cause et conséquence",
    titleEn: "Cause & effect",
    phrases: [
      { fr: "Cela entraîne / génère / favorise…", en: "This leads to / generates / promotes…" },
      { fr: "La principale raison en est que…", en: "The main reason is that…" },
      { fr: "On observe un effet direct sur…", en: "We observe a direct effect on…" },
    ],
  },
  {
    id: "concession",
    titleFr: "Concession et nuance",
    titleEn: "Concession",
    phrases: [
      { fr: "Je comprends l’argument selon lequel… néanmoins…", en: "I understand the argument that… nevertheless…" },
      { fr: "Certes… il n’en reste pas moins que…", en: "Admittedly… nonetheless…" },
      { fr: "Je ne minimise pas… toutefois…", en: "I’m not minimizing… however…" },
    ],
  },
  {
    id: "polite_request",
    titleFr: "Demandes polies (oral & écrit)",
    titleEn: "Polite requests",
    phrases: [
      { fr: "Je souhaiterais savoir si…", en: "I would like to know whether…" },
      { fr: "Pourriez-vous préciser… ?", en: "Could you clarify…?" },
      { fr: "Je vous remercie par avance pour…", en: "Thank you in advance for…" },
    ],
  },
  {
    id: "formal_email",
    titleFr: "Courriel formel",
    titleEn: "Formal email",
    phrases: [
      { fr: "Je fais suite à votre message du…", en: "Further to your message of…" },
      { fr: "Je vous informe que…", en: "I inform you that…" },
      { fr: "Je vous prie d’agréer l’expression de mes salutations distinguées.", en: "Very formal closing" },
    ],
  },
];
