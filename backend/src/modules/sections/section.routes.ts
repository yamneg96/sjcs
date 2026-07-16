import { Router } from "express";
import { protect, authorize } from "../../middleware/auth.middleware";
import { UserRole } from "../../shared/types/auth.types";
import {
  createSection,
  listSections,
  getSection,
  updateSection,
  deleteSection,
} from "./section.controller";

const router = Router();

router.use(protect);

router.get("/", listSections);
router.get("/:sectionId", getSection);

const canManage = authorize(UserRole.ORG_OWNER, UserRole.ORG_ADMIN, UserRole.DIRECTOR, UserRole.REGISTRAR);
router.post("/", canManage, createSection);
router.put("/:sectionId", canManage, updateSection);
router.delete("/:sectionId", canManage, deleteSection);

export default router;
