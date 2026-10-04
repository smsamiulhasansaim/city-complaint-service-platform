"use client";

import Link from "next/link";
import { useMemo } from "react";
import { FileWarning, Plus } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { Pagination } from "@/components/ui/Pagination";
import { ComplaintCard } from "@/components/complaints/ComplaintCard";
import { ComplaintFilters } from "@/components/complaints/ComplaintFilters";
import { useComplaints } from "@/hooks/useComplaints";
import { useUrlState } from "@/hooks/useUrlState";
import { usePagination } from "@/hooks/usePagination";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/lib/utils/constants";
import type { ComplaintStatus, Priority } from "@/lib/api/types";

export default function CitizenComplaintsPage() {
  const { state, setState, reset } = useUrlState({
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
    status: "" as ComplaintStatus | "",
    priority: "" as Priority | "",
    categoryId: "",
    search: "",
    sort: "newest" as "newest" | "oldest",
  });

  const query = useMemo(
    () => ({
      page: state.page,
      limit: state.limit,
      status: state.status || undefined,
      priority: state.priority || undefined,
      categoryId: state.categoryId || undefined,
      search: state.search || undefined,
      sort: state.sort,
    }),
    [state],
  );

  const { data, isLoading, isError, refetch } = useComplaints(query);

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
            My complaints
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Track the status and timeline of every complaint you file.
          </p>
        </div>
        <Link href="/dashboard/complaints/new">
          <Button leftIcon={<Plus className="h-4 w-4" />}>File a complaint</Button>
        </Link>
      </header>

      <ComplaintFilters
        value={{
          status: state.status || undefined,
          priority: state.priority || undefined,
          categoryId: state.categoryId || undefined,
          search: state.search || undefined,
          sort: state.sort,
        }}
        onChange={(patch) => {
          const { page: _page, ...rest } = patch as Record<string, unknown>;
          void _page;
          setState({
            ...(rest as Partial<typeof state>),
            page: 1,
          });
        }}
        onReset={reset}
      />

      {isLoading ? (
        <ListSkeleton rows={5} />
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : (data?.items.length ?? 0) === 0 ? (
        <EmptyState
          icon={<FileWarning className="h-6 w-6" aria-hidden="true" />}
          title="No complaints found"
          description={
            state.search || state.status || state.priority || state.categoryId
              ? "Try adjusting your filters or clear them to see all complaints."
              : "You haven't filed any complaints yet. File your first one to get started."
          }
          action={
            <Link href="/dashboard/complaints/new">
              <Button leftIcon={<Plus className="h-4 w-4" />}>
                File a complaint
              </Button>
            </Link>
          }
        />
      ) : (
        <>
          <div className="space-y-3">
            {data?.items.map((c) => (
              <ComplaintCard key={c.id} complaint={c} />
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