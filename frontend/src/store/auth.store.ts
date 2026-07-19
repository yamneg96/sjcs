import { create } from "zustand";
import type { AuthUser } from "@/types/api.types";

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;

  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // 1. Fetch the raw item
  const storedUser = localStorage.getItem("sjcs_user");
  
  // 2. Safely parse only if it exists and is not the string "undefined"
  const parsedUser = storedUser && storedUser !== "undefined" 
    ? JSON.parse(storedUser) 
    : null;

  return {
    token: localStorage.getItem("sjcs_token"),
    user: parsedUser,
    isAuthenticated: !!localStorage.getItem("sjcs_token"),

    setAuth: (token, user) => {
      localStorage.setItem("sjcs_token", token);
      localStorage.setItem("sjcs_user", JSON.stringify(user));
      set({ token, user, isAuthenticated: true });
    },

    logout: () => {
      localStorage.removeItem("sjcs_token");
      localStorage.removeItem("sjcs_user");
      set({ token: null, user: null, isAuthenticated: false });
    },
  };
});

