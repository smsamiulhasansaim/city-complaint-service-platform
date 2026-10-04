"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CheckCircle2,
  FileWarning,
  ListChecks,
  Loader2,
  Timer,
  TrendingUp,
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
import { useAgentDashboard } from "@/hooks/useDashboard";
import { useAuth } from "@/hooks/useAuth";
import {
  COMPLAINT_STATUSES,
  SERVICE_REQUEST_STATUSES,
} from "@/lib/utils/constants";

export default function AgentDashboardPage() {
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = useAgentDashboard();
  const [range] = useState<"all">("all");

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
        title="Could not load your workspace"
        message="There was a problem fetching your assigned work. Please try again."
        onRetry={() => void refetch()}
      />
    );
  }

  const totalComplaints = data.complaints.totalAssigned;
  const resolved = data.complaints.resolved;
  const inProgress =
    (data.complaints.byStatus.ASSIGNED ?? 0) +
    (data.complaints.byStatus.IN_PROGRESS ?? 0);
  const totalServiceRequests = data.serviceRequests.totalAssigned;

  void range;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            Agent workspace
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Welcome, {user?.name.split(" ")[0] ?? "agent"}. Here&apos;s your
            current queue.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/provider/complaints">
            <Button variant="outline" leftIcon={<FileWarning className="h-4 w-4" />}>
              My complaints
            </Button>
          </Link>
          <Link href="/provider/service-requests">
            <Button leftIcon={<ListChecks className="h-4 w-4" />}>
              My requests
            </Button>
          </Link>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Assigned complaints"
          value={totalComplaints}
          icon={<FileWarning className="h-4 w-4" />}
          tone="accent"
        />
        <StatCard
          label="In progress"
          value={inProgress}
          icon={<Timer className="h-4 w-4" />}
          tone="warning"
        />
        <StatCard
          label="Resolved"
          value={resolved}
          icon={<CheckCircle2 className="h-4 w-4" />}
          tone="success"
        />
        <StatCard
          label="Service requests"
          value={totalServiceRequests}
          icon={<TrendingUp className="h-4 w-4" />}
          tone="info"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Complaints by status</CardTitle>
          </CardHeader>
          <CardContent>
            {totalComplaints === 0 ? (
              <EmptyState
                title="No complaints assigned"
                description="You'll see assigned complaints here once an admin assigns one."
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
            {totalServiceRequests === 0 ? (
              <EmptyState
                title="No service requests"
                description="Requests assigned to you will appear here."
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
    </div>
  );
}