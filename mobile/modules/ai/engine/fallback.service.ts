import { AITask } from "../types";

/**
 * Fallback service (§21) — when the router can serve neither locally (no
 * READY model / unsupported runtime) nor via cloud (offline), the app gives
 * an HONEST message: what it can't do right now and what still works.
 * Connectivity absence never breaks the app; it just narrows it (§4.4).
 */

const TASK_LABEL: Record<AITask, string> = {
  chat: "answer this question",
  quiz: "generate a quiz",
  summary: "summarize this content",
  flashcards: "create flashcards",
  translation: "translate this",
  classify: "analyze this capture",
  planner: "build your study plan",
  reasoning: "work through this problem",
};

export function offlineFallbackMessage(task: AITask, hasLocalModel: boolean): string {
  const action = TASK_LABEL[task] ?? "help with this";
  if (hasLocalModel) {
    return (
      `I couldn't ${action} right now — the on-device model hit a problem and you're offline, ` +
      `so I can't reach cloud AI either. You can still read downloaded lessons, review flashcards, ` +
      `and retake saved quizzes. Try again once you're back online.`
    );
  }
  return (
    `This needs cloud AI and you're offline right now. ` +
    `To ${action} without internet, download an on-device AI model from the AI Models screen ` +
    `(one-time download on Wi-Fi). Meanwhile, downloaded lessons, flashcards and saved quizzes still work.`
  );
}
