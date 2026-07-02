import { api } from "./axios";
import { ApiResponse, IQuiz } from "../types/api.types";

export async function generateQuiz(topic: string) {
  const response = await api.post<ApiResponse<IQuiz>>("/quizzes/generate", { topic });
  return response.data;
}

export async function submitQuiz(payload: { quizId: string; answers: string[] }) {
  const response = await api.post<ApiResponse<{ score: number; total: number; questions: any[] }>>(
    "/quizzes/submit",
    payload
  );
  return response.data;
}
