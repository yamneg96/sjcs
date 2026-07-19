import React from "react";
import { View, ScrollView, ActivityIndicator, RefreshControl, Pressable } from "react-native";
import { router } from "expo-router";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useNotifications } from "@/hooks/use-notifications";
import type { AppNotification } from "@/api/notifications";
import {
  ArrowLeftIcon,
  BellIcon,
  AwardIcon,
  MessageSquareIcon,
  FileTextIcon,
  MegaphoneIcon,
} from "lucide-react-native";

/** Icon per notification kind — results releases are the headline event (§33). */
function KindIcon({ kind }: { kind: AppNotification["kind"] }) {
  const map = {
    results_published: AwardIcon,
    appeal_update: MessageSquareIcon,
    admission_update: FileTextIcon,
    announcement: MegaphoneIcon,
  } as const;
  const Icon = map[kind] ?? BellIcon;
  return <Icon className="text-primary size-5" />;
}

function timeAgo(iso: string): string {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(iso).toLocaleDateString();
}

export default function NotificationsScreen() {
  const { notifications, unreadCount, isLoading, error, refresh, markRead, markAllRead } =
    useNotifications();

  const open = async (n: AppNotification) => {
    if (!n.readAt) await markRead(n._id);
    if (n.link) router.push(n.link as never);
  };

  return (
    <View className="flex-1 bg-background">
      <View className="pt-14 pb-4 px-4 bg-card border-b border-border/40 flex-row items-center gap-3">
        <Button variant="ghost" size="icon" onPress={() => router.back()}>
          <ArrowLeftIcon className="text-foreground size-5" />
        </Button>
        <View className="flex-1">
          <Text className="text-lg font-bold text-foreground">Notifications</Text>
          {unreadCount > 0 && (
            <Text className="text-[11px] text-muted-foreground">{unreadCount} unread</Text>
          )}
        </View>
        {unreadCount > 0 && (
          <Button variant="ghost" className="px-2" onPress={markAllRead}>
            <Text className="text-[11px] font-semibold text-primary">Mark all read</Text>
          </Button>
        )}
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} />}
      >
        {isLoading ? (
          <View className="items-center py-12">
            <ActivityIndicator />
          </View>
        ) : error ? (
          <View className="bg-destructive/10 p-4 rounded-2xl">
            <Text className="text-sm text-destructive">{error}</Text>
          </View>
        ) : notifications.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <BellIcon size={56} className="text-muted-foreground/60 mb-3" />
            <Text className="text-center text-sm text-muted-foreground px-10">
              Nothing yet. You&apos;ll be notified the moment your results are published.
            </Text>
          </View>
        ) : (
          notifications.map((n) => {
            const unread = !n.readAt;
            return (
              <Pressable
                key={n._id}
                onPress={() => open(n)}
                className={`flex-row gap-3 p-4 rounded-2xl mb-3 border ${
                  unread ? "bg-primary/5 border-primary/20" : "bg-card border-border/40"
                }`}
              >
                <View className={`p-2.5 rounded-xl h-fit ${unread ? "bg-primary/10" : "bg-muted"}`}>
                  <KindIcon kind={n.kind} />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text className={`text-sm flex-1 ${unread ? "font-bold" : "font-semibold"} text-foreground`}>
                      {n.title}
                    </Text>
                    {unread && <View className="size-2 rounded-full bg-primary" />}
                  </View>
                  <Text className="text-xs text-muted-foreground mt-0.5">{n.body}</Text>
                  <Text className="text-[10px] text-muted-foreground mt-1.5">
                    {timeAgo(n.createdAt)}
                  </Text>
                </View>
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
