import type { LinearGradientProps } from "expo-linear-gradient";

/**
 * The "Leadership Gradient" (DESIGN.md §2) — Scholastic Red → Academic Blue.
 *
 * React Native has no CSS `linear-gradient`, so this can't live in global.css
 * as a utility class the way the web app does. Instead it's a shared constant
 * consumed by `expo-linear-gradient` through <GradientButton> / <GradientView>.
 * The two stops are the same tokens the palette already defines
 * (--primary #af101a, --secondary #005faf), kept in sync by hand.
 */
// Tuple type (not string[]) so expo-linear-gradient's `colors` overload —
// which requires at least two ColorValues — accepts it directly.
export const LEADERSHIP_GRADIENT: readonly [string, string] = ["#af101a", "#005faf"];

/** 135deg diagonal, matching the web `.leadership-gradient`. */
export const GRADIENT_DIRECTION: Pick<LinearGradientProps, "start" | "end"> = {
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
};
