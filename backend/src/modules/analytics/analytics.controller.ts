import { Response } from "express";
import { AuthRequest } from "../../shared/types/auth.types";
import { AnalyticsService } from "./analytics.service";
import { sendSuccess } from "../../shared/utils/api-response";
import { asyncHandler } from "../../shared/utils/async-handler";
import { BadRequestError } from "../../shared/errors/errors";

export const getAnalytics = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  const studentId = req.user?.id;
  
  if (!tenantId || !studentId) {
    throw new BadRequestError("Auth context required");
  }

  const analytics = await AnalyticsService.getStudentAnalytics(tenantId, studentId as string);

  sendSuccess(res, { analytics }, "Analytics retrieved successfully");
});
