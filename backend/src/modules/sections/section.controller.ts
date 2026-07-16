import { Response } from "express";
import { AuthRequest } from "../../shared/types/auth.types";
import { sendSuccess } from "../../shared/utils/api-response";
import { asyncHandler } from "../../shared/utils/async-handler";
import { BadRequestError } from "../../shared/errors/errors";
import { SectionService } from "./section.service";
import { createSectionSchema, updateSectionSchema } from "./section.validation";

export const createSection = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new BadRequestError("Auth context required");

  const parsed = createSectionSchema.safeParse(req.body);
  if (!parsed.success) throw new BadRequestError(parsed.error.errors[0].message);

  const section = await SectionService.create(userId, parsed.data);
  sendSuccess(res, section, "Section created", 201);
});

export const listSections = asyncHandler(async (req: AuthRequest, res: Response) => {
  const academicYearId = req.query.academicYearId as string | undefined;
  const grade = req.query.grade ? Number(req.query.grade) : undefined;
  const list = await SectionService.list({ academicYearId, grade });
  sendSuccess(res, list, "Sections retrieved");
});

export const getSection = asyncHandler(async (req: AuthRequest, res: Response) => {
  const section = await SectionService.get(req.params.sectionId as string);
  sendSuccess(res, section, "Section details");
});

export const updateSection = asyncHandler(async (req: AuthRequest, res: Response) => {
  const parsed = updateSectionSchema.safeParse(req.body);
  if (!parsed.success) throw new BadRequestError(parsed.error.errors[0].message);

  const section = await SectionService.update(req.params.sectionId as string, parsed.data);
  sendSuccess(res, section, "Section updated");
});

export const deleteSection = asyncHandler(async (req: AuthRequest, res: Response) => {
  await SectionService.remove(req.params.sectionId as string);
  sendSuccess(res, null, "Section deleted");
});
