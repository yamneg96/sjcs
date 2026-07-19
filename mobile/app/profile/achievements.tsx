import React from "react";
import { View, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { ScreenHeader } from "@/components/ui/screen-header";
import { LoadingState } from "@/components/ui/states";
import { useAnalytics, useFlashcardStats } from "@/hooks/use-progress";
import { useStudyHistory } from "@/hooks/use-records";
import {
  TrophyIcon,
  FlameIcon,
  BrainIcon,
  LayersIcon,
  TargetIcon,
  StarIcon,
  LockIcon,
} from "lucide-react-native";

/**
 * Achievements (progress&profile/achievements).
 *
 * Every badge is derived from REAL activity (quiz history, flashcards, AI
 * sessions) rather than a hardcoded list — an achievement the student didn't
 * actually earn is worse than none at all.
 */

interface Badge {
  icon: typeof TrophyIcon;
  title: string;
  description: string;
  earned: boolean;
  progress?: string;
}

export default function Achievements() {
  const { data: analytics, isLoading } = useAnalytics();
  const { data: cards } = useFlashcardStats();
  const { data: history } = useStudyHistory(1, 1);

  if (isLoading) {
    return (
      <View className="flex-1 bg-background">
        <ScreenHeader title="Achievements" />
        <LoadingState />
      </View>
    );
  }

  const topics = analytics ?? [];
  const quizzes = topics.reduce((n, t) => n + t.quizzesTaken, 0);
  const strong = topics.filter((t) => t.status === "strong").length;
  const best = topics.reduce((m, t) => Math.max(m, t.averageScore), 0);
  const sessions = history?.data?.pagination?.total ?? 0;
  const cardCount = cards?.cards ?? 0;

  const badges: Badge[] = [
    {
      icon: FlameIcon,
      title: "First steps",
      description: "Take your first quiz",
      earned: quizzes >= 1,
      progress: quizzes >= 1 ? undefined : "0 of 1 quiz",
    },
    {
      icon: TargetIcon,
      title: "Sharpshooter",
      description: "Score 80% or higher on a topic",
      earned: best >= 80,
      progress: best >= 80 ? undefined : `Best so far: ${best}%`,
    },
    {
      icon: BrainIcon,
      title: "Curious mind",
      description: "Ask the AI tutor 10 questions",
      earned: sessions >= 10,
      progress: sessions >= 10 ? undefined : `${sessions} of 10`,
    },
    {
      icon: LayersIcon,
      title: "Card collector",
      description: "Build a deck of 20 flashcards",
      earned: cardCount >= 20,
      progress: cardCount >= 20 ? undefined : `${cardCount} of 20`,
    },
    {
      icon: StarIcon,
      title: "Well rounded",
      description: "Reach 'strong' in 3 topics",
      earned: strong >= 3,
      progress: strong >= 3 ? undefined : `${strong} of 3`,
    },
    {
      icon: TrophyIcon,
      title: "Dedicated",
      description: "Take 25 quizzes",
      earned: quizzes >= 25,
      progress: quizzes >= 25 ? undefined : `${quizzes} of 25`,
    },
  ];

  const earned = badges.filter((b) => b.earned).length;

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Achievements" subtitle={`${earned} of ${badges.length} unlocked`} />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {badges.map((b) => (
          <View
            key={b.title}
            className={`flex-row items-center gap-3 rounded-2xl p-4 mb-3 border ${
              b.earned ? "bg-primary/5 border-primary/20" : "bg-card border-border/40"
            }`}
          >
            <View className={`p-3 rounded-2xl ${b.earned ? "bg-primary/15" : "bg-muted"}`}>
              {b.earned ? (
                <b.icon className="text-primary size-6" />
              ) : (
                <LockIcon className="text-muted-foreground size-6" />
              )}
            </View>
            <View className="flex-1">
              <Text className={`text-sm font-bold ${b.earned ? "text-foreground" : "text-muted-foreground"}`}>
                {b.title}
              </Text>
              <Text className="text-[11px] text-muted-foreground">{b.description}</Text>
              {b.progress ? (
                <Text className="text-[10px] text-muted-foreground mt-1 font-semibold">{b.progress}</Text>
              ) : null}
            </View>
            {b.earned ? (
              <View className="bg-primary px-2 py-1 rounded-full">
                <Text className="text-[9px] font-bold text-primary-foreground uppercase">Earned</Text>
              </View>
            ) : null}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
