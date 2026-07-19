import React, { useState } from "react";
import { View, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { ScreenHeader } from "@/components/ui/screen-header";
import { ConfirmSheet } from "@/components/ui/sheet";
import { EmptyState } from "@/components/ui/states";
import { useQuizStore } from "@/store/quiz.store";
import { useSubmitQuiz } from "@/hooks/use-exams";
import { recordLearningEvent } from "@/modules/ai/telemetry";
import { ClipboardListIcon, CheckIcon } from "lucide-react-native";

/**
 * Quiz taking (quiz/quiz_taking). One question at a time with a progress bar;
 * answers are held in the store so back/next never loses them.
 */
export default function QuizTaking() {
  const { quiz, answers, answer, finish, reset } = useQuizStore();
  const submit = useSubmitQuiz();

  const [index, setIndex] = useState(0);
  const [confirmQuit, setConfirmQuit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!quiz) {
    return (
      <View className="flex-1 bg-background">
        <ScreenHeader title="Quiz" />
        <EmptyState
          icon={ClipboardListIcon}
          title="No quiz in progress"
          body="Start a new quiz to practise a topic."
          actionLabel="New quiz"
          onAction={() => router.replace("/quiz/setup" as never)}
        />
      </View>
    );
  }

  const question = quiz.questions[index];
  const total = quiz.questions.length;
  const selected = answers[index];
  const answeredCount = Object.keys(answers).length;
  const isLast = index === total - 1;

  const handleSubmit = () => {
    setError(null);
    // Answers must line up positionally with questions.
    const ordered = quiz.questions.map((_, i) => answers[i] ?? "");
    submit.mutate(
      { quizId: quiz._id, answers: ordered },
      {
        onSuccess: (res) => {
          if (res.success && res.data) {
            finish(res.data);
            void recordLearningEvent({
              kind: "quiz_result",
              topic: quiz.topic,
              payload: { score: res.data.score, total: res.data.total },
            });
            router.replace("/quiz/results" as never);
          }
        },
        onError: (err: any) => setError(err?.message || "Couldn't submit your answers."),
      }
    );
  };

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader
        title={quiz.topic}
        subtitle={`Question ${index + 1} of ${total}`}
        onBack={() => setConfirmQuit(true)}
      />

      {/* Progress */}
      <View className="h-1 bg-muted">
        <View className="h-full bg-primary" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1 }}>
        <Text className="text-base font-bold text-foreground mb-5 leading-6">
          {question.question}
        </Text>

        <View className="gap-2.5">
          {question.options.map((opt) => {
            const active = selected === opt;
            return (
              <Pressable
                key={opt}
                onPress={() => answer(index, opt)}
                className={`flex-row items-center gap-3 p-4 rounded-2xl border ${
                  active ? "bg-primary/10 border-primary" : "bg-card border-border/40"
                }`}
              >
                <View
                  className={`size-5 rounded-full items-center justify-center border ${
                    active ? "bg-primary border-primary" : "border-muted-foreground/40"
                  }`}
                >
                  {active ? <CheckIcon size={12} color="#fff" /> : null}
                </View>
                <Text className={`text-sm flex-1 ${active ? "font-semibold text-foreground" : "text-foreground"}`}>
                  {opt}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {error ? (
          <View className="bg-destructive/10 p-3 rounded-xl mt-4">
            <Text className="text-xs text-destructive">{error}</Text>
          </View>
        ) : null}
      </ScrollView>

      {/* Nav */}
      <View className="p-4 border-t border-border/40 bg-card flex-row gap-2">
        <Button
          variant="outline"
          className="h-12 rounded-xl px-5"
          onPress={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
        >
          <Text className="text-sm font-semibold">Back</Text>
        </Button>

        {isLast ? (
          <Button
            className="flex-1 h-12 rounded-xl bg-primary"
            onPress={handleSubmit}
            disabled={submit.isPending || answeredCount === 0}
          >
            {submit.isPending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-primary-foreground font-semibold text-sm">
                Submit ({answeredCount}/{total})
              </Text>
            )}
          </Button>
        ) : (
          <Button
            className="flex-1 h-12 rounded-xl bg-primary"
            onPress={() => setIndex((i) => Math.min(total - 1, i + 1))}
          >
            <Text className="text-primary-foreground font-semibold text-sm">Next</Text>
          </Button>
        )}
      </View>

      <ConfirmSheet
        visible={confirmQuit}
        onClose={() => setConfirmQuit(false)}
        title="Leave this quiz?"
        body="Your answers so far won't be saved."
        confirmLabel="Leave"
        destructive
        onConfirm={() => {
          reset();
          router.back();
        }}
      />
    </View>
  );
}
