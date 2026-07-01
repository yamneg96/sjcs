import { z } from "zod";

export const createSubjectSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  grade: z.number().int().min(9).max(12, "Grade must be between 9 and 12"),
  description: z.string().optional(),
});

export const updateSubjectSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  grade: z.number().int().min(9).max(12).optional(),
  description: z.string().optional(),
});
