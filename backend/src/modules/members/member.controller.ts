import { Response } from "express";
import { MemberService } from "./member.service";
import { sendSuccess } from "../../shared/utils/api-response";
import { asyncHandler } from "../../shared/utils/async-handler";
import { createStudentSchema, importStudentsSchema, createTeacherSchema, resetStudentPasswordSchema } from "./member.validation";
import { BadRequestError } from "../../shared/errors/errors";
import { AuthRequest, UserRole } from "../../shared/types/auth.types";

export const createStudent = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  if (!tenantId) throw new BadRequestError("Auth tenant context required");

  const parsed = createStudentSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(parsed.error.errors[0].message);
  }

  const student = await MemberService.createStudent(tenantId, parsed.data);
  sendSuccess(res, { id: student._id, fullName: student.fullName, studentId: student.studentId }, "Student created successfully", 201);
});

/**
 * Parent portal: the children linked to the requesting parent (§32).
 */
export const getMyChildren = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  const parentId = req.user?.id;
  if (!tenantId || !parentId) throw new BadRequestError("Auth context required");

  const children = await MemberService.getMyChildren(tenantId, parentId);
  sendSuccess(res, children, "Children retrieved successfully");
});

export const importStudents = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  if (!tenantId) throw new BadRequestError("Auth tenant context required");

  const parsed = importStudentsSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(parsed.error.errors[0].message);
  }

  const result = await MemberService.importStudents(tenantId, parsed.data.students);
  sendSuccess(res, result, `Import finished. Successfully imported ${result.importedCount} students.`);
});

export const createTeacher = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  if (!tenantId) throw new BadRequestError("Auth tenant context required");

  const parsed = createTeacherSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(parsed.error.errors[0].message);
  }

  const teacher = await MemberService.createTeacher(tenantId, parsed.data);
  sendSuccess(res, { id: teacher._id, fullName: teacher.fullName, email: teacher.email }, "Teacher created successfully. Verification email sent.", 201);
});

export const suspendMember = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  const { memberId } = req.params;
  if (!tenantId) throw new BadRequestError("Auth tenant context required");

  const member = await MemberService.suspendMember(tenantId, memberId as string);
  sendSuccess(res, { id: member._id, status: member.status }, "Member account suspended successfully");
});

export const activateMember = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  const { memberId } = req.params;
  if (!tenantId) throw new BadRequestError("Auth tenant context required");

  const member = await MemberService.activateMember(tenantId, memberId as string);
  sendSuccess(res, { id: member._id, status: member.status }, "Member account activated successfully");
});

export const resetStudentPassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  const { studentId } = req.params;
  if (!tenantId) throw new BadRequestError("Auth tenant context required");

  const parsed = resetStudentPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(parsed.error.errors[0].message);
  }

  await MemberService.resetStudentPassword(tenantId, studentId as string, parsed.data.password);
  sendSuccess(res, null, "Student password updated successfully");
});

export const listTeachers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  if (!tenantId) throw new BadRequestError("Auth tenant context required");

  const page = parseInt(req.query.page as string || "1", 10);
  const limit = parseInt(req.query.limit as string || "10", 10);
  const search = req.query.search as string || "";

  const result = await MemberService.listMembers(tenantId, UserRole.TEACHER, page, limit, search);
  sendSuccess(res, result, "Teachers list retrieved");
});

export const listStudents = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  if (!tenantId) throw new BadRequestError("Auth tenant context required");

  const page = parseInt(req.query.page as string || "1", 10);
  const limit = parseInt(req.query.limit as string || "10", 10);
  const search = req.query.search as string || "";

  const result = await MemberService.listMembers(tenantId, UserRole.STUDENT, page, limit, search);
  sendSuccess(res, result, "Students list retrieved");
});
