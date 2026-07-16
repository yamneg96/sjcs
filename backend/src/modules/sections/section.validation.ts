import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

export const createSectionSchema = z.object({
  name: z.string().min(1, "Section name is required").max(24),
  grade: z.number().int().min(1).max(12),
  academicYearId: objectId,
  capacity: z.number().int().min(1).max(200).optional(),
  classTeacherId: objectId.optional(),
});

export const updateSectionSchema = z.object({
  name: z.string().min(1).max(24).optional(),
  capacity: z.number().int().min(1).max(200).optional(),
  classTeacherId: objectId.nullable().optional(),
});

export type CreateSectionInput = z.infer<typeof createSectionSchema>;
export type UpdateSectionInput = z.infer<typeof updateSectionSchema>;
