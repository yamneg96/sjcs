import { Request, Response } from "express";
import { sendSuccess, sendError } from "../../utils/api-response";

export const askPublicAI = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== "string") {
      sendError(res, "Question is required");
      return;
    }

    // Mock response — will be replaced with actual RAG pipeline
    sendSuccess(res, {
      answer:
        "Welcome to the SJCS AI Assistant! I can help you learn about Saint Joseph Catholic School, our programs, admissions process, and campus life. The full RAG system is being configured to provide detailed, curriculum-specific responses.",
      source: "public",
    });
  } catch (err) {
    sendError(res, (err as Error).message, 500);
  }
};
