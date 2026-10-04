"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ListChecks, Plus } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { Pagination } from "@/components/ui/Pagination";
import { ServiceRequestCard } from "@/components/service-requests/ServiceRequestCard";
import { ServiceRequestFilters } from "@/components/service-requests/ServiceRequestFilters";
import { useServiceRequests } from "@/hooks/useServiceRequests";
import { useUrlState } from "@/hooks/useUrlState";
import { usePagination } from "@/hooks/usePagination";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/lib/utils/constants";
import type { ServiceRequestStatus } from "@/lib/api/types";

export default function CitizenServiceRequestsPage() {
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

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            Service requests
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Apply for municipal services, pay fees, and track the review.
          </p>
        </div>
        <Link href="/dashboard/service-requests/new">
          <Button leftIcon={<Plus className="h-4 w-4" />}>New request</Button>
        </Link>
      </header>

      <ServiceRequestFilters
        value={{
          status: state.status || undefined,
          sort: state.sort,
        }}
        onChange={(patch) => setState({ ...patch, page: 1 })}
        onReset={reset}
      />

      {isLoading ? (
        <ListSkeleton rows={5} />
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : (data?.items.length ?? 0) === 0 ? (
        <EmptyState
          icon={<ListChecks className="h-6 w-6" aria-hidden="true" />}
          title="No service requests found"
          description={
            state.status
              ? "Try a different status filter."
              : "You haven't requested any municipal services yet."
          }
          action={
            <Link href="/dashboard/service-requests/new">
              <Button leftIcon={<Plus className="h-4 w-4" />}>
                New request
              </Button>
            </Link>
          }
        />
      ) : (
        <>
          <div className="space-y-3">
            {data?.items.map((sr) => (
              <ServiceRequestCard key={sr.id} request={sr} />
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