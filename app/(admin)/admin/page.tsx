"use client";

import Link from "next/link";
import {
  ArrowRight,
  CreditCard,
  FileWarning,
  ListChecks,
  Loader2,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { StatCard } from "@/components/ui/StatCard";
import {
  ComplaintStatusBadge,
  PaymentStatusBadge,
} from "@/components/ui/StatusBadge";
import { ChartCard } from "@/components/admin/ChartCard";
import {
  ComplaintsByPriorityChart,
  ComplaintsByStatusChart,
  RevenueChart,
  UsersByRoleChart,
  type RevenueDatum,
  type RoleBreakdownDatum,
  type StatusBreakdownDatum,
} from "@/components/admin/Charts";
import { useAdminDashboard } from "@/hooks/useDashboard";
import {
  COMPLAINT_STATUSES,
  PRIORITIES,
  ROLES,
} from "@/lib/utils/constants";
import { formatCurrency, formatRelative, humanizeEnum } from "@/lib/utils/format";

export default function AdminDashboardPage() {
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
        title="Could not load the admin dashboard"
        message="There was a problem fetching analytics. Please try again."
        onRetry={() => void refetch()}
      />
    );
  }

  const usersByRole: RoleBreakdownDatum[] = ROLES.map((role) => ({
    name: role,
    value: data.users.byRole[role] ?? 0,
  }));

  const complaintsByStatus: StatusBreakdownDatum[] = COMPLAINT_STATUSES.map(
    (status) => ({
      name: status,
      value: data.complaints.byStatus[status] ?? 0,
    }),
  );

  const complaintsByPriority: StatusBreakdownDatum[] = PRIORITIES.map(
    (priority) => ({
      name: priority,
      value: data.complaints.byPriority[priority] ?? 0,
    }),
  );

  // Revenue is presented as a simple monotone line using the total collected.
  // A time series is not exposed by the backend dashboard endpoint; we render
  // a single-point series so the chart remains meaningful without fabricating
  // a trend.
  const revenueData: RevenueDatum[] =
    data.revenue.totalCollected > 0
      ? [{ label: "Collected", amount: data.revenue.totalCollected }]
      : [];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            Admin console
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Platform overview — users, complaints, service requests, revenue.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/complaints">
            <Button variant="outline" leftIcon={<FileWarning className="h-4 w-4" />}>
              Complaints
            </Button>
          </Link>
          <Link href="/admin/users">
            <Button leftIcon={<Users className="h-4 w-4" />}>Users</Button>
          </Link>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total users"
          value={data.users.total}
          hint={`${data.users.byRole.CITIZEN ?? 0} citizens · ${data.users.byRole.AGENT ?? 0} agents`}
          icon={<Users className="h-4 w-4" />}
          tone="accent"
        />
        <StatCard
          label="Complaints"
          value={data.complaints.total}
          hint={`${data.complaints.byStatus.RESOLVED ?? 0} resolved`}
          icon={<FileWarning className="h-4 w-4" />}
          tone="info"
        />
        <StatCard
          label="Service requests"
          value={data.serviceRequests.total}
          hint={`${data.serviceRequests.byStatus.COMPLETED ?? 0} completed`}
          icon={<ListChecks className="h-4 w-4" />}
          tone="warning"
        />
        <StatCard
          label="Revenue"
          value={formatCurrency(data.revenue.totalCollected)}
          hint={`${data.revenue.paidCount} completed payments`}
          icon={<CreditCard className="h-4 w-4" />}
          tone="success"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Users by role"
          description="Distribution across citizens, agents, and admins"
        >
          <UsersByRoleChart data={usersByRole} />
        </ChartCard>

        <ChartCard
          title="Complaints by priority"
          description="Current priority mix"
        >
          <ComplaintsByPriorityChart data={complaintsByPriority} />
        </ChartCard>
      </div>

      <ChartCard
        title="Complaints by status"
        description="Live status distribution across the platform"
      >
        <ComplaintsByStatusChart data={complaintsByStatus} />
      </ChartCard>

      <ChartCard
        title="Revenue"
        description={`Total collected: ${formatCurrency(data.revenue.totalCollected)}`}
      >
        <RevenueChart data={revenueData} />
      </ChartCard>

      <Card>
        <CardHeader>
          <CardTitle>Recent complaints</CardTitle>
        </CardHeader>
        <CardContent>
          {data.recentComplaints.length === 0 ? (
            <EmptyState
              title="No complaints yet"
              description="New complaints will appear here."
            />
          ) : (
            <ul className="divide-y divide-border">
              {data.recentComplaints.map((c) => (
                <li
                  key={c.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/admin/complaints/${c.id}`}
                      className="truncate text-sm font-medium text-ink hover:underline"
                    >
                      {c.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-ink-muted">
                      {c.category?.name ?? "—"} · {c.ward ?? "no ward"} ·{" "}
                      {formatRelative(c.createdAt)}
                    </p>
                  </div>
                  <ComplaintStatusBadge status={c.status} />
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4 flex justify-end">
            <Link href="/admin/complaints">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                View all complaints
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(["PENDING", "COMPLETED"] as const).map((s) => {
          // Small status helper tiles for payments (uses PaymentStatusBadge).
          const paymentStatus =
            s === "PENDING" ? ("PENDING" as const) : ("COMPLETED" as const);
          return (
            <Card key={s}>
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    Payments {humanizeEnum(paymentStatus)}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-ink">—</p>
                </div>
                <PaymentStatusBadge status={paymentStatus} />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}