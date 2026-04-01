import { z } from "zod";

export const verifyStudentSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  grade: z.number().int().min(9).max(12),
});

export const setupPasswordSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128),
});

export const loginSchema = z.union([
  z.object({
    email: z.string().email(),
    password: z.string().min(1, "Password is required"),
  }),
  z.object({
    fullName: z.string().min(2, "Full name is required"),
    grade: z.number().int().min(9).max(12),
    password: z.string().min(1, "Password is required"),
  }),
]);

export type VerifyStudentInput = z.infer<typeof verifyStudentSchema>;
export type SetupPasswordInput = z.infer<typeof setupPasswordSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
