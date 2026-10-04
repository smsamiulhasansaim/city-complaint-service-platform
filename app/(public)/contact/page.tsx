import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach the City Complaint & Service Platform support team — helpline, email, and physical address.",
  openGraph: {
    title: "Contact | City Complaint Service Platform",
    description:
      "Get in touch with the city platform support team.",
    type: "website",
  },
};

const CHANNELS = [
  {
    icon: Phone,
    label: "24×7 helpline",
    value: "16263",
    hint: "Toll-free within city limits",
    href: "tel:16263",
  },
  {
    icon: Mail,
    label: "Email support",
    value: "support@citycomplaint.com",
    hint: "Replies within 24 hours",
    href: "mailto:support@citycomplaint.com",
  },
  {
    icon: MessageCircle,
    label: "Live chat",
    value: "Available in-app",
    hint: "For signed-in citizens",
    href: "/login",
  },
  {
    icon: MapPin,
    label: "Head office",
    value: "City Corporation, Dhaka 1000, Bangladesh",
    hint: "Sun–Thu, 9:00 – 17:00",
    href: "https://maps.google.com/?q=Dhaka",
  },
] as const;

export default function ContactPage() {
  return (
    <div className="bg-cream">
      <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Contact
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            We&apos;re here to help
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-muted">
            For platform support, reach us through any of the channels below.
            For civic emergencies, always call the helpline first.
          </p>
        </header>

        <section className="mt-10 grid gap-4 sm:grid-cols-2">
          {CHANNELS.map((ch) => {
            const Icon = ch.icon;
            return (
              <a
                key={ch.label}
                href={ch.href}
                className="group flex items-start gap-4 rounded-lg border-2 border-border bg-surface p-5 transition-all hover:border-ink hover:shadow-[4px_4px_0_0_var(--color-ink)]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent/25 text-ink">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    {ch.label}
                  </p>
                  <p className="mt-1 break-words text-sm font-semibold text-ink">
                    {ch.value}
                  </p>
                  <p className="mt-1 text-xs text-ink-muted">{ch.hint}</p>
                </div>
              </a>
            );
          })}
        </section>

        <section className="mt-12 rounded-lg border-2 border-ink bg-surface p-6 shadow-[6px_6px_0_0_var(--color-ink)]">
          <h2 className="text-lg font-semibold text-ink">
            Reporting a civic issue?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            File it through the platform so it is tracked, assigned, and
            resolved — not through email. You&apos;ll get status updates on your
            dashboard.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link href="/login">
            <Button>File a complaint</Button>
            </Link>
            <Link href="/services">
            <Button variant="outline">Browse services</Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}