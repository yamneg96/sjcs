import React, { useState } from "react";
import { View, ScrollView, ActivityIndicator, TextInput, Alert, RefreshControl } from "react-native";
import { router } from "expo-router";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useDecks } from "@/hooks/use-flashcards";
import {
  ArrowLeftIcon,
  LayersIcon,
  PlusIcon,
  SparklesIcon,
} from "lucide-react-native";

/**
 * Flashcard library (§42). Decks and their SM-2 schedules live in on-device
 * SQLite, so this screen — and reviewing — work with no connection at all.
 */
export default function FlashcardLibrary() {
  const { decks, isLoading, refresh, create, remove } = useDecks();
  const [showNew, setShowNew] = useState(false);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");

  const handleCreate = async () => {
    if (!title.trim()) return;
    const deck = await create(title.trim(), subject.trim() || undefined);
    setTitle("");
    setSubject("");
    setShowNew(false);
    router.push(`/flashcards/${deck.id}` as never);
  };

  const confirmDelete = (id: string, name: string) =>
    Alert.alert("Delete deck?", `"${name}" and all its cards will be removed.`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => void remove(id) },
    ]);

  const totalDue = decks.reduce((n, d) => n + (d.dueCount ?? 0), 0);

  return (
    <View className="flex-1 bg-background">
      <View className="pt-14 pb-4 px-4 bg-card border-b border-border/40 flex-row items-center gap-3">
        <Button variant="ghost" size="icon" onPress={() => router.back()}>
          <ArrowLeftIcon className="text-foreground size-5" />
        </Button>
        <View className="flex-1">
          <Text className="text-lg font-bold text-foreground">Flashcards</Text>
          <Text className="text-[11px] text-muted-foreground">
            {totalDue > 0 ? `${totalDue} card${totalDue === 1 ? "" : "s"} due now` : "Works offline"}
          </Text>
        </View>
        <Button variant="ghost" size="icon" onPress={() => setShowNew((v) => !v)}>
          <PlusIcon className="text-primary size-5" />
        </Button>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} />}
      >
        {showNew && (
          <View className="bg-card border border-border/40 rounded-2xl p-4 mb-4">
            <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              New deck
            </Text>
            <TextInput
              placeholder="Deck title (e.g. Biology Ch.4)"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#888"
              className="bg-muted/40 rounded-xl px-3 py-3 text-sm text-foreground mb-2"
            />
            <TextInput
              placeholder="Subject (optional)"
              value={subject}
              onChangeText={setSubject}
              placeholderTextColor="#888"
              className="bg-muted/40 rounded-xl px-3 py-3 text-sm text-foreground mb-3"
            />
            <Button
              className="h-11 rounded-xl bg-primary"
              onPress={handleCreate}
              disabled={!title.trim()}
            >
              <Text className="text-primary-foreground font-semibold text-sm">Create deck</Text>
            </Button>
          </View>
        )}

        {isLoading ? (
          <View className="items-center py-12">
            <ActivityIndicator />
          </View>
        ) : decks.length === 0 ? (
          <View className="flex-1 items-center justify-center py-16">
            <LayersIcon size={56} className="text-muted-foreground/60 mb-3" />
            <Text className="text-center text-sm text-muted-foreground px-10 mb-4">
              No decks yet. Create one, then let AI turn your notes or a lesson into cards.
            </Text>
            <Button className="h-11 rounded-xl bg-primary px-6" onPress={() => setShowNew(true)}>
              <Text className="text-primary-foreground font-semibold text-sm">Create your first deck</Text>
            </Button>
          </View>
        ) : (
          decks.map((deck) => {
            const due = deck.dueCount ?? 0;
            return (
              <Button
                key={deck.id}
                variant="outline"
                className="h-auto py-4 px-4 rounded-2xl border-border/60 mb-3 justify-between items-center"
                onPress={() => router.push(`/flashcards/${deck.id}` as never)}
                onLongPress={() => confirmDelete(deck.id, deck.title)}
              >
                <View className="flex-row items-center gap-3 flex-1">
                  <View className={`p-2.5 rounded-xl ${due > 0 ? "bg-primary/10" : "bg-muted"}`}>
                    <LayersIcon className={due > 0 ? "text-primary size-5" : "text-muted-foreground size-5"} />
                  </View>
                  <View className="items-start flex-1">
                    <Text className="text-sm font-bold text-foreground">{deck.title}</Text>
                    <Text className="text-[11px] text-muted-foreground">
                      {deck.cardCount ?? 0} card{(deck.cardCount ?? 0) === 1 ? "" : "s"}
                      {deck.subject ? ` · ${deck.subject}` : ""}
                    </Text>
                  </View>
                </View>
                {due > 0 ? (
                  <View className="bg-primary px-2.5 py-1 rounded-full">
                    <Text className="text-[10px] font-bold text-primary-foreground">{due} due</Text>
                  </View>
                ) : (
                  <Text className="text-[10px] text-muted-foreground">Up to date</Text>
                )}
              </Button>
            );
          })
        )}

        {decks.length > 0 && (
          <View className="flex-row items-center gap-2 mt-2 px-1">
            <SparklesIcon size={12} className="text-muted-foreground" />
            <Text className="text-[11px] text-muted-foreground flex-1">
              Open a deck to generate cards with AI. Long-press a deck to delete it.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
