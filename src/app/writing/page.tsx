"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { WRITING_PROMPTS, type WritingMode } from "@/lib/content/writing-prompts";
import { useMemo, useState } from "react";

export default function WritingPage() {
  const [mode, setMode] = useState<WritingMode>("exam");
  const prompts = useMemo(() => WRITING_PROMPTS.filter((p) => p.mode === mode), [mode]);
  const [prompt, setPrompt] = useState(prompts[0]!);
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState<Record<string, unknown> | null>(null);
  const [rewrite, setRewrite] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingRw, setLoadingRw] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setLoading(true);
    setError(null);
    setFeedback(null);
    try {
      const r = await fetch("/api/writing/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${prompt.titleFr}\n\n${prompt.instructionFr}`,
          mode,
          text,
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error ?? "Erreur");
      setFeedback(data.feedback);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  async function rewriteB2() {
    setLoadingRw(true);
    setError(null);
    setRewrite(null);
    try {
      const r = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error ?? "Erreur");
      setRewrite(data.result as Record<string, unknown>);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoadingRw(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Expression écrite</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Consignes type TCF — correction détaillée, version B2, et phrases à sauvegarder.
        </p>
      </div>

      <Tabs
        value={mode}
        onChange={(id) => {
          setMode(id as WritingMode);
          const list = WRITING_PROMPTS.filter((p) => p.mode === id);
          setPrompt(list[0]!);
        }}
        tabs={[
          { id: "beginner", label: "Débutant" },
          { id: "intermediate", label: "Intermédiaire" },
          { id: "exam", label: "Examen" },
        ]}
      />

      <Card>
        <CardTitle className="text-base">{prompt.titleFr}</CardTitle>
        <CardDescription>
          {prompt.genre} · {prompt.wordTarget}
        </CardDescription>
        <select
          className="mt-3 w-full rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-3 py-2 text-sm"
          value={prompt.id}
          onChange={(e) => {
            const p = WRITING_PROMPTS.find((x) => x.id === e.target.value);
            if (p) setPrompt(p);
          }}
        >
          {WRITING_PROMPTS.filter((p) => p.mode === mode).map((p) => (
            <option key={p.id} value={p.id}>
              {p.titleFr}
            </option>
          ))}
        </select>
        <p className="mt-3 text-sm leading-relaxed">{prompt.instructionFr}</p>
      </Card>

      <Card>
        <CardTitle className="text-base">Votre texte</CardTitle>
        <Textarea className="mt-3 min-h-[220px]" value={text} onChange={(e) => setText(e.target.value)} />
        <div className="mt-3 flex flex-wrap gap-2">
          <Button type="button" disabled={loading || !text.trim()} onClick={submit}>
            {loading ? "Correction…" : "Corriger (coach)"}
          </Button>
          <Button type="button" variant="secondary" disabled={loadingRw || !text.trim()} onClick={rewriteB2}>
            {loadingRw ? "Réécriture…" : "Réécrire en B2"}
          </Button>
        </div>
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      </Card>

      {feedback ? <WritingFeedbackView fb={feedback} /> : null}
      {rewrite ? <RewriteView rw={rewrite} /> : null}
    </div>
  );
}

function WritingFeedbackView({ fb }: { fb: Record<string, unknown> }) {
  return (
    <Card>
      <CardTitle className="text-base">Résultat</CardTitle>
      <div className="mt-4 space-y-4 text-sm">
        {typeof fb.original === "string" ? (
          <div>
            <h3 className="font-semibold">Original</h3>
            <p className="mt-1 whitespace-pre-wrap">{fb.original}</p>
          </div>
        ) : null}
        {typeof fb.corrected === "string" ? (
          <div>
            <h3 className="font-semibold">Corrigé</h3>
            <p className="mt-1 whitespace-pre-wrap">{fb.corrected}</p>
          </div>
        ) : null}
        {typeof fb.improvedB2 === "string" ? (
          <div>
            <h3 className="font-semibold">Version B2 renforcée</h3>
            <p className="mt-1 whitespace-pre-wrap">{fb.improvedB2}</p>
          </div>
        ) : null}
        {fb.bLevelFit && typeof fb.bLevelFit === "object" ? (
          <p className="text-[var(--muted)]">
            Niveau : {JSON.stringify(fb.bLevelFit)}
          </p>
        ) : null}
      </div>
    </Card>
  );
}

function RewriteView({ rw }: { rw: Record<string, unknown> }) {
  return (
    <Card>
      <CardTitle className="text-base">Réécriture B2</CardTitle>
      {typeof rw.rewriteFr === "string" ? (
        <p className="mt-3 whitespace-pre-wrap text-sm">{rw.rewriteFr}</p>
      ) : (
        <pre className="mt-3 overflow-x-auto text-xs">{JSON.stringify(rw, null, 2)}</pre>
      )}
    </Card>
  );
}
