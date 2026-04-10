"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { READING_PASSAGES } from "@/lib/content/passages";
import { useState } from "react";

export default function ReadingPage() {
  const [pIdx, setPIdx] = useState(0);
  const passage = READING_PASSAGES[pIdx % READING_PASSAGES.length]!;
  const [choices, setChoices] = useState<Record<string, number>>({});
  const [showExp, setShowExp] = useState<Record<string, boolean>>({});

  function setChoice(qid: string, i: number) {
    setChoices((c) => ({ ...c, [qid]: i }));
  }

  async function saveScore() {
    let score = 0;
    for (const q of passage.questions) {
      if (choices[q.id] === q.correctIndex) score++;
    }
    await fetch("/api/comprehension", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        skill: "reading",
        passageId: passage.id,
        topic: passage.topic,
        difficulty: passage.difficulty,
        score,
        total: passage.questions.length,
      }),
    }).catch(() => {});
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Compréhension écrite</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Textes courts type examen — pièges, explications, suivi par thème.
        </p>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base">{passage.titleFr}</CardTitle>
          <span className="text-xs text-[var(--muted)]">
            {passage.topic} · {passage.difficulty}
          </span>
        </div>
        <p className="mt-4 text-sm leading-relaxed whitespace-pre-wrap">{passage.textFr}</p>
      </Card>

      {passage.questions.map((q) => (
        <Card key={q.id}>
          <CardTitle className="text-base text-sm font-medium">{q.promptFr}</CardTitle>
          <ul className="mt-3 space-y-2 text-sm">
            {q.choices.map((c, i) => {
              const picked = choices[q.id] === i;
              const correct = i === q.correctIndex;
              const revealed = choices[q.id] !== undefined;
              return (
                <li key={c}>
                  <button
                    type="button"
                    onClick={() => setChoice(q.id, i)}
                    className={`w-full rounded-lg border px-3 py-2 text-left transition-colors ${
                      revealed && correct
                        ? "border-green-600 bg-green-600/10"
                        : revealed && picked && !correct
                          ? "border-red-500 bg-red-500/10"
                          : picked
                            ? "border-brand-600"
                            : "border-[var(--card-border)] hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
                    {c}
                  </button>
                </li>
              );
            })}
          </ul>
          {choices[q.id] !== undefined ? (
            <div className="mt-3">
              <Button type="button" variant="secondary" onClick={() => setShowExp((s) => ({ ...s, [q.id]: !s[q.id] }))}>
                {showExp[q.id] ? "Masquer l’explication" : "Voir l’explication"}
              </Button>
              {showExp[q.id] ? (
                <CardDescription className="mt-2">{q.explanationFr}</CardDescription>
              ) : null}
              {q.trapTipEn && showExp[q.id] ? (
                <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">Piège : {q.trapTipEn}</p>
              ) : null}
            </div>
          ) : null}
        </Card>
      ))}

      <Button
        type="button"
        onClick={() => {
          void saveScore();
          setPIdx((i) => i + 1);
          setChoices({});
          setShowExp({});
        }}
      >
        Enregistrer & texte suivant
      </Button>
    </div>
  );
}
