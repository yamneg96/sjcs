import React, { useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { Text } from "@/components/ui/text";
import { ScreenHeader } from "@/components/ui/screen-header";
import { ConfirmSheet } from "@/components/ui/sheet";
import { useAuthStore } from "@/store/auth.store";
import { useLogout } from "@/hooks/use-auth";
import { useAnalytics, useFlashcardStats } from "@/hooks/use-progress";
import {
  TrophyIcon,
  TrendingUpIcon,
  LightbulbIcon,
  SettingsIcon,
  InfoIcon,
  UserPenIcon,
  LogOutIcon,
  ChevronRightIcon,
  CpuIcon,
} from "lucide-react-native";

/**
 * Student profile (progress&profile/student_profile) — the hub for everything
 * personal: progress, achievements, insights, settings.
 */

function Row({
  icon: Icon,
  label,
  hint,
  onPress,
  danger,
}: {
  icon: typeof TrophyIcon;
  label: string;
  hint?: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 bg-card border border-border/40 rounded-2xl p-4 mb-2"
    >
      <View className={`p-2.5 rounded-xl ${danger ? "bg-destructive/10" : "bg-primary/10"}`}>
        <Icon className={danger ? "text-destructive size-4" : "text-primary size-4"} />
      </View>
      <View className="flex-1">
        <Text className={`text-sm font-semibold ${danger ? "text-destructive" : "text-foreground"}`}>
          {label}
        </Text>
        {hint ? <Text className="text-[11px] text-muted-foreground">{hint}</Text> : null}
      </View>
      {!danger ? <ChevronRightIcon className="text-muted-foreground size-4" /> : null}
    </Pressable>
  );
}

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logoutMutation = useLogout();
  const [confirmLogout, setConfirmLogout] = useState(false);

  const { data: analytics } = useAnalytics();
  const { data: cards } = useFlashcardStats();

  const avg = analytics?.length
    ? Math.round(analytics.reduce((n, t) => n + t.averageScore, 0) / analytics.length)
    : 0;
  const initials = (user?.fullName || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Profile" />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {/* Identity */}
        <View className="items-center mb-6">
          <View className="size-20 rounded-full bg-primary items-center justify-center mb-3">
            <Text className="text-2xl font-bold text-primary-foreground">{initials}</Text>
          </View>
          <Text className="text-lg font-bold text-foreground">{user?.fullName}</Text>
          <Text className="text-xs text-muted-foreground">
            {user?.studentId ? `${user.studentId} · ` : ""}
            {user?.grade ? `Grade ${user.grade}` : ""}
          </Text>
        </View>

        {/* At a glance */}
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-card border border-border/40 p-4 rounded-2xl items-center">
            <Text className="text-xl font-bold text-foreground">{avg}%</Text>
            <Text className="text-[10px] text-muted-foreground">Average</Text>
          </View>
          <View className="flex-1 bg-card border border-border/40 p-4 rounded-2xl items-center">
            <Text className="text-xl font-bold text-foreground">{cards?.cards ?? 0}</Text>
            <Text className="text-[10px] text-muted-foreground">Flashcards</Text>
          </View>
          <View className="flex-1 bg-card border border-border/40 p-4 rounded-2xl items-center">
            <Text className="text-xl font-bold text-foreground">{analytics?.length ?? 0}</Text>
            <Text className="text-[10px] text-muted-foreground">Topics</Text>
          </View>
        </View>

        <Row icon={TrendingUpIcon} label="Progress" hint="Mastery by topic" onPress={() => router.push("/progress" as never)} />
        <Row icon={TrophyIcon} label="Achievements" hint="What you've unlocked" onPress={() => router.push("/profile/achievements" as never)} />
        <Row icon={LightbulbIcon} label="Learning insights" hint="Where to focus next" onPress={() => router.push("/profile/insights" as never)} />
        <Row icon={CpuIcon} label="AI models" hint="Download for offline study" onPress={() => router.push("/models" as never)} />
        <Row icon={UserPenIcon} label="Edit profile" onPress={() => router.push("/profile/edit" as never)} />
        <Row icon={SettingsIcon} label="Settings" onPress={() => router.push("/profile/settings" as never)} />
        <Row icon={InfoIcon} label="About Lumora" onPress={() => router.push("/profile/about" as never)} />

        <View className="mt-4">
          <Row icon={LogOutIcon} label="Sign out" onPress={() => setConfirmLogout(true)} danger />
        </View>
      </ScrollView>

      <ConfirmSheet
        visible={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        title="Sign out?"
        body="Your downloaded models and flashcards stay on this device."
        confirmLabel="Sign out"
        destructive
        onConfirm={() => logoutMutation.mutate()}
      />
    </View>
  );
}
