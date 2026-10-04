"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/queryKeys";
import { useApiAuth } from "./useApiAuth";
import type {
  AdminDashboardData,
  AgentDashboardData,
  CitizenDashboardData,
} from "@/lib/api/types";

export function useCitizenDashboard() {
  const { call } = useApiAuth();
  return useQuery({
    queryKey: queryKeys.dashboard.citizen,
    queryFn: () => call<CitizenDashboardData>("/dashboard/citizen"),
  });
}

export function useAgentDashboard() {
  const { call } = useApiAuth();
  return useQuery({
    queryKey: queryKeys.dashboard.agent,
    queryFn: () => call<AgentDashboardData>("/dashboard/agent"),
  });
}

export function useAdminDashboard() {
  const { call } = useApiAuth();
  return useQuery({
    queryKey: queryKeys.dashboard.admin,
    queryFn: () => call<AdminDashboardData>("/dashboard/admin"),
  });
}