import { Router, Request, Response } from "express";
import { protect } from "../../middleware/auth.middleware";
import {
  submitApplication,
  updateStatus,
  listApplications,
  getApplication,
  addDocument,
} from "./admission.controller";
import { submitApplicationSchema } from "./admission.validation";
import { AdmissionService } from "./admission.service";
import { sendSuccess } from "../../shared/utils/api-response";
import { asyncHandler } from "../../shared/utils/async-handler";
import { BadRequestError, NotFoundError } from "../../shared/errors/errors";
import Organization from "../organizations/organization.model";

const router = Router();

/**
 * PUBLIC ROUTE — No authentication required.
 * Parents/students submit applications via the public portal.
 * The org is identified by its slug so we can resolve the tenantId.
 */
router.post(
  "/public/:orgSlug",
  asyncHandler(async (req: Request, res: Response) => {
    const { orgSlug } = req.params;

    // Resolve org slug → tenantId
    const org = await Organization.findOne({ slug: orgSlug }).lean();
    if (!org) throw new NotFoundError("Organization not found");

    const parsed = submitApplicationSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new BadRequestError(parsed.error.errors[0].message);
    }

    const admission = await AdmissionService.submitApplication(
      org.tenantId,
      parsed.data
    );
    sendSuccess(res, admission, "Application submitted successfully", 201);
  })
);

// ── Protected routes (require JWT) ──
router.use(protect);

// Application submission (authenticated parents/users)
router.post("/", submitApplication);

// Admin operations
router.get("/", listApplications);
router.get("/:admissionId", getApplication);
router.patch("/:admissionId/status", updateStatus);
router.post("/:admissionId/documents", addDocument);

export default router;
