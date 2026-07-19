import React, { useState } from "react";
import { View, ScrollView, TextInput, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { ScreenHeader } from "@/components/ui/screen-header";
import { useGenerateQuiz } from "@/hooks/use-exams";
import { useQuizStore } from "@/store/quiz.store";
import { useSubjects } from "@/hooks/use-subjects";
import { useAuthStore } from "@/store/auth.store";
import { SparklesIcon, ClipboardListIcon } from "lucide-react-native";

/**
 * Quiz setup (quiz/quiz_setup + quiz_generator). Sources per §41: a topic you
 * type, a subject, or a lesson you came from (topic passed via params).
 */
export default function QuizSetup() {
  const params = useLocalSearchParams<{ subject?: string; topic?: string }>();
  const user = useAuthStore((s) => s.user);
  const { data: subjects } = useSubjects(user?.grade);

  const [topic, setTopic] = useState(params.topic ?? "");
  const [subject, setSubject] = useState(params.subject ?? "");
  const [error, setError] = useState<string | null>(null);

  const generate = useGenerateQuiz();
  const startQuiz = useQuizStore((s) => s.start);

  const handleStart = () => {
    const prompt = [subject, topic].filter(Boolean).join(" — ");
    if (!prompt.trim()) {
      setError("Pick a subject or type a topic to practise.");
      return;
    }
    setError(null);

    generate.mutate(prompt, {
      onSuccess: (res) => {
        if (res.success && res.data?.questions?.length) {
          startQuiz(res.data);
          router.replace("/quiz/taking" as never);
        } else {
          setError("Couldn't build a quiz for that. Try a more specific topic.");
        }
      },
      onError: (err: any) => setError(err?.message || "Couldn't generate the quiz."),
    });
  };

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="New quiz" subtitle="Practice what you choose" />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
          Subject
        </Text>
        <View className="flex-row flex-wrap gap-2 mb-5">
          {(subjects ?? []).map((s) => (
            <Button
              key={s._id}
              variant={subject === s.name ? "default" : "outline"}
              className="h-9 rounded-xl px-3"
              onPress={() => setSubject(subject === s.name ? "" : s.name)}
            >
              <Text className="text-xs font-semibold">{s.name}</Text>
            </Button>
          ))}
          {!subjects?.length ? (
            <Text className="text-xs text-muted-foreground">
              No subjects published yet — type a topic below instead.
            </Text>
          ) : null}
        </View>

        <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
          Topic
        </Text>
        <TextInput
          placeholder="e.g. Photosynthesis, Kinematic equations…"
          value={topic}
          onChangeText={setTopic}
          placeholderTextColor="#888"
          className="bg-card border border-border/40 rounded-xl px-4 py-3 text-sm text-foreground mb-2"
        />
        <Text className="text-[11px] text-muted-foreground mb-6">
          Questions adapt to your grade. Leave the topic blank to be quizzed across the subject.
        </Text>

        {error ? (
          <View className="bg-destructive/10 p-3 rounded-xl mb-4">
            <Text className="text-xs text-destructive">{error}</Text>
          </View>
        ) : null}

        <Button
          className="h-12 rounded-xl bg-primary flex-row items-center justify-center gap-2"
          onPress={handleStart}
          disabled={generate.isPending}
        >
          {generate.isPending ? (
            <>
              <ActivityIndicator size="small" color="#fff" />
              <Text className="text-primary-foreground font-semibold text-sm">Building your quiz…</Text>
            </>
          ) : (
            <>
              <SparklesIcon size={16} color="#fff" />
              <Text className="text-primary-foreground font-semibold text-sm">Generate quiz</Text>
            </>
          )}
        </Button>

        <View className="flex-row items-center gap-2 mt-6 px-1">
          <ClipboardListIcon size={12} className="text-muted-foreground" />
          <Text className="text-[11px] text-muted-foreground flex-1">
            With an on-device model installed, quizzes generate offline too.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
