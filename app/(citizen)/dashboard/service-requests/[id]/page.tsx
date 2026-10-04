"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Coins, CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { ServiceRequestStatusBadge } from "@/components/ui/StatusBadge";
import { ServiceRequestTimeline } from "@/components/service-requests/ServiceRequestTimeline";
import {
  useServiceRequest,
} from "@/hooks/useServiceRequests";
import { useCheckoutServiceRequest } from "@/hooks/usePayments";
import { formatCurrency, formatDateTime, initials } from "@/lib/utils/format";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ServiceRequestDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const request = useServiceRequest(id);
  const checkout = useCheckoutServiceRequest();
  const [isRedirecting, setIsRedirecting] = useState(false);

  if (request.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (request.isError || !request.data) {
    return (
      <ErrorState
        title="Request not found"
        onRetry={() => void request.refetch()}
      />
    );
  }

  const sr = request.data;
  const canPay = sr.status === "PENDING_PAYMENT";

  const handleCheckout = async () => {
    setIsRedirecting(true);
    try {
      const result = await checkout.mutateAsync(sr.id);
      if (!result.checkoutUrl) {
        throw new Error("No checkout URL returned");
      }
      window.location.href = result.checkoutUrl;
    } catch (err) {
      setIsRedirecting(false);
      const message =
        err instanceof Error ? err.message : "Could not start checkout";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/service-requests"
        className="inline-flex items-center gap-1 text-sm font-medium text-ink-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to requests
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <ServiceRequestStatusBadge status={sr.status} />
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
            {sr.service?.name ?? "Service request"}
          </h1>
          <p className="mt-1 text-xs text-ink-muted">
            Request ID: <span className="font-mono">{sr.id.slice(0, 8)}</span>{" "}
            · Filed {formatDateTime(sr.createdAt)}
          </p>
        </div>

        {canPay && (
          <Button
            onClick={() => void handleCheckout()}
            disabled={isRedirecting || checkout.isPending}
            leftIcon={
              isRedirecting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CreditCard className="h-4 w-4" />
              )
            }
          >
            Pay {sr.service?.fee ? formatCurrency(sr.service.fee) : "now"}
          </Button>
        )}
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Request details</CardTitle>
            </CardHeader>
            <CardContent>
              {sr.details ? (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink">
                  {sr.details}
                </p>
              ) : (
                <p className="text-sm text-ink-muted">
                  No additional details were provided.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent>
              {sr.payment ? (
                <dl className="space-y-3 text-sm">
                  <Row label="Status">{sr.payment.status}</Row>
                  <Row label="Amount">
                    {formatCurrency(sr.payment.amount)}
                  </Row>
                  {sr.payment.paidAt && (
                    <Row label="Paid at">
                      {formatDateTime(sr.payment.paidAt)}
                    </Row>
                  )}
                </dl>
              ) : (
                <p className="text-sm text-ink-muted">
                  No payment record yet.
                </p>
              )}

              {canPay && (
                <div className="mt-4 rounded-md border border-warning/30 bg-warning-bg/50 p-3 text-sm">
                  <p className="font-medium text-ink">
                    Payment required before review
                  </p>
                  <p className="mt-1 text-xs text-ink-muted">
                    Complete Stripe checkout to submit this request to the
                    municipal team.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <ServiceRequestTimeline current={sr.status} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Meta</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3 text-sm">
                <Row label="Service">
                  <span className="inline-flex items-center gap-1.5">
                    <Coins className="h-3.5 w-3.5" aria-hidden="true" />
                    {sr.service?.name ?? "—"}
                  </span>
                </Row>
                <Row label="Fee">
                  {sr.service?.fee ? formatCurrency(sr.service.fee) : "—"}
                </Row>
                {sr.assignedAgent ? (
                  <Row label="Agent">
                    <span className="inline-flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/25 text-[10px] font-semibold text-ink">
                        {initials(sr.assignedAgent.name)}
                      </span>
                      {sr.assignedAgent.name}
                    </span>
                  </Row>
                ) : (
                  <Row label="Agent">Unassigned</Row>
                )}
                <Row label="Last updated">
                  {formatDateTime(sr.updatedAt)}
                </Row>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="text-right text-ink">{children}</dd>
    </div>
  );
}