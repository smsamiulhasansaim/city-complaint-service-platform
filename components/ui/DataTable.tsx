"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export interface Column<T> {
  key: string;
  header: ReactNode;
  /** Cell renderer for a row. */
  cell: (row: T) => ReactNode;
  /** Tailwind classes applied to <th> and <td>. */
  className?: string;
  /** Hide this column below `sm` breakpoint. */
  hideOnMobile?: boolean;
  align?: "left" | "right" | "center";
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyState?: ReactNode;
  className?: string;
  /** Renders a mobile-friendly stacked card layout under `sm`. Default true. */
  responsive?: boolean;
}

const alignMap = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
} as const;

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  onRowClick,
  emptyState,
  className,
  responsive = true,
}: DataTableProps<T>) {
  if (rows.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Desktop / tablet table */}
      <div className="hidden overflow-hidden rounded-lg border-2 border-border bg-surface sm:block">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-surface-2">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cn(
                    "border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-muted",
                    alignMap[col.align ?? "left"],
                    col.className,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={getRowId(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  "border-b border-border last:border-b-0 transition-colors",
                  onRowClick && "cursor-pointer hover:bg-surface-2/60",
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-4 py-3 text-ink align-middle",
                      alignMap[col.align ?? "left"],
                      col.className,
                    )}
                  >
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      {responsive && (
        <div className="space-y-3 sm:hidden">
          {rows.map((row) => {
            const cardContent = (
              <dl className="space-y-2">
                {columns.map((col) => (
                  <div
                    key={col.key}
                    className={cn(
                      "flex items-start justify-between gap-4",
                      col.hideOnMobile && "hidden",
                    )}
                  >
                    <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                      {col.header}
                    </dt>
                    <dd className="text-right text-sm text-ink">
                      {col.cell(row)}
                    </dd>
                  </div>
                ))}
              </dl>
            );

            if (!onRowClick) {
              return (
                <div key={getRowId(row)} className="rounded-lg border-2 border-border bg-surface p-4">
                  {cardContent}
                </div>
              );
            }

            return (
              <button
                key={getRowId(row)}
                type="button"
                onClick={() => onRowClick(row)}
                className={cn(
                  "w-full rounded-lg border-2 border-border bg-surface p-4 text-left",
                  "cursor-pointer active:bg-surface-2/60",
                )}
              >
                {cardContent}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}