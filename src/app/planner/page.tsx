"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

export default function PlannerPage() {
  const [examDate, setExamDate] = useState("");
  const [targetLevel, setTargetLevel] = useState("B2");
  const [currentEstimate, setCurrentEstimate] = useState("B1+");
  const [dailyMinutes, setDailyMinutes] = useState(45);
  const [strengths, setStrengths] = useState("compréhension écrite");
  const [weaknesses, setWeaknesses] = useState("subjonctif, oral");
  const [msg, setMsg] = useState<string | null>(null);
  const [plan, setPlan] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        const p = d.user?.profile;
        if (!p) return;
        if (p.examDate) setExamDate(p.examDate.slice(0, 10));
        setTargetLevel(p.targetLevel ?? "B2");
        setCurrentEstimate(p.currentEstimate ?? "B1");
        setDailyMinutes(p.dailyMinutes ?? 45);
        try {
          const s = JSON.parse(p.strengthsJson || "[]") as string[];
          const w = JSON.parse(p.weaknessesJson || "[]") as string[];
          if (s.length) setStrengths(s.join(", "));
          if (w.length) setWeaknesses(w.join(", "));
        } catch {
          /* ignore */
        }
      })
      .catch(() => {});
  }, []);

  async function saveProfile() {
    setMsg(null);
    const r = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        examDate: examDate || null,
        targetLevel,
        currentEstimate,
        dailyMinutes,
        strengths: strengths.split(",").map((s) => s.trim()).filter(Boolean),
        weaknesses: weaknesses.split(",").map((s) => s.trim()).filter(Boolean),
      }),
    });
    if (!r.ok) setMsg("Impossible d’enregistrer le profil (DB ?)");
    else setMsg("Profil enregistré.");
  }

  async function generatePlan() {
    setLoading(true);
    setMsg(null);
    setPlan(null);
    try {
      const r = await fetch("/api/planner", { method: "POST" });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      setPlan(data.plan);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Erreur plan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Plan d’études personnalisé</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Paramètres → plan hebdomadaire généré par le coach (révision automatique si erreurs répétées).
        </p>
      </div>

      <Card>
        <CardTitle className="text-base">Profil examen</CardTitle>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="text-[var(--muted)]">Date d’examen</span>
            <Input type="date" className="mt-1" value={examDate} onChange={(e) => setExamDate(e.target.value)} />
          </label>
          <label className="text-sm">
            <span className="text-[var(--muted)]">Objectif CECRL</span>
            <Input className="mt-1" value={targetLevel} onChange={(e) => setTargetLevel(e.target.value)} />
          </label>
          <label className="text-sm">
            <span className="text-[var(--muted)]">Estimation actuelle</span>
            <Input className="mt-1" value={currentEstimate} onChange={(e) => setCurrentEstimate(e.target.value)} />
          </label>
          <label className="text-sm">
            <span className="text-[var(--muted)]">Minutes / jour</span>
            <Input
              type="number"
              min={15}
              max={240}
              className="mt-1"
              value={dailyMinutes}
              onChange={(e) => setDailyMinutes(Number(e.target.value))}
            />
          </label>
        </div>
        <label className="mt-3 block text-sm">
          <span className="text-[var(--muted)]">Forces (séparées par des virgules)</span>
          <Input className="mt-1" value={strengths} onChange={(e) => setStrengths(e.target.value)} />
        </label>
        <label className="mt-3 block text-sm">
          <span className="text-[var(--muted)]">Faiblesses</span>
          <Input className="mt-1" value={weaknesses} onChange={(e) => setWeaknesses(e.target.value)} />
        </label>
        <Button type="button" className="mt-4" variant="secondary" onClick={saveProfile}>
          Enregistrer le profil
        </Button>
        {msg ? <p className="mt-2 text-sm text-[var(--muted)]">{msg}</p> : null}
      </Card>

      <Card>
        <CardTitle className="text-base">Génération IA du plan</CardTitle>
        <CardDescription>Nécessite OPENAI_API_KEY. Le plan est stocké sur votre profil.</CardDescription>
        <Button type="button" className="mt-4" disabled={loading} onClick={generatePlan}>
          {loading ? "Génération…" : "Générer / mettre à jour la semaine"}
        </Button>
        {plan ? (
          <pre className="mt-4 max-h-[480px] overflow-auto rounded-xl bg-black/5 p-4 text-xs dark:bg-white/5">
            {JSON.stringify(plan, null, 2)}
          </pre>
        ) : null}
      </Card>
    </div>
  );
}
