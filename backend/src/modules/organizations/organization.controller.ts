import { Request, Response } from "express";
import { OrganizationService } from "./organization.service";
import { sendSuccess } from "../../shared/utils/api-response";
import { asyncHandler } from "../../shared/utils/async-handler";
import { updateOrganizationSchema, updateAIConfigSchema, verifySubscriptionSchema } from "./organization.validation";
import { BadRequestError } from "../../shared/errors/errors";
import { AuthRequest } from "../../shared/types/auth.types";

export const getMyOrganization = asyncHandler(async (req: AuthRequest, res: Response) => {
  const orgId = req.user?.tenantId;
  if (!orgId || orgId === "individual" || orgId === "platform") {
    throw new BadRequestError("Valid organization ID required in token context");
  }

  const organization = await OrganizationService.getOrganization({ id: orgId });
  sendSuccess(res, organization, "Organization retrieved successfully");
});

export const updateMyOrganization = asyncHandler(async (req: AuthRequest, res: Response) => {
  const orgId = req.user?.tenantId;
  if (!orgId || orgId === "individual" || orgId === "platform") {
    throw new BadRequestError("Valid organization ID required in token context");
  }

  const parsed = updateOrganizationSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(parsed.error.errors[0].message);
  }

  const organization = await OrganizationService.updateOrganization(orgId, parsed.data);
  sendSuccess(res, organization, "Organization updated successfully");
});

// Admin-Only endpoints (SuperAdmin configuring tenant limits)
export const updateAIConfig = asyncHandler(async (req: Request, res: Response) => {
  const { orgId } = req.params;
  const parsed = updateAIConfigSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(parsed.error.errors[0].message);
  }

  const organization = await OrganizationService.updateAIConfig(orgId as string, parsed.data);
  sendSuccess(res, organization, "Organization AI config updated successfully");
});

export const updateSubscription = asyncHandler(async (req: Request, res: Response) => {
  const { orgId } = req.params;
  const parsed = verifySubscriptionSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(parsed.error.errors[0].message);
  }

  const organization = await OrganizationService.updateSubscription(orgId as string, parsed.data);
  sendSuccess(res, organization, "Organization subscription updated successfully");
});
