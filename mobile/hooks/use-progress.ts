import { useQuery } from "@tanstack/react-query";
import { fetchAnalytics, fetchRecommendations } from "@/api/progress";
import { listDecks } from "@/modules/flashcards/flashcards.service";

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: () => fetchAnalytics().then((r) => r.data),
  });
}

export function useRecommendations() {
  return useQuery({
    queryKey: ["recommendations"],
    queryFn: () => fetchRecommendations().then((r) => r.data),
  });
}

/** Local flashcard totals — offline data, so no network round-trip. */
export function useFlashcardStats() {
  return useQuery({
    queryKey: ["flashcard-stats"],
    queryFn: async () => {
      const decks = await listDecks();
      return {
        decks: decks.length,
        cards: decks.reduce((n, d) => n + (d.cardCount ?? 0), 0),
        due: decks.reduce((n, d) => n + (d.dueCount ?? 0), 0),
      };
    },
  });
}
