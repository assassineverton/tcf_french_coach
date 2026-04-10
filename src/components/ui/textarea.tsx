import { cn } from "@/lib/cn";
import type { TextareaHTMLAttributes } from "react";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-[120px] w-full rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-3 py-2 text-sm outline-none ring-brand-500/30 focus:ring-2",
        className,
      )}
      {...props}
    />
  );
}
