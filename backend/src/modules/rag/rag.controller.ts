import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { sendSuccess, sendError } from "../../utils/api-response";
import { RAGService } from "./rag.service";
import { getAccessibleGrades } from "../../utils/grade-access";

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

    // Since this is public, we fetch general/public material without grade restrictions (or grade 12 to query most)
    const contextDocs = await RAGService.findRelevantContext(question, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    const contextText = contextDocs.map((doc: any) => doc.content).join("\n\n");

    const prompt = `You are an AI assistant for Saint Joseph Catholic School. Be helpful and polite.
    Context from our school documents:
    ${contextText}

    User Question: ${question}
    Answer based on the context above. If you don't know, state that you don't have enough information.`;

    const answer = await RAGService.generateAnswer(prompt);

    sendSuccess(res, { answer, source: "public" });
  } catch (err) {
    sendError(res, (err as Error).message, 500);
  }
};

export const askAI = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { question, subject } = req.body;
    const userGrade = req.user?.grade || 9;
    const accessibleGrades = getAccessibleGrades(userGrade);

    if (!question) {
      sendError(res, "Question is required");
      return;
    }

    const contextDocs = await RAGService.findRelevantContext(question, accessibleGrades, subject);
    const contextText = contextDocs.map((doc: any) => doc.content).join("\n\n");

    const prompt = `You are an educational assistant. Provide an answer to the student's question using the provided context.
    Context:
    ${contextText}

    Student Grade: ${userGrade}
    Subject: ${subject || "General"}
    Question: ${question}

    Keep it appropriate for a grade ${userGrade} student.`;

    const answer = await RAGService.generateAnswer(prompt);

    sendSuccess(res, { answer, matches: contextDocs.length, subject });
  } catch (err) {
    sendError(res, (err as Error).message, 500);
  }
};
