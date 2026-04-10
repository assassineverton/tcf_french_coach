/** Client-side fallback metrics when API returns empty */
export const DEMO_DASHBOARD = {
  streak: 4,
  cefrEstimate: "B1+",
  mockScores: [
    { section: "Expression écrite", score: 11, maxScore: 20 },
    { section: "Expression orale", score: 9, maxScore: 20 },
  ],
  weakAreas: ["Subjonctif déclenché", "Structuration orale", "Registre formel à l’écrit"],
  dailyPlan: [
    { title: "Oral — tâche d’opinion (12 min)", done: false },
    { title: "Connecteurs — flashcards SRS (8 min)", done: false },
    { title: "Écrit — courriel formel (20 min)", done: false },
    { title: "Compréhension écrite — 1 texte (10 min)", done: true },
  ],
  recommended: [
    "Enregistrer 2 minutes d’opinion avec minuteur",
    "Réécrire un email au niveau B2",
    "Quiz : imparfait vs passé composé",
  ],
};
