import { create } from "zustand";
import type { IQuiz } from "@/types/api.types";

/**
 * Quiz session state, shared across the setup → taking → results → review
 * screens. Held in a store rather than passed through route params because a
 * quiz is a multi-screen flow over one object, and re-fetching between steps
 * would lose the student's in-progress answers.
 */
interface QuizState {
  quiz: IQuiz | null;
  answers: Record<number, string>;
  result: { score: number; total: number; questions: IQuiz["questions"] } | null;

  start: (quiz: IQuiz) => void;
  answer: (index: number, value: string) => void;
  finish: (result: QuizState["result"]) => void;
  reset: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  quiz: null,
  answers: {},
  result: null,

  start: (quiz) => set({ quiz, answers: {}, result: null }),
  answer: (index, value) => set((s) => ({ answers: { ...s.answers, [index]: value } })),
  finish: (result) => set({ result }),
  reset: () => set({ quiz: null, answers: {}, result: null }),
}));
