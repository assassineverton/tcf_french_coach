"use client";

import { cn } from "@/lib/cn";

const LABELS: Record<string, string> = {
  speaking: "Expression orale",
  writing: "Expression écrite",
  reading: "Compréhension écrite",
  listening: "Compréhension orale",
  grammar: "Grammaire",
  vocabulary: "Vocabulaire",
};

export function SkillBreakdown({
  data,
}: {
  data: Record<string, { attempts: number; avgPct: number | null }>;
}) {
  const keys = ["speaking", "writing", "reading", "listening", "grammar", "vocabulary"] as const;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {keys.map((k) => {
        const row = data[k] ?? { attempts: 0, avgPct: null };
        const pct = row.avgPct ?? 0;
        return (
          <div
            key={k}
            className="rounded-xl border border-[var(--hairline)] bg-[var(--card)] px-4 py-3"
          >
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="font-medium">{LABELS[k] ?? k}</span>
              <span className={cn("text-xs text-[var(--muted)]")}>
                {row.attempts ? `${row.avgPct ?? "—"}% moy.` : "Pas encore de données"}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/[0.08]">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-all"
                style={{ width: `${Math.min(100, pct)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
