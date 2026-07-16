import { Router } from "express";
import { protect, authorize } from "../../middleware/auth.middleware";
import { UserRole } from "../../shared/types/auth.types";
import {
  createAcademicYear,
  listAcademicYears,
  getCurrentAcademicYear,
  updateAcademicYear,
  setCurrentAcademicYear,
  closeAcademicYear,
} from "./academic-year.controller";

const router = Router();

router.use(protect);

// Read: any authenticated org member
router.get("/", listAcademicYears);
router.get("/current", getCurrentAcademicYear);

// Write: org administration + directors
const canManage = authorize(UserRole.ORG_OWNER, UserRole.ORG_ADMIN, UserRole.DIRECTOR);
router.post("/", canManage, createAcademicYear);
router.put("/:yearId", canManage, updateAcademicYear);
router.post("/:yearId/set-current", canManage, setCurrentAcademicYear);
router.post("/:yearId/close", canManage, closeAcademicYear);

export default router;
