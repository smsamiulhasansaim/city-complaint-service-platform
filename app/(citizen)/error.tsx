"use client";

import { ErrorState } from "@/components/ui/ErrorState";

interface CitizenErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CitizenError({ error, reset }: CitizenErrorProps) {
  return (
    <ErrorState
      title="Something went wrong"
      message={error.message || "We couldn't load your dashboard."}
      onRetry={reset}
    />
  );
}