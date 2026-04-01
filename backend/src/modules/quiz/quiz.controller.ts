import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { QuizService } from "./quiz.service";
import { getAccessibleGrades } from "../../utils/grade-access";
import { sendSuccess, sendError } from "../../utils/api-response";

export const generateQuiz = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { topic } = req.body;
    if (!topic) {
      sendError(res, "Topic is required");
      return;
    }

    const userGrade = req.user?.grade || 9;
    const accessibleGrades = getAccessibleGrades(userGrade);
    
    if (!req.user?.id) {
       sendError(res, "Unauthorized", 401);
       return;
    }

    const quiz = await QuizService.generateQuiz(
      req.user.id,
      topic,
      accessibleGrades
    );

    sendSuccess(res, { quiz }, 201);
  } catch (err) {
    sendError(res, (err as Error).message, 500);
  }
};

export const submitQuiz = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { quizId, answers } = req.body;
    
    if (!quizId || !Array.isArray(answers)) {
      sendError(res, "quizId and answers array are required");
      return;
    }

    if (!req.user?.id) {
       sendError(res, "Unauthorized", 401);
       return;
    }

    const result = await QuizService.submitQuiz(quizId, req.user.id, answers);
    sendSuccess(res, { result });
  } catch (err) {
    sendError(res, (err as Error).message, 500);
  }
};
