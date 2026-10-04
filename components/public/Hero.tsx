import Link from "next/link";
import { ArrowRight, FileWarning, ShieldCheck, Timer } from "lucide-react";
import { Button } from "@/components/ui/Button";

const TRUST = [
  {
    icon: <FileWarning className="h-4 w-4" aria-hidden="true" />,
    label: "File in under 2 minutes",
  },
  {
    icon: <Timer className="h-4 w-4" aria-hidden="true" />,
    label: "Track every status change",
  },
  {
    icon: <ShieldCheck className="h-4 w-4" aria-hidden="true" />,
    label: "Secure, transparent, auditable",
  },
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b-2 border-border bg-cream">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(#8a9e7b_1.5px,transparent_1.5px)] bg-size-[28px_28px] opacity-25 [mask-image:radial-gradient(ellipse_at_center,transparent_25%,black_90%)]"
      />
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
        <div className="animate-fade-in">
          <p className="inline-flex items-center gap-2 rounded-full border-2 border-border-strong bg-surface px-3 py-1 text-xs font-medium text-ink-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Official civic platform
          </p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
            Report civic issues.{" "}
            <span className="text-accent">Get them fixed.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
            File street-level complaints, request municipal services, pay fees,
            and follow every update — all in one transparent place.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/login">
              <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                File a complaint
              </Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="outline">
                Browse services
              </Button>
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-ink-muted">
            {TRUST.map((item) => (
              <li key={item.label} className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent/20 text-ink">
                  {item.icon}
                </span>
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="rounded-lg border-2 border-ink bg-surface p-6 shadow-[8px_8px_0_0_var(--color-ink)]">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Live activity
              </p>
              <span className="inline-flex items-center gap-1 rounded-full bg-success-bg px-2 py-0.5 text-[10px] font-semibold text-success">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
                Live
              </span>
            </div>

            <ul className="mt-4 space-y-3">
              {[
                {
                  title: "Streetlight restored",
                  ward: "Ward 5",
                  time: "2 min ago",
                },
                {
                  title: "Pothole marked for repair",
                  ward: "Ward 7",
                  time: "18 min ago",
                },
                {
                  title: "Trade license approved",
                  ward: "Ward 3",
                  time: "1 hr ago",
                },
                {
                  title: "Garbage pickup scheduled",
                  ward: "Ward 9",
                  time: "3 hr ago",
                },
              ].map((row) => (
                <li
                  key={row.title}
                  className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface-2/60 px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">
                      {row.title}
                    </p>
                    <p className="text-xs text-ink-muted">{row.ward}</p>
                  </div>
                  <p className="shrink-0 text-xs text-ink-muted">{row.time}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}