import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export interface StatCardProps {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  tone?: "neutral" | "accent" | "success" | "warning" | "danger" | "info";
  className?: string;
}

const toneRing: Record<NonNullable<StatCardProps["tone"]>, string> = {
  neutral: "bg-surface-2 text-ink",
  accent: "bg-accent/20 text-ink",
  success: "bg-success-bg text-success",
  warning: "bg-warning-bg text-warning",
  danger: "bg-danger-bg text-danger",
  info: "bg-info-bg text-info",
};

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "neutral",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border-2 border-border bg-surface p-5 shadow-[3px_3px_0_0_var(--color-border-strong)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
          {label}
        </p>
        {icon && (
          <span
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-md",
              toneRing[tone],
            )}
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-semibold text-ink tabular-nums">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-ink-muted">{hint}</p>}
    </div>
  );
}