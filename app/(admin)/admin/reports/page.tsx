"use client";

import {
  CheckCircle2,
  Clock,
  CreditCard,
  FileWarning,
  ListChecks,
  Loader2,
  TrendingUp,
  Users,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { StatCard } from "@/components/ui/StatCard";
import {
  ComplaintStatusBadge,
  ServiceRequestStatusBadge,
} from "@/components/ui/StatusBadge";
import { ChartCard } from "@/components/admin/ChartCard";
import {
  ComplaintsByStatusChart,
  UsersByRoleChart,
  type RoleBreakdownDatum,
  type StatusBreakdownDatum,
} from "@/components/admin/Charts";
import { useAdminDashboard } from "@/hooks/useDashboard";
import {
  COMPLAINT_STATUSES,
  ROLES,
  SERVICE_REQUEST_STATUSES,
} from "@/lib/utils/constants";
import { formatCurrency } from "@/lib/utils/format";

export default function AdminReportsPage() {
  const { data, isLoading, isError, refetch } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2
          className="h-6 w-6 animate-spin text-ink-muted"
          aria-hidden="true"
        />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <ErrorState
        title="Could not load reports"
        onRetry={() => void refetch()}
      />
    );
  }

  const resolved =
    (data.complaints.byStatus.RESOLVED ?? 0) +
    (data.complaints.byStatus.CLOSED ?? 0);
  const resolutionRate =
    data.complaints.total > 0
      ? Math.round((resolved / data.complaints.total) * 100)
      : 0;

  const usersByRole: RoleBreakdownDatum[] = ROLES.map((r) => ({
    name: r,
    value: data.users.byRole[r] ?? 0,
  }));

  const complaintsByStatus: StatusBreakdownDatum[] = COMPLAINT_STATUSES.map(
    (s) => ({
      name: s,
      value: data.complaints.byStatus[s] ?? 0,
    }),
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          Reports & metrics
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Platform-wide KPIs derived from live data.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Resolution rate"
          value={`${resolutionRate}%`}
          hint={`${resolved} of ${data.complaints.total} complaints`}
          icon={<CheckCircle2 className="h-4 w-4" />}
          tone="success"
        />
        <StatCard
          label="Total users"
          value={data.users.total}
          hint={`${data.users.byRole.CITIZEN ?? 0} citizens`}
          icon={<Users className="h-4 w-4" />}
          tone="accent"
        />
        <StatCard
          label="Total complaints"
          value={data.complaints.total}
          icon={<FileWarning className="h-4 w-4" />}
          tone="info"
        />
        <StatCard
          label="Revenue collected"
          value={formatCurrency(data.revenue.totalCollected)}
          hint={`${data.revenue.paidCount} payments`}
          icon={<CreditCard className="h-4 w-4" />}
          tone="warning"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Users by role" description="Citizen vs agent vs admin">
          <UsersByRoleChart data={usersByRole} />
        </ChartCard>

        <ChartCard
          title="Complaints by status"
          description="Live breakdown"
        >
          <ComplaintsByStatusChart data={complaintsByStatus} />
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Complaint status breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {COMPLAINT_STATUSES.map((status) => {
                const count = data.complaints.byStatus[status] ?? 0;
                return (
                  <li
                    key={status}
                    className="flex items-center justify-between rounded-md border border-border bg-surface-2/60 px-3 py-2"
                  >
                    <ComplaintStatusBadge status={status} />
                    <span className="text-sm font-semibold text-ink tabular-nums">
                      {count}
                    </span>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service request status breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {SERVICE_REQUEST_STATUSES.map((status) => {
                const count = data.serviceRequests.byStatus[status] ?? 0;
                return (
                  <li
                    key={status}
                    className="flex items-center justify-between rounded-md border border-border bg-surface-2/60 px-3 py-2"
                  >
                    <ServiceRequestStatusBadge status={status} />
                    <span className="text-sm font-semibold text-ink tabular-nums">
                      {count}
                    </span>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Key insights</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm text-ink-muted">
            <li className="flex items-start gap-3">
              <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              <span>
                <strong className="text-ink">Resolution rate</strong> stands at{" "}
                {resolutionRate}% — {resolved} of {data.complaints.total}{" "}
                complaints have been resolved or closed.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
              <span>
                <strong className="text-ink">Open workload:</strong>{" "}
                {(data.complaints.byStatus.PENDING ?? 0) +
                  (data.complaints.byStatus.ASSIGNED ?? 0) +
                  (data.complaints.byStatus.IN_PROGRESS ?? 0)}{" "}
                complaints are still being processed.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <ListChecks className="mt-0.5 h-4 w-4 shrink-0 text-info" aria-hidden="true" />
              <span>
                <strong className="text-ink">Service requests:</strong>{" "}
                {data.serviceRequests.total} total,{" "}
                {data.serviceRequests.byStatus.COMPLETED ?? 0} completed.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}