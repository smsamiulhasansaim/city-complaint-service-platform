"use client";

import { useMemo } from "react";
import { Bell, BellOff, CheckCheck } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { Pagination } from "@/components/ui/Pagination";
import { Select, type SelectOption } from "@/components/ui/Select";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "@/hooks/useNotifications";
import { useUrlState } from "@/hooks/useUrlState";
import { usePagination } from "@/hooks/usePagination";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/lib/utils/constants";
import { cn } from "@/lib/utils/cn";
import { formatRelative, humanizeEnum } from "@/lib/utils/format";

const readOptions: SelectOption[] = [
  { value: "", label: "All" },
  { value: "false", label: "Unread only" },
  { value: "true", label: "Read only" },
];

export default function NotificationsPage() {
  const { state, setState } = useUrlState({
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
    isRead: "",
  });

  const query = useMemo(
    () => ({
      page: state.page,
      limit: state.limit,
      isRead:
        state.isRead === ""
          ? undefined
          : state.isRead === "true",
    }),
    [state],
  );

  const { data, isLoading, isError, refetch } = useNotifications(query);
  const markOne = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();
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
            Notifications
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {data ? `${data.unreadCount} unread` : "Stay up to date"}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => markAll.mutate()}
          disabled={!data || data.unreadCount === 0 || markAll.isPending}
          leftIcon={<CheckCheck className="h-4 w-4" />}
        >
          Mark all read
        </Button>
      </header>

      <div className="rounded-lg border-2 border-border bg-surface p-4">
        <Select
          aria-label="Filter by read status"
          value={state.isRead}
          onChange={(e) => setState({ isRead: e.target.value, page: 1 })}
          options={readOptions}
        />
      </div>

      {isLoading ? (
        <ListSkeleton rows={6} />
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : (data?.items.length ?? 0) === 0 ? (
        <EmptyState
          icon={<BellOff className="h-6 w-6" aria-hidden="true" />}
          title="No notifications"
          description={
            state.isRead
              ? "There are no notifications matching this filter."
              : "You're all caught up."
          }
        />
      ) : (
        <>
          <div className="space-y-2">
            {data?.items.map((n) => (
              <Card
                key={n.id}
                className={cn(
                  "transition-colors",
                  !n.isRead && "border-accent bg-surface-2/40",
                )}
              >
                <CardContent className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <span
                      className={cn(
                        "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
                        n.isRead
                          ? "bg-surface-2 text-ink-muted"
                          : "bg-accent/25 text-ink",
                      )}
                    >
                      <Bell className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full border border-border-strong px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
                          {humanizeEnum(n.type)}
                        </span>
                        {!n.isRead && (
                          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        )}
                      </div>
                      <p className="mt-1 text-sm text-ink">{n.message}</p>
                      <p className="mt-1 text-xs text-ink-muted">
                        {formatRelative(n.createdAt)}
                      </p>
                    </div>
                  </div>

                  {!n.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markOne.mutate(n.id)}
                      disabled={markOne.isPending}
                    >
                      Mark read
                    </Button>
                  )}
                </CardContent>
              </Card>
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