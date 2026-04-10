"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { SPEAKING_PROMPTS, type SpeakingPrompt } from "@/lib/content/speaking-prompts";
import { useCallback, useEffect, useRef, useState } from "react";

export default function SpeakingPage() {
  const [prompt, setPrompt] = useState<SpeakingPrompt>(SPEAKING_PROMPTS[0]!);
  const [text, setText] = useState("");
  const [timerSec, setTimerSec] = useState<number | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [listening, setListening] = useState(false);
  const [feedback, setFeedback] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recogRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (remaining === null || remaining <= 0) return;
    const t = setInterval(() => setRemaining((r) => (r !== null ? r - 1 : r)), 1000);
    return () => clearInterval(t);
  }, [remaining]);

  const startTimer = () => {
    const n = prompt.timeGuideSec;
    setTimerSec(n);
    setRemaining(n);
  };

  const stopTimer = () => setRemaining(null);

  const startSpeech = useCallback(() => {
    const SR = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SR) {
      setError("La dictée vocale n’est pas disponible dans ce navigateur. Saisissez au clavier.");
      return;
    }
    setError(null);
    const r = new SR();
    r.lang = "fr-FR";
    r.continuous = false;
    r.interimResults = false;
    r.onresult = (e: SpeechRecognitionEvent) => {
      let chunk = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        chunk += e.results[i]![0]!.transcript;
      }
      setText((prev) => (prev ? `${prev.trim()} ${chunk}` : chunk));
    };
    r.onerror = () => setListening(false);
    r.onend = () => setListening(false);
    r.start();
    recogRef.current = r;
    setListening(true);
  }, []);

  const stopSpeech = () => {
    recogRef.current?.stop();
    setListening(false);
  };

  async function analyze(elapsed: number | null) {
    setLoading(true);
    setError(null);
    setFeedback(null);
    try {
      const r = await fetch("/api/speaking/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskType: prompt.taskType,
          prompt: prompt.promptFr,
          transcript: text,
          timedSeconds: elapsed ?? timerSec,
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

  const fb = feedback as Record<string, unknown> | null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Expression orale</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Tâches type TCF : demande d’information, persuasion, opinion. Minuteur pour pression d’examen.
        </p>
      </div>

      <Card>
        <CardTitle className="text-base">Choix de consigne</CardTitle>
        <select
          className="mt-3 w-full rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-3 py-2 text-sm"
          value={prompt.id}
          onChange={(e) => {
            const p = SPEAKING_PROMPTS.find((x) => x.id === e.target.value);
            if (p) setPrompt(p);
          }}
        >
          {SPEAKING_PROMPTS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.titleFr}
            </option>
          ))}
        </select>
        <CardDescription className="mt-3">{prompt.hintsEn}</CardDescription>
        <p className="mt-3 text-sm leading-relaxed">{prompt.promptFr}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={startTimer}>
            Démarrer le minuteur ({prompt.timeGuideSec}s)
          </Button>
          <Button type="button" variant="ghost" onClick={stopTimer}>
            Stop minuteur
          </Button>
          {remaining !== null ? (
            <span className="self-center text-sm font-medium">Temps : {remaining}s</span>
          ) : null}
        </div>
      </Card>

      <Card>
        <CardTitle className="text-base">Votre réponse</CardTitle>
        <div className="mt-3 flex flex-wrap gap-2">
          {!listening ? (
            <Button type="button" variant="secondary" onClick={startSpeech}>
              Parler (reconnaissance vocale)
            </Button>
          ) : (
            <Button type="button" variant="danger" onClick={stopSpeech}>
              Arrêter l’écoute
            </Button>
          )}
        </div>
        <Textarea
          className="mt-3 min-h-[160px]"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Transcription ou saisie manuelle…"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            type="button"
            disabled={loading || !text.trim()}
            onClick={() => analyze(remaining !== null ? prompt.timeGuideSec - remaining : null)}
          >
            {loading ? "Analyse…" : "Analyser avec le coach"}
          </Button>
        </div>
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      </Card>

      {fb ? (
        <Card>
          <CardTitle className="text-base">Retour structuré</CardTitle>
          <div className="mt-4 space-y-4 text-sm">
            <Section title="Ce qui était bien" items={fb.whatWasGood as string[]} />
            <Section title="Erreurs majeures" items={fb.majorMistakes as string[]} />
            <Section title="Corrections naturelles" items={fb.naturalCorrections as string[]} />
            <Section title="Alternatives plus B2" items={fb.higherLevelAlternatives as string[]} />
            {typeof fb.modelAnswerFr === "string" ? (
              <div>
                <h3 className="font-semibold">Modèle de réponse</h3>
                <p className="mt-1 whitespace-pre-wrap">{fb.modelAnswerFr}</p>
              </div>
            ) : null}
            {Array.isArray(fb.keyPhrases) ? (
              <div>
                <h3 className="font-semibold">Phrases à mémoriser</h3>
                <ul className="mt-1 list-disc pl-5">
                  {(fb.keyPhrases as { fr: string; en: string }[]).map((k, i) => (
                    <li key={i}>
                      <span className="font-medium">{k.fr}</span> — {k.en}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
          <CardDescription className="mt-4">
            Boucle « parler à nouveau » : réenregistrez en intégrant 3 connecteurs du retour.
          </CardDescription>
        </Card>
      ) : null}
    </div>
  );
}

function Section({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <div>
      <h3 className="font-semibold">{title}</h3>
      <ul className="mt-1 list-disc pl-5">
        {items.map((x, i) => (
          <li key={i}>{x}</li>
        ))}
      </ul>
    </div>
  );
}
