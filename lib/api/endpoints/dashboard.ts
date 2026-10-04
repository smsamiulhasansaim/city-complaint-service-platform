import { request } from "../client";
import type {
  AdminDashboardData,
  AgentDashboardData,
  CitizenDashboardData,
} from "../types";

export const dashboardApi = {
  admin(token: string): Promise<AdminDashboardData> {
    return request<AdminDashboardData>("/dashboard/admin", { token });
  },

  agent(token: string): Promise<AgentDashboardData> {
    return request<AgentDashboardData>("/dashboard/agent", { token });
  },

  citizen(token: string): Promise<CitizenDashboardData> {
    return request<CitizenDashboardData>("/dashboard/citizen", { token });
  },
};