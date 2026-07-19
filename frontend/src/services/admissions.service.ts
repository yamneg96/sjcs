import api from "./axios";
import type {
  ApiResponse,
  PaginatedResponse,
  IAdmission,
  AdmissionStatus,
  SubmitApplicationPayload,
  UpdateAdmissionStatusPayload,
  AddDocumentPayload,
} from "@/types/api.types";

/** Public application status (safe subset — no documents or reviewer notes). */
export interface ApplicationTracking {
  reference: string;
  studentName: string;
  gradeAppliedFor: number;
  status: AdmissionStatus;
  submittedAt: string;
  interviewDate?: string;
  interviewTime?: string;
  enrolled: boolean;
}

export const admissionsService = {
  list: (params?: { status?: AdmissionStatus; page?: number; limit?: number }) =>
    api.get<ApiResponse<PaginatedResponse<IAdmission>>>("/admissions", { params }),

  getById: (admissionId: string) =>
    api.get<ApiResponse<IAdmission>>(`/admissions/${admissionId}`),

  submit: (data: SubmitApplicationPayload) =>
    api.post<ApiResponse<IAdmission>>("/admissions", data),

  /** Public submission — no auth required. Uses org slug to identify tenant. */
  submitPublic: (orgSlug: string, data: SubmitApplicationPayload) =>
    api.post<ApiResponse<IAdmission>>(`/admissions/public/${orgSlug}`, data),

  /**
   * Public status tracking — no auth. Requires BOTH the reference and the
   * email used to apply; returns status only (never documents/notes).
   */
  track: (orgSlug: string, reference: string, email: string) =>
    api.get<ApiResponse<ApplicationTracking>>(`/admissions/public/${orgSlug}/track`, {
      params: { reference, email },
    }),

  updateStatus: (admissionId: string, data: UpdateAdmissionStatusPayload) =>
    api.patch<ApiResponse<IAdmission>>(`/admissions/${admissionId}/status`, data),

  addDocument: (admissionId: string, data: AddDocumentPayload) =>
    api.post<ApiResponse<IAdmission>>(`/admissions/${admissionId}/documents`, data),
};
