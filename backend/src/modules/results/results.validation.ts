import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

export const createAssessmentSchema = z.object({
  academicYearId: objectId,
  term: z.string().min(1).max(32),
  grade: z.number().int().min(1).max(12),
  sectionId: objectId,
  subjectId: objectId,
  title: z.string().min(1).max(120),
  items: z
    .array(z.object({ name: z.string().min(1).max(60), maxScore: z.number().min(1).max(1000) }))
    .min(1, "At least one assessment item is required"),
});

export const enterMarkSchema = z.object({
  studentId: objectId,
  items: z.array(z.object({ name: z.string().min(1), score: z.number().min(0) })).min(1),
});

export const bulkEnterMarksSchema = z.object({
  marks: z.array(enterMarkSchema).min(1).max(200),
});

export const createPublishingSchema = z.object({
  academicYearId: objectId,
  term: z.string().min(1).max(32),
  grades: z.array(z.number().int().min(1).max(12)).min(1),
});

export const schedulePublishingSchema = z.object({
  releaseAt: z.coerce.date().refine((d) => d.getTime() > Date.now(), {
    message: "releaseAt must be in the future",
  }),
});

export const createAppealSchema = z.object({
  markId: objectId,
  reason: z.string().min(4).max(1000),
});

export const proposeAppealChangeSchema = z.object({
  message: z.string().min(1).max(1000).optional(),
  proposedItems: z
    .array(z.object({ name: z.string().min(1), score: z.number().min(0) }))
    .min(1),
});

export const resolveAppealSchema = z.object({
  outcome: z.enum(["UPHELD", "EXPLAINED"]),
  reason: z.string().min(4).max(1000),
});

export type CreateAssessmentInput = z.infer<typeof createAssessmentSchema>;
export type EnterMarkInput = z.infer<typeof enterMarkSchema>;
export type CreatePublishingInput = z.infer<typeof createPublishingSchema>;
export type CreateAppealInput = z.infer<typeof createAppealSchema>;
export type ProposeAppealChangeInput = z.infer<typeof proposeAppealChangeSchema>;
export type ResolveAppealInput = z.infer<typeof resolveAppealSchema>;
