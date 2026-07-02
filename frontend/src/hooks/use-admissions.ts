import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { admissionsService } from "@/services/admissions.service";
import type { AdmissionStatus, SubmitApplicationPayload, UpdateAdmissionStatusPayload, AddDocumentPayload } from "@/types/api.types";

export function useAdmissions(filters?: { status?: AdmissionStatus; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["admissions", filters],
    queryFn: () => admissionsService.list(filters).then(r => r.data.data),
    placeholderData: (prev) => prev,
  });
}

export function useAdmission(admissionId: string) {
  return useQuery({
    queryKey: ["admissions", admissionId],
    queryFn: () => admissionsService.getById(admissionId).then(r => r.data.data),
    enabled: !!admissionId,
  });
}

export function useSubmitPublicApplication() {
  return useMutation({
    mutationFn: ({ orgSlug, data }: { orgSlug: string; data: SubmitApplicationPayload }) =>
      admissionsService.submitPublic(orgSlug, data).then(r => r.data.data),
  });
}

export function useUpdateAdmissionStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ admissionId, data }: { admissionId: string; data: UpdateAdmissionStatusPayload }) =>
      admissionsService.updateStatus(admissionId, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admissions"] }); },
  });
}

export function useAddDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ admissionId, data }: { admissionId: string; data: AddDocumentPayload }) =>
      admissionsService.addDocument(admissionId, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admissions"] }); },
  });
}
