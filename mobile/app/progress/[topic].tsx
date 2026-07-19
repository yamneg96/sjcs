import React from "react";
import { View, ScrollView, Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { ScreenHeader } from "@/components/ui/screen-header";
import { LoadingState, EmptyState } from "@/components/ui/states";
import { useAnalytics, useRecommendations } from "@/hooks/use-progress";
import { TrendingUpIcon, FileTextIcon, ClipboardListIcon } from "lucide-react-native";

/**
 * Subject analytics (progress&profile/subject_analytics_physics) — one topic's
 * mastery plus the materials the recommendation engine suggests for it.
 */
export default function TopicAnalytics() {
  const { topic } = useLocalSearchParams<{ topic: string }>();
  const decoded = decodeURIComponent(topic ?? "");

  const { data: analytics, isLoading } = useAnalytics();
  const { data: recommendations } = useRecommendations();

  const stat = analytics?.find((t) => t.topic === decoded);
  const rec = recommendations?.find((r) => r.topic === decoded);

  if (isLoading) {
    return (
      <View className="flex-1 bg-background">
        <ScreenHeader title={decoded} />
        <LoadingState />
      </View>
    );
  }

  if (!stat) {
    return (
      <View className="flex-1 bg-background">
        <ScreenHeader title={decoded} />
        <EmptyState
          icon={TrendingUpIcon}
          title="No data for this topic"
          body="Take a quiz on it and your mastery will show up here."
          actionLabel="Quiz me"
          onAction={() => router.push(`/quiz/setup?topic=${encodeURIComponent(decoded)}` as never)}
        />
      </View>
    );
  }

  const isWeak = stat.status === "weak" || stat.status === "critical";

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title={decoded} subtitle={`${stat.quizzesTaken} quiz${stat.quizzesTaken === 1 ? "" : "zes"} taken`} />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="bg-card border border-border/40 rounded-3xl p-8 items-center mb-4">
          <Text className={`text-5xl font-bold ${isWeak ? "text-destructive" : "text-chart-3"}`}>
            {stat.averageScore}%
          </Text>
          <Text className="text-sm text-muted-foreground mt-1">average score</Text>
        </View>

        {/* What to do about it — recommendation engine output */}
        {rec ? (
          <View className={`rounded-2xl p-4 mb-4 ${isWeak ? "bg-destructive/10" : "bg-secondary/10"}`}>
            <Text className="text-sm font-bold text-foreground mb-1">What to do next</Text>
            <Text className="text-xs text-muted-foreground">{rec.suggestion}</Text>
          </View>
        ) : null}

        {rec?.materials?.length ? (
          <>
            <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Recommended material
            </Text>
            {rec.materials.map((m) => (
              <Pressable
                key={m._id}
                onPress={() => router.push(`/learn/lesson/${m._id}` as never)}
                className="flex-row items-center gap-3 bg-card border border-border/40 rounded-2xl p-4 mb-2"
              >
                <View className="bg-secondary/15 p-2.5 rounded-xl">
                  <FileTextIcon className="text-secondary size-4" />
                </View>
                <Text className="text-sm text-foreground flex-1" numberOfLines={2}>
                  {m.title}
                </Text>
              </Pressable>
            ))}
          </>
        ) : null}

        <Button
          className="h-12 rounded-xl bg-primary mt-4 flex-row items-center justify-center gap-2"
          onPress={() => router.push(`/quiz/setup?topic=${encodeURIComponent(decoded)}` as never)}
        >
          <ClipboardListIcon size={16} color="#fff" />
          <Text className="text-primary-foreground font-semibold text-sm">Practise this topic</Text>
        </Button>
      </ScrollView>
    </View>
  );
}
