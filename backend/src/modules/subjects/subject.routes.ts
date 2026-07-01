import { Router } from "express";
import {
  createSubject,
  listSubjects,
  getSubject,
  updateSubject,
  deleteSubject,
} from "./subject.controller";
import { protect, authorize } from "../../middleware/auth.middleware";
import { UserRole } from "../../shared/types/auth.types";

const router = Router();

router.use(protect);

router.post("/", authorize(UserRole.ORG_OWNER, UserRole.ORG_ADMIN), createSubject);
router.get("/", listSubjects);
router.get("/:idOrSlug", getSubject);
router.put("/:subjectId", authorize(UserRole.ORG_OWNER, UserRole.ORG_ADMIN), updateSubject);
router.delete("/:subjectId", authorize(UserRole.ORG_OWNER, UserRole.ORG_ADMIN), deleteSubject);

export default router;
