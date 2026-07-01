export interface IAIRequestOptions {
  provider?: "groq" | "gemini" | "openai" | "bonsai";
  modelName?: string;
  systemInstruction?: string;
  temperature?: number;
  maxTokens?: number;
  tenantId?: string; // For limit checks and billing/analytics increments
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
