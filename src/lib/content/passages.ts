export interface ComprehensionQuestion {
  id: string;
  promptFr: string;
  choices: string[];
  correctIndex: number;
  explanationFr: string;
  trapTipEn?: string;
}

export interface Passage {
  id: string;
  skill: "reading" | "listening";
  topic: string;
  difficulty: "B1" | "B2";
  titleFr: string;
  textFr: string;
  audioScriptNote?: string;
  questions: ComprehensionQuestion[];
}

/** Short TCF-style reading passages (listening uses same text as transcript note for MVP) */
export const READING_PASSAGES: Passage[] = [
  {
    id: "rd-01",
    skill: "reading",
    topic: "administratif",
    difficulty: "B2",
    titleFr: "Avis municipal — compostage",
    textFr:
      "La Ville expérimente, jusqu’au 30 juin, des bacs de compostage collectif près des écoles. Les résidents concernés recevront un guide. Attention : seuls les déchets autorisés seront acceptés ; tout dépôt non conforme entraînera un rappel à la réglementation.",
    questions: [
      {
        id: "rd-01-q1",
        promptFr: "Quel est l’objectif principal du texte ?",
        choices: [
          "Interdire le compostage domestique",
          "Informer sur une expérimentation limitée dans le temps",
          "Fermer les écoles pour travaux",
          "Augmenter les taxes locales",
        ],
        correctIndex: 1,
        explanationFr: "Le texte annonce une expérimentation jusqu’au 30 juin.",
        trapTipEn: "Trap: confusing 'collectif' with a ban—read the deadline and tone.",
      },
      {
        id: "rd-01-q2",
        promptFr: "Que risque-t-on si le dépôt est non conforme ?",
        choices: [
          "Une amende immédiate de 500 €",
          "Un rappel à la réglementation",
          "L’expulsion du quartier",
          "La suppression des bacs",
        ],
        correctIndex: 1,
        explanationFr: "Le texte dit explicitement 'rappel à la réglementation'.",
      },
    ],
  },
  {
    id: "rd-02",
    skill: "reading",
    topic: "travail",
    difficulty: "B1",
    titleFr: "Annonce interne",
    textFr:
      "Réunion obligatoire jeudi à 10 h : présentation du nouveau logiciel. Merci d’arriver cinq minutes en avance. En cas d’empêchement, prévenir le service RH avant mercredi 17 h.",
    questions: [
      {
        id: "rd-02-q1",
        promptFr: "Que doit-on faire en cas d’empêchement ?",
        choices: [
          "Écrire après la réunion",
          "Prévenir les RH avant mercredi 17 h",
          "Envoyer un message au directeur seulement",
          "Annuler sans prévenir",
        ],
        correctIndex: 1,
        explanationFr: "Consigne explicite : prévenir RH avant mercredi 17 h.",
      },
    ],
  },
];

export const LISTENING_PASSAGES: Passage[] = [
  {
    id: "ls-01",
    skill: "listening",
    topic: "services",
    difficulty: "B2",
    titleFr: "Message vocal — livraison",
    textFr:
      "[Transcription indicative] Bonjour, votre colis arrivera demain entre 14 h et 17 h. Si vous n’êtes pas disponible, reprogrammez via le lien reçu par courriel. Une pièce d’identité pourra être demandée.",
    audioScriptNote: "Use text as script for teacher read-aloud or future TTS integration.",
    questions: [
      {
        id: "ls-01-q1",
        promptFr: "Que doit faire l’utilisateur s’il n’est pas disponible ?",
        choices: [
          "Refuser le colis",
          "Reprogrammer via le lien reçu par courriel",
          "Appeler le bureau de poste uniquement",
          "Attendre un second passage automatique",
        ],
        correctIndex: 1,
        explanationFr: "Le message indique de reprogrammer via le lien.",
        trapTipEn: "Trap: 'second passage' sounds plausible but is not stated.",
      },
    ],
  },
];
