import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { membersService } from "@/services/members.service";
import type { CreateStudentPayload, ImportStudentsPayload, CreateTeacherPayload } from "@/types/api.types";

// ── Queries ──
export function useStudents(page = 1, limit = 10, search = "") {
  return useQuery({
    queryKey: ["students", page, limit, search],
    queryFn: () => membersService.listStudents(page, limit, search).then(r => r.data.data),
    placeholderData: (prev) => prev,
  });
}

export function useTeachers(page = 1, limit = 10, search = "") {
  return useQuery({
    queryKey: ["teachers", page, limit, search],
    queryFn: () => membersService.listTeachers(page, limit, search).then(r => r.data.data),
    placeholderData: (prev) => prev,
  });
}

// ── Mutations ──
export function useCreateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStudentPayload) => membersService.createStudent(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["students"] }); },
  });
}

export function useImportStudents() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ImportStudentsPayload) => membersService.importStudents(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["students"] }); },
  });
}

export function useCreateTeacher() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTeacherPayload) => membersService.createTeacher(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["teachers"] }); },
  });
}

export function useSuspendMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (memberId: string) => membersService.suspendMember(memberId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
      qc.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
}

export function useActivateMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (memberId: string) => membersService.activateMember(memberId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
      qc.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
}

export function useResetStudentPassword() {
  return useMutation({
    mutationFn: ({ studentId, password }: { studentId: string; password: string }) =>
      membersService.resetStudentPassword(studentId, password),
  });
}
