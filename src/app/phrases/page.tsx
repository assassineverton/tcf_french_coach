import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { CONNECTORS } from "@/lib/content/connectors";
import { PHRASE_BANK_SECTIONS } from "@/lib/content/phrase-banks";

export default function PhrasesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Banques de phrases</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Opinions, contrastes, causes, concessions, demandes polies, courriel formel — + liste de connecteurs
          fréquents TCF.
        </p>
      </div>

      {PHRASE_BANK_SECTIONS.map((s) => (
        <Card key={s.id}>
          <CardTitle className="text-base">
            {s.titleFr}{" "}
            <span className="text-sm font-normal text-[var(--muted)]">({s.titleEn})</span>
          </CardTitle>
          <ul className="mt-3 space-y-2 text-sm">
            {s.phrases.map((p, i) => (
              <li key={i} className="rounded-lg border border-[var(--card-border)] px-3 py-2">
                <span className="font-medium">{p.fr}</span>
                <span className="text-[var(--muted)]"> — {p.en}</span>
              </li>
            ))}
          </ul>
        </Card>
      ))}

      <Card>
        <CardTitle className="text-base">55 connecteurs & formules utiles</CardTitle>
        <CardDescription>Filtrage par registre dans une future version — pour l’instant liste complète.</CardDescription>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--card-border)] text-[var(--muted)]">
                <th className="py-2 pr-2">FR</th>
                <th className="py-2 pr-2">EN</th>
                <th className="py-2">Catégorie</th>
              </tr>
            </thead>
            <tbody>
              {CONNECTORS.map((c) => (
                <tr key={c.id} className="border-b border-[var(--card-border)]/60">
                  <td className="py-2 pr-2 font-medium">{c.fr}</td>
                  <td className="py-2 pr-2">{c.en}</td>
                  <td className="py-2 text-xs text-[var(--muted)]">{c.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
