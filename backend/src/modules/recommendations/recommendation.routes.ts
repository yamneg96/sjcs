import { Router } from "express";
import { getRecommendations } from "./recommendation.controller";
import { protect } from "../../middleware/auth.middleware";

const router = Router();

router.get("/", protect, getRecommendations);

export default router;
