import React from "react";
import { View, ScrollView, RefreshControl, Pressable } from "react-native";
import { router } from "expo-router";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { ScreenHeader } from "@/components/ui/screen-header";
import { LoadingState, EmptyState, ErrorState } from "@/components/ui/states";
import { useRecommendations, useAnalytics } from "@/hooks/use-progress";
import { LightbulbIcon, FileTextIcon, ClipboardListIcon, TrendingUpIcon } from "lucide-react-native";

/**
 * Learning insights (progress&profile/learning_insights) — the recommendation
 * engine's output: weak topics and what to do about them (§27).
 */
export default function LearningInsights() {
  const { data: recs, isLoading, isError, refetch } = useRecommendations();
  const { data: analytics } = useAnalytics();

  const strong = (analytics ?? []).filter((t) => t.status === "strong");

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Insights" subtitle="Where to focus next" />

      <ScrollView
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      >
        {isLoading ? (
          <LoadingState label="Analysing your history…" />
        ) : isError ? (
          <ErrorState body="Couldn't load your insights." onRetry={refetch} />
        ) : !recs?.length ? (
          <EmptyState
            icon={LightbulbIcon}
            title="Nothing to flag yet"
            body="Once you've taken a few quizzes, we'll point you at the topics worth your time."
            actionLabel="Take a quiz"
            onAction={() => router.push("/quiz/setup" as never)}
          />
        ) : (
          <>
            <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Focus areas
            </Text>

            {recs.map((r) => (
              <View key={r.topic} className="bg-card border border-border/40 rounded-2xl p-4 mb-3">
                <View className="flex-row items-center gap-2 mb-1">
                  <LightbulbIcon className="text-primary size-4" />
                  <Text className="text-sm font-bold text-foreground flex-1">{r.topic}</Text>
                  <Text
                    className={`text-[10px] font-bold uppercase ${
                      r.level === "critical" ? "text-destructive" : "text-secondary"
                    }`}
                  >
                    {r.level}
                  </Text>
                </View>
                <Text className="text-xs text-muted-foreground mb-3">{r.suggestion}</Text>

                {r.materials?.slice(0, 3).map((m) => (
                  <Pressable
                    key={m._id}
                    onPress={() => router.push(`/learn/lesson/${m._id}` as never)}
                    className="flex-row items-center gap-2 bg-muted/40 rounded-xl p-2.5 mb-1.5"
                  >
                    <FileTextIcon className="text-secondary size-3.5" />
                    <Text className="text-[11px] text-foreground flex-1" numberOfLines={1}>
                      {m.title}
                    </Text>
                  </Pressable>
                ))}

                <Button
                  variant="outline"
                  className="h-9 rounded-xl mt-2 flex-row items-center justify-center gap-1.5"
                  onPress={() => router.push(`/quiz/setup?topic=${encodeURIComponent(r.topic)}` as never)}
                >
                  <ClipboardListIcon className="text-foreground size-3.5" />
                  <Text className="text-[11px] font-semibold">Practise this</Text>
                </Button>
              </View>
            ))}

            {strong.length > 0 ? (
              <>
                <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-4 mb-3">
                  Strengths
                </Text>
                <View className="bg-chart-3/10 rounded-2xl p-4">
                  <View className="flex-row items-center gap-2 mb-1">
                    <TrendingUpIcon className="text-chart-3 size-4" />
                    <Text className="text-sm font-bold text-foreground">
                      Strong in {strong.length} topic{strong.length === 1 ? "" : "s"}
                    </Text>
                  </View>
                  <Text className="text-xs text-muted-foreground">
                    {strong.map((t) => t.topic).join(", ")}
                  </Text>
                </View>
              </>
            ) : null}
          </>
        )}
      </ScrollView>
    </View>
  );
}
