import { z } from "zod";

export const createConversationSchema = z.object({
  subjectId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Subject ID").optional(),
  title: z.string().min(1, "Title must be at least 1 character").optional(),
  grade: z.number().int().min(9).max(12).optional(),
});

export const sendMessageSchema = z.object({
  message: z.string().min(1, "Message content cannot be empty"),
});
