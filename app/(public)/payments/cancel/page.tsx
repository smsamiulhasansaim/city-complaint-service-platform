import type { Metadata } from "next";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Payment cancelled",
  robots: { index: false, follow: false },
};

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 sm:px-6">
      <Card className="w-full">
        <CardContent className="pt-5 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-warning-bg text-warning">
            <XCircle className="h-6 w-6" aria-hidden="true" />
          </div>
          <h1 className="mt-4 text-xl font-semibold text-ink">
            Payment cancelled
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            Your payment was not completed. No charges were made. You can retry
            at any time.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/dashboard/service-requests">
              <Button>Back to requests</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">Go to dashboard</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}