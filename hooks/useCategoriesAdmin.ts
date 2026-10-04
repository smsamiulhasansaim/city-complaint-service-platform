"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useApiAuth } from "./useApiAuth";
import { queryKeys } from "@/lib/api/queryKeys";
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/lib/api/types";

export function useCreateCategory() {
  const { call } = useApiAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCategoryInput) =>
      call<Category>("/categories", { method: "POST", body: input }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.categories.all });
      toast.success("Category created");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateCategory() {
  const { call } = useApiAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: UpdateCategoryInput;
    }) =>
      call<Category>(`/categories/${id}`, { method: "PATCH", body: input }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.categories.all });
      toast.success("Category updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteCategory() {
  const { call } = useApiAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      call<{ deleted: true } | { softDeleted: true; category: Category }>(
        `/categories/${id}`,
        { method: "DELETE" },
      ),
    onSuccess: (result) => {
      void qc.invalidateQueries({ queryKey: queryKeys.categories.all });
      toast.success(
        "softDeleted" in result ? "Category deactivated (in use)" : "Category deleted",
      );
    },
    onError: (err: Error) => toast.error(err.message),
  });
}