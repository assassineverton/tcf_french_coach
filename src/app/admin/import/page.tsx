"use client";

import { PageHeader } from "@/components/premium/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useState } from "react";

export default function AdminImportPage() {
  const [sourceLabel, setSourceLabel] = useState("Mes supports autorisés");
  const [rights, setRights] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [paste, setPaste] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function upload() {
    setMsg(null);
    if (!file) {
      setMsg("Choisissez un fichier.");
      return;
    }
    if (rights.trim().length < 20) {
      setMsg("Attestation de droits trop courte (20 caractères minimum).");
      return;
    }
    setLoading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("rightsDeclaration", rights.trim());
    fd.append("sourceLabel", sourceLabel.trim());
    if (notes.trim()) fd.append("notes", notes.trim());
    try {
      const r = await fetch("/api/admin/import", { method: "POST", body: fd });
      const d = await r.json();
      if (!r.ok) throw new Error(typeof d.error === "string" ? d.error : JSON.stringify(d.error));
      setMsg(`Import OK — lot ${d.batchId} · ${JSON.stringify(d.counts)}`);
      setFile(null);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  async function submitPaste() {
    setMsg(null);
    if (paste.trim().length < 10) {
      setMsg("Collez un JSON valide.");
      return;
    }
    if (rights.trim().length < 20) {
      setMsg("Attestation de droits trop courte.");
      return;
    }
    setLoading(true);
    try {
      const r = await fetch("/api/admin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawJson: paste,
          rightsDeclaration: rights.trim(),
          sourceLabel: sourceLabel.trim(),
          notes: notes.trim() || undefined,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(typeof d.error === "string" ? d.error : JSON.stringify(d.error));
      setMsg(`Import OK — lot ${d.batchId} · ${JSON.stringify(d.counts)}`);
      setPaste("");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-10">
      <PageHeader
        title="Importer du contenu autorisé"
        subtitle="Formats : JSON (recommandé), CSV (prompts oraux simples), Markdown avec bloc ```json```, ou texte brut (passage de lecture générique). Vous devez confirmer vos droits sur chaque lot."
        action={
          <Link href="/library">
            <Button type="button" variant="secondary">
              Retour bibliothèque
            </Button>
          </Link>
        }
      />

      <Card className="border-[var(--hairline)] bg-[var(--card-elevated)] shadow-[var(--shadow-soft)]">
        <CardTitle className="font-serif text-xl">Attestation légale</CardTitle>
        <CardDescription>
          Déclarez que vous possédez les droits ou une licence explicite pour importer ces contenus. Cette plateforme ne fournit pas de banques officielles TCF.
        </CardDescription>
        <label className="mt-4 block text-sm">
          <span className="text-[var(--muted)]">Libellé de la source</span>
          <Input className="mt-1" value={sourceLabel} onChange={(e) => setSourceLabel(e.target.value)} />
        </label>
        <label className="mt-3 block text-sm">
          <span className="text-[var(--muted)]">Attestation (min. 20 caractères)</span>
          <Textarea
            className="mt-1 min-h-[100px]"
            value={rights}
            onChange={(e) => setRights(e.target.value)}
            placeholder="J’atteste disposer des droits nécessaires pour importer ces supports à des fins personnelles / pédagogiques…"
          />
        </label>
        <label className="mt-3 block text-sm">
          <span className="text-[var(--muted)]">Notes internes (optionnel)</span>
          <Input className="mt-1" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-[var(--hairline)] bg-[var(--card-elevated)] shadow-[var(--shadow-soft)]">
          <CardTitle className="font-serif text-xl">Fichier</CardTitle>
          <CardDescription>.json · .csv · .md · .txt</CardDescription>
          <Input
            type="file"
            accept=".json,.csv,.md,.markdown,.txt"
            className="mt-4"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <Button type="button" className="mt-4" disabled={loading} onClick={upload}>
            {loading ? "Import…" : "Importer le fichier"}
          </Button>
        </Card>

        <Card className="border-[var(--hairline)] bg-[var(--card-elevated)] shadow-[var(--shadow-soft)]">
          <CardTitle className="font-serif text-xl">Coller du JSON</CardTitle>
          <CardDescription>Schéma documenté dans README — champs sourceLabel & sourceAttribution requis.</CardDescription>
          <Textarea
            className="mt-4 min-h-[220px] font-mono text-xs"
            value={paste}
            onChange={(e) => setPaste(e.target.value)}
            placeholder='{ "sourceLabel": "...", "sourceAttribution": "...", "speakingPrompts": [] }'
          />
          <Button type="button" className="mt-4" variant="secondary" disabled={loading} onClick={submitPaste}>
            Importer le presse-papiers
          </Button>
        </Card>
      </div>

      {msg ? (
        <p className="rounded-xl border border-[var(--hairline)] bg-[var(--card)] px-4 py-3 text-sm whitespace-pre-wrap">
          {msg}
        </p>
      ) : null}
    </div>
  );
}
