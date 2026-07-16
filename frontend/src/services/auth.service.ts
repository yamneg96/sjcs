import api from "./axios";
import type { ApiResponse, LoginResponse } from "@/types/api.types";

export const authService = {
  login: (email: string, password: string) =>
    api.post<ApiResponse<LoginResponse>>("/auth/login", { email, password }),

  studentLogin: (fullName: string, grade: number, password: string) =>
    api.post<ApiResponse<LoginResponse>>("/auth/login", { fullName, grade, password }),

  forgotPassword: (email: string) =>
    api.post<ApiResponse<null>>("/auth/forgot-password", { email }),

  resetPassword: (token: string, password: string) =>
    api.post<ApiResponse<null>>("/auth/reset-password", { token, password }),
};
