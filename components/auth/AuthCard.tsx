import type { ReactNode } from "react";

export interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="rounded-lg border-2 border-ink bg-surface p-6 shadow-[6px_6px_0_0_var(--color-ink)] sm:p-8">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5 text-sm text-ink-muted">{subtitle}</p>
        )}
      </header>
      {children}
      {footer && (
        <div className="mt-6 border-t border-border pt-5 text-center text-sm text-ink-muted">
          {footer}
        </div>
      )}
    </div>
  );
}