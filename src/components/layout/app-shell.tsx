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
  Headphones,
  History,
  Home,
  Library,
  LineChart,
  MessageSquare,
  Mic,
  Moon,
  PenLine,
  Sun,
  Target,
  Trophy,
} from "lucide-react";
import { useTheme } from "next-themes";

const NAV = [
  { href: "/", label: "Tableau de bord", icon: Home },
  { href: "/tutor", label: "Coach IA", icon: MessageSquare },
  { href: "/speaking", label: "Expression orale", icon: Mic },
  { href: "/writing", label: "Expression écrite", icon: PenLine },
  { href: "/grammar", label: "Grammaire & vocabulaire", icon: BookOpen },
  { href: "/listening", label: "Compréhension orale", icon: Headphones },
  { href: "/reading", label: "Compréhension écrite", icon: ClipboardList },
  { href: "/planner", label: "Plan d’études", icon: CalendarDays },
  { href: "/progress", label: "Progrès", icon: LineChart },
  { href: "/strategy", label: "Stratégie TCF", icon: Target },
  { href: "/mock-exam", label: "Examen blanc", icon: Trophy },
  { href: "/history", label: "Historique", icon: History },
  { href: "/mistakes", label: "Carnet d’erreurs", icon: Brain },
  { href: "/bookmarks", label: "Modèles favoris", icon: Bookmark },
  { href: "/phrases", label: "Banques de phrases", icon: Library },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-[var(--card-border)] bg-[var(--background)]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="rounded-lg bg-brand-600 px-2 py-1 text-xs font-bold text-white dark:bg-brand-500">
              TCF
            </span>
            <span className="hidden sm:inline">French Coach</span>
          </Link>
          <button
            type="button"
            aria-label="Basculer le thème"
            className="rounded-lg border border-[var(--card-border)] p-2"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="hidden h-4 w-4 dark:block" />
            <Moon className="h-4 w-4 dark:hidden" />
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 md:flex-row md:py-8">
        <aside className="md:w-56 md:shrink-0">
          <nav className="flex flex-row flex-wrap gap-1 overflow-x-auto pb-2 md:flex-col md:overflow-visible">
            {NAV.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm whitespace-nowrap transition-colors",
                    active
                      ? "bg-brand-600 text-white dark:bg-brand-500"
                      : "text-[var(--muted)] hover:bg-black/5 dark:hover:bg-white/10",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <p className="mt-4 hidden text-xs text-[var(--muted)] md:block">
            Préparation sérieuse au TCF Canada — objectif B2.
          </p>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
