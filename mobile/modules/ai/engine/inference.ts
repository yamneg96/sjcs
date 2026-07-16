import { Platform } from "react-native";
import { InstalledModel } from "../types";

/**
 * Inference adapter (§22) — the ONLY file in the app that touches
 * react-native-executorch (ADR-001; enforced by the AIEngine boundary).
 * Exposes a runtime-agnostic interface so a future second runtime would be
 * a new adapter, not a redesign.
 *
 * One model is resident in memory at a time (v1); loading a different model
 * unloads the previous one.
 */

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

let runtime: typeof import("react-native-executorch") | null = null;
let runtimeLoadError: string | null = null;

function getRuntime() {
  if (runtime || runtimeLoadError) return runtime;
  try {
    // Native module — present only in dev-client / production builds,
    // not in Expo Go and not on web.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    runtime = require("react-native-executorch");
  } catch (err: any) {
    runtimeLoadError = err?.message || "react-native-executorch unavailable";
    console.warn(`[Lumora AI] Local runtime unavailable: ${runtimeLoadError}`);
  }
  return runtime;
}

export function isLocalRuntimeSupported(): boolean {
  if (Platform.OS === "web") return false;
  return !!getRuntime();
}

let llm: any = null;
let loadedModelId: string | null = null;
let tokenSink: ((token: string) => void) | null = null;

export function isModelLoaded(modelId: string): boolean {
  return !!llm && loadedModelId === modelId;
}

/** Loads the installed model into memory (idempotent per model id+version). */
export async function loadModel(model: InstalledModel): Promise<void> {
  const rt = getRuntime();
  if (!rt) throw new Error("Local AI runtime is not available in this build.");
  if (isModelLoaded(model.id)) return;

  await unloadModel();

  llm = await rt.LLMModule.fromCustomModel(
    model.modelPath,
    model.tokenizerPath ?? model.modelPath,
    model.tokenizerConfigPath ?? model.tokenizerPath ?? model.modelPath,
    undefined,
    (token: string) => tokenSink?.(token)
  );
  loadedModelId = model.id;
}

/**
 * Runs a chat completion on the loaded model, streaming tokens through
 * `onToken` when provided.
 */
export async function generate(
  model: InstalledModel,
  messages: ChatMessage[],
  onToken?: (token: string) => void
): Promise<string> {
  await loadModel(model);
  tokenSink = onToken ?? null;
  try {
    return await llm.generate(messages);
  } finally {
    tokenSink = null;
  }
}

export async function unloadModel(): Promise<void> {
  if (!llm) return;
  try {
    llm.interrupt?.();
    llm.delete?.();
  } catch (err) {
    console.warn("[Lumora AI] Failed to unload local model cleanly.", err);
  }
  llm = null;
  loadedModelId = null;
}
