"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useApiAuth } from "./useApiAuth";
import { queryKeys } from "@/lib/api/queryKeys";
import type {
  CreateAgentInput,
  ListUsersQuery,
  UpdateRoleInput,
  UpdateUserStatusInput,
  User,
} from "@/lib/api/types";

export function useUsers(query: ListUsersQuery) {
  const { call } = useApiAuth();
  return useQuery({
    queryKey: queryKeys.users.list(query),
    queryFn: async () => {
      const items = await call<User[]>("/users", {
        query: {
          page: query.page,
          limit: query.limit,
          role: query.role,
          status: query.status,
          search: query.search,
        },
      });
      return { items, total: items.length };
    },
  });
}

export function useUser(id: string | null) {
  const { call } = useApiAuth();
  return useQuery({
    queryKey: queryKeys.users.detail(id ?? ""),
    queryFn: () => call<User>(`/users/${id}`),
    enabled: Boolean(id),
  });
}

export function useCreateAgent() {
  const { call } = useApiAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAgentInput) =>
      call<User>("/users/agents", { method: "POST", body: input }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success("Agent created");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateUserRole() {
  const { call } = useApiAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateRoleInput }) =>
      call<User>(`/users/${id}/role`, { method: "PATCH", body: input }),
    onSuccess: (updated) => {
      void qc.invalidateQueries({ queryKey: queryKeys.users.all });
      void qc.invalidateQueries({ queryKey: queryKeys.users.detail(updated.id) });
      toast.success("Role updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateUserStatus() {
  const { call } = useApiAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateUserStatusInput }) =>
      call<User>(`/users/${id}/status`, { method: "PATCH", body: input }),
    onSuccess: (updated) => {
      void qc.invalidateQueries({ queryKey: queryKeys.users.all });
      void qc.invalidateQueries({ queryKey: queryKeys.users.detail(updated.id) });
      toast.success(`User ${updated.status === "BANNED" ? "banned" : "reactivated"}`);
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteUser() {
  const { call } = useApiAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      call<{ deleted: boolean }>(`/users/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success("User deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}