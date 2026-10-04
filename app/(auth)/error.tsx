"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AuthErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AuthError({ error, reset }: AuthErrorProps) {
  return (
    <div className="w-full max-w-md rounded-lg border-2 border-ink bg-surface p-8 shadow-[6px_6px_0_0_var(--color-ink)] text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger-bg text-danger">
        <AlertTriangle className="h-5 w-5" aria-hidden="true" />
      </div>
      <h2 className="text-lg font-semibold text-ink">Authentication error</h2>
      <p className="mt-2 text-sm text-ink-muted">
        {error.message || "We couldn't complete that request."}
      </p>
      <Button
        className="mt-6"
        onClick={reset}
        leftIcon={<RotateCcw className="h-4 w-4" />}
      >
        Try again
      </Button>
    </div>
  );
}