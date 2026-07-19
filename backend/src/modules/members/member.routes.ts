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
  getMyChildren,
} from "./member.controller";
import { protect, authorize } from "../../middleware/auth.middleware";
import { UserRole } from "../../shared/types/auth.types";

const router = Router();

router.use(protect);

// Parent portal — registered BEFORE the org-admin guard below so parents
// (who are not org admins) can read their own children.
router.get("/my-children", authorize(UserRole.PARENT), getMyChildren);

// Restrict the remaining member management endpoints to OrgOwner and OrgAdmin
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
