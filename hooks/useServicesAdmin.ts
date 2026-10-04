"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useApiAuth } from "./useApiAuth";
import { queryKeys } from "@/lib/api/queryKeys";
import type {
  CreateServiceInput,
  Service,
  UpdateServiceInput,
} from "@/lib/api/types";

export function useCreateService() {
  const { call } = useApiAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateServiceInput) =>
      call<Service>("/services", { method: "POST", body: input }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.services.all });
      toast.success("Service created");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateService() {
  const { call } = useApiAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateServiceInput }) =>
      call<Service>(`/services/${id}`, { method: "PATCH", body: input }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.services.all });
      toast.success("Service updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteService() {
  const { call } = useApiAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      call<{ deleted: true } | { softDeleted: true; service: Service }>(
        `/services/${id}`,
        { method: "DELETE" },
      ),
    onSuccess: (result) => {
      void qc.invalidateQueries({ queryKey: queryKeys.services.all });
      toast.success(
        "softDeleted" in result ? "Service deactivated (in use)" : "Service deleted",
      );
    },
    onError: (err: Error) => toast.error(err.message),
  });
}