import { useAuthStore } from "@/store/auth.store";
import { AITask, EduContext } from "../types";

/**
 * Educational context assembly (§26) — the mobile half of the Educational
 * Pipeline. Attaches curriculum / grade / subject / difficulty / language to
 * EVERY AI request; callers pass only what's request-specific (topic, lesson
 * excerpt) and this module fills in the student profile.
 */

export function buildEduContext(partial: EduContext = {}): EduContext {
  const user = useAuthStore.getState().user as
    | { grade?: number; fullName?: string }
    | null;

  return {
    curriculum: partial.curriculum ?? "Ethiopian National Curriculum",
    grade: partial.grade ?? user?.grade,
    language: partial.language ?? "English",
    ...partial,
  };
}

/**
 * System instruction used for LOCAL inference. Mirrors the backend
 * `buildEducationalInstruction` contract (concept → example → check-
 * understanding, grade-appropriate level, language) in a compact form that
 * fits small local-model context windows.
 */
export function buildLocalInstruction(task: AITask, ctx: EduContext): string {
  const parts: string[] = [
    "You are Lumora Tutor, a patient AI tutor for students.",
  ];
  if (ctx.grade) parts.push(`Student grade: ${ctx.grade}.`);
  if (ctx.subject) parts.push(`Subject: ${ctx.subject}.`);
  if (ctx.topic) parts.push(`Topic: ${ctx.topic}.`);
  if (ctx.lessonContext) parts.push(`Lesson excerpt: """${ctx.lessonContext}"""`);

  switch (task) {
    case "quiz":
      parts.push("Write practice quiz questions with answers and one-line explanations.");
      break;
    case "summary":
      parts.push("Summarize into short study notes: key ideas first, then a 'remember this' list.");
      break;
    case "flashcards":
      parts.push("Create flashcards: front (question/term) and back (answer), one concept per card.");
      break;
    case "translation":
      parts.push("Translate faithfully between English and Amharic.");
      break;
    default:
      parts.push("Explain step by step: concept, then an example, then one check-understanding question.");
  }

  parts.push(`Answer in ${ctx.language ?? "English"}. Stay on educational topics.`);
  return parts.join(" ");
}
