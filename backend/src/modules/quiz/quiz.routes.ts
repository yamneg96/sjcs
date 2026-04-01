import { Router } from "express";
import { generateQuiz, submitQuiz } from "./quiz.controller";
import { protect } from "../../middleware/auth.middleware";

const router = Router();

router.post("/generate", protect, generateQuiz);
router.post("/submit", protect, submitQuiz);

export default router;
