/**
 * Centralized TanStack Query keys. Every list/detail hook must use these to
 * keep cache invalidation predictable.
 */

import type {
  ListComplaintsQuery,
  ListNotificationsQuery,
  ListPaymentsQuery,
  ListServiceRequestsQuery,
  ListUsersQuery,
} from "./types";

export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  users: {
    all: ["users"] as const,
    list: (query: ListUsersQuery) => ["users", "list", query] as const,
    detail: (id: string) => ["users", "detail", id] as const,
  },
  categories: {
    all: ["categories"] as const,
    list: () => ["categories", "list"] as const,
    detail: (id: string) => ["categories", "detail", id] as const,
  },
  services: {
    all: ["services"] as const,
    list: () => ["services", "list"] as const,
    detail: (id: string) => ["services", "detail", id] as const,
  },
  complaints: {
    all: ["complaints"] as const,
    list: (query: ListComplaintsQuery) =>
      ["complaints", "list", query] as const,
    detail: (id: string) => ["complaints", "detail", id] as const,
    updates: (id: string) => ["complaints", "updates", id] as const,
  },
  serviceRequests: {
    all: ["service-requests"] as const,
    list: (query: ListServiceRequestsQuery) =>
      ["service-requests", "list", query] as const,
    detail: (id: string) => ["service-requests", "detail", id] as const,
  },
  payments: {
    all: ["payments"] as const,
    list: (query: ListPaymentsQuery) => ["payments", "list", query] as const,
    detail: (id: string) => ["payments", "detail", id] as const,
  },
  reviews: {
    byComplaint: (complaintId: string) =>
      ["reviews", "complaint", complaintId] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    list: (query: ListNotificationsQuery) =>
      ["notifications", "list", query] as const,
  },
  dashboard: {
    admin: ["dashboard", "admin"] as const,
    agent: ["dashboard", "agent"] as const,
    citizen: ["dashboard", "citizen"] as const,
  },
} as const;