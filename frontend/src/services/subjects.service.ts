import api from "./axios";
import type { ApiResponse, ISubject, CreateSubjectPayload } from "@/types/api.types";

export const subjectsService = {
  list: () =>
    api.get<ApiResponse<ISubject[]>>("/subjects"),

  getById: (idOrSlug: string) =>
    api.get<ApiResponse<ISubject>>(`/subjects/${idOrSlug}`),

  create: (data: CreateSubjectPayload) =>
    api.post<ApiResponse<ISubject>>("/subjects", data),

  update: (subjectId: string, data: Partial<CreateSubjectPayload>) =>
    api.put<ApiResponse<ISubject>>(`/subjects/${subjectId}`, data),

  delete: (subjectId: string) =>
    api.delete<ApiResponse<null>>(`/subjects/${subjectId}`),
};
