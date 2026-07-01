import { Response } from "express";
import { AuthRequest } from "../../shared/types/auth.types";
import { RecommendationService } from "./recommendation.service";
import { getAccessibleGrades } from "../../utils/grade-access";
import { sendSuccess } from "../../shared/utils/api-response";
import { asyncHandler } from "../../shared/utils/async-handler";
import { BadRequestError } from "../../shared/errors/errors";

export const getRecommendations = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  const studentId = req.user?.id;

  if (!tenantId || !studentId) {
    throw new BadRequestError("Auth context required");
  }

  const userGrade = req.user?.grades?.[0] || 9;
  const accessibleGrades = getAccessibleGrades(userGrade);

  const recommendations = await RecommendationService.getRecommendations(
    tenantId,
    studentId as string,
    accessibleGrades
  );

  sendSuccess(res, { recommendations }, "Recommendations retrieved successfully");
});
