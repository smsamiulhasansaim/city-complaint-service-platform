"use client";

import { useMemo } from "react";
import { ListChecks, X } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { Pagination } from "@/components/ui/Pagination";
import { Select, type SelectOption } from "@/components/ui/Select";
import { ServiceRequestCard } from "@/components/service-requests/ServiceRequestCard";
import { useServiceRequests } from "@/hooks/useServiceRequests";
import { useUrlState } from "@/hooks/useUrlState";
import { usePagination } from "@/hooks/usePagination";
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  SERVICE_REQUEST_STATUSES,
} from "@/lib/utils/constants";
import { humanizeEnum } from "@/lib/utils/format";
import type { ServiceRequestStatus } from "@/lib/api/types";

const statusOptions: SelectOption[] = [
  { value: "", label: "All statuses" },
  ...SERVICE_REQUEST_STATUSES.map((s) => ({
    value: s,
    label: humanizeEnum(s),
  })),
];

const sortOptions: SelectOption[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
];

export default function AgentServiceRequestsPage() {
  const { state, setState, reset } = useUrlState({
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
    status: "" as ServiceRequestStatus | "",
    sort: "newest" as "newest" | "oldest",
  });

  const query = useMemo(
    () => ({
      page: state.page,
      limit: state.limit,
      status: state.status || undefined,
      sort: state.sort,
    }),
    [state],
  );

  const { data, isLoading, isError, refetch } = useServiceRequests(query);
  const pagination = usePagination({
    page: state.page,
    limit: state.limit,
    total: data?.total ?? 0,
  });

  const hasFilters = Boolean(state.status || state.sort !== "newest");

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          Assigned service requests
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Review requests, move them through approvals, and complete them.
        </p>
      </header>

      <div className="space-y-3 rounded-lg border-2 border-border bg-surface p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Select
            aria-label="Status"
            value={state.status}
            onChange={(e) =>
              setState({
                status: (e.target.value || "") as ServiceRequestStatus | "",
                page: 1,
              })
            }
            options={statusOptions}
          />
          <Select
            aria-label="Sort"
            value={state.sort}
            onChange={(e) =>
              setState({ sort: e.target.value as "newest" | "oldest" })
            }
            options={sortOptions}
          />
        </div>
        {hasFilters && (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={reset}
              leftIcon={<X className="h-3.5 w-3.5" />}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>

      {isLoading ? (
        <ListSkeleton rows={5} />
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : (data?.items.length ?? 0) === 0 ? (
        <EmptyState
          icon={<ListChecks className="h-6 w-6" aria-hidden="true" />}
          title="No service requests in your queue"
          description={
            hasFilters
              ? "Try clearing filters to see all requests."
              : "You don't have any service requests assigned right now."
          }
        />
      ) : (
        <>
          <div className="space-y-3">
            {data?.items.map((sr) => (
              <ServiceRequestCard
                key={sr.id}
                request={sr}
                basePath="/provider/service-requests"
              />
            ))}
          </div>
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(next) => setState({ page: next })}
          />
        </>
      )}
    </div>
  );
}