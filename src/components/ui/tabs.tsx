"use client";

import { cn } from "@/lib/cn";
import * as React from "react";

export function Tabs({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-1 rounded-xl border border-[var(--card-border)] p-1", className)}>
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
            value === t.id
              ? "bg-brand-600 text-white dark:bg-brand-500"
              : "text-[var(--muted)] hover:bg-black/5 dark:hover:bg-white/10",
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
