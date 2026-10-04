"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Shield, ShieldOff, Trash2, Users as UsersIcon } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { Select, type SelectOption } from "@/components/ui/Select";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { SearchInput } from "@/components/ui/SearchInput";
import {
  useDeleteUser,
  useUpdateUserStatus,
  useUsers,
} from "@/hooks/useUsers";
import { useUrlState } from "@/hooks/useUrlState";
import { usePagination } from "@/hooks/usePagination";
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  ROLE_LABELS,
  ROLES,
  USER_STATUSES,
} from "@/lib/utils/constants";
import { formatDate, humanizeEnum, initials } from "@/lib/utils/format";
import type { Role, User, UserStatus } from "@/lib/api/types";
import { CreateAgentModal } from "@/components/admin/CreateAgentModal";
import { UpdateRoleModal } from "@/components/admin/UpdateRoleModal";

const roleOptions: SelectOption[] = [
  { value: "", label: "All roles" },
  ...ROLES.map((r) => ({ value: r, label: ROLE_LABELS[r] })),
];

const statusOptions: SelectOption[] = [
  { value: "", label: "All statuses" },
  ...USER_STATUSES.map((s) => ({ value: s, label: humanizeEnum(s) })),
];

export default function AdminUsersPage() {
  const { state, setState, reset } = useUrlState({
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
    role: "" as Role | "",
    status: "" as UserStatus | "",
    search: "",
  });

  const query = useMemo(
    () => ({
      page: state.page,
      limit: state.limit,
      role: state.role || undefined,
      status: state.status || undefined,
      search: state.search || undefined,
    }),
    [state],
  );

  const { data, isLoading, isError, refetch } = useUsers(query);
  const pagination = usePagination({
    page: state.page,
    limit: state.limit,
    total: data?.total ?? 0,
  });

  const statusMutation = useUpdateUserStatus();
  const deleteMutation = useDeleteUser();

  const [createOpen, setCreateOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState<User | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<User | null>(null);

  const hasFilters = Boolean(state.role || state.status || state.search);

  const columns: Column<User>[] = [
    {
      key: "user",
      header: "User",
      cell: (u) => (
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/25 text-[10px] font-semibold text-ink">
            {initials(u.name)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">{u.name}</p>
            <p className="truncate text-xs text-ink-muted">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      cell: (u) => <Badge tone="accent">{ROLE_LABELS[u.role]}</Badge>,
    },
    {
      key: "status",
      header: "Status",
      cell: (u) => (
        <Badge tone={u.status === "ACTIVE" ? "success" : "danger"} dot>
          {humanizeEnum(u.status)}
        </Badge>
      ),
    },
    {
      key: "ward",
      header: "Ward",
      hideOnMobile: true,
      cell: (u) => <span className="text-sm text-ink-muted">{u.ward ?? "—"}</span>,
    },
    {
      key: "joined",
      header: "Joined",
      hideOnMobile: true,
      cell: (u) => (
        <span className="text-sm text-ink-muted">{formatDate(u.createdAt)}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (u) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRoleOpen(u)}
            aria-label={`Change role for ${u.name}`}
          >
            Role
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              statusMutation.mutate({
                id: u.id,
                input: { status: u.status === "BANNED" ? "ACTIVE" : "BANNED" },
              })
            }
            aria-label={u.status === "BANNED" ? "Reactivate" : "Ban"}
          >
            {u.status === "BANNED" ? (
              <Shield className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ShieldOff className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConfirmDelete(u)}
            aria-label={`Delete ${u.name}`}
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
            User management
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Create agents, adjust roles, and moderate accounts.
          </p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setCreateOpen(true)}>
          Create agent
        </Button>
      </header>

      <div className="grid gap-3 rounded-lg border-2 border-border bg-surface p-4 sm:grid-cols-2 lg:grid-cols-3">
        <SearchInput
          value={state.search}
          onChange={(search) => setState({ search, page: 1 })}
          placeholder="Search by name or email"
        />
        <Select
          aria-label="Role"
          value={state.role}
          onChange={(e) =>
            setState({ role: (e.target.value || "") as Role | "", page: 1 })
          }
          options={roleOptions}
        />
        <Select
          aria-label="Status"
          value={state.status}
          onChange={(e) =>
            setState({
              status: (e.target.value || "") as UserStatus | "",
              page: 1,
            })
          }
          options={statusOptions}
        />
      </div>

      {isLoading ? (
        <TableSkeleton rows={6} cols={5} />
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : (
        <>
          <DataTable<User>
            columns={columns}
            rows={data?.items ?? []}
            getRowId={(u) => u.id}
            emptyState={
              <EmptyState
                icon={<UsersIcon className="h-6 w-6" aria-hidden="true" />}
                title="No users found"
                description={
                  hasFilters
                    ? "Try clearing filters or using a different search."
                    : "There are no users on the platform yet."
                }
                action={
                  hasFilters && (
                    <Button variant="outline" size="sm" onClick={reset}>
                      Clear filters
                    </Button>
                  )
                }
              />
            }
          />
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(next) => setState({ page: next })}
          />
        </>
      )}

      <CreateAgentModal open={createOpen} onClose={() => setCreateOpen(false)} />

      <UpdateRoleModal
        user={roleOpen}
        onClose={() => setRoleOpen(null)}
      />

      <Modal
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        title="Delete this user?"
        description="You can only delete users who have no platform activity."
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              isLoading={deleteMutation.isPending}
              onClick={() => {
                if (!confirmDelete) return;
                deleteMutation.mutate(confirmDelete.id, {
                  onSuccess: () => setConfirmDelete(null),
                });
              }}
            >
              Delete user
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-muted">
          Users with complaints, service requests, payments, or assigned work
          cannot be deleted — ban them instead.
        </p>
      </Modal>

      <Search className="hidden" aria-hidden="true" />
    </div>
  );
}