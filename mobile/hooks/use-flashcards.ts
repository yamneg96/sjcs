import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listDecks,
  createDeck,
  deleteDeck,
  getDueCards,
  reviewCard,
} from "@/modules/flashcards/flashcards.service";
import type { ReviewGrade } from "@/modules/flashcards/srs";

/**
 * Deck library state — all local (SQLite), so it works offline. Uses
 * TanStack Query (the app's standard async-data tool) rather than a manual
 * useState+useEffect fetch.
 */
export function useDecks() {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["flashcard-decks"],
    queryFn: listDecks,
  });

  return {
    decks: query.data ?? [],
    isLoading: query.isLoading,
    refresh: async () => {
      await query.refetch();
    },
    create: async (title: string, subject?: string) => {
      const deck = await createDeck(title, subject);
      await qc.invalidateQueries({ queryKey: ["flashcard-decks"] });
      return deck;
    },
    remove: async (deckId: string) => {
      await deleteDeck(deckId);
      await qc.invalidateQueries({ queryKey: ["flashcard-decks"] });
    },
  };
}

/** A review session over the cards currently due in a deck. */
export function useReviewSession(deckId?: string) {
  const dueQuery = useQuery({
    queryKey: ["due-cards", deckId],
    queryFn: () => getDueCards(deckId as string),
    enabled: !!deckId,
  });

  const [index, setIndex] = useState(0);
  const [stats, setStats] = useState({ again: 0, hard: 0, good: 0, easy: 0 });

  /**
   * Resets session progress whenever a fresh queue arrives (new deck, or a
   * restart) — adjusted during render (React's documented pattern for
   * resetting state when a dependency changes), so no effect is involved.
   */
  const [seenData, setSeenData] = useState(dueQuery.data);
  if (dueQuery.data !== seenData) {
    setSeenData(dueQuery.data);
    setIndex(0);
    setStats({ again: 0, hard: 0, good: 0, easy: 0 });
  }

  const queue = dueQuery.data ?? [];
  const current = queue[index];
  const finished = !dueQuery.isLoading && index >= queue.length;

  const grade = async (g: ReviewGrade) => {
    if (!current) return;
    await reviewCard(current, g);
    setStats((s) => ({ ...s, [g]: s[g] + 1 }));
    setIndex((i) => i + 1);
  };

  return {
    current,
    grade,
    finished,
    isLoading: dueQuery.isLoading,
    stats,
    total: queue.length,
    position: Math.min(index + 1, queue.length),
    restart: async () => {
      await dueQuery.refetch();
    },
  };
}
