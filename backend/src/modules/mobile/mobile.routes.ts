import { Router } from "express";
import multer from "multer";
import { protect } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../shared/utils/async-handler";
import {
  getModels,
  registerDevice,
  aiComplete,
  aiTranscribe,
  syncLearningEvents,
} from "./mobile.controller";

/**
 * Mobile BFF (§16.4) — the only surface the Lumora Tutor app talks to for
 * model discovery, device profiles, the cloud AI path, speech, and offline sync.
 */
const router = Router();

// Audio is held in memory and handed straight to the AI Gateway — voice clips
// are never written to disk (§47.2 data minimisation).
const audioUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB ≈ a few minutes of speech
});

router.use(protect);

router.get("/models", asyncHandler(getModels));
router.post("/devices", asyncHandler(registerDevice));
router.post("/ai/complete", asyncHandler(aiComplete));
router.post("/ai/transcribe", audioUpload.single("audio"), asyncHandler(aiTranscribe));
router.post("/sync/learning-events", asyncHandler(syncLearningEvents));

export default router;
