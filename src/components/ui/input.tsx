import { cn } from "@/lib/cn";
import type { InputHTMLAttributes } from "react";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-3 py-2 text-sm outline-none ring-brand-500/30 focus:ring-2",
        className,
      )}
      {...props}
    />
  );
}
