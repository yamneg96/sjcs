// ============================================================
// Lumora Platform — Frontend Type Definitions
// Mirrors backend models exactly as the source of truth
// ============================================================

// --- API Envelope ---
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface PaginatedResponse<T> {
  results: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// --- Auth ---
// Must mirror the backend enum (backend/src/shared/types/auth.types.ts).
export const UserRole = {
  SUPER_ADMIN: "SuperAdmin",
  ORG_OWNER: "OrganizationOwner",
  ORG_ADMIN: "OrganizationAdmin",
  DIRECTOR: "Director",
  REGISTRAR: "Registrar",
  TEACHER: "Teacher",
  PARENT: "Parent",
  STUDENT: "Student",
  INDIVIDUAL: "Individual",
} as const;

// Create a matching TypeScript type from the object values
export type UserRole = typeof UserRole[keyof typeof UserRole];


export interface AuthUser {
  id: string;
  fullName: string;
  email?: string;
  role: UserRole;
  tenantId: string;
  grade?: number;
  grades?: number[];
  studentId?: string;
}

export interface LoginResponse {
  token: string;
  student: AuthUser; // backend returns "student" key for all user types
}

// --- Members ---
export interface IMember {
  _id: string;
  fullName: string;
  email?: string;
  studentId?: string;
  grade?: number;
  grades?: number[];
  role: UserRole;
  status: "Active" | "Pending" | "Suspended";
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentPayload {
  fullName: string;
  studentId: string;
  grade: number;
}

export interface ImportStudentsPayload {
  students: CreateStudentPayload[];
}

export interface CreateTeacherPayload {
  fullName: string;
  email: string;
  grades: number[];
}

// --- Admissions ---
export type AdmissionStatus =
  | "INQUIRY"
  | "PENDING_REVIEW"
  | "INTERVIEW_SCHEDULED"
  | "APPROVED"
  | "REJECTED"
  | "WAITLISTED";

export interface IAdmissionDocument {
  fileName: string;
  fileUrl: string;
  fileType: string;
  mimeType: string;
  uploadedAt: string;
}

export interface IAdmission {
  _id: string;
  tenantId: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  studentFirstName: string;
  studentLastName: string;
  studentDOB: string;
  studentGender: "male" | "female";
  gradeAppliedFor: number;
  documents: IAdmissionDocument[];
  status: AdmissionStatus;
  interviewDate?: string;
  interviewTime?: string;
  interviewNotes?: string;
  reviewerNotes?: string;
  reviewedBy?: string;
  previousSchool?: string;
  transferReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitApplicationPayload {
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  studentFirstName: string;
  studentLastName: string;
  studentDOB: string;
  studentGender: "male" | "female";
  gradeAppliedFor: number;
  previousSchool?: string;
  transferReason?: string;
}

export interface UpdateAdmissionStatusPayload {
  status: AdmissionStatus;
  interviewDate?: string;
  interviewTime?: string;
  interviewNotes?: string;
  reviewerNotes?: string;
}

export interface AddDocumentPayload {
  fileName: string;
  fileUrl: string;
  fileType: string;
  mimeType: string;
}

// --- Subjects ---
export interface ISubject {
  _id: string;
  name: string;
  code: string;
  slug: string;
  grade: number;
  description?: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubjectPayload {
  name: string;
  code: string;
  grade: number;
  description?: string;
}

// --- Materials ---
export type MaterialType = "pdf" | "video" | "markdown" | "link";

export interface IMaterial {
  _id: string;
  title: string;
  subjectId: ISubject | string;
  materialType: MaterialType;
  contentUrl?: string;
  textParsed?: string;
  tenantId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMaterialPayload {
  title: string;
  subjectId: string;
  materialType: MaterialType;
  contentUrl?: string;
  textParsed?: string;
}

// --- Organization ---
export interface IOrganization {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  address?: string;
  phone?: string;
  email?: string;
  ownerId: string;
  subscription: {
    plan: string;
    status: string;
    maxStudents: number;
    maxTeachers: number;
  };
  aiConfig?: {
    provider: string;
    model: string;
    maxTokens: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateOrgPayload {
  name?: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  address?: string;
  phone?: string;
  email?: string;
}

// --- Storage ---
export interface UploadResponse {
  fileUrl: string;
  storageKey: string;
}
