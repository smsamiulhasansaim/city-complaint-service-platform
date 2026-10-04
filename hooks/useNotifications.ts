"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useApiAuth } from "./useApiAuth";
import { queryKeys } from "@/lib/api/queryKeys";
import type {
  ListNotificationsQuery,
  Notification,
} from "@/lib/api/types";

interface NotificationsResult {
  items: Notification[];
  total: number;
  unreadCount: number;
}

export function useNotifications(query: ListNotificationsQuery = {}) {
  const { call } = useApiAuth();
  return useQuery({
    queryKey: queryKeys.notifications.list(query),
    queryFn: async () => {
      const items = await call<Notification[]>("/notifications", {
        query: {
          page: query.page,
          limit: query.limit,
          isRead:
            query.isRead === undefined ? undefined : String(query.isRead),
        },
      });
      const unreadCount = items.filter((n) => !n.isRead).length;
      return { items, total: items.length, unreadCount } satisfies NotificationsResult;
    },
  });
}

/** Lightweight unread count query for the navbar badge. */
export function useUnreadCount() {
  const { call } = useApiAuth();
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      const items = await call<Notification[]>("/notifications", {
        query: { isRead: "false", limit: 100 },
      });
      return items.length;
    },
    staleTime: 30_000,
  });
}

export function useMarkNotificationRead() {
  const { call } = useApiAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      call<Notification>(`/notifications/${id}/read`, { method: "PATCH" }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.notifications.all });
      void qc.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const { call } = useApiAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      call<{ updated: number }>("/notifications/read-all", { method: "PATCH" }),
    onSuccess: (result) => {
      void qc.invalidateQueries({ queryKey: queryKeys.notifications.all });
      void qc.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
      toast.success(`Marked ${result.updated} as read`);
    },
  });
}