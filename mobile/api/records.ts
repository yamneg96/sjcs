import { api } from "./axios";
import { ApiResponse, IStudyLog } from "../types/api.types";

export interface AskLISResponse {
  answer: string;
  subject: string;
  accessibleGrades: number[];
}

export async function askLIS(question: string, subject: string) {
  const response = await api.post<ApiResponse<AskLISResponse>>("/lis/ask", {
    question,
    subject,
  });
  return response.data;
}

export async function getHistory(page = 1, limit = 20) {
  const response = await api.get<ApiResponse<{
    logs: IStudyLog[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }>>(`/lis/history?page=${page}&limit=${limit}`);
  return response.data;
}

export async function startStudySession(subject: string) {
  const response = await api.post<ApiResponse<{
    sessionId: string;
    subject: string;
    startedAt: string;
  }>>("/lis/session/start", { subject });
  return response.data;
}

export async function endStudySession(sessionId: string, duration: number) {
  const response = await api.post<ApiResponse<{
    sessionId: string;
    duration: number;
    endedAt: string;
    message: string;
  }>>("/lis/session/end", { sessionId, duration });
  return response.data;
}
