"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Coins, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { ServiceRequestStatusBadge } from "@/components/ui/StatusBadge";
import { ServiceRequestTimeline } from "@/components/service-requests/ServiceRequestTimeline";
import { AgentServiceRequestStatusForm } from "@/components/service-requests/AgentServiceRequestStatusForm";
import { AssignServiceRequestModal } from "@/components/admin/AssignServiceRequestModal";
import { useServiceRequest } from "@/hooks/useServiceRequests";
import {
  formatCurrency,
  formatDateTime,
  humanizeEnum,
  initials,
} from "@/lib/utils/format";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AdminServiceRequestDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const request = useServiceRequest(id);
  const [assignOpen, setAssignOpen] = useState(false);

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
        title="Service request not found"
        onRetry={() => void request.refetch()}
      />
    );
  }

  const sr = request.data;
  const canAssign =
    sr.status !== "PENDING_PAYMENT" &&
    sr.status !== "REJECTED" &&
    sr.status !== "COMPLETED";

  return (
    <div className="space-y-6">
      <Link
        href="/admin/service-requests"
        className="inline-flex items-center gap-1 text-sm font-medium text-ink-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to service requests
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

        <div className="flex flex-wrap gap-2">
          {canAssign && (
            <Button
              variant="outline"
              onClick={() => setAssignOpen(true)}
              leftIcon={<UserPlus className="h-4 w-4" />}
            >
              Assign
            </Button>
          )}
          <AgentServiceRequestStatusForm request={sr} />
        </div>
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
                <p className="text-sm text-ink-muted">No details provided.</p>
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
                  <Row label="Status">{humanizeEnum(sr.payment.status)}</Row>
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
                <p className="text-sm text-ink-muted">No payment yet.</p>
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
                <Row label="Citizen">
                  <span className="inline-flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/25 text-[10px] font-semibold text-ink">
                      {sr.citizen ? initials(sr.citizen.name) : "?"}
                    </span>
                    {sr.citizen?.name ?? "—"}
                  </span>
                </Row>
                <Row label="Agent">
                  {sr.assignedAgent ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/25 text-[10px] font-semibold text-ink">
                        {initials(sr.assignedAgent.name)}
                      </span>
                      {sr.assignedAgent.name}
                    </span>
                  ) : (
                    "Unassigned"
                  )}
                </Row>
                <Row label="Last updated">
                  {formatDateTime(sr.updatedAt)}
                </Row>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>

      <AssignServiceRequestModal
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        requestId={sr.id}
        currentAgentId={sr.assignedAgentId}
      />
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