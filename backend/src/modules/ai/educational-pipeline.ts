/**
 * Educational Pipeline (§26 of PROJECT_ARCHITECTURE) — the mandatory wrapper
 * around every AI request:
 *
 *   Student → Question → Curriculum → Grade → Subject → Difficulty
 *           → Learning History → Lesson Context → AI → Educational Formatter → Student
 *
 * Context assembly lives HERE on the backend (and in `mobile/modules/ai/engine/edu.context.ts`
 * on-device) — never ad hoc in callers. This layer is what makes Lumora an
 * educational platform rather than a generic chatbot.
 */

export type AICapabilityTask =
  | "chat"
  | "quiz"
  | "summary"
  | "flashcards"
  | "translation"
  | "classify"
  | "planner"
  | "reasoning";

export interface IEduContext {
  curriculum?: string; // e.g. "Ethiopian National Curriculum"
  grade?: number;
  subject?: string;
  topic?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  language?: "English" | "Amharic";
  learningHistorySummary?: string; // short weak-topics / strengths summary
  lessonContext?: string; // excerpt of the material the student is studying
}

/**
 * Builds the system instruction for a task, folding in the educational
 * context and the Educational Formatter contract (structure, reading level,
 * language). The raw model never speaks to a student without this wrapper.
 */
export function buildEducationalInstruction(
  task: AICapabilityTask,
  ctx: IEduContext = {}
): string {
  const lines: string[] = [];

  lines.push(
    "You are Lumora Tutor, a patient, curriculum-aligned AI tutor for students."
  );

  // --- Educational context (in) ---
  if (ctx.curriculum) lines.push(`Curriculum: ${ctx.curriculum}.`);
  if (ctx.grade) lines.push(`The student is in Grade ${ctx.grade}.`);
  if (ctx.subject) lines.push(`Subject: ${ctx.subject}.`);
  if (ctx.topic) lines.push(`Current topic: ${ctx.topic}.`);
  if (ctx.difficulty) lines.push(`Target difficulty: ${ctx.difficulty}.`);
  if (ctx.learningHistorySummary) {
    lines.push(`Learning history summary: ${ctx.learningHistorySummary}`);
  }
  if (ctx.lessonContext) {
    lines.push(
      `Ground your answer in this lesson material when relevant:\n"""${ctx.lessonContext}"""`
    );
  }

  // --- Task framing ---
  switch (task) {
    case "quiz":
      lines.push(
        "Generate practice quiz questions appropriate for the student's grade and topic. " +
          "Return each question with its options (for MCQ), the correct answer, and a one-line explanation."
      );
      break;
    case "summary":
      lines.push(
        "Summarize the provided content into clear study notes: key concepts first, then supporting details, then a short 'remember this' list."
      );
      break;
    case "flashcards":
      lines.push(
        "Create concise flashcards from the content. Each card: a front (question/term) and a back (answer/definition), one concept per card."
      );
      break;
    case "translation":
      lines.push(
        "Translate the content faithfully between English and Amharic, preserving educational meaning and terminology."
      );
      break;
    case "classify":
      lines.push(
        "Classify the student's captured question: identify the subject, topic, and question type, and restate the problem clearly."
      );
      break;
    case "planner":
      lines.push(
        "Create a realistic daily study plan from the student's weak topics and available time. Short focused blocks, hardest subjects earliest."
      );
      break;
    default:
      lines.push(
        "Explain concepts step by step. Prefer guiding the student to think (Socratic hints) before revealing full solutions."
      );
  }

  // --- Educational Formatter contract (out) ---
  const language = ctx.language || "English";
  lines.push(
    "Formatting rules: " +
      `write at a reading level appropriate for Grade ${ctx.grade ?? "9-12"}; ` +
      "structure explanations as concept → example → check-understanding question; " +
      `respond in ${language} unless the student explicitly asks otherwise; ` +
      "keep answers focused on education — politely decline off-topic or unsafe requests."
  );

  return lines.join("\n");
}

/**
 * Educational Formatter — final gate on the way out (§26). Light-touch
 * server-side pass: normalizes whitespace and guarantees a non-empty,
 * student-safe response envelope.
 */
export function formatEducationalResponse(text: string): string {
  const cleaned = (text || "").trim();
  if (!cleaned) {
    return "I couldn't generate a good answer for that just now. Try rephrasing your question, or ask about a specific topic from your lesson.";
  }
  return cleaned;
}
