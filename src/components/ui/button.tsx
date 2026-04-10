import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes } from "react";

const variants = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400",
  secondary:
    "bg-[var(--card)] border border-[var(--card-border)] hover:bg-black/5 dark:hover:bg-white/5",
  ghost: "hover:bg-black/5 dark:hover:bg-white/10",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof variants }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
