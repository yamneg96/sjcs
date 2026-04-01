import { create } from "zustand";

export interface AnalyticsRecord {
  topic: string;
  averageScore: number;
  quizzesTaken: number;
  status: "strong" | "average" | "weak" | "critical";
}

interface AnalyticsState {
  analytics: AnalyticsRecord[];
  isLoading: boolean;
  error: string | null;
  fetchAnalytics: () => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  analytics: [],
  isLoading: false,
  error: null,
  
  fetchAnalytics: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/analytics", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch analytics");
      const data = await res.json();
      set({ analytics: data.data.analytics, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  }
}));
