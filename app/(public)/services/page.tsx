import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Coins } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { getPublicServices } from "@/lib/api/server";
import { formatCurrency } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Browse municipal services available online — trade licenses, pet registration, permits, and more. Pay fees securely with Stripe.",
  openGraph: {
    title: "Services | City Complaint Service Platform",
    description:
      "Apply for municipal services online and pay fees securely.",
    type: "website",
  },
};

export const revalidate = 3600;

export default async function ServicesPage() {
  const services = (await getPublicServices()) ?? [];
  const active = services.filter((s) => s.isActive);

  return (
    <div className="bg-cream">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Municipal services
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Apply for city services online
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-muted">
            Submit applications, pay the applicable fee with Stripe, and track
            the review. An agent is assigned as soon as payment succeeds.
          </p>
        </header>

        <section className="mt-10">
          {active.length === 0 ? (
            <EmptyState
              title="No services available"
              description="Services will appear here once the city publishes them."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {active.map((service) => (
                <article
                  key={service.id}
                  className="flex flex-col rounded-lg border-2 border-border bg-surface p-5 transition-shadow hover:shadow-[4px_4px_0_0_var(--color-border-strong)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent/25 text-ink">
                      <Coins className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="rounded-full border border-border-strong bg-surface-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
                      Online
                    </span>
                  </div>
                  <h2 className="mt-4 text-base font-semibold text-ink">
                    {service.name}
                  </h2>
                  <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-ink-muted">
                    {service.description}
                  </p>
                  <div className="mt-auto pt-5">
                    <p className="text-xs uppercase tracking-wider text-ink-muted">
                      Fee
                    </p>
                    <p className="text-lg font-semibold text-ink">
                      {formatCurrency(service.fee)}
                    </p>
                    <Link href="/login" className="mt-4 block">
                      <Button
                        size="sm"
                        fullWidth
                        rightIcon={<ArrowRight className="h-4 w-4" />}
                      >
                        Apply now
                      </Button>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <p className="mt-10 text-xs text-ink-muted">
          You must be signed in as a citizen to apply. Payments are processed by
          Stripe in test mode.
        </p>
      </div>
    </div>
  );
}