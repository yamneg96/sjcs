import React, { useState } from "react";
import { View, ScrollView, Linking, Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { ScreenHeader } from "@/components/ui/screen-header";
import { LoadingState, ErrorState, ThinkingState } from "@/components/ui/states";
import { BottomSheet } from "@/components/ui/sheet";
import { useMaterialDetails } from "@/hooks/use-materials";
import { AIEngine } from "@/modules/ai/engine/ai.engine";
import { createDeck } from "@/modules/flashcards/flashcards.service";
import { generateIntoDeck } from "@/modules/flashcards/generate";
import type { AIRoute } from "@/modules/ai/types";
import { recordLearningEvent } from "@/modules/ai/telemetry";
import {
  SparklesIcon,
  LayersIcon,
  BrainIcon,
  ExternalLinkIcon,
  SmartphoneIcon,
  CloudIcon,
  ClipboardListIcon,
} from "lucide-react-native";

/**
 * Lesson reader (learn/chapter_*, unit_*). Cached content renders offline, and
 * every inline action (§40: Summarize, Explain, Make flashcards, Make quiz)
 * goes through AIEngine — so each works on-device when a model is installed.
 *
 * This screen also covers the ai_lesson_summary / ai_deep_dive designs: they're
 * outputs of this reader, not separate destinations.
 */

type Action = "summary" | "explain";

export default function LessonReader() {
  const { materialId } = useLocalSearchParams<{ materialId: string }>();
  const { data, isLoading, isError, refetch } = useMaterialDetails(materialId);
  const material = data?.data;

  const [busy, setBusy] = useState<Action | "flashcards" | null>(null);
  const [output, setOutput] = useState<{ title: string; text: string; route: AIRoute } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // The reader has the lesson text for markdown material; links/PDFs open out.
  const body = material?.description || "";

  const runAI = async (action: Action) => {
    if (!material) return;
    setBusy(action);
    setError(null);
    try {
      const source = `${material.title}\n\n${body}`.slice(0, 6000);
      const eduContext = { subject: material.subject, grade: material.gradeLevel };

      const result =
        action === "summary"
          ? await AIEngine.summarize(source, { eduContext })
          : await AIEngine.complete(
              `Explain this lesson in depth for a Grade ${material.gradeLevel} student, step by step:\n\n${source}`,
              { eduContext }
            );

      setOutput({
        title: action === "summary" ? "Study notes" : "Deep dive",
        text: result.text,
        route: result.route,
      });
      void recordLearningEvent({ kind: "lesson_read", subject: material.subject, topic: material.title });
    } catch (err: any) {
      setError(err?.message || "Couldn't generate that right now.");
    } finally {
      setBusy(null);
    }
  };

  const makeFlashcards = async () => {
    if (!material) return;
    setBusy("flashcards");
    setError(null);
    try {
      const deck = await createDeck(material.title, material.subject);
      const { added } = await generateIntoDeck(deck.id, `${material.title}\n\n${body}`, {
        subject: material.subject,
        grade: material.gradeLevel,
      });
      router.push(`/flashcards/${deck.id}` as never);
      void added;
    } catch (err: any) {
      setError(err?.message || "Couldn't create flashcards from this lesson.");
    } finally {
      setBusy(null);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-background">
        <ScreenHeader title="Lesson" />
        <LoadingState label="Opening lesson…" />
      </View>
    );
  }

  if (isError || !material) {
    return (
      <View className="flex-1 bg-background">
        <ScreenHeader title="Lesson" />
        <ErrorState body="Couldn't open this lesson." onRetry={refetch} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title={material.title} subtitle={`${material.subject} · Grade ${material.gradeLevel}`} />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {/* Lesson body — cached text renders with no network */}
        {body ? (
          <View className="bg-card border border-border/40 rounded-2xl p-4 mb-4">
            <Text className="text-sm text-foreground leading-6">{body}</Text>
          </View>
        ) : null}

        {/* Non-text material opens in its viewer */}
        {material.url ? (
          <Button
            variant="outline"
            className="h-12 rounded-xl mb-4 flex-row items-center justify-center gap-2"
            onPress={() => Linking.openURL(material.url)}
          >
            <ExternalLinkIcon className="text-foreground size-4" />
            <Text className="text-sm font-semibold">Open {material.fileType.toUpperCase()}</Text>
          </Button>
        ) : null}

        {/* Inline AI actions (§40) */}
        <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
          Study with AI
        </Text>
        <View className="gap-2 mb-4">
          <Button
            variant="outline"
            className="h-12 rounded-xl flex-row items-center justify-between px-4"
            onPress={() => runAI("summary")}
            disabled={!!busy}
          >
            <View className="flex-row items-center gap-2">
              <SparklesIcon className="text-primary size-4" />
              <Text className="text-sm font-semibold">Summarize into study notes</Text>
            </View>
          </Button>

          <Button
            variant="outline"
            className="h-12 rounded-xl flex-row items-center justify-between px-4"
            onPress={() => runAI("explain")}
            disabled={!!busy}
          >
            <View className="flex-row items-center gap-2">
              <BrainIcon className="text-primary size-4" />
              <Text className="text-sm font-semibold">Explain in depth</Text>
            </View>
          </Button>

          <Button
            variant="outline"
            className="h-12 rounded-xl flex-row items-center justify-between px-4"
            onPress={makeFlashcards}
            disabled={!!busy}
          >
            <View className="flex-row items-center gap-2">
              <LayersIcon className="text-primary size-4" />
              <Text className="text-sm font-semibold">Make flashcards</Text>
            </View>
          </Button>

          <Button
            variant="outline"
            className="h-12 rounded-xl flex-row items-center justify-between px-4"
            onPress={() =>
              router.push(
                `/quiz/setup?subject=${encodeURIComponent(material.subject)}&topic=${encodeURIComponent(material.title)}` as never
              )
            }
            disabled={!!busy}
          >
            <View className="flex-row items-center gap-2">
              <ClipboardListIcon className="text-primary size-4" />
              <Text className="text-sm font-semibold">Quiz me on this</Text>
            </View>
          </Button>
        </View>

        {busy ? <ThinkingState label={busy === "flashcards" ? "Building your deck…" : "Working on it…"} /> : null}
        {error ? (
          <View className="bg-destructive/10 p-4 rounded-2xl">
            <Text className="text-sm text-destructive">{error}</Text>
          </View>
        ) : null}
      </ScrollView>

      {/* AI output — the ai_lesson_summary / ai_deep_dive surfaces */}
      <BottomSheet
        visible={!!output}
        onClose={() => setOutput(null)}
        title={output?.title ?? ""}
        subtitle={material.title}
      >
        <Text className="text-sm text-foreground leading-6">{output?.text}</Text>
        {output && output.route !== "fallback" ? (
          <View className="flex-row items-center gap-1 mt-4">
            {output.route === "local" ? (
              <SmartphoneIcon size={11} className="text-muted-foreground" />
            ) : (
              <CloudIcon size={11} className="text-muted-foreground" />
            )}
            <Text className="text-[10px] text-muted-foreground">
              {output.route === "local" ? "Generated on-device" : "Generated via cloud"}
            </Text>
          </View>
        ) : null}
        <Pressable onPress={() => setOutput(null)} className="mt-5">
          <View className="bg-primary h-11 rounded-xl items-center justify-center">
            <Text className="text-primary-foreground font-semibold text-sm">Done</Text>
          </View>
        </Pressable>
      </BottomSheet>
    </View>
  );
}
