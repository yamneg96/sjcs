import { Request, Response } from "express";
import { askSupportAI } from "./support.service";
import { sendSuccess, sendError } from "../../utils/api-response";

export const handleSupportAI = async (req: Request, res: Response) => {
  try {
    const { question } = req.body;

    if (!question) {
      sendError(res, "Question is required", 400);
      return;
    }

    const answer = await askSupportAI(question);
    sendSuccess(res, { answer });
  } catch (err: any) {
    console.error("Support AI Error:", err);
    sendError(res, err.message || "Failed to get response from Digital Assistant", 500);
  }
};