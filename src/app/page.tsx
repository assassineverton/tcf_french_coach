"use client";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { DEMO_DASHBOARD } from "@/lib/demo-dashboard";
import { getDailyOralPrompt } from "@/lib/content/speaking-prompts";
import Link from "next/link";
import { differenceInCalendarDays } from "date-fns";
import { useEffect, useMemo, useState } from "react";

type ProfileUser = {
  profile: {
    examDate: string | null;
    targetLevel: string;
    currentEstimate: string;
    dailyMinutes: number;
    streakDays: number;
    weaknessesJson: string;
    strengthsJson: string;
    studyPlanDaily: string | null;
  } | null;
  mockExams: { section: string; score: number; maxScore: number }[];
};

export default function DashboardPage() {
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setErr(d.error);
        else setUser(d.user);
      })
      .catch(() => setErr("Réseau indisponible"))
      .finally(() => setLoading(false));
  }, []);

  const dailyOral = useMemo(() => getDailyOralPrompt(), []);

  const examCountdown = useMemo(() => {
    const iso = user?.profile?.examDate;
    if (!iso) return null;
    const days = differenceInCalendarDays(new Date(iso), new Date());
    return days >= 0 ? days : null;
  }, [user]);

  const weakAreas = useMemo(() => {
    try {
      const w = user?.profile?.weaknessesJson;
      if (w) return JSON.parse(w) as string[];
    } catch {
      /* ignore */
    }
    return DEMO_DASHBOARD.weakAreas;
  }, [user]);

  const streak = user?.profile?.streakDays ?? DEMO_DASHBOARD.streak;
  const estimate = user?.profile?.currentEstimate ?? DEMO_DASHBOARD.cefrEstimate;
  const mockRows = user?.mockExams?.length ? user.mockExams : DEMO_DASHBOARD.mockScores;

  const readiness = Math.min(
    100,
    Math.round(
      mockRows.reduce((a, r) => a + (r.score / r.max) * 50, 0) / Math.max(1, mockRows.length),
    ) + 15,
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Tableau de bord</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Vue d’ensemble — plan du jour, progression et objectif B2.
        </p>
      </div>

      {err && (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardTitle className="text-base">Mode dégradé</CardTitle>
          <CardDescription>
            {err} — des exemples de données s’affichent pour explorer l’interface.
          </CardDescription>
        </Card>
      )}

      {loading ? (
        <p className="text-sm text-[var(--muted)]">Chargement du profil…</p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardTitle className="text-base">Compte à rebours</CardTitle>
          <CardDescription>
            {examCountdown !== null ? (
              <span className="text-foreground text-2xl font-semibold">{examCountdown} jours</span>
            ) : (
              <span>Définissez votre date d’examen dans le plan d’études.</span>
            )}
          </CardDescription>
          <Link href="/planner" className="mt-3 inline-block text-sm text-brand-600 dark:text-brand-300">
            Paramètres du plan →
          </Link>
        </Card>
        <Card>
          <CardTitle className="text-base">Série & estimation</CardTitle>
          <p className="mt-2 text-3xl font-semibold">{streak} jours</p>
          <p className="text-sm text-[var(--muted)]">Estimation CECRL : {estimate}</p>
        </Card>
        <Card>
          <CardTitle className="text-base">Préparation (indicatif)</CardTitle>
          <p className="mt-2 text-sm text-[var(--muted)]">Lecture des scores blancs + régularité</p>
          <div className="mt-3">
            <ProgressBar value={readiness} />
            <p className="mt-1 text-xs text-[var(--muted)]">{readiness}% prêtitude estimée</p>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle className="text-base">Plan du jour</CardTitle>
          <CardDescription>Séquence recommandée (ajustez selon votre temps disponible).</CardDescription>
          <ul className="mt-4 space-y-2 text-sm">
            {DEMO_DASHBOARD.dailyPlan.map((t) => (
              <li
                key={t.title}
                className="flex items-start justify-between gap-2 rounded-lg border border-[var(--card-border)] px-3 py-2"
              >
                <span>{t.title}</span>
                <span className="text-xs text-[var(--muted)]">{t.done ? "fait" : "à faire"}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardTitle className="text-base">Question orale du jour</CardTitle>
          <CardDescription>{dailyOral.titleFr}</CardDescription>
          <p className="mt-3 text-sm leading-relaxed">{dailyOral.promptFr}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/speaking">
              <Button type="button">S’entraîner</Button>
            </Link>
            <Link href="/tutor">
              <Button type="button" variant="secondary">
                Demander une structure B2 au coach
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle className="text-base">Scores blancs récents</CardTitle>
          <ul className="mt-3 space-y-2 text-sm">
            {mockRows.map((m) => (
              <li key={m.section} className="flex justify-between gap-2">
                <span>{m.section}</span>
                <span className="text-[var(--muted)]">
                  {m.score}/{m.maxScore}
                </span>
              </li>
            ))}
          </ul>
          <Link href="/mock-exam" className="mt-3 inline-block text-sm text-brand-600 dark:text-brand-300">
            Lancer un examen blanc →
          </Link>
        </Card>

        <Card>
          <CardTitle className="text-base">Axes à renforcer</CardTitle>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
            {weakAreas.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-[var(--muted)]">Prochaines tâches suggérées :</p>
          <ul className="mt-2 space-y-1 text-sm">
            {DEMO_DASHBOARD.recommended.map((r) => (
              <li key={r}>• {r}</li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
