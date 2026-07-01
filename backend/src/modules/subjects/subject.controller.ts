import { Response } from "express";
import { SubjectService } from "./subject.service";
import { sendSuccess } from "../../shared/utils/api-response";
import { asyncHandler } from "../../shared/utils/async-handler";
import { createSubjectSchema, updateSubjectSchema } from "./subject.validation";
import { BadRequestError, UnauthorizedError } from "../../shared/errors/errors";
import { AuthRequest } from "../../shared/types/auth.types";

export const createSubject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  const userId = req.user?.id;
  if (!tenantId || !userId) throw new BadRequestError("Auth context required");

  const parsed = createSubjectSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(parsed.error.errors[0].message);
  }

  const subject = await SubjectService.createSubject(tenantId, userId, parsed.data);
  sendSuccess(res, subject, "Subject created successfully", 201);
});

export const listSubjects = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  if (!tenantId) throw new BadRequestError("Auth context required");

  // Filter subjects by student/teacher grade level permissions
  const allowedGrades = req.user?.grades || [];
  const subjects = await SubjectService.listSubjects(tenantId, allowedGrades);
  sendSuccess(res, subjects, "Subjects retrieved successfully");
});

export const getSubject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  const { idOrSlug } = req.params;
  if (!tenantId) throw new BadRequestError("Auth context required");

  const subject = await SubjectService.getSubject(tenantId, idOrSlug as string);
  sendSuccess(res, subject, "Subject details retrieved");
});

export const updateSubject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  const { subjectId } = req.params;
  if (!tenantId) throw new BadRequestError("Auth context required");

  const parsed = updateSubjectSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(parsed.error.errors[0].message);
  }

  const subject = await SubjectService.updateSubject(tenantId, subjectId as string, parsed.data);
  sendSuccess(res, subject, "Subject updated successfully");
});

export const deleteSubject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  const { subjectId } = req.params;
  if (!tenantId) throw new BadRequestError("Auth context required");

  await SubjectService.deleteSubject(tenantId, subjectId as string);
  sendSuccess(res, null, "Subject deleted successfully");
});
