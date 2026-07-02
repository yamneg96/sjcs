import { create } from "zustand";
import type { AuthUser } from "@/types/api.types";

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;

  // Verification flow state (LIS student activation)
  verifiedStudent: {
    studentId: string;
    isActivated: boolean;
    fullName: string;
    grade: number;
  } | null;

  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
  setVerifiedStudent: (student: AuthState["verifiedStudent"]) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("sjcs_token"),
  user: JSON.parse(localStorage.getItem("sjcs_user") || "null"),
  isAuthenticated: !!localStorage.getItem("sjcs_token"),
  verifiedStudent: null,

  setAuth: (token, user) => {
    localStorage.setItem("sjcs_token", token);
    localStorage.setItem("sjcs_user", JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("sjcs_token");
    localStorage.removeItem("sjcs_user");
    set({ token: null, user: null, isAuthenticated: false, verifiedStudent: null });
  },

  setVerifiedStudent: (student) => set({ verifiedStudent: student }),
}));
