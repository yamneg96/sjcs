import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { router } from "expo-router";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { ScreenHeader } from "@/components/ui/screen-header";
import { EmptyState, ThinkingState } from "@/components/ui/states";
import { BottomSheet } from "@/components/ui/sheet";
import { useQuizStore } from "@/store/quiz.store";
import { AIEngine } from "@/modules/ai/engine/ai.engine";
import { ClipboardListIcon, CheckCircle2Icon, XCircleIcon, SparklesIcon } from "lucide-react-native";

/**
 * Quiz review (quiz/quiz_review). Every item is scored and explainable — per
 * §41 results are "scored + explained per item", so the explanation is on
 * demand via AIEngine rather than a canned string.
 */
export default function QuizReview() {
  const { quiz, result, reset } = useQuizStore();
  const [explaining, setExplaining] = useState<number | null>(null);
  const [explanation, setExplanation] = useState<{ q: string; text: string } | null>(null);

  if (!quiz || !result) {
    return (
      <View className="flex-1 bg-background">
        <ScreenHeader title="Review" />
        <EmptyState
          icon={ClipboardListIcon}
          title="Nothing to review"
          body="Take a quiz first, then come back to go through the answers."
          actionLabel="New quiz"
          onAction={() => router.replace("/quiz/setup" as never)}
        />
      </View>
    );
  }

  const explain = async (index: number, q: (typeof result.questions)[number]) => {
    setExplaining(index);
    try {
      const res = await AIEngine.complete(
        `Question: ${q.question}\nCorrect answer: ${q.answer}\nMy answer: ${q.userAnswer || "(blank)"}\n\nExplain why the correct answer is right, and where my thinking went wrong.`,
        { eduContext: { subject: quiz.topic } }
      );
      setExplanation({ q: q.question, text: res.text });
    } finally {
      setExplaining(null);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader
        title="Review"
        subtitle={`${result.score}/${result.total} correct`}
        onBack={() => router.replace("/quiz/results" as never)}
      />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {result.questions.map((q, i) => {
          const correct = q.userAnswer === q.answer;
          return (
            <View key={i} className="bg-card border border-border/40 rounded-2xl p-4 mb-3">
              <View className="flex-row items-start gap-2 mb-3">
                {correct ? (
                  <CheckCircle2Icon className="text-chart-3 size-5" />
                ) : (
                  <XCircleIcon className="text-destructive size-5" />
                )}
                <Text className="text-sm font-semibold text-foreground flex-1">{q.question}</Text>
              </View>

              {!correct ? (
                <View className="bg-destructive/10 rounded-xl p-3 mb-2">
                  <Text className="text-[10px] font-bold uppercase text-destructive mb-0.5">
                    Your answer
                  </Text>
                  <Text className="text-sm text-foreground">{q.userAnswer || "(left blank)"}</Text>
                </View>
              ) : null}

              <View className="bg-chart-3/10 rounded-xl p-3">
                <Text className="text-[10px] font-bold uppercase text-chart-3 mb-0.5">
                  Correct answer
                </Text>
                <Text className="text-sm text-foreground">{q.answer}</Text>
              </View>

              {explaining === i ? (
                <ThinkingState label="Explaining…" />
              ) : (
                <Button
                  variant="ghost"
                  className="h-9 mt-2 flex-row items-center gap-1.5 self-start px-1"
                  onPress={() => explain(i, q)}
                >
                  <SparklesIcon className="text-primary size-3.5" />
                  <Text className="text-[11px] font-semibold text-primary">Explain this</Text>
                </Button>
              )}
            </View>
          );
        })}

        <Button
          className="h-12 rounded-xl bg-primary mt-2"
          onPress={() => {
            reset();
            router.replace("/(tabs)" as never);
          }}
        >
          <Text className="text-primary-foreground font-semibold text-sm">Done</Text>
        </Button>
      </ScrollView>

      <BottomSheet
        visible={!!explanation}
        onClose={() => setExplanation(null)}
        title="Explanation"
        subtitle={explanation?.q}
      >
        <Text className="text-sm text-foreground leading-6">{explanation?.text}</Text>
      </BottomSheet>
    </View>
  );
}
