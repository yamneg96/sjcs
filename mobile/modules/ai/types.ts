/**
 * Shared types for the mobile AI layer (§20–§23 of PROJECT_ARCHITECTURE).
 *
 * The app never knows which model is running: features ask the AI Engine for
 * outcomes ("explain this chapter"), and the Capability Router decides local
 * (ExecuTorch) vs cloud (AI Gateway) vs honest fallback per request.
 */

export type AITask =
  | "chat"
  | "quiz"
  | "summary"
  | "flashcards"
  | "translation"
  | "classify"
  | "planner"
  | "reasoning";

export type AIRoute = "local" | "cloud" | "fallback";

export interface EduContext {
  curriculum?: string;
  grade?: number;
  subject?: string;
  topic?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  language?: "English" | "Amharic";
  learningHistorySummary?: string;
  lessonContext?: string;
}

export interface AICompletionOptions {
  eduContext?: EduContext;
  temperature?: number;
  maxTokens?: number;
  onToken?: (token: string) => void;
}

export interface AICompletionResult {
  text: string;
  task: AITask;
  route: AIRoute;
  /** Why the router chose this route — surfaced in the transparency panel. */
  reason: string;
  provider?: string;
  model?: string;
}

/** A catalog entry as served by GET /api/mobile/models (§16.4). */
export interface CatalogModel {
  id: string;
  displayName: string;
  description?: string;
  engine: "executorch";
  task: "chat" | "embedding" | "asr" | "vision";
  capabilities: string[];
  sizeBytes: number;
  quantization: string;
  minimumRAMGB: number;
  languages: string[];
  downloadUrl: string;
  tokenizerUrl?: string;
  tokenizerConfigUrl?: string;
  checksum: string; // "md5:<hex>" or "sha256:<hex>"
  version: string;
  status: "canary" | "stable" | "deprecated";
  compat: { minAppVersion: string; abis: string[] };
  eligible: boolean;
  ineligibleReasons: string[];
}

/**
 * Model lifecycle (§23.3), Play-Store-like:
 * NOT_INSTALLED → DOWNLOADING → VERIFYING → REGISTERING → READY
 * READY → UPDATING → READY | READY → DEPRECATED → REMOVED
 */
export type ModelLifecycleStatus =
  | "not_installed"
  | "downloading"
  | "verifying"
  | "registering"
  | "ready"
  | "updating"
  | "deprecated"
  | "error";

export interface InstalledModel {
  id: string;
  version: string;
  task: CatalogModel["task"];
  capabilities: string[];
  status: "ready";
  /** Absolute file URIs inside documentDirectory/models/<id>/<version>/ */
  modelPath: string;
  tokenizerPath?: string;
  tokenizerConfigPath?: string;
  sizeBytes: number;
  installedAt: string; // ISO
}

/** documentDirectory/models/model-registry.json — the single local truth (§23.2). */
export interface ModelRegistryFile {
  installed: InstalledModel[];
}

export interface InstallProgress {
  modelId: string;
  status: ModelLifecycleStatus;
  /** 0..1 while downloading */
  progress: number;
  error?: string;
}
