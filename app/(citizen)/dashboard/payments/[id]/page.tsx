"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { PaymentStatusBadge } from "@/components/ui/StatusBadge";
import { Skeleton } from "@/components/ui/Skeleton";
import { usePayment } from "@/hooks/usePayments";
import {
  formatCurrency,
  formatDateTime,
  humanizeEnum,
} from "@/lib/utils/format";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PaymentDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const payment = usePayment(id);

  if (payment.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (payment.isError || !payment.data) {
    return (
      <ErrorState
        title="Payment not found"
        onRetry={() => void payment.refetch()}
      />
    );
  }

  const p = payment.data;

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/payments"
        className="inline-flex items-center gap-1 text-sm font-medium text-ink-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to payments
      </Link>

      <header>
        <PaymentStatusBadge status={p.status} />
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
          {formatCurrency(p.amount)}
        </h1>
        <p className="mt-1 text-xs text-ink-muted">
          Transaction{" "}
          <span className="font-mono">{p.transactionId.slice(0, 20)}…</span>
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Payment details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3 text-sm">
              <Row label="Status">{humanizeEnum(p.status)}</Row>
              <Row label="Purpose">{humanizeEnum(p.purpose)}</Row>
              <Row label="Provider">{humanizeEnum(p.provider)}</Row>
              <Row label="Method">{p.method}</Row>
              <Row label="Currency">{p.currency.toUpperCase()}</Row>
              <Row label="Amount">{formatCurrency(p.amount)}</Row>
              <Row label="Created">{formatDateTime(p.createdAt)}</Row>
              {p.paidAt && (
                <Row label="Paid at">{formatDateTime(p.paidAt)}</Row>
              )}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Linked to</CardTitle>
          </CardHeader>
          <CardContent>
            {p.serviceRequest && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  Service request
                </p>
                <Link
                  href={`/dashboard/service-requests/${p.serviceRequest.id}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-ink underline underline-offset-4"
                >
                  {p.serviceRequest.id.slice(0, 8)}
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </Link>
                <p className="text-xs text-ink-muted">
                  Status: {humanizeEnum(p.serviceRequest.status)}
                </p>
              </div>
            )}
            {p.complaint && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  Complaint
                </p>
                <Link
                  href={`/dashboard/complaints/${p.complaint.id}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-ink underline underline-offset-4"
                >
                  {p.complaint.title}
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </Link>
                <p className="text-xs text-ink-muted">
                  Status: {humanizeEnum(p.complaint.status)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
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