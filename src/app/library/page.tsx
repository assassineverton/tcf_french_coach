"use client";

import { PageHeader } from "@/components/premium/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";

type Batch = {
  id: string;
  createdAt: string;
  format: string;
  sourceLabel: string;
  originalFileName: string | null;
  itemCountsJson: string;
};

export default function LibraryPage() {
  const [counts, setCounts] = useState<Record<string, number> | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/library")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setErr(d.error);
        else {
          setCounts(d.counts);
          setBatches(d.batches ?? []);
        }
      })
      .catch(() => setErr("Impossible de charger la bibliothèque."));
  }, []);

  const tiles = [
    { key: "speaking", label: "Expression orale", href: "/practice/speaking" },
    { key: "writing", label: "Expression écrite", href: "/practice/writing" },
    { key: "reading", label: "Compréhension écrite", href: "/practice/reading" },
    { key: "listening", label: "Compréhension orale", href: "/practice/listening" },
    { key: "grammar", label: "Grammaire", href: "/practice/grammar" },
    { key: "vocabulary", label: "Vocabulaire", href: "/phrases" },
  ];

  return (
    <div className="space-y-10">
      <PageHeader
        title="Bibliothèque pédagogique"
        subtitle="Contenu que vous importez ou détenez légalement : sujets, textes, drills et banques. Aucun scraping ni banque tierce protégée."
        action={
          <Link href="/admin/import">
            <Button type="button">Importer</Button>
          </Link>
        }
      />

      {err ? (
        <p className="rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-800 dark:text-red-200">
          {err}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tiles.map((t) => (
          <Link key={t.key} href={t.href}>
            <Card className="h-full border-[var(--hairline)] bg-[var(--card-elevated)] shadow-[var(--shadow-soft)] transition hover:border-[var(--accent)]/40">
              <CardTitle className="font-serif text-lg">{t.label}</CardTitle>
              <CardDescription>
                {counts ? `${counts[t.key] ?? 0} élément(s) indexé(s)` : "Chargement…"}
              </CardDescription>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="border-[var(--hairline)] bg-[var(--card-elevated)] shadow-[var(--shadow-soft)]">
        <CardTitle className="font-serif text-xl">Lots d’import</CardTitle>
        <CardDescription>Traçabilité : format, source déclarée, décompte d’items.</CardDescription>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--hairline)] text-[var(--muted)]">
                <th className="py-2 pr-3">Date</th>
                <th className="py-2 pr-3">Source</th>
                <th className="py-2 pr-3">Format</th>
                <th className="py-2 pr-3">Fichier</th>
                <th className="py-2">Items</th>
              </tr>
            </thead>
            <tbody>
              {batches.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-[var(--muted)]">
                    Aucun import pour l’instant — ajoutez un JSON autorisé depuis l’admin.
                  </td>
                </tr>
              ) : (
                batches.map((b) => (
                  <tr key={b.id} className="border-b border-[var(--hairline)]/70">
                    <td className="py-2 pr-3 whitespace-nowrap">
                      {new Date(b.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2 pr-3">{b.sourceLabel}</td>
                    <td className="py-2 pr-3">{b.format}</td>
                    <td className="py-2 pr-3">{b.originalFileName ?? "—"}</td>
                    <td className="py-2 font-mono text-xs">{b.itemCountsJson}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
