import { z } from "zod";

export const submitApplicationSchema = z.object({
  parentName: z.string().min(2, "Parent name is required"),
  parentEmail: z.string().email("Valid parent email is required"),
  parentPhone: z.string().min(6, "Valid phone number is required"),
  studentFirstName: z.string().min(1, "Student first name is required"),
  studentLastName: z.string().min(1, "Student last name is required"),
  studentDOB: z.string().refine((val) => !isNaN(Date.parse(val)), "Valid date of birth is required"),
  studentGender: z.enum(["male", "female"]),
  gradeAppliedFor: z.number().int().min(1).max(12),
  previousSchool: z.string().optional(),
  transferReason: z.string().optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(["INQUIRY", "PENDING_REVIEW", "INTERVIEW_SCHEDULED", "APPROVED", "REJECTED", "WAITLISTED"]),
  interviewDate: z.string().optional(),
  interviewTime: z.string().optional(),
  interviewNotes: z.string().optional(),
  reviewerNotes: z.string().optional(),
});

export const enrollSchema = z.object({
  sectionId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Valid sectionId is required"),
  createParentAccount: z.boolean().optional().default(true),
});

export type SubmitApplicationDTO = z.infer<typeof submitApplicationSchema>;
export type UpdateStatusDTO = z.infer<typeof updateStatusSchema>;
export type EnrollDTO = z.infer<typeof enrollSchema>;
