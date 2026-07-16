import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../shared/utils/async-handler";
import {
  getModels,
  registerDevice,
  aiComplete,
  syncLearningEvents,
} from "./mobile.controller";

/**
 * Mobile BFF (§16.4) — the only surface the Lumora Tutor app talks to for
 * model discovery, device profiles, the cloud AI path, and offline sync.
 */
const router = Router();

router.use(protect);

router.get("/models", asyncHandler(getModels));
router.post("/devices", asyncHandler(registerDevice));
router.post("/ai/complete", asyncHandler(aiComplete));
router.post("/sync/learning-events", asyncHandler(syncLearningEvents));

export default router;
