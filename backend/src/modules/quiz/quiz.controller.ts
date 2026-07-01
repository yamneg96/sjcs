import { Response } from "express";
import { QuizService } from "./quiz.service";
import { sendSuccess } from "../../shared/utils/api-response";
import { asyncHandler } from "../../shared/utils/async-handler";
import { getAccessibleGrades } from "../../utils/grade-access";
import { BadRequestError } from "../../shared/errors/errors";
import { AuthRequest } from "../../shared/types/auth.types";

export const generateQuiz = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  const studentId = req.user?.id;
  if (!tenantId || !studentId) {
    throw new BadRequestError("Auth context required");
  }

  const { topic } = req.body;
  if (!topic) {
    throw new BadRequestError("Topic is required");
  }

  const userGrade = req.user?.grades?.[0] || 9;
  const accessibleGrades = getAccessibleGrades(userGrade);

  const quiz = await QuizService.generateQuiz(
    tenantId,
    studentId as string,
    topic,
    accessibleGrades
  );

  sendSuccess(res, quiz, "Quiz generated successfully", 201);
});

export const submitQuiz = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  const studentId = req.user?.id;
  if (!tenantId || !studentId) {
    throw new BadRequestError("Auth context required");
  }

  const { quizId, answers } = req.body;
  if (!quizId || !Array.isArray(answers)) {
    throw new BadRequestError("quizId and answers array are required");
  }

  const result = await QuizService.submitQuiz(
    tenantId,
    quizId as string,
    studentId as string,
    answers
  );

  sendSuccess(res, result, "Quiz graded successfully");
});
