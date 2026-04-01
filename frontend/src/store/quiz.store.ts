import { create } from "zustand";

interface QuizState {
  currentQuiz: any | null;
  isLoading: boolean;
  error: string | null;
  generateQuiz: (topic: string) => Promise<void>;
  submitQuiz: (quizId: string, answers: string[]) => Promise<void>;
}

export const useQuizStore = create<QuizState>((set) => ({
  currentQuiz: null,
  isLoading: false,
  error: null,
  
  generateQuiz: async (topic: string) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ topic }),
      });
      if (!res.ok) throw new Error("Failed to generate quiz");
      const data = await res.json();
      set({ currentQuiz: data.data.quiz, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  submitQuiz: async (quizId: string, answers: string[]) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ quizId, answers }),
      });
      if (!res.ok) throw new Error("Failed to submit quiz");
      const data = await res.json();
      set({ currentQuiz: data.data.result, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  }
}));
