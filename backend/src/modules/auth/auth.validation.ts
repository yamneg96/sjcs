import { z } from "zod";

export const registerIndividualSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  grade: z.number().int().min(9).max(12, "Grade must be between 9 and 12")
});

export const registerOrganizationSchema = z.object({
  orgName: z.string().min(3, "Organization name must be at least 3 characters"),
  orgSlug: z.string().min(3, "Subdomain/slug must be at least 3 characters").optional(),
  ownerName: z.string().min(2, "Owner name must be at least 2 characters"),
  ownerEmail: z.string().email("Invalid owner email address"),
  ownerPassword: z.string().min(6, "Owner password must be at least 6 characters")
});

export const loginSchema = z.union([
  // Email Login (SuperAdmin, OrgOwner, OrgAdmin, Teacher, Individual)
  z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required")
  }),
  // Student Login (Needs orgSlug, fullName, grade, password)
  z.object({
    orgSlug: z.string().min(1, "Organization slug is required"),
    fullName: z.string().min(2, "Full name is required"),
    grade: z.number().int().min(9).max(12),
    password: z.string().min(1, "Password is required")
  })
]);

export const verifyStudentFirstTimeSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  grade: z.number().int().min(9).max(12),
  orgSlug: z.string().min(1, "Organization slug is required")
});

export const setupPasswordFirstTimeSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export const requestPasswordResetSchema = z.object({
  email: z.string().email("Invalid email address")
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
  deviceId: z.string().max(128).optional()
});

export const logoutSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required")
});
