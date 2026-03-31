import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { askLIS, getHistory, startSession, endSession } from "./lis.controller";

const router = Router();

// All LIS routes require authentication
router.use(protect);

router.post("/ask", askLIS);
router.get("/history", getHistory);
router.post("/session/start", startSession);
router.post("/session/end", endSession);

export default router;
