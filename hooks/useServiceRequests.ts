"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useApiAuth } from "./useApiAuth";
import { queryKeys } from "@/lib/api/queryKeys";
import type {
  AssignInput,
  CreateServiceRequestInput,
  ListServiceRequestsQuery,
  ServiceRequest,
  ServiceRequestStatusInput,
} from "@/lib/api/types";

interface ListResult {
  items: ServiceRequest[];
  total: number;
}

export function useServiceRequests(query: ListServiceRequestsQuery) {
  const { call } = useApiAuth();
  return useQuery({
    queryKey: queryKeys.serviceRequests.list(query),
    queryFn: async () => {
      const items = await call<ServiceRequest[]>("/service-requests", {
        query: {
          page: query.page,
          limit: query.limit,
          status: query.status,
          serviceId: query.serviceId,
          sort: query.sort,
        },
      });
      return { items, total: items.length } satisfies ListResult;
    },
  });
}

export function useServiceRequest(id: string | null) {
  const { call } = useApiAuth();
  return useQuery({
    queryKey: queryKeys.serviceRequests.detail(id ?? ""),
    queryFn: () => call<ServiceRequest>(`/service-requests/${id}`),
    enabled: Boolean(id),
  });
}

export function useCreateServiceRequest() {
  const { call } = useApiAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateServiceRequestInput) =>
      call<ServiceRequest>("/service-requests", {
        method: "POST",
        body: input,
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.serviceRequests.all });
      void qc.invalidateQueries({ queryKey: queryKeys.dashboard.citizen });
    },
  });
}

export function useAssignServiceRequest() {
  const { call } = useApiAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: AssignInput }) =>
      call<ServiceRequest>(`/service-requests/${id}/assign`, {
        method: "PATCH",
        body: input,
      }),
    onSuccess: (updated) => {
      void qc.invalidateQueries({ queryKey: queryKeys.serviceRequests.all });
      void qc.invalidateQueries({
        queryKey: queryKeys.serviceRequests.detail(updated.id),
      });
      toast.success("Agent assigned");
    },
  });
}

export function useChangeServiceRequestStatus() {
  const { call } = useApiAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ServiceRequestStatusInput }) =>
      call<ServiceRequest>(`/service-requests/${id}/status`, {
        method: "PATCH",
        body: input,
      }),
    onSuccess: (updated) => {
      void qc.invalidateQueries({ queryKey: queryKeys.serviceRequests.all });
      void qc.invalidateQueries({
        queryKey: queryKeys.serviceRequests.detail(updated.id),
      });
      toast.success("Status updated");
    },
  });
}