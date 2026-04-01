import { Request, Response } from "express";
import { askSupportAI } from "./support.service";

export const handleSupportAI = async (req: Request, res: Response) => {
  const { question } = req.body;

  const answer = await askSupportAI(question);

  res.json({ answer });
};