"use client";

import { PageHeader } from "@/components/premium/page-header";
import { SkillBreakdown } from "@/components/premium/skill-breakdown";
import { StatCard } from "@/components/premium/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { DEMO_DASHBOARD } from "@/lib/demo-dashboard";
import { getDailyOralPrompt } from "@/lib/content/speaking-prompts";
import { differenceInCalendarDays } from "date-fns";
import { CalendarClock, Flame, Library, LineChart, Target } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart as RLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Summary = {
  user: {
    profile: {
      examDate: string | null;
      currentEstimate: string;
      streakDays: number;
      weaknessesJson: string;
      dailyMinutes: number;
    } | null;
    mockExams: { section: string; score: number; maxScore: number }[];
  } | null;
  libraryCounts: Record<string, number> | null;
  skillBreakdown: Record<string, { attempts: number; avgPct: number | null }> | null;
  recentQuizChart: { label: string; pct: number; date: string }[];
};

export default function DashboardPage() {
  const [data, setData] = useState<Summary | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/summary")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setErr(d.error);
        else setData(d);
      })
      .catch(() => setErr("Réseau indisponible"))
      .finally(() => setLoading(false));
  }, []);

  const dailyOral = useMemo(() => getDailyOralPrompt(), []);

  const examCountdown = useMemo(() => {
    const iso = data?.user?.profile?.examDate;
    if (!iso) return null;
    const days = differenceInCalendarDays(new Date(iso), new Date());
    return days >= 0 ? days : null;
  }, [data]);

  const weakAreas = useMemo(() => {
    try {
      const w = data?.user?.profile?.weaknessesJson;
      if (w) return JSON.parse(w) as string[];
    } catch {
      /* ignore */
    }
    return DEMO_DASHBOARD.weakAreas;
  }, [data]);

  const streak = data?.user?.profile?.streakDays ?? DEMO_DASHBOARD.streak;
  const estimate = data?.user?.profile?.currentEstimate ?? DEMO_DASHBOARD.cefrEstimate;
  const mockRows = data?.user?.mockExams?.length ? data.user.mockExams : DEMO_DASHBOARD.mockScores;

  const readiness = Math.min(
    100,
    Math.round(
      mockRows.reduce((a, r) => a + (r.score / r.maxScore) * 50, 0) / Math.max(1, mockRows.length),
    ) + 12,
  );

  const skills =
    data?.skillBreakdown ??
    ({
      speaking: { attempts: 0, avgPct: null },
      writing: { attempts: 0, avgPct: null },
      reading: { attempts: 0, avgPct: null },
      listening: { attempts: 0, avgPct: null },
      grammar: { attempts: 0, avgPct: null },
      vocabulary: { attempts: 0, avgPct: null },
    } as Summary["skillBreakdown"]);

  const chartData =
    data?.recentQuizChart?.length ?
      data.recentQuizChart.map((r, i) => ({ name: `#${i + 1}`, pct: r.pct }))
    : [
        { name: "Q1", pct: 62 },
        { name: "Q2", pct: 71 },
        { name: "Q3", pct: 58 },
      ];

  const lib = data?.libraryCounts;

  return (
    <div className="space-y-10">
      <PageHeader
        title="Pilotage d’examen"
        subtitle="Vue premium pour le TCF Canada : rythme du jour, compétences, bibliothèque autorisée et prochaines actions à fort impact."
        action={
          <Link href="/admin/import">
            <Button type="button" variant="secondary">
              Importer du contenu
            </Button>
          </Link>
        }
      />

      {err ? (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
          {err} — affichage partiel avec données de secours.
        </p>
      ) : null}
      {loading ? <p className="text-sm text-[var(--muted)]">Chargement du tableau de bord…</p> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Compte à rebours"
          value={examCountdown !== null ? `${examCountdown} j` : "—"}
          hint="Définissez la date dans le planificateur."
          icon={CalendarClock}
        />
        <StatCard label="Série" value={`${streak} j`} hint="Régularité = progression durable." icon={Flame} />
        <StatCard label="Estimation" value={estimate} hint="Objectif conseillé : B2 stable." icon={Target} />
        <StatCard
          label="Préparation"
          value={`${readiness}%`}
          hint="Indicateur composite (blancs + régularité)."
          icon={LineChart}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-[var(--hairline)] bg-[var(--card-elevated)] shadow-[var(--shadow-soft)] lg:col-span-2">
          <CardTitle className="font-serif text-xl">Tâches du jour</CardTitle>
          <CardDescription>Ordre suggéré — ajustez selon vos minutes disponibles.</CardDescription>
          <ul className="mt-5 space-y-3 text-sm">
            {DEMO_DASHBOARD.dailyPlan.map((t) => (
              <li
                key={t.title}
                className="flex items-center justify-between gap-3 rounded-xl border border-[var(--hairline)] px-4 py-3"
              >
                <span>{t.title}</span>
                <span className="text-xs text-[var(--muted)]">{t.done ? "Terminé" : "À faire"}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/practice/speaking">
              <Button type="button">Oral structuré</Button>
            </Link>
            <Link href="/practice/writing">
              <Button type="button" variant="secondary">
                Écrit + correction IA
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="border-[var(--hairline)] bg-[var(--card-elevated)] shadow-[var(--shadow-soft)]">
          <CardTitle className="font-serif text-xl">Question orale</CardTitle>
          <CardDescription className="line-clamp-2">{dailyOral.titleFr}</CardDescription>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{dailyOral.promptFr}</p>
          <Link href="/practice/speaking" className="mt-4 inline-block text-sm font-medium text-[var(--accent)]">
            Ouvrir le studio oral →
          </Link>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-[var(--hairline)] bg-[var(--card-elevated)] shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="font-serif text-xl">Répartition des compétences</CardTitle>
            <Link href="/progress" className="text-xs font-medium text-[var(--accent)]">
              Détails
            </Link>
          </div>
          <CardDescription>Basé sur vos tentatives enregistrées (PracticeAttempt).</CardDescription>
          <div className="mt-5">
            <SkillBreakdown data={skills!} />
          </div>
        </Card>

        <Card className="border-[var(--hairline)] bg-[var(--card-elevated)] shadow-[var(--shadow-soft)]">
          <CardTitle className="font-serif text-xl">Performance récente</CardTitle>
          <CardDescription>Quiz rapides — pour tendance, pas pour prédiction officielle.</CardDescription>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RLineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="pct" stroke="var(--accent)" strokeWidth={2} dot />
              </RLineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-[var(--hairline)] bg-[var(--card-elevated)] shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between">
            <CardTitle className="font-serif text-xl">Bibliothèque (contenu autorisé)</CardTitle>
            <Library className="h-5 w-5 text-[var(--muted)]" />
          </div>
          <CardDescription>Imports JSON / CSV / MD — droits attestés par l’utilisateur.</CardDescription>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-[var(--hairline)] px-3 py-2">
              <dt className="text-xs text-[var(--muted)]">Oral</dt>
              <dd className="font-semibold">{lib?.speaking ?? "—"}</dd>
            </div>
            <div className="rounded-lg border border-[var(--hairline)] px-3 py-2">
              <dt className="text-xs text-[var(--muted)]">Écrit</dt>
              <dd className="font-semibold">{lib?.writing ?? "—"}</dd>
            </div>
            <div className="rounded-lg border border-[var(--hairline)] px-3 py-2">
              <dt className="text-xs text-[var(--muted)]">Lecture</dt>
              <dd className="font-semibold">{lib?.reading ?? "—"}</dd>
            </div>
            <div className="rounded-lg border border-[var(--hairline)] px-3 py-2">
              <dt className="text-xs text-[var(--muted)]">Écoute</dt>
              <dd className="font-semibold">{lib?.listening ?? "—"}</dd>
            </div>
            <div className="rounded-lg border border-[var(--hairline)] px-3 py-2">
              <dt className="text-xs text-[var(--muted)]">Grammaire</dt>
              <dd className="font-semibold">{lib?.grammar ?? "—"}</dd>
            </div>
            <div className="rounded-lg border border-[var(--hairline)] px-3 py-2">
              <dt className="text-xs text-[var(--muted)]">Vocabulaire</dt>
              <dd className="font-semibold">{lib?.vocabulary ?? "—"}</dd>
            </div>
          </dl>
          <Link href="/library" className="mt-4 inline-block text-sm font-medium text-[var(--accent)]">
            Ouvrir la bibliothèque →
          </Link>
        </Card>

        <Card className="border-[var(--hairline)] bg-[var(--card-elevated)] shadow-[var(--shadow-soft)]">
          <CardTitle className="font-serif text-xl">Axes à renforcer</CardTitle>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm">
            {weakAreas.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm font-medium text-[var(--foreground)]">Recommandations</p>
          <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
            {DEMO_DASHBOARD.recommended.map((r) => (
              <li key={r}>• {r}</li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="border-[var(--hairline)] bg-[var(--card-elevated)] shadow-[var(--shadow-soft)]">
        <CardTitle className="font-serif text-xl">Scores blancs récents</CardTitle>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {mockRows.map((m) => (
            <div key={m.section} className="flex items-center justify-between rounded-xl border border-[var(--hairline)] px-4 py-3 text-sm">
              <span>{m.section}</span>
              <span className="font-medium">
                {m.score}/{m.maxScore}
              </span>
            </div>
          ))}
        </div>
        <Link href="/mock-exam" className="mt-4 inline-block text-sm font-medium text-[var(--accent)]">
          Enregistrer un nouveau blanc →
        </Link>
      </Card>
    </div>
  );
}
