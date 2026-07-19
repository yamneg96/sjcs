import { useColorScheme } from "nativewind";
import { useAuthStore } from "@/store/auth.store";

export type ThemePreference = "light" | "dark" | "system";

/**
 * Single source of truth for the app theme.
 *
 * Two systems have to agree: NativeWind's `colorScheme` (which drives the
 * `.dark` CSS variables in global.css and thus every `bg-*`/`text-*` class),
 * and the persisted preference in the auth store (which survives restarts —
 * NativeWind's own scheme resets to the device default on cold start). This
 * hook writes both so they never drift.
 */
export function useTheme() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const persisted = useAuthStore((s) => s.colorScheme);
  const persist = useAuthStore((s) => s.setColorScheme);

  const setTheme = (pref: ThemePreference) => {
    setColorScheme(pref); // updates the live UI
    persist(pref); // remembers it for next launch
  };

  /** Flip between light and dark (used by the floating toggle). */
  const toggle = () => setTheme(colorScheme === "dark" ? "light" : "dark");

  return {
    /** The resolved scheme actually rendering ("light" | "dark"). */
    colorScheme: colorScheme ?? "light",
    /** The saved preference, which may be "system". */
    preference: persisted,
    isDark: colorScheme === "dark",
    setTheme,
    toggle,
  };
}
