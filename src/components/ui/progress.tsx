import { cn } from "@/lib/cn";

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  const v = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10", className)}>
      <div
        className="h-full rounded-full bg-brand-600 transition-all dark:bg-brand-400"
        style={{ width: `${v}%` }}
      />
    </div>
  );
}
