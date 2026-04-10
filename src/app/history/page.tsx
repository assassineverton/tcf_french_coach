"use client";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HistoryPage() {
  const [data, setData] = useState<{
    writingPieces: { id: string; prompt: string; createdAt: string; scoreBand: string | null }[];
    speakingSessions: { id: string; taskType: string; createdAt: string }[];
  } | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.user)
          setData({
            writingPieces: d.user.writingPieces ?? [],
            speakingSessions: d.user.speakingSessions ?? [],
          });
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Historique des corrections</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Productions analysées — ouvrez le coach pour comparer vos versions successives.
        </p>
      </div>

      <Card>
        <CardTitle className="text-base">Expression écrite</CardTitle>
        {!data?.writingPieces?.length ? (
          <CardDescription className="mt-2">Aucune entrée pour l’instant.</CardDescription>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {data.writingPieces.map((w) => (
              <li key={w.id} className="rounded-lg border border-[var(--card-border)] p-3">
                <p className="font-medium line-clamp-2">{w.prompt}</p>
                <p className="text-xs text-[var(--muted)]">
                  {new Date(w.createdAt).toLocaleString()} · {w.scoreBand ?? "—"}
                </p>
              </li>
            ))}
          </ul>
        )}
        <Link href="/writing" className="mt-3 inline-block text-sm text-brand-600 dark:text-brand-300">
          Nouvelle production →
        </Link>
      </Card>

      <Card>
        <CardTitle className="text-base">Expression orale</CardTitle>
        {!data?.speakingSessions?.length ? (
          <CardDescription className="mt-2">Aucune session enregistrée.</CardDescription>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {data.speakingSessions.map((s) => (
              <li key={s.id} className="rounded-lg border border-[var(--card-border)] p-3">
                <p className="font-medium">{s.taskType}</p>
                <p className="text-xs text-[var(--muted)]">{new Date(s.createdAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
        <Link href="/speaking" className="mt-3 inline-block text-sm text-brand-600 dark:text-brand-300">
          Nouvelle simulation →
        </Link>
      </Card>
    </div>
  );
}
