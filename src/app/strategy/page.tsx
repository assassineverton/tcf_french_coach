import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const SECTIONS = [
  {
    title: "Expression orale — ce que cherche l’examinateur",
    points: [
      "Tâche accomplie : vous répondez vraiment à la consigne (pas un monologue hors-sujet).",
      "Cohérence : introduction courte, 2 idées, mini-conclusion.",
      "Registre stable : tutoiement/vouvoiement cohérent selon la situation.",
      "Gestion du temps : mieux vaut une fin propre qu’un développement infini.",
    ],
  },
  {
    title: "Expression écrite — structure gagnante",
    points: [
      "Annoncez votre plan en une phrase (je vais d’abord… puis… enfin…).",
      "Un paragraphe = une idée ; utilisez des connecteurs logiques visibles.",
      "Conclusion qui répond clairement à la question, sans nouveauté absolue.",
      "Relisez 3 minutes : accords, articles, temps verbaux, ponctuation.",
    ],
  },
  {
    title: "Temps & gestion d’examen",
    points: [
      "Lisez deux fois la consigne : type de texte, destinataire, ton, limites de mots.",
      "Gardez 10–15 % du temps pour la relecture à l’écrit ; à l’oral, gardez une phrase de clôture prête.",
      "Si vous bloquez, paraphrasez : « Autrement dit… », « Cela signifie que… ».",
    ],
  },
  {
    title: "Erreurs qui bloquent sous B2",
    points: [
      "Réponses trop courtes sans justification ni exemple.",
      "Erreurs systématiques d’accord qui nuisent à la lisibilité.",
      "Registre familier dans un courriel formel (je suis désolé mais bon…).",
      "Absence de nuance : B2 = concession + reformulation.",
    ],
  },
];

const TEMPLATES = [
  {
    title: "Donner son opinion",
    fr: "À mon sens, … Toutefois, il convient de nuancer : … En définitive, …",
  },
  {
    title: "Comparer",
    fr: "D’une part, … D’autre part, … Si l’on compare ces deux options, …",
  },
  {
    title: "Demander poliment",
    fr: "Je me permets de vous contacter afin de… Pourriez-vous me préciser si… ?",
  },
  {
    title: "Persuader",
    fr: "Je comprends votre réticence. Néanmoins, deux éléments plaident en faveur de…",
  },
  {
    title: "Courriel formel",
    fr: "Objet : …\nMadame, Monsieur,\nJe vous écris concernant…\nJe vous remercie par avance…\nCordialement,",
  },
];

export default function StrategyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Stratégie TCF</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Méthode d’examen, attentes des correcteurs, et modèles réutilisables.
        </p>
      </div>

      {SECTIONS.map((s) => (
        <Card key={s.title}>
          <CardTitle className="text-base">{s.title}</CardTitle>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
            {s.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </Card>
      ))}

      <Card>
        <CardTitle className="text-base">Modèles pratiques</CardTitle>
        <CardDescription>À adapter à votre style — pas à réciter mot pour mot.</CardDescription>
        <div className="mt-4 space-y-4 text-sm">
          {TEMPLATES.map((t) => (
            <div key={t.title} className="rounded-xl border border-[var(--card-border)] p-3">
              <p className="font-semibold">{t.title}</p>
              <p className="mt-2 whitespace-pre-wrap text-[var(--muted)]">{t.fr}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
