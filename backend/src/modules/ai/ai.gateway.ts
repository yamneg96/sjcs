import axios from "axios";
import Groq from "groq-sdk";
import OpenAI from "openai";
import Organization, { IOrganization } from "../organizations/organization.model";
import { IAIRequestOptions, IAIResponse, IAIEmbeddingResponse } from "./ai.types";
import { env } from "../../config/env";
import { ForbiddenError, BadRequestError } from "../../shared/errors/errors";
import {
  AICapabilityTask,
  IEduContext,
  buildEducationalInstruction,
  formatEducationalResponse,
} from "./educational-pipeline";
import { moderateContent, MODERATION_FALLBACK } from "./moderation";

export interface IEducationalAIRequest {
  task: AICapabilityTask;
  prompt: string;
  eduContext?: IEduContext;
  tenantId?: string;
  isStudentFacing?: boolean;
  temperature?: number;
  maxTokens?: number;
}

// Interface to bypass Groq SDK type limitations for the embeddings endpoint safely
interface IGroqEmbeddingsSDK {
  embeddings: {
    create(options: { input: string; model: string }): Promise<{
      data: Array<{ embedding: number[] }>;
    }>;
  };
}

// Current stable embedding models on Groq, tried in order until one succeeds
const EMBEDDING_MODELS = ["nomic-embed-text-v1_5", "snowflake-arctic-embed-m-v2.0"];
const EMBEDDING_DIMENSIONS = 768;

const SOCRATIC_INSTRUCTION = 
  "You are an AI learning assistant on the Lumora Platform. Adhere strictly to the Socratic method: " +
  "Never provide direct answers to the student. Instead, guide them step-by-step, ask clarifying questions, " +
  "break down complex concepts, and prompt the student to think critically to discover the answer on their own.";

