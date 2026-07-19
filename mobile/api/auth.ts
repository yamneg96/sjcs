import { api } from "./axios";
import { ApiResponse, IUser } from "../types/api.types";

/** School-student login (§13.2 student branch): org slug + name + grade + password. */
export interface StudentLoginPayload {
  orgSlug: string;
  fullName: string;
  grade: number;
  password: string;
}

/** Email login (§13.2 email branch) — individual learners, and any staff/parent
 * account that authenticates against the same endpoint. */
export interface EmailLoginPayload {
  email: string;
  password: string;
}

export type LoginPayload = StudentLoginPayload | EmailLoginPayload;

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: IUser;
}

/** The single login entry point — matches the backend's loginSchema union exactly. */
export async function login(payload: LoginPayload) {
  const response = await api.post<ApiResponse<LoginResponse>>("/auth/login", payload);
  return response.data;
}

/** @deprecated use `login()` — kept only as a typed alias for the student shape. */
export const loginStudent = login;

export async function logoutRequest(refreshToken: string) {
  const response = await api.post<ApiResponse<null>>("/auth/logout", { refreshToken });
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
  password: string;
}) {
  const response = await api.post<ApiResponse<void>>(
    "/auth/setup-password",
    payload
  );
  return response.data;
}

export interface RegisterIndividualPayload {
  fullName: string;
  email: string;
  password: string;
  grade: number;
}

/**
 * Self-signup for INDIVIDUAL learners (students not enrolled at a subscribed
 * school). School students never use this — they activate against their
 * school record via verify-student → setup-password.
 */
export async function registerIndividual(payload: RegisterIndividualPayload) {
  const response = await api.post<ApiResponse<{ id: string; email: string }>>(
    "/auth/register",
    payload
  );
  return response.data;
}
