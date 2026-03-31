import { z } from "zod";

export const askLISSchema = z.object({
  question: z.string().min(1, "Question is required"),
  subject: z.string().optional().default("general"),
});

export const startSessionSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
});

export const endSessionSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  duration: z.number().int().positive(),
});

export type AskLISInput = z.infer<typeof askLISSchema>;
export type StartSessionInput = z.infer<typeof startSessionSchema>;
export type EndSessionInput = z.infer<typeof endSessionSchema>;
