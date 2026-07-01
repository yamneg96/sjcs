import { Response } from "express";
import { AuthRequest } from "../../shared/types/auth.types";
import StudyLog from "../learning/studylog.model";
import { getAccessibleGrades } from "../../utils/grade-access";
import { sendSuccess } from "../../shared/utils/api-response";
import { asyncHandler } from "../../shared/utils/async-handler";
import { LISService } from "./lis.service";
import { BadRequestError } from "../../shared/errors/errors";
import { askLISSchema } from "./lis.validation";

export const askLIS = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  const studentId = req.user?.id;

  if (!tenantId || !studentId) {
    throw new BadRequestError("Auth context required");
  }

  const parsed = askLISSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(parsed.error.errors[0].message);
  }

  const { question, subject } = parsed.data;
  const userGrade = req.user?.grades?.[0] || 9;
  const accessibleGrades = getAccessibleGrades(userGrade);

  const aiResponse = await LISService.askLIS(
    tenantId,
    studentId as string,
    question,
    subject || "general",
    userGrade,
    accessibleGrades
  );

  sendSuccess(res, {
    answer: aiResponse,
    subject: subject || "general",
    accessibleGrades,
  }, "L.I.S. tutor assistant response matched");
});

export const getHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  const studentId = req.user?.id;

  if (!tenantId || !studentId) {
    throw new BadRequestError("Auth context required");
  }

  const page = parseInt(req.query.page as string || "1", 10);
  const limit = parseInt(req.query.limit as string || "20", 10);
  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    StudyLog.find({ tenantId, studentId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    StudyLog.countDocuments({ tenantId, studentId }),
  ]);

  sendSuccess(res, {
    logs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }, "Study logs retrieved successfully");
});

export const startSession = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { subject } = req.body;
  sendSuccess(res, {
    sessionId: `session_${Date.now()}`,
    subject: subject || "general",
    startedAt: new Date().toISOString(),
  }, "Study session started");
});

export const endSession = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { sessionId, duration } = req.body;
  sendSuccess(res, {
    sessionId,
    duration,
    endedAt: new Date().toISOString(),
    message: "Study session recorded successfully",
  }, "Study session ended");
});
