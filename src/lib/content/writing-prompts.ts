export type WritingMode = "beginner" | "intermediate" | "exam";

export interface WritingPrompt {
  id: string;
  mode: WritingMode;
  titleFr: string;
  instructionFr: string;
  wordTarget: string;
  genre: "email" | "article" | "message" | "letter" | "forum";
}

export const WRITING_PROMPTS: WritingPrompt[] = [
  {
    id: "wr-01",
    mode: "beginner",
    titleFr: "Message à un ami",
    instructionFr:
      "Écrivez un message court à un ami pour lui proposer une sortie ce week-end (lieu, horaire, activité).",
    wordTarget: "60–80 mots",
    genre: "message",
  },
  {
    id: "wr-02",
    mode: "beginner",
    titleFr: "Email formel simple",
    instructionFr:
      "Vous écrivez à la bibliothèque municipale pour demander si vous pouvez réserver une salle d’étude.",
    wordTarget: "80–100 mots",
    genre: "email",
  },
  {
    id: "wr-03",
    mode: "beginner",
    titleFr: "Avis sur un film",
    instructionFr:
      "Sur un forum, décrivez brièvement un film que vous avez vu et dites si vous le recommandez.",
    wordTarget: "70–90 mots",
    genre: "forum",
  },
  {
    id: "wr-04",
    mode: "beginner",
    titleFr: "Lettre de remerciement",
    instructionFr:
      "Remerciez votre voisin pour son aide pendant votre déménagement et proposez un café.",
    wordTarget: "70–90 mots",
    genre: "letter",
  },
  {
    id: "wr-05",
    mode: "beginner",
    titleFr: "Annonce personnelle",
    instructionFr:
      "Rédigez une petite annonce pour vendre un vélo d’occasion (état, prix, contact).",
    wordTarget: "50–70 mots",
    genre: "message",
  },
  {
    id: "wr-06",
    mode: "intermediate",
    titleFr: "Plainte constructive",
    instructionFr:
      "Écrivez un email à votre propriétaire pour signaler un problème récurrent (bruit, chauffage) et proposer une solution.",
    wordTarget: "120–150 mots",
    genre: "email",
  },
  {
    id: "wr-07",
    mode: "intermediate",
    titleFr: "Article d’opinion",
    instructionFr:
      "Rédigez un article pour le journal de votre association sur l’importance du bénévolat chez les jeunes.",
    wordTarget: "150–180 mots",
    genre: "article",
  },
  {
    id: "wr-08",
    mode: "intermediate",
    titleFr: "Message professionnel",
    instructionFr:
      "Vous informez votre équipe d’un changement d’horaire de réunion et demandez une confirmation de présence.",
    wordTarget: "100–130 mots",
    genre: "message",
  },
  {
    id: "wr-09",
    mode: "intermediate",
    titleFr: "Lettre de motivation (version courte)",
    instructionFr:
      "Expliquez pourquoi vous souhaitez intégrer un programme de français intensif et ce que vous apporterez au groupe.",
    wordTarget: "150–200 mots",
    genre: "letter",
  },
  {
    id: "wr-10",
    mode: "intermediate",
    titleFr: "Synthèse d’expérience",
    instructionFr:
      "Racontez une expérience de travail en équipe difficile et ce que vous en avez appris.",
    wordTarget: "140–170 mots",
    genre: "article",
  },
  {
    id: "wr-11",
    mode: "exam",
    titleFr: "TCF-style — courriel administratif",
    instructionFr:
      "Vous venez d’arriver au Canada et vous écrivez à un organisme d’accueil pour demander des informations sur les cours de français, les délais d’inscription et les pièces à fournir. Ton formel.",
    wordTarget: "180–220 mots",
    genre: "email",
  },
  {
    id: "wr-12",
    mode: "exam",
    titleFr: "TCF-style — article argumenté",
    instructionFr:
      "Rédigez un texte argumenté sur cette question : « Le télétravail favorise-t-il l’équilibre vie pro / vie perso ? » Présentez des arguments pour et contre, puis concluez.",
    wordTarget: "220–260 mots",
    genre: "article",
  },
  {
    id: "wr-13",
    mode: "exam",
    titleFr: "TCF-style — lettre au journal",
    instructionFr:
      "Vous répondez dans les colonnes d’un journal local à un article critiquant les nouvelles pistes cyclables. Défendez ou nuancez la position de la ville avec des exemples.",
    wordTarget: "200–240 mots",
    genre: "article",
  },
  {
    id: "wr-14",
    mode: "exam",
    titleFr: "TCF-style — forum universitaire",
    instructionFr:
      "Sur le forum de votre université, débattez : faut-il rendre certains stages obligatoires ? Argumentez et respectez le ton semi-formel.",
    wordTarget: "180–220 mots",
    genre: "forum",
  },
  {
    id: "wr-15",
    mode: "exam",
    titleFr: "TCF-style — message + consignes multiples",
    instructionFr:
      "Vous organisez un atelier de conversation pour candidats au TCF. Rédigez une annonce expliquant l’objectif, le déroulement, le niveau requis et l’inscription.",
    wordTarget: "200–230 mots",
    genre: "article",
  },
  {
    id: "wr-16",
    mode: "exam",
    titleFr: "TCF-style — courriel de réclamation",
    instructionFr:
      "Vous avez suivi une formation en ligne dont la qualité ne correspondait pas à la publicité. Écrivez au service client pour demander un geste commercial et exposer les faits.",
    wordTarget: "190–230 mots",
    genre: "email",
  },
  {
    id: "wr-17",
    mode: "exam",
    titleFr: "TCF-style — tribune",
    instructionFr:
      "« Les entreprises doivent-elles financer la formation continue des employés ? » Rédigez une tribune avec introduction, développement structuré et conclusion nette.",
    wordTarget: "230–270 mots",
    genre: "article",
  },
  {
    id: "wr-18",
    mode: "exam",
    titleFr: "TCF-style — lettre formelle",
    instructionFr:
      "Vous écrivez à un élu local pour proposer une initiative visant à réduire le gaspillage alimentaire dans les écoles (actions concrètes, bénéfices, demande de rendez-vous).",
    wordTarget: "210–250 mots",
    genre: "letter",
  },
  {
    id: "wr-19",
    mode: "exam",
    titleFr: "TCF-style — synthèse d’enquête imaginaire",
    instructionFr:
      "À partir de votre expérience (réelle ou fictive), rédigez un texte présentant les avantages et limites des cours hybrides en langue. Ton objectif et clair.",
    wordTarget: "200–240 mots",
    genre: "article",
  },
  {
    id: "wr-20",
    mode: "exam",
    titleFr: "TCF-style — message professionnel long",
    instructionFr:
      "Vous êtes responsable bénévole d’un club sportif. Informez les membres des nouvelles règles d’hygiène et des créneaux, et motivez-les à respecter le planning.",
    wordTarget: "190–220 mots",
    genre: "message",
  },
];
