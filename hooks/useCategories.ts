"use client";

import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "@/lib/api/endpoints";
import { queryKeys } from "@/lib/api/queryKeys";

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: () => categoriesApi.list(),
    staleTime: 60 * 60 * 1000,
  });
}