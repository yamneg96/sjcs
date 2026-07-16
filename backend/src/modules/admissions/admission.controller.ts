import { Response } from "express";
import { AuthRequest, UserRole } from "../../shared/types/auth.types";
import { AdmissionService } from "./admission.service";
import { submitApplicationSchema, updateStatusSchema, enrollSchema } from "./admission.validation";
import { sendSuccess } from "../../shared/utils/api-response";
import { asyncHandler } from "../../shared/utils/async-handler";
import { BadRequestError } from "../../shared/errors/errors";
import { AdmissionStatus } from "./admission.model";

/**
 * Submit a new admission application (accessible by parents/public portal users).
 */
export const submitApplication = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  if (!tenantId) throw new BadRequestError("Auth context required");

  const parsed = submitApplicationSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(parsed.error.errors[0].message);
  }

  const admission = await AdmissionService.submitApplication(tenantId, parsed.data);
  sendSuccess(res, admission, "Application submitted successfully", 201);
});

/**
 * Update an admission status (admin/owner only).
 */
export const updateStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  const reviewerId = req.user?.id;
  if (!tenantId || !reviewerId) throw new BadRequestError("Auth context required");

  // Restrict to admin/owner roles
  if (
    req.user?.role !== UserRole.ORG_ADMIN &&
    req.user?.role !== UserRole.ORG_OWNER &&
    req.user?.role !== UserRole.SUPER_ADMIN
  ) {
    throw new BadRequestError("Permission denied: admin access required");
  }

  const admissionId = req.params.admissionId as string;
  const parsed = updateStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(parsed.error.errors[0].message);
  }

  const admission = await AdmissionService.updateStatus(
    tenantId,
    admissionId,
    reviewerId as string,
    parsed.data
  );
  sendSuccess(res, admission, "Admission status updated successfully");
});

/**
 * List admissions with optional status filter (admin/owner only).
 */
export const listApplications = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  if (!tenantId) throw new BadRequestError("Auth context required");

  const status = req.query.status as AdmissionStatus | undefined;
  const page = parseInt(req.query.page as string || "1", 10);
  const limit = parseInt(req.query.limit as string || "20", 10);

  const result = await AdmissionService.listApplications(tenantId, { status, page, limit });
  sendSuccess(res, result, "Applications retrieved successfully");
});

/**
 * Get a single admission detail.
 */
export const getApplication = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  if (!tenantId) throw new BadRequestError("Auth context required");

  const admissionId = req.params.admissionId as string;
  const admission = await AdmissionService.getById(tenantId, admissionId);
  sendSuccess(res, admission, "Application retrieved successfully");
});

/**
 * Enroll an APPROVED applicant → creates a student record + section assignment.
 * Restricted to registrar/director/admin/owner.
 */
export const enrollApplicant = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  const actorId = req.user?.id;
  if (!tenantId || !actorId) throw new BadRequestError("Auth context required");

  const allowed = [
    UserRole.ORG_OWNER,
    UserRole.ORG_ADMIN,
    UserRole.DIRECTOR,
    UserRole.REGISTRAR,
    UserRole.SUPER_ADMIN,
  ];
  if (!req.user?.role || !allowed.includes(req.user.role)) {
    throw new BadRequestError("Permission denied: registrar/admin access required");
  }

  const parsed = enrollSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(parsed.error.errors[0].message);
  }

  const result = await AdmissionService.enroll(
    tenantId,
    req.params.admissionId as string,
    actorId as string,
    parsed.data
  );
  sendSuccess(res, result, "Applicant enrolled successfully", 201);
});

/**
 * Add a document to an existing admission application.
 */
export const addDocument = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  if (!tenantId) throw new BadRequestError("Auth context required");

  const admissionId = req.params.admissionId as string;
  const { fileName, fileUrl, fileType, mimeType } = req.body;

  if (!fileName || !fileUrl || !fileType || !mimeType) {
    throw new BadRequestError("fileName, fileUrl, fileType, and mimeType are required");
  }

  const admission = await AdmissionService.addDocument(tenantId, admissionId, {
    fileName,
    fileUrl,
    fileType,
    mimeType,
  });

  sendSuccess(res, admission, "Document added successfully");
});
