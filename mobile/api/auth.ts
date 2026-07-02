import { api } from "./axios";
import { ApiResponse, IUser } from "../types/api.types";

export interface StudentLoginPayload {
  orgSlug: string;
  fullName: string;
  grade: number;
  password?: string;
}

export async function loginStudent(payload: StudentLoginPayload) {
  const response = await api.post<ApiResponse<{ token: string; user: IUser }>>(
    "/auth/login",
    payload
  );
  return response.data;
}

export async function verifyStudentFirstTime(payload: {
  orgSlug: string;
  fullName: string;
  grade: number;
}) {
  const response = await api.post<ApiResponse<{ userId: string; isActivated: boolean }>>(
    "/auth/verify-student",
    payload
  );
  return response.data;
}

export async function setupPasswordFirstTime(payload: {
  userId: string;
  password?: string;
}) {
  const response = await api.post<ApiResponse<void>>(
    "/auth/setup-password",
    payload
  );
  return response.data;
}
