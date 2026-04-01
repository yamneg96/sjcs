import { create } from "zustand";

export interface Recommendation {
  topic: string;
  level: string;
  suggestion: string;
  materials: any[];
}

interface RecommendationsState {
  recommendations: Recommendation[];
  isLoading: boolean;
  error: string | null;
  fetchRecommendations: () => Promise<void>;
}

export const useRecommendationsStore = create<RecommendationsState>((set) => ({
  recommendations: [],
  isLoading: false,
  error: null,
  
  fetchRecommendations: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/recommendations", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch recommendations");
      const data = await res.json();
      set({ recommendations: data.data.recommendations, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  }
}));
