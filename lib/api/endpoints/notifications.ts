import { request, requestWithMeta } from "../client";
import type {
  ListNotificationsQuery,
  Notification,
  NotificationsListResult,
} from "../types";

export const notificationsApi = {
  async list(
    token: string,
    query: ListNotificationsQuery,
  ): Promise<NotificationsListResult> {
    const { data, meta } = await requestWithMeta<Notification[]>(
      "/notifications",
      {
        token,
        query: {
          page: query.page,
          limit: query.limit,
          isRead:
            query.isRead === undefined ? undefined : String(query.isRead),
        },
      },
    );
    return {
      notifications: data,
      total: meta?.total ?? data.length,
      unreadCount: meta?.unreadCount ?? 0,
    };
  },

  markRead(token: string, id: string): Promise<Notification> {
    return request<Notification>(`/notifications/${id}/read`, {
      method: "PATCH",
      token,
    });
  },

  markAllRead(token: string): Promise<{ updated: number }> {
    return request<{ updated: number }>("/notifications/read-all", {
      method: "PATCH",
      token,
    });
  },
};