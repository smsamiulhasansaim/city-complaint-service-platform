"use client";

import { useState } from "react";
import { Layers, Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Modal } from "@/components/ui/Modal";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { CategoryFormModal } from "@/components/admin/CategoryFormModal";
import { useCategories } from "@/hooks/useCategories";
import { useDeleteCategory } from "@/hooks/useCategoriesAdmin";
import { formatDate, truncate } from "@/lib/utils/format";
import type { Category } from "@/lib/api/types";

export default function AdminCategoriesPage() {
  const { data, isLoading, isError, refetch } = useCategories();
  const remove = useDeleteCategory();

  const [editing, setEditing] = useState<Category | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Category | null>(null);

  const columns: Column<Category>[] = [
    {
      key: "name",
      header: "Name",
      cell: (c) => (
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/25 text-ink">
            <Layers className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <span className="text-sm font-medium text-ink">{c.name}</span>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      hideOnMobile: true,
      cell: (c) => (
        <span className="text-sm text-ink-muted">
          {c.description ? truncate(c.description, 60) : "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (c) => (
        <Badge tone={c.isActive ? "success" : "neutral"} dot>
          {c.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "created",
      header: "Created",
      hideOnMobile: true,
      cell: (c) => (
        <span className="text-sm text-ink-muted">{formatDate(c.createdAt)}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (c) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditing(c)}
            aria-label={`Edit ${c.name}`}
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConfirmDelete(c)}
            aria-label={`Delete ${c.name}`}
            className="text-danger hover:bg-danger-bg/50"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            Categories
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Complaint categories citizens choose from when filing.
          </p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setCreating(true)}>
          New category
        </Button>
      </header>

      {isLoading ? (
        <TableSkeleton rows={6} cols={4} />
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : (
        <DataTable<Category>
          columns={columns}
          rows={data ?? []}
          getRowId={(c) => c.id}
          emptyState={
            <EmptyState
              icon={<Layers className="h-6 w-6" aria-hidden="true" />}
              title="No categories yet"
              description="Add the first complaint category."
              action={
                <Button
                  size="sm"
                  leftIcon={<Plus className="h-4 w-4" />}
                  onClick={() => setCreating(true)}
                >
                  New category
                </Button>
              }
            />
          }
        />
      )}

      <CategoryFormModal
        open={creating}
        onClose={() => setCreating(false)}
        category={null}
      />
      <CategoryFormModal
        open={editing !== null}
        onClose={() => setEditing(null)}
        category={editing}
      />

      <Modal
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        title="Delete this category?"
        description="If the category is in use, it will be deactivated instead."
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              isLoading={remove.isPending}
              onClick={() => {
                if (!confirmDelete) return;
                remove.mutate(confirmDelete.id, {
                  onSuccess: () => setConfirmDelete(null),
                });
              }}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-muted">
          Categories that are referenced by at least one complaint are
          soft-disabled to preserve historical data.
        </p>
      </Modal>
    </div>
  );
}