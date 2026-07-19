import React, { useState } from "react";
import { View, ScrollView, ActivityIndicator, TextInput, Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useReviewSession } from "@/hooks/use-flashcards";
import { generateIntoDeck } from "@/modules/flashcards/generate";
import type { ReviewGrade } from "@/modules/flashcards/srs";
import {
  ArrowLeftIcon,
  SparklesIcon,
  CheckCircle2Icon,
  RotateCcwIcon,
} from "lucide-react-native";

/**
 * Flashcard study session (§42). Grading runs the on-device SM-2 scheduler —
 * no network involved — so a student can review on a bus with no signal.
 */

const GRADES: { key: ReviewGrade; label: string; className: string }[] = [
  { key: "again", label: "Again", className: "bg-destructive" },
  { key: "hard", label: "Hard", className: "bg-muted-foreground/70" },
  { key: "good", label: "Good", className: "bg-secondary" },
  { key: "easy", label: "Easy", className: "bg-chart-3" },
];

export default function DeckStudyScreen() {
  const { deckId } = useLocalSearchParams<{ deckId: string }>();
  const session = useReviewSession(deckId);

  const [revealed, setRevealed] = useState(false);
  const [showGen, setShowGen] = useState(false);
  const [source, setSource] = useState("");
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  const handleGrade = async (g: ReviewGrade) => {
    await session.grade(g);
    setRevealed(false);
  };

  const handleGenerate = async () => {
    if (!source.trim() || !deckId) return;
    setGenerating(true);
    setGenError(null);
    try {
      const { added } = await generateIntoDeck(deckId, source.trim());
      setSource("");
      setShowGen(false);
      await session.restart();
      setGenError(null);
      alert(`Added ${added} card${added === 1 ? "" : "s"} to this deck.`);
    } catch (err: any) {
      setGenError(err?.message || "Couldn't generate cards.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <View className="pt-14 pb-4 px-4 bg-card border-b border-border/40 flex-row items-center gap-3">
        <Button variant="ghost" size="icon" onPress={() => router.back()}>
          <ArrowLeftIcon className="text-foreground size-5" />
        </Button>
        <View className="flex-1">
          <Text className="text-lg font-bold text-foreground">Study</Text>
          {session.total > 0 && !session.finished && (
            <Text className="text-[11px] text-muted-foreground">
              Card {session.position} of {session.total}
            </Text>
          )}
        </View>
        <Button variant="ghost" size="icon" onPress={() => setShowGen((v) => !v)}>
          <SparklesIcon className="text-primary size-5" />
        </Button>
      </View>

      {/* AI generation panel */}
      {showGen && (
        <View className="p-4 bg-card border-b border-border/40">
          <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Generate cards with AI
          </Text>
          <TextInput
            placeholder="Paste your notes or a lesson excerpt…"
            value={source}
            onChangeText={setSource}
            multiline
            placeholderTextColor="#888"
            className="bg-muted/40 rounded-xl px-3 py-3 text-sm text-foreground mb-2"
            style={{ minHeight: 90, textAlignVertical: "top" }}
          />
          {genError && <Text className="text-xs text-destructive mb-2">{genError}</Text>}
          <Button
            className="h-11 rounded-xl bg-primary flex-row items-center justify-center gap-2"
            onPress={handleGenerate}
            disabled={generating || !source.trim()}
          >
            {generating ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <SparklesIcon size={15} color="#fff" />
                <Text className="text-primary-foreground font-semibold text-sm">Generate</Text>
              </>
            )}
          </Button>
        </View>
      )}

      <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1, justifyContent: "center" }}>
        {session.isLoading ? (
          <ActivityIndicator />
        ) : session.finished ? (
          // ── Session complete ──
          <View className="items-center">
            <CheckCircle2Icon size={64} className="text-chart-3 mb-3" />
            <Text className="text-xl font-bold text-foreground mb-1">
              {session.total > 0 ? "Session complete" : "Nothing due right now"}
            </Text>
            <Text className="text-sm text-muted-foreground text-center px-8 mb-6">
              {session.total > 0
                ? `You reviewed ${session.total} card${session.total === 1 ? "" : "s"}. They'll come back when they're due.`
                : "Add cards or come back later — spaced repetition schedules them for you."}
            </Text>

            {session.total > 0 && (
              <View className="flex-row gap-3 mb-6">
                {GRADES.map((g) => (
                  <View key={g.key} className="items-center">
                    <Text className="text-lg font-bold text-foreground">{session.stats[g.key]}</Text>
                    <Text className="text-[10px] text-muted-foreground">{g.label}</Text>
                  </View>
                ))}
              </View>
            )}

            <View className="flex-row gap-2">
              <Button
                variant="outline"
                className="h-11 rounded-xl px-5 flex-row items-center gap-2"
                onPress={session.restart}
              >
                <RotateCcwIcon size={14} className="text-foreground" />
                <Text className="text-sm font-semibold">Check again</Text>
              </Button>
              <Button className="h-11 rounded-xl bg-primary px-5" onPress={() => setShowGen(true)}>
                <Text className="text-primary-foreground font-semibold text-sm">Add cards</Text>
              </Button>
            </View>
          </View>
        ) : session.current ? (
          // ── Card ──
          <View>
            <Pressable
              onPress={() => setRevealed((v) => !v)}
              className="bg-card border border-border/40 rounded-3xl p-8 min-h-[220px] justify-center"
            >
              <Text className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3 text-center">
                {revealed ? "Answer" : "Question"}
              </Text>
              <Text className="text-lg text-foreground text-center">
                {revealed ? session.current.back : session.current.front}
              </Text>
              {!revealed && (
                <Text className="text-[11px] text-muted-foreground text-center mt-6">
                  Tap to reveal
                </Text>
              )}
            </Pressable>

            {revealed && (
              <View className="mt-6">
                <Text className="text-[11px] text-muted-foreground text-center mb-3">
                  How well did you know it?
                </Text>
                <View className="flex-row gap-2">
                  {GRADES.map((g) => (
                    <Button
                      key={g.key}
                      className={`flex-1 h-12 rounded-xl ${g.className}`}
                      onPress={() => handleGrade(g.key)}
                    >
                      <Text className="text-white font-semibold text-xs">{g.label}</Text>
                    </Button>
                  ))}
                </View>
              </View>
            )}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
