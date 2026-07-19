import * as Speech from "expo-speech";
import { transcribeAudio } from "@/api/ai";
import { AIEngine } from "../engine/ai.engine";
import { isOnline } from "../engine/capability.service";
import { AICompletionResult, EduContext } from "../types";
import { recordLearningEvent } from "../telemetry";

/**
 * Voice pipeline (§44, §24.2):
 *
 *   Mic → Speech Pipeline → Ethio-ASR (cloud) → transcript
 *       → Educational AI (canonical flow) → Answer → TTS
 *
 * v1 requires connectivity because Ethio-ASR is a cloud service; the UI says so
 * honestly rather than failing silently. A future local Whisper-class model
 * drops into `transcribe()` via the Model Manager with no change to callers
 * (§24.2) — which is why transcription lives behind this function.
 *
 * The transcript is always surfaced for editing before it becomes a tutoring
 * request, so ASR mistakes are recoverable.
 */

export type VoiceLanguage = "am" | "en";

export class VoiceOfflineError extends Error {
  constructor() {
    super(
      "Voice tutoring needs an internet connection right now. You can type your question instead — or download an on-device model to study offline."
    );
    this.name = "VoiceOfflineError";
  }
}

/** Speech → text. Throws VoiceOfflineError when there's no connectivity. */
export async function transcribe(
  fileUri: string,
  language?: VoiceLanguage
): Promise<string> {
  if (!(await isOnline())) {
    throw new VoiceOfflineError();
  }

  const response = await transcribeAudio(fileUri, language);
  const text = (response.data?.text || "").trim();

  void recordLearningEvent({
    kind: "voice_session",
    payload: { chars: text.length, provider: response.data?.provider },
  });

  if (!text) {
    throw new Error("I couldn't make out any speech. Try again, closer to the mic.");
  }
  return text;
}

/**
 * Sends an (already reviewed) transcript through the canonical AI flow. This is
 * the same AIEngine entry every other feature uses — voice gets no special
 * model path.
 */
export function ask(transcript: string, eduContext: EduContext = {}): Promise<AICompletionResult> {
  return AIEngine.complete(transcript, { eduContext });
}

/** Reads an answer aloud. Amharic falls back to the device default voice. */
export function speak(text: string, language: VoiceLanguage = "en"): void {
  Speech.stop();
  Speech.speak(text, {
    language: language === "am" ? "am-ET" : "en-US",
    rate: 0.95,
  });
}

export function stopSpeaking(): void {
  Speech.stop();
}
