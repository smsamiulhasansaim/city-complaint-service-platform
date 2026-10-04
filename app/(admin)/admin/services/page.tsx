"use client";

import { useState } from "react";
import { Coins, Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Modal } from "@/components/ui/Modal";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { ServiceFormModal } from "@/components/admin/ServiceFormModal";
import { useServices } from "@/hooks/useServices";
import { useDeleteService } from "@/hooks/useServicesAdmin";
import { formatCurrency, formatDate, truncate } from "@/lib/utils/format";
import type { Service } from "@/lib/api/types";

export default function AdminServicesPage() {
  const { data, isLoading, isError, refetch } = useServices();
  const remove = useDeleteService();

  const [editing, setEditing] = useState<Service | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Service | null>(null);

  const columns: Column<Service>[] = [
    {
      key: "name",
      header: "Service",
      cell: (s) => (
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/25 text-ink">
            <Coins className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <span className="text-sm font-medium text-ink">{s.name}</span>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      hideOnMobile: true,
      cell: (s) => (
        <span className="text-sm text-ink-muted">
          {truncate(s.description, 60)}
        </span>
      ),
    },
    {
      key: "fee",
      header: "Fee",
      align: "right",
      cell: (s) => (
        <span className="text-sm font-semibold text-ink tabular-nums">
          {formatCurrency(s.fee)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (s) => (
        <Badge tone={s.isActive ? "success" : "neutral"} dot>
          {s.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "created",
      header: "Created",
      hideOnMobile: true,
      cell: (s) => (
        <span className="text-sm text-ink-muted">{formatDate(s.createdAt)}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (s) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditing(s)}
            aria-label={`Edit ${s.name}`}
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConfirmDelete(s)}
            aria-label={`Delete ${s.name}`}
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
            Services
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Municipal services citizens can apply and pay for.
          </p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setCreating(true)}>
          New service
        </Button>
      </header>

      {isLoading ? (
        <TableSkeleton rows={6} cols={5} />
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : (
        <DataTable<Service>
          columns={columns}
          rows={data ?? []}
          getRowId={(s) => s.id}
          emptyState={
            <EmptyState
              icon={<Coins className="h-6 w-6" aria-hidden="true" />}
              title="No services yet"
              description="Add the first municipal service."
              action={
                <Button
                  size="sm"
                  leftIcon={<Plus className="h-4 w-4" />}
                  onClick={() => setCreating(true)}
                >
                  New service
                </Button>
              }
            />
          }
        />
      )}

      <ServiceFormModal
        open={creating}
        onClose={() => setCreating(false)}
        service={null}
      />
      <ServiceFormModal
        open={editing !== null}
        onClose={() => setEditing(null)}
        service={editing}
      />

      <Modal
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        title="Delete this service?"
        description="If the service is in use, it will be deactivated instead."
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
          Services referenced by existing service requests are soft-disabled so
          history stays intact.
        </p>
      </Modal>
    </div>
  );
}