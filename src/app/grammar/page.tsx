"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CONNECTORS } from "@/lib/content/connectors";
import { GRAMMAR_DRILLS } from "@/lib/content/grammar-drills";
import { useMemo, useState } from "react";

export default function GrammarPage() {
  const [idx, setIdx] = useState(0);
  const [show, setShow] = useState(false);
  const card = CONNECTORS[idx % CONNECTORS.length]!;

  const [qIdx, setQIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const drill = GRAMMAR_DRILLS[qIdx % GRAMMAR_DRILLS.length]!;

  async function submitQuiz(correct: boolean) {
    await fetch("/api/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        module: "grammar",
        topic: drill.topic,
        score: correct ? 1 : 0,
        total: 1,
        details: { exerciseId: drill.id },
      }),
    }).catch(() => {});
  }

  function checkDrill() {
    const norm = (s: string) =>
      s
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    const ok =
      norm(answer) === norm(drill.answer) ||
      drill.alternatives?.some((a) => norm(answer) === norm(a));
    setResult(ok ? "Correct — bravo." : `À retravailler : attendu « ${drill.answer} »`);
    void submitQuiz(ok);
  }

  const srsHint = useMemo(
    () => "SRS : répétez les cartes « difficiles » le lendemain ; les faciles dans 3–7 jours.",
    [],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Grammaire & vocabulaire</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Flashcards connecteurs + micro-quiz (conjugaison, temps, pronoms, prépositions).
        </p>
      </div>

      <Card>
        <CardTitle className="text-base">Flashcards — connecteurs & formules</CardTitle>
        <CardDescription>{srsHint}</CardDescription>
        <div className="mt-4 rounded-xl border border-[var(--card-border)] p-4 text-center">
          <p className="text-xs uppercase text-[var(--muted)]">{card.category}</p>
          <p className="mt-3 text-lg font-medium">{show ? card.fr : "???"}</p>
          {show ? (
            <p className="mt-2 text-sm text-[var(--muted)]">{card.en}</p>
          ) : (
            <p className="mt-2 text-sm text-[var(--muted)]">Registre : {card.register}</p>
          )}
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Button type="button" variant="secondary" onClick={() => setShow((s) => !s)}>
            {show ? "Masquer" : "Révéler"}
          </Button>
          <Button
            type="button"
            onClick={() => {
              setIdx((i) => i + 1);
              setShow(false);
            }}
          >
            Carte suivante
          </Button>
        </div>
      </Card>

      <Card>
        <CardTitle className="text-base">Quiz express</CardTitle>
        <p className="mt-3 text-sm leading-relaxed">{drill.promptFr}</p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <Input value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Votre réponse" />
          <Button type="button" onClick={checkDrill}>
            Vérifier
          </Button>
        </div>
        {result ? <p className="mt-2 text-sm">{result}</p> : null}
        <div className="mt-3 rounded-lg bg-black/5 p-3 text-sm dark:bg-white/5">
          <p className="font-medium">Explication</p>
          <p className="mt-1">{drill.explanationFr}</p>
          <p className="mt-1 text-[var(--muted)]">{drill.explanationEn}</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          className="mt-3"
          onClick={() => {
            setQIdx((i) => i + 1);
            setAnswer("");
            setResult(null);
          }}
        >
          Question suivante
        </Button>
      </Card>
    </div>
  );
}
