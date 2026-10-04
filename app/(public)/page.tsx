import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Hero } from "@/components/public/Hero";
import { HowItWorks } from "@/components/public/HowItWorks";
import { CategoryGrid } from "@/components/public/CategoryGrid";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { getPublicCategories, getPublicServices } from "@/lib/api/server";
import { formatCurrency } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "Home",
  description:
    "File civic complaints, request municipal services, pay fees, and track every update — transparently. Official city platform.",
  openGraph: {
    title: "City Complaint Service Platform",
    description:
      "Report civic issues and request municipal services online.",
    type: "website",
  },
};

export const revalidate = 300;

export default async function HomePage() {
  const [categories, services] = await Promise.all([
    getPublicCategories(),
    getPublicServices(),
  ]);

  const topCategories = categories?.slice(0, 6) ?? [];
  const topServices = services?.slice(0, 4) ?? [];

  return (
    <>
      <Hero />
      <HowItWorks />

      {/* Categories */}
      <section className="border-b-2 border-border bg-cream">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Complaint categories
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                Pick a category to report
              </h2>
              <p className="mt-2 text-sm text-ink-muted">
                Categories are maintained by the city. Choose the one that
                matches your issue.
              </p>
            </div>
            <Link href="/login">
              <Button variant="outline" rightIcon={<ArrowRight className="h-4 w-4" />}>
                File a complaint
              </Button>
            </Link>
          </div>

          <div className="mt-8">
            {topCategories.length === 0 ? (
              <EmptyState
                title="No categories published yet"
                description="Please check back soon — the city is setting up the platform."
              />
            ) : (
              <CategoryGrid categories={topCategories} />
            )}
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="border-b-2 border-border bg-surface">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Municipal services
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                Apply for services online
              </h2>
              <p className="mt-2 text-sm text-ink-muted">
                Pay fees securely with Stripe. Applications are reviewed by
                assigned agents.
              </p>
            </div>
            <Link href="/services">
              <Button variant="outline" rightIcon={<ArrowRight className="h-4 w-4" />}>
                View all services
              </Button>
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {topServices.map((service) => (
              <div
                key={service.id}
                className="flex flex-col rounded-lg border-2 border-border bg-cream p-5"
              >
                <p className="flex items-center gap-2 text-xs font-medium text-ink-muted">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  Municipal service
                </p>
                <h3 className="mt-3 text-base font-semibold text-ink">
                  {service.name}
                </h3>
                <p className="mt-1 line-clamp-3 text-sm text-ink-muted">
                  {service.description}
                </p>
                <p className="mt-4 text-sm font-semibold text-ink">
                  Fee: {formatCurrency(service.fee)}
                </p>
                <Link href="/services" className="mt-4">
                  <Button size="sm" variant="outline" fullWidth>
                    Learn more
                  </Button>
                </Link>
              </div>
            ))}
            {topServices.length === 0 && (
              <div className="sm:col-span-2 lg:col-span-4">
                <EmptyState
                  title="No services available"
                  description="Services will appear here once the city publishes them."
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
          <div className="rounded-lg border-2 border-ink bg-surface p-8 shadow-[6px_6px_0_0_var(--color-ink)] sm:p-12">
            <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                  Ready to make your ward better?
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted sm:text-base">
                  Create a free citizen account to file complaints, request
                  services, and pay fees — all in one place.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <Link href="/register">
                  <Button size="lg" fullWidth rightIcon={<ArrowRight className="h-4 w-4" />}>
                    Get started
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" fullWidth>
                    Try a demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}