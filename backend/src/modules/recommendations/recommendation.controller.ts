import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { RecommendationService } from "./recommendation.service";
import { getAccessibleGrades } from "../../utils/grade-access";
import { sendSuccess, sendError } from "../../utils/api-response";

export const getRecommendations = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?.id) {
      sendError(res, "Unauthorized", 401);
      return;
    }

    const userGrade = req.user.grade || 9;
    const accessibleGrades = getAccessibleGrades(userGrade);

    const recommendations = await RecommendationService.getRecommendations(
      req.user.id,
      accessibleGrades
    );

    sendSuccess(res, { recommendations });
  } catch (err) {
    sendError(res, (err as Error).message, 500);
  }
};
