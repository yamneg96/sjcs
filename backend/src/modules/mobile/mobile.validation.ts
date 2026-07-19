import { z } from "zod";

export const registerDeviceSchema = z.object({
  deviceId: z.string().min(4).max(128),
  platform: z.enum(["android", "ios", "web"]).default("android"),
  osVersion: z.string().max(64).optional(),
  appVersion: z.string().max(32).optional(),
  abi: z.string().max(32).optional(),
  totalRAMGB: z.number().min(0).max(1024).optional(),
  storageFreeBytes: z.number().min(0).optional(),
  expoPushToken: z.string().max(256).optional(),
  installedModels: z
    .array(
      z.object({
        modelId: z.string().min(1),
        version: z.string().min(1),
      })
    )
    .default([]),
});

export const eduContextSchema = z.object({
  curriculum: z.string().max(200).optional(),
  grade: z.number().int().min(1).max(12).optional(),
  subject: z.string().max(100).optional(),
  topic: z.string().max(200).optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  language: z.enum(["English", "Amharic"]).optional(),
  learningHistorySummary: z.string().max(2000).optional(),
  lessonContext: z.string().max(8000).optional(),
});

export const aiCompleteSchema = z.object({
  task: z
    .enum([
      "chat",
      "quiz",
      "summary",
      "flashcards",
      "translation",
      "classify",
      "planner",
      "reasoning",
    ])
    .default("chat"),
  prompt: z.string().min(1).max(16000),
  eduContext: eduContextSchema.optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().int().min(1).max(8192).optional(),
});

export const syncLearningEventsSchema = z.object({
  events: z
    .array(
      z.object({
        clientEventId: z.string().min(8).max(64),
        kind: z.enum([
          "chat",
          "quiz_result",
          "lesson_read",
          "flashcard_review",
          "ocr_capture",
          "voice_session",
          "ai_route",
        ]),
        subject: z.string().max(100).optional(),
        topic: z.string().max(200).optional(),
        payload: z.record(z.unknown()).optional(),
        occurredAt: z.string().datetime().optional(),
      })
    )
    .min(1)
    .max(200),
});

export type RegisterDeviceInput = z.infer<typeof registerDeviceSchema>;
export type AICompleteInput = z.infer<typeof aiCompleteSchema>;
export type SyncLearningEventsInput = z.infer<typeof syncLearningEventsSchema>;
