import { Request, Response } from "express";
import Material from "./material.model";
import { AuthRequest } from "../../middleware/auth.middleware";
import { getAccessibleGrades } from "../../utils/grade-access";
import { sendSuccess, sendError } from "../../utils/api-response";

export const getMaterials = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userGrade = authReq.user?.grade || 9;
    const accessibleGrades = getAccessibleGrades(userGrade);

    const { subject, type } = req.query;

    const filter: Record<string, unknown> = {
      grade: { $in: accessibleGrades },
    };

    if (subject && typeof subject === "string") {
      filter.subject = subject;
    }

    if (type && typeof type === "string") {
      filter.type = type;
    }

    const materials = await Material.find(filter).sort({ createdAt: -1 });

    sendSuccess(res, { materials, accessibleGrades });
  } catch (err) {
    sendError(res, (err as Error).message, 500);
  }
};
