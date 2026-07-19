export interface IAIRequestOptions {
  provider?: "groq" | "gemini" | "openai" | "bonsai";
  modelName?: string;
  systemInstruction?: string;
  temperature?: number;
  maxTokens?: number;
  tenantId?: string; // For limit checks and billing/analytics increments
  isStudentFacing?: boolean; // Injects Socratic safety guidelines when true
}

export interface IAIResponse {
  text: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    estimatedCostUSD: number;
  };
  provider: string;
  model: string;
}

export interface IAIEmbeddingResponse {
  embedding: number[];
  model: string;
  /** True when every embedding provider failed and a dummy vector was returned to avoid a 500. */
  isFallback: boolean;
}

export interface IAITranscriptionOptions {
  /** BCP-47-ish hint: "am" (Amharic), "en", or omitted to auto-detect. */
  language?: "am" | "en";
  fileName?: string;
  mimeType?: string;
  tenantId?: string;
}

export interface IAITranscriptionResponse {
  text: string;
  language?: string;
  provider: string;
  /** True when no ASR provider is configured and a stub transcript was returned. */
  isFallback: boolean;
}
