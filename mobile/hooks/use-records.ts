import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { askLIS, getHistory, startStudySession, endStudySession } from "../api/records";

export function useAskLIS() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { question: string; subject: string }) => {
      return askLIS(payload.question, payload.subject);
    },
    onSuccess: () => {
      // Invalidate study history to force reload
      queryClient.invalidateQueries({ queryKey: ["study-history"] });
    },
  });
}

export function useStudyHistory(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["study-history", page, limit],
    queryFn: () => getHistory(page, limit),
  });
}

export function useStartStudySession() {
  return useMutation({
    mutationFn: startStudySession,
  });
}

export function useEndStudySession() {
  return useMutation({
    mutationFn: (payload: { sessionId: string; duration: number }) => {
      return endStudySession(payload.sessionId, payload.duration);
    },
  });
}
