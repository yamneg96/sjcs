import { create } from "zustand";
import api from "@/lib/api";

interface Student {
  id: string;
  fullName: string;
  grade: number;
  studentId: string;
}

interface AuthState {
  token: string | null;
  student: Student | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Verification flow state
  verifiedStudent: {
    studentId: string;
    isActivated: boolean;
    fullName: string;
    grade: number;
  } | null;

  verifyStudent: (fullName: string, grade: number) => Promise<boolean>;
  setupPassword: (studentId: string, password: string) => Promise<boolean>;
  login: (fullName: string, grade: number, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  setVerifiedStudent: (student: AuthState["verifiedStudent"]) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("sjcs_token"),
  student: JSON.parse(localStorage.getItem("sjcs_student") || "null"),
  isAuthenticated: !!localStorage.getItem("sjcs_token"),
  isLoading: false,
  error: null,
  verifiedStudent: null,

  verifyStudent: async (fullName, grade) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post("/auth/verify-student", {
        fullName,
        grade,
      });
      set({
        verifiedStudent: data.data,
        isLoading: false,
      });
      return true;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      set({
        error: error.response?.data?.message || "Verification failed",
        isLoading: false,
      });
      return false;
    }
  },

  setupPassword: async (studentId, password) => {
    set({ isLoading: true, error: null });
    try {
      await api.post("/auth/setup-password", { studentId, password });
      set({ isLoading: false });
      return true;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      set({
        error: error.response?.data?.message || "Setup failed",
        isLoading: false,
      });
      return false;
    }
  },

  login: async (fullName, grade, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post("/auth/login", {
        fullName,
        grade,
        password,
      });
      const { token, student } = data.data;
      localStorage.setItem("sjcs_token", token);
      localStorage.setItem("sjcs_student", JSON.stringify(student));
      set({
        token,
        student,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      set({
        error: error.response?.data?.message || "Login failed",
        isLoading: false,
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("sjcs_token");
    localStorage.removeItem("sjcs_student");
    set({
      token: null,
      student: null,
      isAuthenticated: false,
      verifiedStudent: null,
    });
  },

  clearError: () => set({ error: null }),
  setVerifiedStudent: (student) => set({ verifiedStudent: student }),
}));
