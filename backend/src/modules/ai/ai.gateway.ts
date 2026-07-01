import axios from "axios";
import Groq from "groq-sdk";
import OpenAI from "openai";
import Organization from "../organizations/organization.model";
import { IAIRequestOptions, IAIResponse } from "./ai.types";
import { env } from "../../config/env";
import { ForbiddenError, BadRequestError } from "../../shared/errors/errors";

export class AIGateway {
  /**
   * Main entry point to invoke AI completions.
   * Manages tenanted limits, allows model restrictions, and counts usages.
   */
  static async generateCompletion(
    prompt: string,
    options: IAIRequestOptions = {}
  ): Promise<IAIResponse> {
    const provider = options.provider || "gemini";
    let modelName = options.modelName || "";
    const tenantId = options.tenantId;

    // 1. Perform Tenant Isolation & Credit Limit Guard
    let organization: any = null;
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
        const error: any = new Error("Monthly organization AI credit limit exceeded. Upgrade your plan.");
        error.statusCode = 402;
        throw error;
      }
    }

    // 2. Route completion requests to proper model provider
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
          const messages: any[] = [];
          if (options.systemInstruction) {
            messages.push({ role: "system", content: options.systemInstruction });
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
          const messages: any[] = [];
          if (options.systemInstruction) {
            messages.push({ role: "system", content: options.systemInstruction });
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
        // Local/CDN model downloader, fallback to mixtral or mock
        if (env.GROQ_API_KEY) {
          // Route Bonsai internally to Groq Mixtral for high quality
          return this.generateCompletion(prompt, {
            ...options,
            provider: "groq",
            modelName: "mixtral-8x7b-32768",
          });
        }
        text = `[BONSAI Adaptive Tutor]: Mocking local model: processing tutoring instruction: "${prompt.substring(0, 50)}..."`;
      } else {
        // Default to Google Gemini API
        modelName = modelName || "gemini-1.5-flash";
        if (!env.GEMINI_API_KEY) {
          text = `[MOCK GEMINI Tutors]: Processing adaptive lesson in sandbox for prompt: "${prompt.substring(0, 50)}..."`;
        } else {
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${env.GEMINI_API_KEY}`;
          const contents = [];
          if (options.systemInstruction) {
            // In Gemini v1beta, systemInstruction is supplied as a separate option or in systemInstruction object
            // Let's use simple structured messages
            contents.push({
              role: "user",
              parts: [{ text: `System context: ${options.systemInstruction}\nUser prompt: ${prompt}` }]
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
          // Approximate tokens if API doesn't return metadata directly in standard fields
          promptTokens = response.data?.usageMetadata?.promptTokenCount || Math.ceil(prompt.length / 4);
          completionTokens = response.data?.usageMetadata?.candidatesTokenCount || Math.ceil(text.length / 4);
        }
      }
    } catch (err: any) {
      console.error(`💥 AI Provider error (${provider}):`, err.message);
      text = `[Adaptive fallback]: Recovering from provider issue. Processing request context: "${prompt.substring(0, 40)}..."`;
    }

    // 3. Estimate cost and update organization consumption
    const totalTokens = promptTokens + completionTokens;
    // Flat estimate: $0.0005 per token-equivalent query or custom provider cost ratios
    const estimatedCostUSD = totalTokens > 0 
      ? (promptTokens * 0.0000015) + (completionTokens * 0.000002) // Approx pricing
      : 0.0002; // Minimum cost unit

    if (organization) {
      organization.aiConfig.currentMonthlyUsage = 
        Math.min(organization.aiConfig.monthlyUsageLimit, (organization.aiConfig.currentMonthlyUsage || 0) + estimatedCostUSD);
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
}
