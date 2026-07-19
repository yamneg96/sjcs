import { Redirect } from "expo-router";
import * as React from "react";
import { useAuthStore } from "@/store/auth.store";

/**
 * Entry point (auth/splash_screen). First-run users get welcome + onboarding;
 * returning users go straight in. The root layout's guard still has the final
 * say on unauthenticated access.
 */
export default function Screen() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  // Cast: expo-router regenerates its typed-route manifest from the file tree
  // when the dev server runs, so newly added routes aren't in the types yet.
  const target = (isAuthenticated ? "/(tabs)" : "/(auth)/welcome") as never;
  return <Redirect href={target} />;
}
