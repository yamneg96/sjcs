import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import {
  submitApplication,
  updateStatus,
  listApplications,
  getApplication,
  addDocument,
} from "./admission.controller";

const router = Router();

// All admission routes require authentication
router.use(protect);

// Application submission (parents/users)
router.post("/", submitApplication);

// Admin operations
router.get("/", listApplications);
router.get("/:admissionId", getApplication);
router.patch("/:admissionId/status", updateStatus);
router.post("/:admissionId/documents", addDocument);

export default router;
