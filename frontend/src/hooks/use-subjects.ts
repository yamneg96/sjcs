import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subjectsService } from "@/services/subjects.service";
import type { CreateSubjectPayload } from "@/types/api.types";

export function useSubjects() {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: () => subjectsService.list().then(r => r.data.data),
  });
}

export function useCreateSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSubjectPayload) => subjectsService.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["subjects"] }); },
  });
}

export function useDeleteSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (subjectId: string) => subjectsService.delete(subjectId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["subjects"] }); },
  });
}
