import { Router } from "express";
import { protect, authorize } from "../../middleware/auth.middleware";
import { UserRole } from "../../shared/types/auth.types";
import {
  createAssessment,
  listAssessments,
  enterMark,
  bulkEnterMarks,
  listAssessmentMarks,
  submitAssessmentMarks,
  getStudentResults,
  createPublishing,
  listPublishings,
  approvePublishing,
  schedulePublishing,
  createAppeal,
  listAppeals,
  proposeAppealChange,
  resolveAppeal,
} from "./results.controller";

const router = Router();
router.use(protect);

const teacher = authorize(UserRole.TEACHER, UserRole.ORG_ADMIN, UserRole.ORG_OWNER, UserRole.DIRECTOR);
const director = authorize(UserRole.DIRECTOR, UserRole.ORG_ADMIN, UserRole.ORG_OWNER);

// Assessments + mark entry (teachers/staff)
router.post("/assessments", teacher, createAssessment);
router.get("/assessments", teacher, listAssessments);
router.get("/assessments/:assessmentId/marks", teacher, listAssessmentMarks);
router.post("/assessments/:assessmentId/marks", teacher, enterMark);
router.post("/assessments/:assessmentId/marks/bulk", teacher, bulkEnterMarks);
router.post("/assessments/:assessmentId/submit", teacher, submitAssessmentMarks);

// Publishing (director/admin) — controls the time-lock
router.post("/publishings", director, createPublishing);
router.get("/publishings", director, listPublishings);
router.post("/publishings/:publishingId/approve", director, approvePublishing);
router.post("/publishings/:publishingId/schedule", director, schedulePublishing);

// Appeals: file (student/parent), propose (teacher), resolve (director)
router.post("/appeals", createAppeal);
router.get("/appeals", teacher, listAppeals);
router.post("/appeals/:appealId/propose", teacher, proposeAppealChange);
router.post("/appeals/:appealId/resolve", director, resolveAppeal);

// Time-locked results read (student/parent) — embargo enforced server-side
router.get("/students/:studentId/results", getStudentResults);

export default router;
