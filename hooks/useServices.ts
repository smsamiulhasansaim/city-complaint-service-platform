"use client";

import { useQuery } from "@tanstack/react-query";
import { servicesApi } from "@/lib/api/endpoints";
import { queryKeys } from "@/lib/api/queryKeys";

export function useServices() {
  return useQuery({
    queryKey: queryKeys.services.list(),
    queryFn: () => servicesApi.list(),
    staleTime: 60 * 60 * 1000,
  });
}