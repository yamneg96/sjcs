import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { AnalyticsService } from "./analytics.service";
import { sendSuccess, sendError } from "../../utils/api-response";

export const getAnalytics = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?.id) {
      sendError(res, "Unauthorized", 401);
      return;
    }

    const analytics = await AnalyticsService.getStudentAnalytics(req.user.id);

    sendSuccess(res, { analytics });
  } catch (err) {
    sendError(res, (err as Error).message, 500);
  }
};
