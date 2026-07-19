import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  type AppNotification,
} from "@/api/notifications";
import { registerDevice } from "@/api/ai";
import { getDeviceProfile } from "@/modules/ai/engine/capability.service";

interface InboxData {
  notifications: AppNotification[];
  unreadCount: number;
}

/** Uses TanStack Query (the app's standard async-data tool) for the inbox. */
export function useNotifications() {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: () => fetchNotifications().then((r) => r.data),
  });

  const setInbox = (updater: (prev: InboxData) => InboxData) => {
    qc.setQueryData<InboxData>(["notifications"], (prev) => (prev ? updater(prev) : prev));
  };

  return {
    notifications: query.data?.notifications ?? [],
    unreadCount: query.data?.unreadCount ?? 0,
    isLoading: query.isLoading,
    error: query.isError ? "Couldn't load notifications." : null,
    refresh: async () => {
      await query.refetch();
    },
    markRead: async (id: string) => {
      // Optimistic: the inbox should feel instant.
      setInbox((prev) => ({
        notifications: prev.notifications.map((x) =>
          x._id === id ? { ...x, readAt: new Date().toISOString() } : x
        ),
        unreadCount: Math.max(0, prev.unreadCount - 1),
      }));
      await markNotificationRead(id).catch(() => query.refetch());
    },
    markAllRead: async () => {
      const now = new Date().toISOString();
      setInbox((prev) => ({
        notifications: prev.notifications.map((x) => ({ ...x, readAt: x.readAt ?? now })),
        unreadCount: 0,
      }));
      await markAllNotificationsRead().catch(() => query.refetch());
    },
  };
}

/**
 * Registers this device's Expo push token with the backend so results releases
 * (§33 fan-out) can reach the student/parent. Safe to call on every launch:
 * device registration is an upsert.
 */
export async function registerForPushNotifications(): Promise<string | null> {
  // Push requires a real device; simulators have no token.
  if (!Device.isDevice) return null;

  try {
    const existing = await Notifications.getPermissionsAsync();
    let status = existing.status;
    if (status !== "granted") {
      status = (await Notifications.requestPermissionsAsync()).status;
    }
    if (status !== "granted") return null;

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;

    const profile = await getDeviceProfile();
    await registerDevice({ ...profile, expoPushToken: token }, []);
    return token;
  } catch (err) {
    // Never block app start on push registration.
    console.warn("[Lumora] Push registration failed:", err);
    return null;
  }
}
