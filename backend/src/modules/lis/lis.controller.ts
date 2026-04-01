import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import StudyLog from "../learning/studylog.model";
import { getAccessibleGrades } from "../../utils/grade-access";
import { sendSuccess, sendError } from "../../utils/api-response";
import { askLISSchema } from "./lis.validation";
import { LISService } from "./lis.service";

export const askLIS = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const parsed = askLISSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, parsed.error.errors[0].message);
      return;
    }

    const { question, subject } = parsed.data;
    const userGrade = req.user?.grade || 9;
    const accessibleGrades = getAccessibleGrades(userGrade);

    if (!req.user?.id) {
      sendError(res, "Unauthorized", 401);
      return;
    }

    const aiResponse = await LISService.askLIS(
      req.user.id,
      question,
      subject || "general",
      userGrade,
      accessibleGrades
    );

    sendSuccess(res, {
      answer: aiResponse,
      subject: subject || "general",
      accessibleGrades,
    });
  } catch (err) {
    sendError(res, (err as Error).message, 500);
  }
};

export const getHistory = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      sendError(res, "Unauthorized", 401);
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      StudyLog.find({ studentId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      StudyLog.countDocuments({ studentId }),
    ]);

    sendSuccess(res, {
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    sendError(res, (err as Error).message, 500);
  }
};

export const startSession = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { subject } = req.body;
    sendSuccess(res, {
      sessionId: `session_${Date.now()}`,
      subject: subject || "general",
      startedAt: new Date().toISOString(),
    });
  } catch (err) {
    sendError(res, (err as Error).message, 500);
  }
};

export const endSession = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { sessionId, duration } = req.body;
    sendSuccess(res, {
      sessionId,
      duration,
      endedAt: new Date().toISOString(),
      message: "Study session recorded successfully",
    });
  } catch (err) {
    sendError(res, (err as Error).message, 500);
  }
};
