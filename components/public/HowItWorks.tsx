
import { CheckCircle2, FileText, Search, UserCheck } from "lucide-react";

const STEPS = [
  {
    icon: FileText,
    title: "File a complaint",
    body: "Choose a category, describe the issue, add photos, drop a pin. Takes under two minutes.",
  },
  {
    icon: UserCheck,
    title: "Get an agent assigned",
    body: "A ward officer is assigned based on location and category, and starts working on it.",
  },
  {
    icon: Search,
    title: "Track progress",
    body: "Every status change and field update appears on your timeline in real time.",
  },
  {
    icon: CheckCircle2,
    title: "Confirm resolution",
    body: "Review the outcome and rate the service to keep quality accountable.",
  },
] as const;

export function HowItWorks() {
  return (
    <section className="border-b-2 border-border bg-surface">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            How it works
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            From complaint to closure, in four steps
          </h2>
        </div>

        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <li
                key={step.title}
                className="rounded-lg border-2 border-border bg-surface-2/60 p-5"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/25 text-ink">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    Step {idx + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {step.body}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}