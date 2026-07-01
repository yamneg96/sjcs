import { z } from "zod";

export const createStudentSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  studentId: z.string().min(2, "Student ID must be at least 2 characters"),
  grade: z.number().int().min(9).max(12, "Grade must be between 9 and 12"),
});

export const importStudentsSchema = z.object({
  students: z.array(createStudentSchema).min(1, "Students list cannot be empty"),
});

export const createTeacherSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  grades: z.array(z.number().int().min(9).max(12)).min(1, "Teacher must be assigned to at least one grade"),
});

export const resetStudentPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});
