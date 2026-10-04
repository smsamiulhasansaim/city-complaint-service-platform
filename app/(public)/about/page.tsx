import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, FileText, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn how the City Complaint & Service Platform connects citizens, agents, and administrators to resolve civic issues transparently.",
  openGraph: {
    title: "About | City Complaint Service Platform",
    description:
      "A transparent civic platform connecting citizens and city staff.",
    type: "website",
  },
};

const STATS = [
  { icon: Users, label: "Roles supported", value: "3" },
  { icon: FileText, label: "Complaint categories", value: "Managed by city" },
  { icon: Shield, label: "Payments", value: "Stripe-secured" },
  { icon: Building2, label: "Deployment", value: "Cloud-native" },
] as const;

export default function AboutPage() {
  return (
    <div className="bg-cream">
      <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            About
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            A transparent bridge between citizens and city staff
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-muted">
            The City Complaint &amp; Service Platform lets residents report
            civic issues, request municipal services, pay fees online, and
            follow every step of the resolution. Every action is scoped by role
            and tracked with a full audit timeline.
          </p>
        </header>

        <section className="mt-12 grid gap-4 sm:grid-cols-2">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-lg border-2 border-border bg-surface p-5"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent/25 text-ink">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  {stat.label}
                </p>
                <p className="mt-1 text-lg font-semibold text-ink">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </section>

        <section className="mt-14 space-y-6">
          <article className="rounded-lg border-2 border-border bg-surface p-6">
            <h2 className="text-lg font-semibold text-ink">Our mission</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              Make civic reporting as simple as sending a message. Ensure no
              issue is lost, no citizen is ignored, and every resolution is
              documented. We design for trust: real status flows, real
              timelines, real accountability.
            </p>
          </article>

          <article className="rounded-lg border-2 border-border bg-surface p-6">
            <h2 className="text-lg font-semibold text-ink">How we handle data</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
              <li>Credentials are hashed (bcrypt) and never stored in plaintext.</li>
              <li>Sessions use JWT verified on every backend request.</li>
              <li>Payments are processed by Stripe; we never store card data.</li>
              <li>Role-based access controls scope every read and write.</li>
            </ul>
          </article>

          <article className="rounded-lg border-2 border-border bg-surface p-6">
            <h2 className="text-lg font-semibold text-ink">Who can use it</h2>
            <ul className="mt-3 space-y-3 text-sm leading-relaxed text-ink-muted">
              <li>
                <strong className="text-ink">Citizens</strong> file complaints,
                request services, pay fees, and review resolutions.
              </li>
              <li>
                <strong className="text-ink">Agents</strong> receive assigned
                work, advance status, and comment on the timeline.
              </li>
              <li>
                <strong className="text-ink">Admins</strong> manage users,
                categories, services, and monitor the platform through
                analytics.
              </li>
            </ul>
          </article>
        </section>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Link href="/register">
            <Button rightIcon={<ArrowRight className="h-4 w-4" />}>
              Create an account
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline">Contact us</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}