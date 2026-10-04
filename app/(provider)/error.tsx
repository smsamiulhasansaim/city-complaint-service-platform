"use client";

import { ErrorState } from "@/components/ui/ErrorState";

interface ProviderErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProviderError({ error, reset }: ProviderErrorProps) {
  return (
    <ErrorState
      title="Something went wrong"
      message={error.message || "We couldn't load your workspace."}
      onRetry={reset}
    />
  );
}