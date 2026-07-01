import { z } from "zod";

export const updateOrganizationSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").optional(),
  logoUrl: z.string().url("Invalid logo URL").optional(),
  branding: z.object({
    primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color code").optional(),
    secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color code").optional(),
  }).optional(),
});

export const updateAIConfigSchema = z.object({
  allowedModels: z.array(z.string()).min(1, "At least one model must be allowed"),
  monthlyUsageLimit: z.number().nonnegative("Usage limit cannot be negative"),
});

export const verifySubscriptionSchema = z.object({
  plan: z.enum(["Free", "Starter", "Growth", "Enterprise"]),
  status: z.enum(["Active", "Suspended", "PastDue", "Trialing"]),
  expiresAt: z.preprocess((val) => new Date(val as string), z.date()).optional(),
});
