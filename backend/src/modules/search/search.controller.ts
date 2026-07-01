import { Response } from "express";
import { AuthRequest } from "../../shared/types/auth.types";
import { SearchService } from "./search.service";
import { getAccessibleGrades } from "../../utils/grade-access";
import { sendSuccess } from "../../shared/utils/api-response";
import { asyncHandler } from "../../shared/utils/async-handler";
import { BadRequestError } from "../../shared/errors/errors";

export const searchAll = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  if (!tenantId) {
    throw new BadRequestError("Auth context required");
  }

  const query = req.query.q as string;
  if (!query || query.trim().length === 0) {
    throw new BadRequestError("Search query parameter (q) is required");
  }

  const userGrade = req.user?.grades?.[0] || 9;
  const accessibleGrades = getAccessibleGrades(userGrade);

  const results = await SearchService.searchAll(tenantId, query, accessibleGrades);
  sendSuccess(res, results, "Global search completed successfully");
});
