import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IUser } from "../types/api.types";

interface AuthState {
  token: string | null;
  user: IUser | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: IUser) => void;
  logout: () => void;
  colorScheme: "light" | "dark" | "system";
  setColorScheme: (scheme: "light" | "dark" | "system") => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
      colorScheme: "system",
      setColorScheme: (colorScheme) => set({ colorScheme }),
    }),
    {
      name: "lumora-auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
