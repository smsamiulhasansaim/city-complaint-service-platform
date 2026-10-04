"use client";

import { ErrorState } from "@/components/ui/ErrorState";

interface AdminErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: AdminErrorProps) {
  return (
    <ErrorState
      title="Something went wrong"
      message={error.message || "We couldn't load the admin console."}
      onRetry={reset}
    />
  );
}