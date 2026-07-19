import api from "./axios";
import type { ApiResponse } from "@/types/api.types";

/** One student's scores for a single assessment. */
export interface IMarkResult {
  _id: string;
  assessmentId: string;
  subjectId: string;
  term: string;
  grade: number;
  items: { name: string; score: number }[];
  total: number;
  maxTotal: number;
}

/**
 * Server-enforced time-lock (§33): this endpoint returns results ONLY once a
 * covering publishing is PUBLISHED and its releaseAt has passed. Before that
 * it responds 403 — the marks are never serialized. The UI must therefore
 * treat "403" as the normal "not published yet" state, not an error.
 */
export interface IStudentResults {
  releasedAt: string;
  results: IMarkResult[];
}

export interface IAppeal {
  _id: string;
  markId: string;
  status: "OPEN" | "UPHELD" | "EXPLAINED" | "WITHDRAWN";
  reason: string;
  createdAt: string;
}

export const resultsService = {
  getStudentResults: (studentId: string, academicYearId: string, term: string) =>
    api.get<ApiResponse<IStudentResults>>(`/results/students/${studentId}/results`, {
      params: { academicYearId, term },
    }),

  /** File an appeal on a specific mark (parent/student only). */
  createAppeal: (markId: string, reason: string) =>
    api.post<ApiResponse<IAppeal>>("/results/appeals", { markId, reason }),
};
