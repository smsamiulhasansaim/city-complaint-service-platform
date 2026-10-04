"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ComplaintWizard } from "@/components/complaints/ComplaintWizard";

export default function NewComplaintPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/complaints"
        className="inline-flex items-center gap-1 text-sm font-medium text-ink-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to complaints
      </Link>

      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          File a complaint
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Three quick steps. You can review before submitting.
        </p>
      </header>

      <ComplaintWizard />
    </div>
  );
}