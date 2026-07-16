import { Response } from "express";
import { SubjectService } from "./subject.service";
import { sendSuccess } from "../../shared/utils/api-response";
import { asyncHandler } from "../../shared/utils/async-handler";
import { createSubjectSchema, updateSubjectSchema } from "./subject.validation";
import { BadRequestError } from "../../shared/errors/errors";
import { AuthRequest } from "../../shared/types/auth.types";

// Tenant scoping is enforced by the TenantRepository via request context; the
// `protect` middleware guarantees an authenticated tenant is present.
export const createSubject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new BadRequestError("Auth context required");

  const parsed = createSubjectSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(parsed.error.errors[0].message);
  }

  const subject = await SubjectService.createSubject(userId, parsed.data);
  sendSuccess(res, subject, "Subject created successfully", 201);
});

export const listSubjects = asyncHandler(async (req: AuthRequest, res: Response) => {
  // Filter subjects by student/teacher grade level permissions
  const allowedGrades = req.user?.grades || [];
  const subjects = await SubjectService.listSubjects(allowedGrades);
  sendSuccess(res, subjects, "Subjects retrieved successfully");
});

export const getSubject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { idOrSlug } = req.params;
  const subject = await SubjectService.getSubject(idOrSlug as string);
  sendSuccess(res, subject, "Subject details retrieved");
});

export const updateSubject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { subjectId } = req.params;

  const parsed = updateSubjectSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(parsed.error.errors[0].message);
  }

  const subject = await SubjectService.updateSubject(subjectId as string, parsed.data);
  sendSuccess(res, subject, "Subject updated successfully");
});

export const deleteSubject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { subjectId } = req.params;
  await SubjectService.deleteSubject(subjectId as string);
  sendSuccess(res, null, "Subject deleted successfully");
});
