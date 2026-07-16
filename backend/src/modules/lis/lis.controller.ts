import { Response } from "express";
import { AuthRequest } from "../../shared/types/auth.types";
import StudyLog from "../learning/studylog.model";
import StudySession from "./study-session.model";
import { getAccessibleGrades } from "../../utils/grade-access";
import { sendSuccess } from "../../shared/utils/api-response";
import { asyncHandler } from "../../shared/utils/async-handler";
import { LISService } from "./lis.service";
import { BadRequestError, NotFoundError } from "../../shared/errors/errors";
import { askLISSchema, startSessionSchema, endSessionSchema } from "./lis.validation";

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
  const tenantId = req.user?.tenantId;
  const studentId = req.user?.id;
  if (!tenantId || !studentId) {
    throw new BadRequestError("Auth context required");
  }

  const parsed = startSessionSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(parsed.error.errors[0].message);
  }

  const startedAt = new Date();
  const session = await StudySession.create({
    tenantId,
    studentId,
    subject: parsed.data.subject,
    startedAt,
  });

  sendSuccess(res, {
    sessionId: session._id.toString(),
    subject: session.subject,
    startedAt: startedAt.toISOString(),
  }, "Study session started");
});

export const endSession = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  const studentId = req.user?.id;
  if (!tenantId || !studentId) {
    throw new BadRequestError("Auth context required");
  }

  const parsed = endSessionSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(parsed.error.errors[0].message);
  }
  const { sessionId, duration } = parsed.data;

  const endedAt = new Date();
  const session = await StudySession.findOneAndUpdate(
    { _id: sessionId, tenantId, studentId },
    { $set: { endedAt, durationSeconds: duration } },
    { new: true }
  );
  if (!session) {
    throw new NotFoundError("Study session not found");
  }

  sendSuccess(res, {
    sessionId: session._id.toString(),
    duration: session.durationSeconds,
    endedAt: endedAt.toISOString(),
    message: "Study session recorded successfully",
  }, "Study session ended");
});
