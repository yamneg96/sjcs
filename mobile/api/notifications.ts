import { api } from "./axios";
import { ApiResponse } from "../types/api.types";

export interface AppNotification {
  _id: string;
  kind: "results_published" | "appeal_update" | "admission_update" | "announcement";
  title: string;
  body: string;
  link?: string;
  readAt?: string;
  createdAt: string;
}

export async function fetchNotifications(unreadOnly = false) {
  const response = await api.get<ApiResponse<{ notifications: AppNotification[]; unreadCount: number }>>(
    `/notifications${unreadOnly ? "?unread=true" : ""}`
  );
  return response.data;
}

export async function markNotificationRead(id: string) {
  const response = await api.put<ApiResponse<null>>(`/notifications/${id}/read`);
  return response.data;
}

export async function markAllNotificationsRead() {
  const response = await api.put<ApiResponse<{ marked: number }>>("/notifications/read-all");
  return response.data;
}
