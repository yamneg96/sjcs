import { Router } from "express";
import { askPublicAI, askAI } from "./rag.controller";
import { protect } from "../../middleware/auth.middleware";

const router = Router();

router.post("/public", askPublicAI);
router.post("/ask", protect, askAI);

export default router;
