import { z } from "zod";

export const createMaterialSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  subjectId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Subject ID"),
  materialType: z.enum(["pdf", "video", "markdown", "link"]),
  contentUrl: z.string().url("Invalid content URL").optional(),
  textParsed: z.string().optional(),
});

export const updateMaterialSchema = z.object({
  title: z.string().min(2).optional(),
  materialType: z.enum(["pdf", "video", "markdown", "link"]).optional(),
  contentUrl: z.string().url().optional(),
  textParsed: z.string().optional(),
});
