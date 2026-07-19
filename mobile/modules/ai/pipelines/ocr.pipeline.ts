import { Platform } from "react-native";
import { AIEngine } from "../engine/ai.engine";
import { AICompletionResult, EduContext } from "../types";
import { recordLearningEvent } from "../telemetry";

/**
 * OCR pipeline (§9.6, §43, ADR-002).
 *
 *   Camera → @infinitered/react-native-mlkit (on-device) → StructuredDocument
 *          → AIEngine → Question Classifier → Educational Engine → Student
 *
 * This is the ONLY file permitted to import an ML Kit package (enforced by the
 * CI boundary check). Text extraction is entirely on-device, so scanning works
 * in airplane mode; only the EXTRACTED TEXT may later go to cloud AI — the raw
 * image never leaves the device.
 */

/** A math region hint: lines that look like equations rather than prose. */
const MATH_HINT = /[=+\-×÷^√∫Σ]|\b\d+\s*[/]\s*\d+\b/;

export interface StructuredBlock {
  text: string;
  languages: string[];
  isMathLike: boolean;
}

/** The normalized document handed to the AI Engine — never raw pixels. */
export interface StructuredDocument {
  fullText: string;
  blocks: StructuredBlock[];
  languageHints: string[];
  hasMathRegions: boolean;
}

type MLKitModule = typeof import("@infinitered/react-native-mlkit-text-recognition");

let mlkit: MLKitModule | null = null;
let loadError: string | null = null;

function getMLKit(): MLKitModule | null {
  if (mlkit || loadError) return mlkit;
  try {
    // Native module: present in dev-client/production builds only — not Expo
    // Go, not web.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    mlkit = require("@infinitered/react-native-mlkit-text-recognition");
  } catch (err: any) {
    loadError = err?.message || "ML Kit text recognition unavailable";
    console.warn(`[Lumora OCR] ${loadError}`);
  }
  return mlkit;
}

export function isOcrSupported(): boolean {
  if (Platform.OS === "web") return false;
  return !!getMLKit();
}

/**
 * Runs on-device text recognition over a captured image and normalizes the
 * result into a StructuredDocument.
 */
export async function extractDocument(imageUri: string): Promise<StructuredDocument> {
  const rt = getMLKit();
  if (!rt) {
    throw new Error("On-device text recognition isn't available in this build.");
  }

  const result = await rt.recognizeText(imageUri);

  const blocks: StructuredBlock[] = (result.blocks ?? []).map((b) => ({
    text: b.text,
    languages: b.recognizedLanguages ?? [],
    isMathLike: MATH_HINT.test(b.text),
  }));

  const languageHints = Array.from(
    new Set(blocks.flatMap((b) => b.languages).filter(Boolean))
  );

  void recordLearningEvent({
    kind: "ocr_capture",
    payload: { blocks: blocks.length, chars: result.text?.length ?? 0 },
  });

  return {
    fullText: (result.text ?? "").trim(),
    blocks,
    languageHints,
    hasMathRegions: blocks.some((b) => b.isMathLike),
  };
}

/**
 * The full "scan to learn" flow: extract on-device, then hand the structured
 * text to the AI Engine. OCR never talks to the model directly — the engine
 * attaches educational context and decides local vs cloud (§4.2).
 */
export async function solveCapturedWork(
  imageUri: string,
  eduContext: EduContext = {}
): Promise<{ document: StructuredDocument; answer: AICompletionResult }> {
  const document = await extractDocument(imageUri);

  if (!document.fullText) {
    throw new Error(
      "No text found in that photo. Try again with better lighting and the page flat in frame."
    );
  }

  const prompt = [
    "A student scanned this from their work:",
    `"""${document.fullText}"""`,
    document.hasMathRegions
      ? "It looks like a maths problem — solve it step by step and show the working."
      : "Identify what is being asked, then explain the answer step by step.",
  ].join("\n");

  const answer = await AIEngine.classify(prompt, { eduContext });
  return { document, answer };
}
