import { api } from "./axios";
import { ApiResponse } from "../types/api.types";

export interface ISubject {
  _id: string;
  name: string;
  slug: string;
  grade: number;
  description?: string;
}

export async function fetchSubjects(grade?: number) {
  const response = await api.get<ApiResponse<ISubject[]>>(
    `/subjects${grade ? `?grade=${grade}` : ""}`
  );
  return response.data;
}
