"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

export default function BookmarksPage() {
  const [items, setItems] = useState<{ id: string; title: string; content: string; category: string }[]>(
    [],
  );
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("modèle");

  async function load() {
    const r = await fetch("/api/bookmarks");
    const d = await r.json();
    if (d.items) setItems(d.items);
  }

  useEffect(() => {
    void load();
  }, []);

  async function save() {
    await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, category }),
    });
    setTitle("");
    setContent("");
    void load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Modèles & réponses favorites</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Sauvegardez phrases, introductions, e-mails types issus des retours du coach.
        </p>
      </div>

      <Card>
        <CardTitle className="text-base">Ajouter</CardTitle>
        <Input className="mt-3" placeholder="Titre" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input
          className="mt-2"
          placeholder="Catégorie (opinion, email, oral…)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <Textarea
          className="mt-2 min-h-[120px]"
          placeholder="Contenu"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button type="button" className="mt-3" onClick={save} disabled={!title.trim() || !content.trim()}>
          Enregistrer
        </Button>
      </Card>

      <Card>
        <CardTitle className="text-base">Bibliothèque</CardTitle>
        {!items.length ? (
          <CardDescription className="mt-2">Aucun favori pour l’instant.</CardDescription>
        ) : (
          <ul className="mt-3 space-y-3 text-sm">
            {items.map((b) => (
              <li key={b.id} className="rounded-xl border border-[var(--card-border)] p-3">
                <p className="font-semibold">{b.title}</p>
                <p className="text-xs text-[var(--muted)]">{b.category}</p>
                <p className="mt-2 whitespace-pre-wrap">{b.content}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
