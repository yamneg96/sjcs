/**
 * Content moderation gate (§16.3 rule 4, §47.2 AI safety). A lightweight,
 * dependency-free heuristic filter that runs on AI inputs and outputs. It is
 * intentionally pluggable: a real moderation provider (e.g. a safety model
 * behind the gateway) can replace `moderateContent` without changing callers.
 *
 * The goal here is a sane default that blocks obviously unsafe requests in an
 * educational product, not an exhaustive classifier.
 */

export interface ModerationResult {
  flagged: boolean;
  category?: string;
}

// Coarse category patterns. Deliberately conservative to avoid false positives
// on legitimate academic content (biology, history, chemistry, etc.).
const PATTERNS: { category: string; re: RegExp }[] = [
  { category: "self-harm", re: /\b(kill myself|suicide method|how to (kill|hurt) (myself|yourself))\b/i },
  { category: "weapons", re: /\b(build|make|construct)\b.{0,20}\b(bomb|explosive|detonator)\b/i },
  { category: "illicit", re: /\b(synthesize|manufacture|cook)\b.{0,20}\b(meth|methamphetamine|heroin|fentanyl)\b/i },
];

export function moderateContent(text: string): ModerationResult {
  const value = text || "";
  for (const { category, re } of PATTERNS) {
    if (re.test(value)) return { flagged: true, category };
  }
  return { flagged: false };
}

/** Student-safe message returned when output moderation flags a response. */
export const MODERATION_FALLBACK =
  "I can't help with that. Let's keep our focus on your studies — ask me about a topic from your lessons and I'll help you learn it.";