interface IChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export class AIGateway {
  /**
   * Main entry point to invoke AI completions.
   * Manages tenanted limits, allows model restrictions, and counts usages.
   * Leverages Bonsai fallback resiliency and implements the Socratic Rule.
   */
  static async generateCompletion(
    prompt: string,
    options: IAIRequestOptions = {}
  ): Promise<IAIResponse> {
    const provider = options.provider || "gemini";
    let modelName = options.modelName || "";
    const tenantId = options.tenantId;

    // 1. Perform Tenant Isolation & Credit Limit Guard
    let organization: IOrganization | null = null;
    if (tenantId && tenantId !== "individual" && tenantId !== "platform") {
      organization = await Organization.findById(tenantId);
      if (!organization) {
        throw new BadRequestError("Invalid tenant context for AI query");
      }

      // Check if organization is suspended
      if (organization.suspendedAt || organization.subscription?.status === "Suspended") {
        throw new ForbiddenError("Organization account suspended. Access denied.");
      }

      // Check allowed models list
      const allowedModels = organization.aiConfig?.allowedModels || ["bonsai", "gemma"];
      const isAllowed = allowedModels.some(
        (m: string) =>
          m.toLowerCase() === provider.toLowerCase() ||
          (modelName && m.toLowerCase() === modelName.toLowerCase())
      );

      if (!isAllowed) {
        throw new ForbiddenError(`Model provider '${provider}' restricted by organization administrators`);
      }

      // Check usage limits
      const limit = organization.aiConfig?.monthlyUsageLimit ?? 50.00;
      const current = organization.aiConfig?.currentMonthlyUsage ?? 0.0;
      if (current >= limit) {
        // HTTP 402 - Payment Required
        const error = new Error("Monthly organization AI credit limit exceeded. Upgrade your plan.");
        Object.assign(error, { statusCode: 402 });
        throw error;
      }
    }

    // 2. Inject Socratic Rule System Instruction on all student-facing queries
    let systemInstruction = options.systemInstruction || "";
    if (options.isStudentFacing) {
      systemInstruction = systemInstruction 
        ? `${SOCRATIC_INSTRUCTION}\n\nAdditional instructions:\n${systemInstruction}`
        : SOCRATIC_INSTRUCTION;
    }

    // 3. Route completion requests to proper model provider
    let text = "";
    let promptTokens = 0;
    let completionTokens = 0;

    try {
      if (provider === "groq") {
        if (!env.GROQ_API_KEY) {
          text = `[MOCK GROQ Tutors]: Answering prompt in sandbox: "${prompt.substring(0, 40)}..."`;
        } else {
          const groq = new Groq({ apiKey: env.GROQ_API_KEY });
          modelName = modelName || "llama3-8b-8192";
          const messages: IChatMessage[] = [];
          if (systemInstruction) {
            messages.push({ role: "system", content: systemInstruction });
          }
          messages.push({ role: "user", content: prompt });

          const chatCompletion = await groq.chat.completions.create({
            messages,
            model: modelName,
            temperature: options.temperature ?? 0.7,
            max_tokens: options.maxTokens,
          });

          text = chatCompletion.choices[0]?.message?.content || "";
          promptTokens = chatCompletion.usage?.prompt_tokens || 0;
          completionTokens = chatCompletion.usage?.completion_tokens || 0;
        }
      } else if (provider === "openai") {
        if (!env.OPENAI_API_KEY) {
          text = `[MOCK OPENAI Tutors]: Sandbox reply to prompt: "${prompt.substring(0, 40)}..."`;
        } else {
          const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
          modelName = modelName || "gpt-4o-mini";
          const messages: IChatMessage[] = [];
          if (systemInstruction) {
            messages.push({ role: "system", content: systemInstruction });
          }
          messages.push({ role: "user", content: prompt });

          const completion = await openai.chat.completions.create({
            messages,
            model: modelName,
            temperature: options.temperature ?? 0.7,
            max_tokens: options.maxTokens,
          });

          text = completion.choices[0]?.message?.content || "";
          promptTokens = completion.usage?.prompt_tokens || 0;
          completionTokens = completion.usage?.completion_tokens || 0;
        }
      } else if (provider === "bonsai") {
        // Local model downloader fallback
        if (env.GROQ_API_KEY) {
          // Route Bonsai internally to Groq Mixtral for high quality
          return this.generateCompletion(prompt, {
            ...options,
            provider: "groq",
            modelName: "mixtral-8x7b-32768",
            systemInstruction, // Pass resolved instruction
          });
        }
        text = `[BONSAI Adaptive Tutor]: Mocking local model: processing tutoring instruction: "${prompt.substring(0, 50)}..."` +
               `\n[System Guidelines applied: ${systemInstruction ? "Yes" : "No"}]`;
      } else {
        // Default to Google Gemini API
        modelName = modelName || "gemini-1.5-flash";
        if (!env.GEMINI_API_KEY) {
          text = `[MOCK GEMINI Tutors]: Processing adaptive lesson in sandbox for prompt: "${prompt.substring(0, 50)}..."` +
                 `\n[System Guidelines applied: ${systemInstruction ? "Yes" : "No"}]`;
        } else {
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${env.GEMINI_API_KEY}`;
          const contents = [];
          if (systemInstruction) {
            contents.push({
              role: "user",
              parts: [{ text: `System context: ${systemInstruction}\nUser prompt: ${prompt}` }]
            });
          } else {
            contents.push({
              role: "user",
              parts: [{ text: prompt }]
            });
          }

          const response = await axios.post(geminiUrl, {
            contents,
            generationConfig: {
              temperature: options.temperature ?? 0.7,
              maxOutputTokens: options.maxTokens,
            }
          });

          const candidate = response.data?.candidates?.[0];
          text = candidate?.content?.parts?.[0]?.text || "";
          promptTokens = response.data?.usageMetadata?.promptTokenCount || Math.ceil(prompt.length / 4);
          completionTokens = response.data?.usageMetadata?.candidatesTokenCount || Math.ceil(text.length / 4);
        }
      }
    } catch (err: any) {
      // Secondary Resiliency Rule: If cloud API fails (timeout/429), fall back to local Bonsai
      if (provider !== "bonsai") {
        console.warn(`💥 AI Provider error (${provider}): ${err.message}. Falling back to local Bonsai model...`);
        return this.generateCompletion(prompt, {
          ...options,
          provider: "bonsai",
          systemInstruction, // Carry over resolved instruction
        });
      }
      console.error("💥 local Bonsai fallback failed:", err.message);
      text = `[Adaptive fallback]: Recovering from provider issue. Processing request context: "${prompt.substring(0, 40)}..."`;
    }

    // 4. Estimate cost and update organization consumption
    const totalTokens = promptTokens + completionTokens;
    const estimatedCostUSD = totalTokens > 0 
      ? (promptTokens * 0.0000015) + (completionTokens * 0.000002)
      : 0.0002;

    if (organization && organization.aiConfig) {
      organization.aiConfig.currentMonthlyUsage = 
        Math.min(
          organization.aiConfig.monthlyUsageLimit, 
          (organization.aiConfig.currentMonthlyUsage || 0) + estimatedCostUSD
        );
      await organization.save();
    }

    return {
      text,
      usage: {
        promptTokens,
        completionTokens,
        totalTokens,
        estimatedCostUSD,
      },
      provider,
      model: modelName || "default",
    };
  }

  /**
   * The single educational AI entry point (§16.3 rules 2 & 4). Enforces, by
   * construction, that every request is wrapped by the Educational Pipeline on
   * the way in (context → instruction) and passes moderation + the Educational
   * Formatter on the way out. Feature modules (mobile BFF, chat, quiz, lis)
   * should call THIS rather than assembling prompts and calling
   * `generateCompletion` directly.
   */
  static async completeEducational(
    request: IEducationalAIRequest
  ): Promise<IAIResponse & { moderationFlagged: boolean }> {
    // 1. Moderate the input (fail fast on unsafe requests).
    const inputMod = moderateContent(request.prompt);
    if (inputMod.flagged) {
      throw new BadRequestError("This request can't be processed for safety reasons.");
    }

    // 2. Educational Pipeline (in): assemble the curriculum-aware instruction.
    const systemInstruction = buildEducationalInstruction(request.task, request.eduContext);

    // 3. Generate via the orchestrated provider path.
    const result = await this.generateCompletion(request.prompt, {
      systemInstruction,
      tenantId: request.tenantId,
      isStudentFacing: request.isStudentFacing ?? request.task === "chat",
      temperature: request.temperature,
      maxTokens: request.maxTokens,
    });

    // 4. Moderate the output, then apply the Educational Formatter (out).
    const outputMod = moderateContent(result.text);
    const text = outputMod.flagged
      ? MODERATION_FALLBACK
      : formatEducationalResponse(result.text);

    return { ...result, text, moderationFlagged: outputMod.flagged };
  }

  /**
   * Generates a text embedding, the only path any module may use for vector
   * search / RAG ingestion (never instantiate a provider SDK directly — see
   * CLAUDE.md: "Backend modules call AIGateway only").
   *
   * Falls back across models on failure, then to a dummy vector as a last
   * resort so a provider outage never surfaces as a 500 during ingestion.
   */
  static async generateEmbedding(text: string): Promise<IAIEmbeddingResponse> {
    if (!env.GROQ_API_KEY) {
      return {
        embedding: new Array(EMBEDDING_DIMENSIONS).fill(0.01),
        model: "dummy",
        isFallback: true,
      };
    }

    const groq = new Groq({ apiKey: env.GROQ_API_KEY }) as unknown as IGroqEmbeddingsSDK;

    for (const modelId of EMBEDDING_MODELS) {
      try {
        const response = await groq.embeddings.create({ input: text, model: modelId });
        const embedding = response?.data?.[0]?.embedding;
        if (embedding) {
          return { embedding, model: modelId, isFallback: false };
        }
      } catch (err: any) {
        console.warn(`💥 Embedding model ${modelId} failed: ${err.message}. Trying next...`);
      }
    }

    console.error("CRITICAL: All embedding models failed. Using dummy vector.");
    return {
      embedding: new Array(EMBEDDING_DIMENSIONS).fill(0.01),
      model: "dummy",
      isFallback: true,
    };
  }
}
