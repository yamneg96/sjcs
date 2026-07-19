import { api } from "./axios";
import { ApiResponse } from "../types/api.types";
import { AITask, CatalogModel, EduContext } from "../modules/ai/types";
import { DeviceProfile } from "../modules/ai/engine/capability.service";

/**
 * Mobile BFF client (§16.4) — model discovery, device registration, the
 * cloud AI path used by the Capability Router, and offline learning-event
 * sync. Feature code never calls these directly; it goes through AIEngine.
 */

export interface CloudCompletionResponse {
  text: string;
  task: AITask;
  route: "cloud";
  provider: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    estimatedCostUSD: number;
  };
}

export async function fetchModelCatalog(profile?: DeviceProfile) {
  const params = new URLSearchParams();
  if (profile?.totalRAMGB) params.set("ramGB", String(profile.totalRAMGB));
  if (profile?.abi) params.set("abi", profile.abi);
  if (profile?.storageFreeBytes) {
    params.set("storageFreeBytes", String(profile.storageFreeBytes));
  }
  const query = params.toString();
  const response = await api.get<ApiResponse<{ models: CatalogModel[] }>>(
    `/mobile/models${query ? `?${query}` : ""}`,
    { headers: profile ? { "x-app-version": profile.appVersion } : undefined }
  );
  return response.data;
}

export async function registerDevice(
  profile: DeviceProfile & { expoPushToken?: string },
  installedModels: { modelId: string; version: string }[]
) {
  const response = await api.post<ApiResponse<{ device: unknown }>>("/mobile/devices", {
    ...profile,
    installedModels,
  });
  return response.data;
}

export async function cloudComplete(input: {
  task: AITask;
  prompt: string;
  eduContext?: EduContext;
  temperature?: number;
  maxTokens?: number;
}) {
  const response = await api.post<ApiResponse<CloudCompletionResponse>>(
    "/mobile/ai/complete",
    input,
    { timeout: 60000 }
  );
  return response.data;
}

export interface TranscriptionResponse {
  text: string;
  language?: string;
  provider: string;
}

/**
 * Uploads a recorded clip for transcription (§44). Voice needs connectivity in
 * v1 — Ethio-ASR is a cloud service — and the UI states that honestly.
 */
export async function transcribeAudio(
  fileUri: string,
  language?: "am" | "en"
): Promise<ApiResponse<TranscriptionResponse>> {
  const form = new FormData();
  // React Native's FormData takes this {uri,name,type} shape for file parts.
  form.append("audio", {
    uri: fileUri,
    name: "speech.m4a",
    type: "audio/m4a",
  } as unknown as Blob);
  if (language) form.append("language", language);

  const response = await api.post<ApiResponse<TranscriptionResponse>>(
    "/mobile/ai/transcribe",
    form,
    {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000,
    }
  );
  return response.data;
}

export interface LearningEventInput {
  clientEventId: string;
  kind:
    | "chat"
    | "quiz_result"
    | "lesson_read"
    | "flashcard_review"
    | "ocr_capture"
    | "voice_session"
    | "ai_route";
  subject?: string;
  topic?: string;
  payload?: Record<string, unknown>;
  occurredAt?: string;
}

export async function syncLearningEvents(events: LearningEventInput[]) {
  const response = await api.post<
    ApiResponse<{ received: number; inserted: number; skipped: number }>
  >("/mobile/sync/learning-events", { events });
  return response.data;
}
