"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const SECTIONS = [
  { key: "Compréhension écrite", max: 699 },
  { key: "Compréhension orale", max: 699 },
  { key: "Expression écrite", max: 20 },
  { key: "Expression orale", max: 20 },
];

export default function MockExamPage() {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [msg, setMsg] = useState<string | null>(null);

  async function save() {
    setMsg(null);
    for (const s of SECTIONS) {
      const v = scores[s.key];
      if (v === undefined) continue;
      await fetch("/api/mock-exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: s.key,
          score: Math.round(v),
          maxScore: s.max,
          notes: "Examen blanc manuel",
        }),
      }).catch(() => {});
    }
    setMsg("Scores enregistrés sur votre profil.");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Examen blanc</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Saisissez des scores indicatifs (TCF Canada : comp. sur 699, expression sur 20 selon épreuve).
        </p>
      </div>

      <Card>
        <CardTitle className="text-base">Saisie rapide</CardTitle>
        <CardDescription>Adaptez les barèmes à votre format d’essai.</CardDescription>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {SECTIONS.map((s) => (
            <label key={s.key} className="text-sm">
              <span className="text-[var(--muted)]">
                {s.key} (max {s.max})
              </span>
              <Input
                type="number"
                className="mt-1"
                value={scores[s.key] ?? ""}
                onChange={(e) =>
                  setScores((x) => ({ ...x, [s.key]: Number(e.target.value) }))
                }
              />
            </label>
          ))}
        </div>
        <Button type="button" className="mt-4" onClick={save}>
          Enregistrer
        </Button>
        {msg ? <p className="mt-2 text-sm">{msg}</p> : null}
      </Card>
    </div>
  );
}
