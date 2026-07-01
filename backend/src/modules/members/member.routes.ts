import { Router } from "express";
import {
  createStudent,
  importStudents,
  createTeacher,
  suspendMember,
  activateMember,
  resetStudentPassword,
  listTeachers,
  listStudents,
} from "./member.controller";
import { protect, authorize } from "../../middleware/auth.middleware";
import { UserRole } from "../../shared/types/auth.types";

const router = Router();

// Restrict all member management endpoints to OrgOwner and OrgAdmin
router.use(protect);
router.use(authorize(UserRole.ORG_OWNER, UserRole.ORG_ADMIN));

// Single member additions
router.post("/students", createStudent);
router.post("/teachers", createTeacher);

// Bulk student uploads
router.post("/students/import", importStudents);

// Member listing lookup
router.get("/students", listStudents);
router.get("/teachers", listTeachers);

// Member controls (suspension, directly resetting student password)
router.put("/:memberId/suspend", suspendMember);
router.put("/:memberId/activate", activateMember);
router.put("/students/:studentId/reset-password", resetStudentPassword);

export default router;
