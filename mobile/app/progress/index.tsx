import React from "react";
import { View, ScrollView, RefreshControl, Pressable } from "react-native";
import { router } from "expo-router";
import { Text } from "@/components/ui/text";
import { ScreenHeader } from "@/components/ui/screen-header";
import { LoadingState, EmptyState, ErrorState } from "@/components/ui/states";
import { useAnalytics, useFlashcardStats } from "@/hooks/use-progress";
import { useStudyHistory } from "@/hooks/use-records";
import type { ITopicAnalytics } from "@/api/progress";
import { TrendingUpIcon, LayersIcon, BrainIcon, ChevronRightIcon } from "lucide-react-native";

/**
 * Progress dashboard (progress&profile/progress_dashboard). Mastery per topic
 * comes from real quiz history; flashcard totals come from on-device SQLite.
 */

const STATUS_STYLE: Record<ITopicAnalytics["status"], { bar: string; text: string; label: string }> = {
  critical: { bar: "bg-destructive", text: "text-destructive", label: "Needs work" },
  weak: { bar: "bg-destructive/70", text: "text-destructive", label: "Weak" },
  average: { bar: "bg-secondary", text: "text-secondary", label: "Getting there" },
  strong: { bar: "bg-chart-3", text: "text-chart-3", label: "Strong" },
};

function Stat({ icon: Icon, value, label }: { icon: typeof BrainIcon; value: string | number; label: string }) {
  return (
    <View className="flex-1 bg-card border border-border/40 p-4 rounded-2xl items-center">
      <Icon className="text-primary mb-2 size-5" />
      <Text className="text-xl font-bold text-foreground">{value}</Text>
      <Text className="text-[10px] text-muted-foreground text-center">{label}</Text>
    </View>
  );
}

export default function ProgressDashboard() {
  const { data: analytics, isLoading, isError, refetch } = useAnalytics();
  const { data: cards } = useFlashcardStats();
  const { data: history } = useStudyHistory(1, 1);

  const topics = analytics ?? [];
  const avg = topics.length
    ? Math.round(topics.reduce((n, t) => n + t.averageScore, 0) / topics.length)
    : 0;

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Progress" subtitle="Your learning at a glance" />

      <ScrollView
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      >
        {/* Headline stats */}
        <View className="flex-row gap-3 mb-5">
          <Stat icon={TrendingUpIcon} value={`${avg}%`} label="Average score" />
          <Stat icon={LayersIcon} value={cards?.due ?? 0} label="Cards due" />
          <Stat icon={BrainIcon} value={history?.data?.pagination?.total ?? 0} label="AI sessions" />
        </View>

        <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
          Mastery by topic
        </Text>

        {isLoading ? (
          <LoadingState label="Crunching your history…" />
        ) : isError ? (
          <ErrorState body="Couldn't load your progress." onRetry={refetch} />
        ) : topics.length === 0 ? (
          <EmptyState
            icon={TrendingUpIcon}
            title="No data yet"
            body="Take a quiz and your mastery per topic will appear here."
            actionLabel="Take a quiz"
            onAction={() => router.push("/quiz/setup" as never)}
          />
        ) : (
          topics.map((t) => {
            const style = STATUS_STYLE[t.status];
            return (
              <Pressable
                key={t.topic}
                onPress={() => router.push(`/progress/${encodeURIComponent(t.topic)}` as never)}
                className="bg-card border border-border/40 rounded-2xl p-4 mb-3"
              >
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-sm font-bold text-foreground flex-1" numberOfLines={1}>
                    {t.topic}
                  </Text>
                  <View className="flex-row items-center gap-2">
                    <Text className={`text-[10px] font-bold ${style.text}`}>{style.label}</Text>
                    <ChevronRightIcon className="text-muted-foreground size-4" />
                  </View>
                </View>

                <View className="h-1.5 bg-muted rounded-full overflow-hidden mb-2">
                  <View className={`h-full rounded-full ${style.bar}`} style={{ width: `${t.averageScore}%` }} />
                </View>

                <Text className="text-[11px] text-muted-foreground">
                  {t.averageScore}% average · {t.quizzesTaken} quiz{t.quizzesTaken === 1 ? "" : "zes"}
                </Text>
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
