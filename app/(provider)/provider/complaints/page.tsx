"use client";

import { useMemo } from "react";
import Link from "next/link";
import { FileWarning, X } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { Pagination } from "@/components/ui/Pagination";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select, type SelectOption } from "@/components/ui/Select";
import { ComplaintCard } from "@/components/complaints/ComplaintCard";
import { useComplaints } from "@/hooks/useComplaints";
import { useUrlState } from "@/hooks/useUrlState";
import { usePagination } from "@/hooks/usePagination";
import {
  COMPLAINT_STATUSES,
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  PRIORITIES,
} from "@/lib/utils/constants";
import { humanizeEnum } from "@/lib/utils/format";
import type { ComplaintStatus, Priority } from "@/lib/api/types";

const statusOptions: SelectOption[] = [
  { value: "", label: "All statuses" },
  ...COMPLAINT_STATUSES.map((s) => ({ value: s, label: humanizeEnum(s) })),
];

const priorityOptions: SelectOption[] = [
  { value: "", label: "All priorities" },
  ...PRIORITIES.map((p) => ({ value: p, label: humanizeEnum(p) })),
];

const sortOptions: SelectOption[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
];

export default function AgentComplaintsPage() {
  const { state, setState, reset } = useUrlState({
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
    status: "" as ComplaintStatus | "",
    priority: "" as Priority | "",
    search: "",
    sort: "newest" as "newest" | "oldest",
  });

  const query = useMemo(
    () => ({
      page: state.page,
      limit: state.limit,
      status: state.status || undefined,
      priority: state.priority || undefined,
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

  const hasFilters = Boolean(state.status || state.priority || state.search);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          Assigned complaints
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Advance status, add notes, and resolve complaints in your queue.
        </p>
      </header>

      <div className="space-y-3 rounded-lg border-2 border-border bg-surface p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <SearchInput
            value={state.search}
            onChange={(search) => setState({ search, page: 1 })}
            placeholder="Search title or description"
          />
          <Select
            aria-label="Status"
            value={state.status}
            onChange={(e) =>
              setState({
                status: (e.target.value || "") as ComplaintStatus | "",
                page: 1,
              })
            }
            options={statusOptions}
          />
          <Select
            aria-label="Priority"
            value={state.priority}
            onChange={(e) =>
              setState({
                priority: (e.target.value || "") as Priority | "",
                page: 1,
              })
            }
            options={priorityOptions}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Select
            aria-label="Sort"
            value={state.sort}
            onChange={(e) =>
              setState({ sort: e.target.value as "newest" | "oldest" })
            }
            options={sortOptions}
            className="w-44"
          />
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={reset}
              leftIcon={<X className="h-3.5 w-3.5" />}
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <ListSkeleton rows={5} />
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : (data?.items.length ?? 0) === 0 ? (
        <EmptyState
          icon={<FileWarning className="h-6 w-6" aria-hidden="true" />}
          title="No complaints in your queue"
          description={
            hasFilters
              ? "Try clearing filters or searching for something else."
              : "You don't have any complaints assigned right now."
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