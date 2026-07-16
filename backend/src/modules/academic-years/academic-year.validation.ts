import { z } from "zod";

export const createAcademicYearSchema = z
  .object({
    name: z.string().min(4, "Name is required (e.g. 2024/2025)").max(32),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    isCurrent: z.boolean().optional(),
  })
  .refine((d) => d.endDate > d.startDate, {
    message: "endDate must be after startDate",
    path: ["endDate"],
  });

export const updateAcademicYearSchema = z.object({
  name: z.string().min(4).max(32).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export type CreateAcademicYearInput = z.infer<typeof createAcademicYearSchema>;
export type UpdateAcademicYearInput = z.infer<typeof updateAcademicYearSchema>;
