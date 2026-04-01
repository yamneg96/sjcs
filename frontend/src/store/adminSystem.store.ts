import { create } from "zustand";

export interface SystemSettings {
  schoolName: string;
  maintenanceMode: boolean;
  aiQueryLimit: number;
  allowPublicRegistrations: boolean;
  semesterTerm: "Fall" | "Spring" | "Summer";
}

interface AdminSystemState {
  settings: SystemSettings;
  isLoading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<SystemSettings>) => Promise<void>;
}

const DEFAULT_SETTINGS: SystemSettings = {
  schoolName: "Saint Joseph Catholic School",
  maintenanceMode: false,
  aiQueryLimit: 100,
  allowPublicRegistrations: false,
  semesterTerm: "Fall",
};

export const useAdminSystemStore = create<AdminSystemState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  isLoading: false,
  error: null,

  fetchSettings: async () => {
    set({ isLoading: true, error: null });
    await new Promise((resolve) => setTimeout(resolve, 400));
    // Usually fetched from an API
    set({ isLoading: false });
  },

  updateSettings: async (newSettings) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 800));
    set({ settings: { ...get().settings, ...newSettings }, isLoading: false });
  }
}));
