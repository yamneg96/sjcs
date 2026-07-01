import { z } from "zod";
import mongoose from "mongoose";

// Validate MongoDB ObjectId
export const objectIdSchema = z.string().refine(
  (val) => mongoose.Types.ObjectId.isValid(val),
  { message: "Invalid MongoDB ObjectId format" }
);

// Standard pagination validation
export const paginationSchema = z.object({
  page: z.preprocess((val) => parseInt(val as string, 10), z.number().int().min(1)).optional(),
  limit: z.preprocess((val) => parseInt(val as string, 10), z.number().int().min(1).max(100)).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});
