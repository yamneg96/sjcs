import { AICompletionOptions, AICompletionResult, AITask, EduContext } from "../types";
import { routeRequest } from "./ai.router";
import { generate } from "./inference";
import { cloudComplete } from "@/api/ai";
import { buildEduContext, buildLocalInstruction } from "./edu.context";
import { offlineFallbackMessage } from "./fallback.service";
import { recordLearningEvent } from "../telemetry";

/**
 * AI Engine (§21) — the ONLY entry point for AI on mobile. Features call
 * `AIEngine.complete()` / `quiz()` / `summarize()` / `translate()` and never
 * import the inference adapter, the ExecuTorch bindings, providers, or model
 * ids (ADR-001/003). The engine:
 *
 *   1. attaches educational context (Educational Pipeline, §26),
 *   2. asks the Capability Router for a route (local / cloud / fallback),
 *   3. executes, falling back cloud→local→honest-message resiliently,
 *   4. logs the activity into the learning graph.
 */

async function run(
  task: AITask,
  prompt: string,
  options: AICompletionOptions = {}
): Promise<AICompletionResult> {
  const eduContext: EduContext = buildEduContext(options.eduContext);
  const decision = await routeRequest(task);

  // --- LOCAL path (ExecuTorch) ---
  if (decision.route === "local" && decision.localModel) {
    try {
      const system = buildLocalInstruction(task, eduContext);
      const text = await generate(
        decision.localModel,
        [
          { role: "system", content: system },
          { role: "user", content: prompt },
        ],
        options.onToken
      );
      return finish({
        text,
        task,
        route: "local",
        reason: decision.reason,
        model: decision.localModel.id,
      }, eduContext);
    } catch (err: any) {
      console.warn(`[Lumora AI] Local inference failed: ${err?.message}`);
      // Degrade to cloud when possible; otherwise honest fallback below.
      const retry = await routeRequest(task);
      if (retry.route !== "cloud") {
        return finish({
          text: offlineFallbackMessage(task, true),
          task,
          route: "fallback",
          reason: `Local inference failed: ${err?.message || "unknown error"}`,
        }, eduContext);
      }
      decision.route = "cloud";
      decision.reason = "Local inference failed — retried via cloud AI";
    }
  }

  // --- CLOUD path (AI Gateway) ---
  if (decision.route === "cloud") {
    try {
      const response = await cloudComplete({
        task,
        prompt,
        eduContext,
        temperature: options.temperature,
        maxTokens: options.maxTokens,
      });
      return finish({
        text: response.data.text,
        task,
        route: "cloud",
        reason: decision.reason,
        provider: response.data.provider,
        model: response.data.model,
      }, eduContext);
    } catch (err: any) {
      return finish({
        text:
          err?.message === "Network error. Please check your internet connection."
            ? offlineFallbackMessage(task, decision.hasLocalModel)
            : `Cloud AI is unavailable right now: ${err?.message || "unknown error"}. Please try again.`,
        task,
        route: "fallback",
        reason: `Cloud request failed: ${err?.message || "unknown error"}`,
      }, eduContext);
    }
  }

  // --- Honest offline fallback ---
  return finish({
    text: offlineFallbackMessage(task, decision.hasLocalModel),
    task,
    route: "fallback",
    reason: decision.reason,
  }, eduContext);
}

function finish(result: AICompletionResult, ctx: EduContext): AICompletionResult {
  void recordLearningEvent({
    kind: "chat",
    subject: ctx.subject,
    topic: ctx.topic,
    payload: { task: result.task, route: result.route },
  });
  return result;
}

export const AIEngine = {
  /** Conversational tutoring — the canonical flow (§9.5). */
  complete: (prompt: string, options?: AICompletionOptions) =>
    run("chat", prompt, options),

  /** Practice quiz generation from a topic or lesson selection. */
  quiz: (prompt: string, options?: AICompletionOptions) =>
    run("quiz", prompt, options),

  /** Study-note summarization of lesson content. */
  summarize: (content: string, options?: AICompletionOptions) =>
    run("summary", content, options),

  /** Flashcard deck generation. */
  flashcards: (content: string, options?: AICompletionOptions) =>
    run("flashcards", content, options),

  /** English ⇄ Amharic translation. */
  translate: (content: string, options?: AICompletionOptions) =>
    run("translation", content, options),

  /** Classifies an OCR-captured question (subject/topic/type). */
  classify: (content: string, options?: AICompletionOptions) =>
    run("classify", content, options),
};
