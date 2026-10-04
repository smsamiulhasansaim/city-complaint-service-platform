"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api/endpoints";
import { queryKeys } from "@/lib/api/queryKeys";
import { useApiAuth } from "./useApiAuth";

/**
 * Dashboard queries go through the proxy because they require auth.
 * We use `useApiAuth().call` instead of the endpoint modules, since the
 * endpoint modules expect a raw token and are intended for server usage.
 */

export function useCitizenDashboard() {
  const { call } = useApiAuth();
  return useQuery({
    queryKey: queryKeys.dashboard.citizen,
    queryFn: () => call<import("@/lib/api/types").CitizenDashboardData>("/dashboard/citizen"),
  });
}

export function useAgentDashboard() {
  const { call } = useApiAuth();
  return useQuery({
    queryKey: queryKeys.dashboard.agent,
    queryFn: () => call<import("@/lib/api/types").AgentDashboardData>("/dashboard/agent"),
  });
}

export function useAdminDashboard() {
  const { call } = useApiAuth();
  return useQuery({
    queryKey: queryKeys.dashboard.admin,
    queryFn: () => call<import("@/lib/api/types").AdminDashboardData>("/dashboard/admin"),
  });
}

void dashboardApi; // keep endpoint module referenced for future server usage