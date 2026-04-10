"use client";

import { cn } from "@/lib/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bookmark,
  BookOpen,
  Brain,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  Headphones,
  History,
  Home,
  Library,
  LineChart,
  MessageSquare,
  Mic,
  Moon,
  PenLine,
  Settings2,
  Sun,
  Target,
  Trophy,
} from "lucide-react";
import { useTheme } from "next-themes";

const NAV = [
  { href: "/dashboard", label: "Tableau de bord", icon: Home },
  { href: "/library", label: "Bibliothèque", icon: Library },
  { href: "/practice/speaking", label: "Oral", icon: Mic },
  { href: "/practice/writing", label: "Écrit", icon: PenLine },
  { href: "/practice/reading", label: "Lecture", icon: ClipboardList },
  { href: "/practice/listening", label: "Écoute", icon: Headphones },
  { href: "/practice/grammar", label: "Grammaire", icon: BookOpen },
  { href: "/tutor", label: "Coach IA", icon: MessageSquare },
  { href: "/planner", label: "Planificateur", icon: CalendarDays },
  { href: "/progress", label: "Progrès", icon: LineChart },
  { href: "/strategy", label: "Stratégie", icon: Target },
  { href: "/mock-exam", label: "Examen blanc", icon: Trophy },
  { href: "/history", label: "Historique", icon: History },
  { href: "/mistakes", label: "Erreurs", icon: Brain },
  { href: "/bookmarks", label: "Favoris", icon: Bookmark },
  { href: "/phrases", label: "Phrases", icon: GraduationCap },
  { href: "/admin/import", label: "Import", icon: Settings2 },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-40 border-b border-[var(--hairline)] bg-[var(--background)]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/dashboard" className="group flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent)] text-xs font-bold text-white shadow-[var(--shadow-soft)]">
              TCF
            </span>
            <div className="hidden leading-tight sm:block">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Canada prep</p>
              <p className="font-serif text-base font-semibold">French Coach</p>
            </div>
          </Link>
          <button
            type="button"
            aria-label="Basculer le thème"
            className="rounded-xl border border-[var(--hairline)] bg-[var(--card)] p-2 shadow-sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="hidden h-4 w-4 dark:block" />
            <Moon className="h-4 w-4 dark:hidden" />
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 md:flex-row md:py-10">
        <aside className="md:w-60 md:shrink-0">
          <nav className="flex flex-row flex-wrap gap-1 overflow-x-auto pb-2 md:flex-col md:overflow-visible">
            {NAV.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-3 py-2 text-sm whitespace-nowrap transition-colors",
                    active
                      ? "bg-[var(--accent)] text-white shadow-[var(--shadow-soft)]"
                      : "text-[var(--muted)] hover:bg-[var(--card)] hover:text-[var(--foreground)]",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0 opacity-90" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <p className="mt-5 hidden text-xs leading-relaxed text-[var(--muted)] md:block">
            Contenus importés par vous uniquement — pas de scraping de sites membres.
          </p>
        </aside>

        <main className="min-w-0 flex-1 pb-16">{children}</main>
      </div>
    </div>
  );
}
