"use client";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useMemo, useState } from "react";

export default function ProgressPage() {
  const [user, setUser] = useState<{
    mockExams: { section: string; score: number; maxScore: number }[];
    quizAttempts: { module: string; score: number; total: number }[];
    writingPieces: { scoreBand: string | null }[];
    speakingSessions: { id: string }[];
  } | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) setUser(d.user);
      })
      .catch(() => {});
  }, []);

  const chartData = useMemo(() => {
    if (!user?.mockExams?.length) {
      return [
        { name: "Écrit", score: 11, max: 20 },
        { name: "Oral", score: 9, max: 20 },
      ];
    }
    return user.mockExams.map((m) => ({
      name: m.section.replace("Expression ", "").slice(0, 8),
      score: m.score,
      max: m.maxScore,
    }));
  }, [user]);

  const quizAvg =
    user?.quizAttempts?.length ?
      user.quizAttempts.reduce((a, q) => a + q.score / Math.max(1, q.total), 0) /
      user.quizAttempts.length
    : 0.65;

  const topWeak = [
    "Subjonctif après déclencheurs",
    "Cadre oral (introduction + conclusion)",
    "Registre formel à l’écrit",
    "Connecteurs de concession",
    "Temps du passé (PC vs imparfait)",
  ];
  const topGain = [
    "Richesse lexicale des emails",
    "Fluidité avec connecteurs",
    "Reformulation polie à l’oral",
    "Structuration « thèse-antithèse »",
    "Précision des exemples",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Progrès</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Tendances, erreurs récurrentes, et lecture de « préparation examen » (indicatif).
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardTitle className="text-base">Quiz grammaire (moy.)</CardTitle>
          <p className="mt-2 text-2xl font-semibold">{Math.round(quizAvg * 100)}%</p>
          <div className="mt-3">
            <ProgressBar value={quizAvg * 100} />
          </div>
        </Card>
        <Card>
          <CardTitle className="text-base">Productions analysées</CardTitle>
          <p className="mt-2 text-2xl font-semibold">{user?.writingPieces?.length ?? 0}</p>
          <CardDescription>Textes avec retour détaillé</CardDescription>
        </Card>
        <Card>
          <CardTitle className="text-base">Sessions orales</CardTitle>
          <p className="mt-2 text-2xl font-semibold">{user?.speakingSessions?.length ?? 0}</p>
          <CardDescription>Simulations + analyses</CardDescription>
        </Card>
      </div>

      <Card>
        <CardTitle className="text-base">Scores blancs</CardTitle>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="score" fill="#1a6fd4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardTitle className="text-base">Top 5 faiblesses (à travailler)</CardTitle>
          <ul className="mt-3 list-decimal space-y-1 pl-5 text-sm">
            {topWeak.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardTitle className="text-base">Top 5 progrès récents</CardTitle>
          <ul className="mt-3 list-decimal space-y-1 pl-5 text-sm">
            {topGain.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
