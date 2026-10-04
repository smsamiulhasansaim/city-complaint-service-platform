"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useApiAuth } from "./useApiAuth";
import { queryKeys } from "@/lib/api/queryKeys";
import type {
  AddComplaintUpdateInput,
  AssignInput,
  Complaint,
  ComplaintStatusInput,
  ComplaintUpdate,
  CreateComplaintInput,
  ListComplaintsQuery,
  UpdateComplaintInput,
} from "@/lib/api/types";

interface ComplaintsListResponse {
  // The proxy returns `data` as an array; meta separately.
  // We call the proxy with the raw list endpoint.
  items: Complaint[];
  total: number;
}

export function useComplaints(query: ListComplaintsQuery) {
  const { call } = useApiAuth();
  return useQuery({
    queryKey: queryKeys.complaints.list(query),
    queryFn: async () => {
      const items = await call<Complaint[]>("/complaints", {
        query: {
          page: query.page,
          limit: query.limit,
          status: query.status,
          categoryId: query.categoryId,
          priority: query.priority,
          ward: query.ward,
          search: query.search,
          sort: query.sort,
        },
      });
      return { items, total: items.length } satisfies ComplaintsListResponse;
    },
  });
}

export function useComplaint(id: string | null) {
  const { call } = useApiAuth();
  return useQuery({
    queryKey: queryKeys.complaints.detail(id ?? ""),
    queryFn: () => call<Complaint>(`/complaints/${id}`),
    enabled: Boolean(id),
  });
}

export function useComplaintUpdates(id: string | null) {
  const { call } = useApiAuth();
  return useQuery({
    queryKey: queryKeys.complaints.updates(id ?? ""),
    queryFn: () => call<ComplaintUpdate[]>(`/complaints/${id}/updates`),
    enabled: Boolean(id),
  });
}

export function useCreateComplaint() {
  const { call } = useApiAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateComplaintInput) =>
      call<Complaint>("/complaints", { method: "POST", body: input }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.complaints.all });
      void qc.invalidateQueries({ queryKey: queryKeys.dashboard.citizen });
    },
  });
}

export function useUpdateComplaint() {
  const { call } = useApiAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateComplaintInput }) =>
      call<Complaint>(`/complaints/${id}`, { method: "PATCH", body: input }),
    onSuccess: (updated) => {
      void qc.invalidateQueries({ queryKey: queryKeys.complaints.all });
      void qc.invalidateQueries({
        queryKey: queryKeys.complaints.detail(updated.id),
      });
    },
  });
}

export function useDeleteComplaint() {
  const { call } = useApiAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      call<{ deleted: boolean }>(`/complaints/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.complaints.all });
      void qc.invalidateQueries({ queryKey: queryKeys.dashboard.citizen });
      toast.success("Complaint deleted");
    },
  });
}

export function useAssignComplaint() {
  const { call } = useApiAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: AssignInput }) =>
      call<Complaint>(`/complaints/${id}/assign`, {
        method: "PATCH",
        body: input,
      }),
    onSuccess: (updated) => {
      void qc.invalidateQueries({ queryKey: queryKeys.complaints.all });
      void qc.invalidateQueries({
        queryKey: queryKeys.complaints.detail(updated.id),
      });
      toast.success("Agent assigned");
    },
  });
}

export function useChangeComplaintStatus() {
  const { call } = useApiAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ComplaintStatusInput }) =>
      call<Complaint>(`/complaints/${id}/status`, {
        method: "PATCH",
        body: input,
      }),
    onSuccess: (updated) => {
      void qc.invalidateQueries({ queryKey: queryKeys.complaints.all });
      void qc.invalidateQueries({
        queryKey: queryKeys.complaints.detail(updated.id),
      });
      void qc.invalidateQueries({
        queryKey: queryKeys.complaints.updates(updated.id),
      });
      toast.success("Status updated");
    },
  });
}

export function useAddComplaintUpdate() {
  const { call } = useApiAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: AddComplaintUpdateInput;
    }) =>
      call<ComplaintUpdate>(`/complaints/${id}/updates`, {
        method: "POST",
        body: input,
      }),
    onSuccess: (_update, variables) => {
      void qc.invalidateQueries({
        queryKey: queryKeys.complaints.updates(variables.id),
      });
      void qc.invalidateQueries({
        queryKey: queryKeys.complaints.detail(variables.id),
      });
      toast.success("Update posted");
    },
  });
}