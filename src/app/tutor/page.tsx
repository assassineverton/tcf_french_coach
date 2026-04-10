"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { CoachMode } from "@/lib/agent/prompts";
import { useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function TutorPage() {
  const [mode, setMode] = useState<CoachMode>("tutor");
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send() {
    const trimmed = input.trim();
    if (!trimmed) return;
    setError(null);
    setLoading(true);
    const nextMsgs = [...msgs, { role: "user" as const, content: trimmed }];
    setMsgs(nextMsgs);
    setInput("");
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          messages: nextMsgs.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error ?? "Erreur");
      setMsgs((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Coach IA — Exam Coach</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Modes : tuteur (explications), examinateur (notation réaliste), drill (répétitions rapides).
        </p>
      </div>

      <Tabs
        value={mode}
        onChange={(id) => setMode(id as CoachMode)}
        tabs={[
          { id: "tutor", label: "Tuteur" },
          { id: "examiner", label: "Examinateur" },
          { id: "drill", label: "Drill" },
        ]}
      />

      <Card>
        <CardTitle className="text-base">Conversation</CardTitle>
        <CardDescription>
          Le coach optimise le TCF (honnêteté, corrections à fort impact, modèles B2).
        </CardDescription>
        <div className="mt-4 max-h-[420px] space-y-3 overflow-y-auto rounded-xl border border-[var(--card-border)] p-3 text-sm">
          {msgs.length === 0 ? (
            <p className="text-[var(--muted)]">
              Exemple : « Donne-moi un plan B2 pour défendre une opinion en 2 minutes, puis corrige ma
              réponse. »
            </p>
          ) : (
            msgs.map((m, i) => (
              <div
                key={`${i}-${m.role}`}
                className={
                  m.role === "user"
                    ? "ml-8 rounded-lg bg-brand-600/10 p-3 dark:bg-brand-500/10"
                    : "mr-8 rounded-lg bg-black/5 p-3 dark:bg-white/5"
                }
              >
                <p className="text-xs font-semibold text-[var(--muted)]">
                  {m.role === "user" ? "Vous" : "Coach"}
                </p>
                <p className="mt-1 whitespace-pre-wrap">{m.content}</p>
              </div>
            ))
          )}
        </div>
        {error ? <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p> : null}
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez une question ou collez votre production orale/écrite…"
            className="min-h-[100px] flex-1"
          />
        </div>
        <div className="mt-2 flex gap-2">
          <Button type="button" disabled={loading} onClick={send}>
            {loading ? "Envoi…" : "Envoyer"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => setMsgs([])} disabled={loading}>
            Nouvelle session
          </Button>
        </div>
      </Card>
    </div>
  );
}
