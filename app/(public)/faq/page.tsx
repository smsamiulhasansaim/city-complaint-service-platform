import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about filing complaints, requesting services, payments, and account management.",
  openGraph: {
    title: "FAQ | City Complaint Service Platform",
    description:
      "Answers to common questions about complaints, services, and payments.",
    type: "website",
  },
};

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: readonly FaqItem[] = [
  {
    q: "Who can file a complaint?",
    a: "Any registered citizen can file a complaint. Registration is free and takes less than a minute. Agents are provisioned by administrators.",
  },
  {
    q: "How are complaints routed to agents?",
    a: "An admin assigns each complaint to an agent based on ward and category. Once assigned, the agent can advance status and post updates on the timeline.",
  },
  {
    q: "What do the complaint statuses mean?",
    a: "PENDING: just filed. ASSIGNED: an agent has been assigned. IN_PROGRESS: work underway. RESOLVED: agent marked it fixed. CLOSED: you accepted the resolution. REJECTED: not actionable.",
  },
  {
    q: "How do payments work?",
    a: "Service requests require payment before they enter review. Payments are processed by Stripe in test mode. After a successful payment you are redirected back to a success page and the request advances to PAID.",
  },
  {
    q: "Can I expedite my complaint?",
    a: "Yes. Citizens can pay an expedite fee to mark a complaint as URGENT. This raises its priority in the agent queue.",
  },
  {
    q: "Can I edit or delete a complaint?",
    a: "You can edit or delete a complaint only while it is still PENDING and only if no payment is linked to it. Once an agent is assigned, contact support.",
  },
  {
    q: "How do I leave a review?",
    a: "After your complaint is marked RESOLVED or CLOSED, you can leave one review with a rating (1–5) and a comment.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. Passwords are hashed with bcrypt, sessions use signed JWTs, and all requests are validated and role-scoped on the server. We never store card data.",
  },
] as const;

export default function FaqPage() {
  return (
    <div className="bg-cream">
      <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            FAQ
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Frequently asked questions
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-muted">
            Quick answers about filing complaints, requesting services, and
            payments.
          </p>
        </header>

        <div className="mt-10 space-y-3">
          {FAQS.map((item) => (
            <details
              key={item.q}
              className="group rounded-lg border-2 border-border bg-surface px-5 py-4 open:shadow-[4px_4px_0_0_var(--color-border-strong)]"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold text-ink marker:hidden">
                {item.q}
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border-strong text-ink-muted transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {item.a}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Link href="/contact">
            <Button rightIcon={<ArrowRight className="h-4 w-4" />}>
              Still need help?
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline">Create an account</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}