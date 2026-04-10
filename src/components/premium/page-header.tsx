import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-[var(--hairline)] pb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">TCF Canada</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-4xl">
          {title}
        </h1>
        {subtitle ? <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
