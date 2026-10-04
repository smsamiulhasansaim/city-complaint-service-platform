"use client";

import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PublicErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PublicError({ error, reset }: PublicErrorProps) {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-20 sm:px-6">
      <div className="w-full rounded-lg border-2 border-ink bg-surface p-8 text-center shadow-[6px_6px_0_0_var(--color-ink)]">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger-bg text-danger">
          <AlertTriangle className="h-5 w-5" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-semibold text-ink">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          {error.message || "We couldn't load this page."}
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            onClick={reset}
            leftIcon={<RotateCcw className="h-4 w-4" />}
          >
            Try again
          </Button>
          <Link href="/">
            <Button variant="outline" leftIcon={<Home className="h-4 w-4" />}>
              Go home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}