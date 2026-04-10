export interface B1B2Upgrade {
  id: string;
  label: string;
  b1: string;
  b2: string;
  why: string;
}

export const B1_B2_UPGRADES: B1B2Upgrade[] = [
  {
    id: "u1",
    label: "Opinion",
    b1: "Je pense que c’est une bonne idée.",
    b2: "À mon sens, cette solution présente un réel intérêt, car elle répond à un besoin concret.",
    why: "B2 adds framing (à mon sens), precision (réel intérêt), and justification (car).",
  },
  {
    id: "u2",
    label: "Contrast",
    b1: "C’est pratique mais c’est cher.",
    b2: "Si cette option est indéniablement pratique, elle demeure toutefois coûteuse pour un budget serré.",
    why: "Formal connectors + nuance (si…, demeure, toutefois) lift the register.",
  },
  {
    id: "u3",
    label: "Cause",
    b1: "Il pleut donc on reste.",
    b2: "Étant donné les intempéries annoncées, il serait plus pertinent de reporter la sortie.",
    why: "Cause as a clause + modal of judgment (serait plus pertinent).",
  },
  {
    id: "u4",
    label: "Concession",
    b1: "Même si c’est difficile, je vais essayer.",
    b2: "Bien que la tâche soit ardue, je suis déterminé(e) à m’y atteler méthodiquement.",
    why: "Subjunctive trigger (bien que) + precise vocabulary (ardeur, s’y atteler).",
  },
  {
    id: "u5",
    label: "Request",
    b1: "Donnez-moi des informations.",
    b2: "Pourriez-vous m’indiquer, le cas échéant, les modalités d’inscription ?",
    why: "Conditional politeness + formal vocabulary (modalités, le cas échéant).",
  },
  {
    id: "u6",
    label: "Hypothesis",
    b1: "Si j’ai le temps, je viendrai.",
    b2: "À supposer que mon emploi du temps le permette, je confirmerai ma présence sous 48 heures.",
    why: "Formal hypothesis + professional closure.",
  },
  {
    id: "u7",
    label: "Problem-solution",
    b1: "Il y a un problème avec le bruit.",
    b2: "Le nuisances sonores nocturnes nuisent à la concentration ; je propose donc un rappel au règlement.",
    why: "Nominalization + structured proposal.",
  },
  {
    id: "u8",
    label: "Comparison",
    b1: "Les deux sont bien mais différents.",
    b2: "Ces deux approches se distinguent surtout par leur coût et leur flexibilité.",
    why: "Verb of analysis (se distinguer) + explicit criteria.",
  },
  {
    id: "u9",
    label: "Persuasion",
    b1: "Tu dois venir, c’est important.",
    b2: "Je vous invite à envisager cette participation : elle renforcerait la cohésion d’équipe à moyen terme.",
    why: "Soft persuasion + benefit framing + time horizon.",
  },
  {
    id: "u10",
    label: "Summary",
    b1: "En conclusion, c’est utile.",
    b2: "En définitive, les avantages l’emportent, sous réserve d’une mise en œuvre encadrée.",
    why: "Balanced conclusion (sous réserve de) shows examiner-friendly nuance.",
  },
  {
    id: "u11",
    label: "Oral fluency",
    b1: "Euh… je ne sais pas trop.",
    b2: "Si je dois trancher, je pencherais pour l’option A, pour deux raisons principales.",
    why: "Meta-structuring buys thinking time and signals B2 control.",
  },
  {
    id: "u12",
    label: "Precision",
    b1: "Beaucoup de gens pensent ça.",
    b2: "Une partie non négligeable des usagers semble partager cette perception.",
    why: "Avoids vague 'beaucoup'; adds discipline and register.",
  },
];
