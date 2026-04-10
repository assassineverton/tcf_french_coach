export type SpeakingTaskType = "information" | "convince" | "opinion";

export interface SpeakingPrompt {
  id: string;
  taskType: SpeakingTaskType;
  titleFr: string;
  promptFr: string;
  hintsEn: string;
  timeGuideSec: number;
}

export function getDailyOralPrompt(date = new Date()): SpeakingPrompt {
  const day = Math.floor(date.getTime() / 86400000);
  const idx = Math.abs(day) % SPEAKING_PROMPTS.length;
  return SPEAKING_PROMPTS[idx]!;
}

export const SPEAKING_PROMPTS: SpeakingPrompt[] = [
  {
    id: "so-01",
    taskType: "information",
    titleFr: "Demander des informations",
    promptFr:
      "Vous arrivez dans une nouvelle ville. Appelez l’office de tourisme pour obtenir des informations sur les visites guidées, les horaires et les tarifs.",
    hintsEn: "Polite requests, clarifying questions, handling numbers and times.",
    timeGuideSec: 120,
  },
  {
    id: "so-02",
    taskType: "convince",
    titleFr: "Convaincre un ami",
    promptFr:
      "Votre ami hésite à suivre un cours de français intensif avant le TCF. Convainquez-le en présentant des arguments et en répondant à ses objections.",
    hintsEn: "Structure: thesis → 2 arguments → concession → conclusion.",
    timeGuideSec: 180,
  },
  {
    id: "so-03",
    taskType: "opinion",
    titleFr: "Opinion sur le télétravail",
    promptFr:
      "Le télétravail est-il une bonne solution pour les entreprises ? Exprimez votre opinion et défendez-la avec des exemples concrets.",
    hintsEn: "Use connectors: d’un côté / en revanche / selon moi.",
    timeGuideSec: 150,
  },
  {
    id: "so-04",
    taskType: "information",
    titleFr: "Louer un logement",
    promptFr:
      "Vous téléphonez à un propriétaire pour louer un appartement. Posez des questions sur le loyer, les charges, le quartier et les conditions du bail.",
    hintsEn: "Formal register, precise vocabulary (caution, bail, charges).",
    timeGuideSec: 120,
  },
  {
    id: "so-05",
    taskType: "convince",
    titleFr: "Campagne écologique",
    promptFr:
      "Vous proposez à votre municipalité d’installer plus de composteurs. Argumentez et répondez aux inquiétudes des résidents (odeurs, place).",
    hintsEn: "Problem-solution framing; polite persuasive tone.",
    timeGuideSec: 180,
  },
  {
    id: "so-06",
    taskType: "opinion",
    titleFr: "Réseaux sociaux",
    promptFr:
      "Les réseaux sociaux rendent-ils les relations humaines plus superficielles ? Donnez votre avis nuancé.",
    hintsEn: "Nuanced B2: il est indéniable que / toutefois / en définitive.",
    timeGuideSec: 150,
  },
  {
    id: "so-07",
    taskType: "information",
    titleFr: "Renseignements à la banque",
    promptFr:
      "Vous ouvrez un compte bancaire au Canada. Demandez des informations sur les frais, les cartes et les virements internationaux.",
    hintsEn: "Formal questions; recap what you understood.",
    timeGuideSec: 120,
  },
  {
    id: "so-08",
    taskType: "convince",
    titleFr: "Choisir une formation",
    promptFr:
      "Votre collègue veut abandonner une formation en ligne. Convainquez-le de persévérer ou de choisir une meilleure alternative.",
    hintsEn: "Balance empathy + clear criteria (temps, coût, objectifs).",
    timeGuideSec: 180,
  },
  {
    id: "so-09",
    taskType: "opinion",
    titleFr: "Immigration et intégration",
    promptFr:
      "Selon vous, qu’est-ce qui facilite l’intégration des nouveaux arrivants ? Développez avec des exemples.",
    hintsEn: "Avoid stereotypes; focus on concrete factors (langue, emploi).",
    timeGuideSec: 150,
  },
  {
    id: "so-10",
    taskType: "information",
    titleFr: "Inscription à un cours",
    promptFr:
      "Vous appelez un centre de langue pour vous renseigner sur un cours de préparation au TCF : dates, niveau requis, matériel, évaluation.",
    hintsEn: "Confirm details at the end (récapitulatif).",
    timeGuideSec: 120,
  },
  {
    id: "so-11",
    taskType: "convince",
    titleFr: "Mobilité durable",
    promptFr:
      "Votre entreprise veut réduire les places de parking. Convainquez les employés d’utiliser les transports en commun.",
    hintsEn: "Incentives + address inconvenience (horaires, flexibilité).",
    timeGuideSec: 180,
  },
  {
    id: "so-12",
    taskType: "opinion",
    titleFr: "Santé mentale au travail",
    promptFr:
      "Faut-il imposer des journées sans réunion pour protéger la santé mentale ? Argumentez.",
    hintsEn: "Use conditional and hypothesis: si l’on généralisait…",
    timeGuideSec: 150,
  },
  {
    id: "so-13",
    taskType: "information",
    titleFr: "Rendez-vous médical",
    promptFr:
      "Vous appelez une clinique pour prendre rendez-vous et demander ce qu’il faut apporter (carte d’assurance, résultats d’analyses).",
    hintsEn: "Clarify dates; ask about annulation/report.",
    timeGuideSec: 120,
  },
  {
    id: "so-14",
    taskType: "convince",
    titleFr: "Réduire le gaspillage alimentaire",
    promptFr:
      "Vous animez une réunion de copropriété pour instaurer un compost collectif. Convainquez les réticents.",
    hintsEn: "Acknowledge concerns; propose a pilot project.",
    timeGuideSec: 180,
  },
  {
    id: "so-15",
    taskType: "opinion",
    titleFr: "Éducation et numérique",
    promptFr:
      "Les écrans à l’école : opportunité ou risque ? Donnez une opinion structurée.",
    hintsEn: "Define terms; give limits (âge, usage encadré).",
    timeGuideSec: 150,
  },
  {
    id: "so-16",
    taskType: "information",
    titleFr: "Service après-vente",
    promptFr:
      "Vous appelez pour signaler un problème avec un produit acheté en ligne et demander un remboursement ou un échange.",
    hintsEn: "Stay calm; reference order number, policy.",
    timeGuideSec: 120,
  },
  {
    id: "so-17",
    taskType: "convince",
    titleFr: "Participer à un atelier",
    promptFr:
      "Votre équipe refuse l’atelier de communication interculturelle. Convainquez-les de participer.",
    hintsEn: "ROI for team cohesion; short-term vs long-term.",
    timeGuideSec: 180,
  },
  {
    id: "so-18",
    taskType: "opinion",
    titleFr: "Vie privée et données",
    promptFr:
      "Acceptez-vous que les entreprises collectent vos données pour améliorer leurs services ? Justifiez.",
    hintsEn: "Trade-off vocabulary: en contrepartie / à condition que.",
    timeGuideSec: 150,
  },
  {
    id: "so-19",
    taskType: "information",
    titleFr: "Événement culturel",
    promptFr:
      "Vous demandez des informations sur un festival : programmation, accessibilité, billetterie et transport.",
    hintsEn: "Check understanding: si j’ai bien compris…",
    timeGuideSec: 120,
  },
  {
    id: "so-20",
    taskType: "convince",
    titleFr: "Bénévolat",
    promptFr:
      "Recrutez un ami pour une journée de bénévolat local. Répondez à ses objections (temps, utilité).",
    hintsEn: "Personal story + community impact.",
    timeGuideSec: 180,
  },
];
