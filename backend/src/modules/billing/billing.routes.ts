import { Router } from "express";
import { getUsage, addCredits } from "./billing.controller";
import { protect } from "../../middleware/auth.middleware";

const router = Router();

// All billing endpoints require authentication
router.use(protect);

router.get("/usage", getUsage);
router.post("/credits", addCredits);

export default router;
