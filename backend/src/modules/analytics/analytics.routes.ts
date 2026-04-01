import { Router } from "express";
import { getAnalytics } from "./analytics.controller";
import { protect } from "../../middleware/auth.middleware";

const router = Router();

router.get("/", protect, getAnalytics);

export default router;
