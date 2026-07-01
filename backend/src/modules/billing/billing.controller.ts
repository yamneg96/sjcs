import { Response } from "express";
import { AuthRequest, UserRole } from "../../shared/types/auth.types";
import { BillingService } from "./billing.service";
import { sendSuccess } from "../../shared/utils/api-response";
import { asyncHandler } from "../../shared/utils/async-handler";
import { BadRequestError } from "../../shared/errors/errors";

export const getUsage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  if (!tenantId) {
    throw new BadRequestError("Auth context required");
  }

  const usageData = await BillingService.getUsage(tenantId);
  sendSuccess(res, usageData, "Billing usage data retrieved");
});

export const addCredits = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  if (!tenantId) {
    throw new BadRequestError("Auth context required");
  }

  const { credits } = req.body;
  const parsedCredits = parseInt(credits, 10);
  if (isNaN(parsedCredits) || parsedCredits <= 0) {
    throw new BadRequestError("Valid positive number of credits is required");
  }

  // Restrict credits refueling to org owners/admins
  if (
    req.user?.role !== UserRole.ORG_ADMIN &&
    req.user?.role !== UserRole.ORG_OWNER &&
    req.user?.role !== UserRole.SUPER_ADMIN
  ) {
    throw new BadRequestError("Permission denied: super-admin or manager access required");
  }

  const updatedOrg = await BillingService.addCredits(tenantId, parsedCredits);
  sendSuccess(res, {
    monthlyUsageLimit: updatedOrg.aiConfig?.monthlyUsageLimit,
    currentMonthlyUsage: updatedOrg.aiConfig?.currentMonthlyUsage,
  }, "Organization AI credits updated successfully");
});
