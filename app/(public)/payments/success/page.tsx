"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useConfirmPayment } from "@/hooks/usePayments";

type Status = "confirming" | "success" | "error";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const confirm = useConfirmPayment();
  const [status, setStatus] = useState<Status>(
    sessionId ? "confirming" : "error",
  );
  const [message, setMessage] = useState<string>(
    sessionId ? "Verifying your payment…" : "Missing session id.",
  );

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;

    (async () => {
      try {
        const result = await confirm.mutateAsync(sessionId);
        if (cancelled) return;
        setStatus("success");
        setMessage(
          result.alreadyConfirmed
            ? "Payment was already confirmed."
            : "Payment confirmed successfully.",
        );
      } catch (err) {
        if (cancelled) return;
        setStatus("error");
        setMessage(
          err instanceof Error
            ? err.message
            : "We couldn't confirm this payment.",
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId, confirm.mutateAsync]);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 sm:px-6">
      <Card className="w-full">
        <CardContent className="pt-5 text-center">
          {status === "confirming" && (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-info-bg text-info">
                <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
              </div>
              <h1 className="mt-4 text-xl font-semibold text-ink">
                Confirming payment
              </h1>
              <p className="mt-2 text-sm text-ink-muted">{message}</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-bg text-success">
                <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
              </div>
              <h1 className="mt-4 text-xl font-semibold text-ink">
                Payment successful
              </h1>
              <p className="mt-2 text-sm text-ink-muted">{message}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link href="/dashboard/service-requests">
                  <Button>Back to requests</Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline">Go to dashboard</Button>
                </Link>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-danger-bg text-danger">
                <XCircle className="h-6 w-6" aria-hidden="true" />
              </div>
              <h1 className="mt-4 text-xl font-semibold text-ink">
                Could not confirm payment
              </h1>
              <p className="mt-2 text-sm text-ink-muted">{message}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link href="/dashboard/payments">
                  <Button>View payments</Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline">Go to dashboard</Button>
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}