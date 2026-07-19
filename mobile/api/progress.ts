import { api } from "./axios";
import { ApiResponse, IMaterial } from "../types/api.types";

/** Per-topic mastery derived from quiz history. */
export interface ITopicAnalytics {
  topic: string;
  averageScore: number;
  quizzesTaken: number;
  status: "critical" | "weak" | "average" | "strong";
}

export interface IRecommendation {
  topic: string;
  level: string;
  suggestion: string;
  materials: IMaterial[];
}

export async function fetchAnalytics() {
  const response = await api.get<ApiResponse<ITopicAnalytics[]>>("/analytics");
  return response.data;
}

export async function fetchRecommendations() {
  const response = await api.get<ApiResponse<IRecommendation[]>>("/recommendations");
  return response.data;
}
