"use client";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

export default function MistakesPage() {
  const [mistakes, setMistakes] = useState<
    { id: string; category: string; pattern: string; count: number }[]
  >([]);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        setMistakes(d.user?.mistakes ?? []);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Carnet d’erreurs</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Les entrées seront enrichies automatiquement quand vous activerez la détection de motifs (itération
          suivante : agrégation post-correction IA).
        </p>
      </div>

      <Card>
        <CardTitle className="text-base">Motifs récurrents</CardTitle>
        {!mistakes.length ? (
          <CardDescription className="mt-2">
            Pas encore de données — continuez à soumettre des textes et oraux pour alimenter le suivi.
          </CardDescription>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {mistakes.map((m) => (
              <li key={m.id} className="rounded-lg border border-[var(--card-border)] p-3">
                <p className="font-medium">
                  {m.category} · {m.pattern}
                </p>
                <p className="text-xs text-[var(--muted)]">Observations : {m.count}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
