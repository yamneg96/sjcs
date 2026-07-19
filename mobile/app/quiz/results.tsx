import React from "react";
import { View, ScrollView } from "react-native";
import { router } from "expo-router";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { ScreenHeader } from "@/components/ui/screen-header";
import { EmptyState } from "@/components/ui/states";
import { useQuizStore } from "@/store/quiz.store";
import { createDeck, addCards } from "@/modules/flashcards/flashcards.service";
import { ClipboardListIcon, LayersIcon, RotateCcwIcon } from "lucide-react-native";

/**
 * Quiz results (quiz/quiz_results). Per §41, wrong answers auto-offer
 * flashcards — the miss is the most valuable thing to turn into revision.
 */
export default function QuizResults() {
  const { quiz, result, reset } = useQuizStore();

  if (!quiz || !result) {
    return (
      <View className="flex-1 bg-background">
        <ScreenHeader title="Results" />
        <EmptyState
          icon={ClipboardListIcon}
          title="No results to show"
          body="Take a quiz to see how you did."
          actionLabel="New quiz"
          onAction={() => router.replace("/quiz/setup" as never)}
        />
      </View>
    );
  }

  const pct = Math.round((result.score / result.total) * 100);
  const wrong = result.questions.filter((q) => q.userAnswer !== q.answer);

  const tone =
    pct >= 80 ? "text-chart-3" : pct >= 50 ? "text-secondary" : "text-destructive";
  const verdict =
    pct >= 80 ? "Strong work" : pct >= 50 ? "Good effort" : "Worth another look";

  /** Turn every miss into a deck — the highest-value revision available. */
  const makeDeckFromMisses = async () => {
    const deck = await createDeck(`${quiz.topic} — misses`, quiz.topic);
    await addCards(
      deck.id,
      wrong.map((q) => ({ front: q.question, back: q.answer }))
    );
    reset();
    router.replace(`/flashcards/${deck.id}` as never);
  };

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Results" subtitle={quiz.topic} onBack={() => { reset(); router.replace("/(tabs)" as never); }} />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Score */}
        <View className="bg-card border border-border/40 rounded-3xl p-8 items-center mb-4">
          <Text className={`text-5xl font-bold ${tone}`}>{pct}%</Text>
          <Text className="text-sm text-muted-foreground mt-1">
            {result.score} of {result.total} correct
          </Text>
          <Text className="text-base font-bold text-foreground mt-3">{verdict}</Text>
        </View>

        {/* Misses → flashcards (§41) */}
        {wrong.length > 0 ? (
          <View className="bg-primary/5 border border-primary/20 rounded-2xl p-4 mb-4">
            <Text className="text-sm font-bold text-foreground mb-1">
              {wrong.length} to review
            </Text>
            <Text className="text-xs text-muted-foreground mb-3">
              Turn what you missed into a flashcard deck and drill it with spaced repetition.
            </Text>
            <Button
              className="h-11 rounded-xl bg-primary flex-row items-center justify-center gap-2"
              onPress={makeDeckFromMisses}
            >
              <LayersIcon size={15} color="#fff" />
              <Text className="text-primary-foreground font-semibold text-sm">
                Make flashcards from misses
              </Text>
            </Button>
          </View>
        ) : null}

        <View className="gap-2">
          <Button
            variant="outline"
            className="h-12 rounded-xl"
            onPress={() => router.replace("/quiz/review" as never)}
          >
            <Text className="text-sm font-semibold">Review answers</Text>
          </Button>
          <Button
            variant="outline"
            className="h-12 rounded-xl flex-row items-center justify-center gap-2"
            onPress={() => {
              reset();
              router.replace("/quiz/setup" as never);
            }}
          >
            <RotateCcwIcon className="text-foreground size-4" />
            <Text className="text-sm font-semibold">Another quiz</Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
