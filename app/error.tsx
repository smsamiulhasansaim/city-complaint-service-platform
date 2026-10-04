"use client";

import { useEffect } from "react";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log to the console in dev; production monitoring hooks go here.
    if (process.env.NODE_ENV !== "production") {
      // biome-ignore lint/suspicious/noConsole: dev-only diagnostics
      console.error(error);
    }
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-lg border-2 border-ink bg-surface p-8 shadow-[6px_6px_0_0_var(--color-ink)] text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-danger-bg text-danger">
          <AlertTriangle className="h-6 w-6" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-semibold text-ink">Something went wrong</h1>
        <p className="mt-2 text-sm text-ink-muted">
          An unexpected error occurred while rendering this page. You can retry
          or head back to the home page.
        </p>
        {error.digest && (
          <p className="mt-3 font-mono text-xs text-ink-muted/70">
            ref: {error.digest}
          </p>
        )}
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
    </main>
  );
}