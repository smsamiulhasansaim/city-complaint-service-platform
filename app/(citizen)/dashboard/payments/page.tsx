"use client";

import { useMemo } from "react";
import { CreditCard } from "lucide-react";

import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { Pagination } from "@/components/ui/Pagination";
import { Select, type SelectOption } from "@/components/ui/Select";
import { PaymentCard } from "@/components/payments/PaymentCard";
import { usePayments } from "@/hooks/usePayments";
import { useUrlState } from "@/hooks/useUrlState";
import { usePagination } from "@/hooks/usePagination";
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  PAYMENT_PURPOSES,
  PAYMENT_STATUSES,
} from "@/lib/utils/constants";
import { humanizeEnum } from "@/lib/utils/format";
import type { PaymentPurpose, PaymentStatus } from "@/lib/api/types";

const statusOptions: SelectOption[] = [
  { value: "", label: "All statuses" },
  ...PAYMENT_STATUSES.map((s) => ({ value: s, label: humanizeEnum(s) })),
];

const purposeOptions: SelectOption[] = [
  { value: "", label: "All purposes" },
  ...PAYMENT_PURPOSES.map((p) => ({ value: p, label: humanizeEnum(p) })),
];

export default function CitizenPaymentsPage() {
  const { state, setState, reset } = useUrlState({
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
    status: "" as PaymentStatus | "",
    purpose: "" as PaymentPurpose | "",
  });

  const query = useMemo(
    () => ({
      page: state.page,
      limit: state.limit,
      status: state.status || undefined,
      purpose: state.purpose || undefined,
    }),
    [state],
  );

  const { data, isLoading, isError, refetch } = usePayments(query);
  const pagination = usePagination({
    page: state.page,
    limit: state.limit,
    total: data?.total ?? 0,
  });

  const hasFilters = Boolean(state.status || state.purpose);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          Payment history
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          All Stripe transactions initiated from your account.
        </p>
      </header>

      <div className="grid gap-3 rounded-lg border-2 border-border bg-surface p-4 sm:grid-cols-2">
        <Select
          aria-label="Status"
          value={state.status}
          onChange={(e) =>
            setState({
              status: (e.target.value || "") as PaymentStatus | "",
              page: 1,
            })
          }
          options={statusOptions}
        />
        <Select
          aria-label="Purpose"
          value={state.purpose}
          onChange={(e) =>
            setState({
              purpose: (e.target.value || "") as PaymentPurpose | "",
              page: 1,
            })
          }
          options={purposeOptions}
        />
        {hasFilters && (
          <div className="sm:col-span-2 flex justify-end">
            <button
              type="button"
              className="text-sm font-medium text-ink-muted underline underline-offset-4 hover:text-ink"
              onClick={reset}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <ListSkeleton rows={5} />
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : (data?.items.length ?? 0) === 0 ? (
        <EmptyState
          icon={<CreditCard className="h-6 w-6" aria-hidden="true" />}
          title="No payments found"
          description={
            hasFilters
              ? "Try clearing your filters."
              : "You haven't made any payments yet."
          }
        />
      ) : (
        <>
          <div className="space-y-3">
            {data?.items.map((p) => (
              <PaymentCard key={p.id} payment={p} />
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