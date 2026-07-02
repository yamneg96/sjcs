import { useMutation } from "@tanstack/react-query";
import { generateQuiz, submitQuiz } from "../api/exams";

export function useGenerateQuiz() {
  return useMutation({
    mutationFn: generateQuiz,
  });
}

export function useSubmitQuiz() {
  return useMutation({
    mutationFn: submitQuiz,
  });
}
