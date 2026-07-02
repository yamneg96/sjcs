import api from "./axios";
import type {
  ApiResponse,
  PaginatedResponse,
  IMember,
  CreateStudentPayload,
  ImportStudentsPayload,
  CreateTeacherPayload,
} from "@/types/api.types";

export const membersService = {
  // ── Students ──
  listStudents: (page = 1, limit = 10, search = "") =>
    api.get<ApiResponse<PaginatedResponse<IMember>>>("/members/students", {
      params: { page, limit, search },
    }),

  createStudent: (data: CreateStudentPayload) =>
    api.post<ApiResponse<{ id: string; fullName: string; studentId: string }>>(
      "/members/students",
      data
    ),

  importStudents: (data: ImportStudentsPayload) =>
    api.post<ApiResponse<{ importedCount: number; errors: string[] }>>(
      "/members/students/import",
      data
    ),

  // ── Teachers ──
  listTeachers: (page = 1, limit = 10, search = "") =>
    api.get<ApiResponse<PaginatedResponse<IMember>>>("/members/teachers", {
      params: { page, limit, search },
    }),

  createTeacher: (data: CreateTeacherPayload) =>
    api.post<ApiResponse<{ id: string; fullName: string; email: string }>>(
      "/members/teachers",
      data
    ),

  // ── Member Controls ──
  suspendMember: (memberId: string) =>
    api.put<ApiResponse<{ id: string; status: string }>>(
      `/members/${memberId}/suspend`
    ),

  activateMember: (memberId: string) =>
    api.put<ApiResponse<{ id: string; status: string }>>(
      `/members/${memberId}/activate`
    ),

  resetStudentPassword: (studentId: string, password: string) =>
    api.put<ApiResponse<null>>(`/members/students/${studentId}/reset-password`, {
      password,
    }),
};
