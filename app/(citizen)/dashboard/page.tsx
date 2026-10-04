"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  CreditCard,
  FileWarning,
  ListChecks,
  Loader2,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { StatCard } from "@/components/ui/StatCard";
import {
  ComplaintStatusBadge,
  ServiceRequestStatusBadge,
} from "@/components/ui/StatusBadge";
import { useCitizenDashboard } from "@/hooks/useDashboard";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency } from "@/lib/utils/format";
import { COMPLAINT_STATUSES, SERVICE_REQUEST_STATUSES } from "@/lib/utils/constants";

export default function CitizenDashboardPage() {
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = useCitizenDashboard();

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-ink-muted" aria-hidden="true" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <ErrorState
        title="Could not load your dashboard"
        message="There was a problem fetching your activity. Please try again."
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            Welcome back, {user?.name.split(" ")[0] ?? "citizen"} 👋
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Here&apos;s what&apos;s happening with your complaints and requests.
          </p>
        </div>
        <Link href="/dashboard/complaints/new">
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            File a complaint
          </Button>
        </Link>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total complaints"
          value={data.complaints.total}
          icon={<FileWarning className="h-4 w-4" />}
          tone="accent"
        />
        <StatCard
          label="Resolved"
          value={
            (data.complaints.byStatus.RESOLVED ?? 0) +
            (data.complaints.byStatus.CLOSED ?? 0)
          }
          icon={<CheckCircle2 className="h-4 w-4" />}
          tone="success"
        />
        <StatCard
          label="Total spent"
          value={formatCurrency(data.totalSpent)}
          icon={<CreditCard className="h-4 w-4" />}
          tone="info"
        />
        <StatCard
          label="Unread notifications"
          value={data.unreadNotifications}
          icon={<Bell className="h-4 w-4" />}
          tone={data.unreadNotifications > 0 ? "warning" : "neutral"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Complaints by status</CardTitle>
          </CardHeader>
          <CardContent>
            {data.complaints.total === 0 ? (
              <EmptyState
                title="No complaints yet"
                description="File your first complaint to get started."
                action={
                  <Link href="/dashboard/complaints/new">
                    <Button leftIcon={<Plus className="h-4 w-4" />}>
                      File a complaint
                    </Button>
                  </Link>
                }
              />
            ) : (
              <ul className="space-y-2">
                {COMPLAINT_STATUSES.map((status) => {
                  const count = data.complaints.byStatus[status] ?? 0;
                  if (count === 0) return null;
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
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service requests by status</CardTitle>
          </CardHeader>
          <CardContent>
            {data.serviceRequests.total === 0 ? (
              <EmptyState
                title="No service requests"
                description="Apply for a municipal service like a trade license."
                action={
                  <Link href="/dashboard/service-requests/new">
                    <Button leftIcon={<Plus className="h-4 w-4" />}>
                      New request
                    </Button>
                  </Link>
                }
              />
            ) : (
              <ul className="space-y-2">
                {SERVICE_REQUEST_STATUSES.map((status) => {
                  const count = data.serviceRequests.byStatus[status] ?? 0;
                  if (count === 0) return null;
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
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link href="/dashboard/complaints">
          <Card className="transition-all hover:border-ink hover:shadow-[4px_4px_0_0_var(--color-ink)]">
            <CardContent className="flex items-center justify-between gap-4">
              <div>
                <p className="text-base font-semibold text-ink">
                  View my complaints
                </p>
                <p className="mt-1 text-sm text-ink-muted">
                  Track status, timeline, and reviews.
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-ink-muted" aria-hidden="true" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/service-requests">
          <Card className="transition-all hover:border-ink hover:shadow-[4px_4px_0_0_var(--color-ink)]">
            <CardContent className="flex items-center justify-between gap-4">
              <div>
                <p className="text-base font-semibold text-ink">
                  View my service requests
                </p>
                <p className="mt-1 text-sm text-ink-muted">
                  Applications, reviews, and payments.
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-ink-muted" aria-hidden="true" />
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Link href="/dashboard/complaints/new">
            <Button variant="outline" leftIcon={<FileWarning className="h-4 w-4" />}>
              File a complaint
            </Button>
          </Link>
          <Link href="/dashboard/service-requests/new">
            <Button variant="outline" leftIcon={<ListChecks className="h-4 w-4" />}>
              Request a service
            </Button>
          </Link>
          <Link href="/dashboard/payments">
            <Button variant="outline" leftIcon={<CreditCard className="h-4 w-4" />}>
              Payment history
            </Button>
          </Link>
          <Link href="/dashboard/notifications">
            <Button variant="outline" leftIcon={<Bell className="h-4 w-4" />}>
              Notifications
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}