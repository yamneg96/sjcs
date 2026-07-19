import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IUser } from "../types/api.types";

interface AuthState {
  token: string | null;
  /** Rotating refresh token (§13.2) — needed to revoke the session on logout. */
  refreshToken: string | null;
  user: IUser | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: IUser, refreshToken?: string) => void;
  logout: () => void;
  colorScheme: "light" | "dark" | "system";
  setColorScheme: (scheme: "light" | "dark" | "system") => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user, refreshToken) =>
        set({ token, user, refreshToken: refreshToken ?? null, isAuthenticated: true }),
      logout: () => set({ token: null, refreshToken: null, user: null, isAuthenticated: false }),
      colorScheme: "system",
      setColorScheme: (colorScheme) => set({ colorScheme }),
    }),
    {
      name: "lumora-auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
