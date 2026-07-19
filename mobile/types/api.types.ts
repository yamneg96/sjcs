// Must mirror the backend enum (backend/src/shared/types/auth.types.ts).
export enum UserRole {
  SUPER_ADMIN = "SuperAdmin",
  ORG_OWNER = "OrganizationOwner",
  ORG_ADMIN = "OrganizationAdmin",
  DIRECTOR = "Director",
  REGISTRAR = "Registrar",
  TEACHER = "Teacher",
  PARENT = "Parent",
  STUDENT = "Student",
  INDIVIDUAL = "Individual",
}

/** Roles the mobile app's UI is actually built for (§7.1/§38 — the student tutor). */
export const MOBILE_SUPPORTED_ROLES = [UserRole.STUDENT, UserRole.INDIVIDUAL] as const;

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface IUser {
  id: string;
  fullName: string;
  email?: string;
  studentId?: string;
  role: UserRole;
  tenantId: string;
  grade?: number;
  grades?: number[];
  status: "Active" | "Suspended" | "Pending";
}

export interface IQuizQuestion {
  question: string;
  options: string[];
  answer: string;
  userAnswer?: string;
}

export interface IQuiz {
  _id: string;
  tenantId: string;
  studentId: string;
  topic: string;
  questions: IQuizQuestion[];
  score: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface IStudyLog {
  _id: string;
  tenantId: string;
  studentId: string;
  question: string;
  answer: string;
  subject: string;
  gradeAccessed: number;
  createdAt: string;
}

export interface IMaterial {
  _id: string;
  tenantId: string;
  title: string;
  description?: string;
  url: string;
  fileType: string;
  subject: string;
  gradeLevel: number;
  uploadedBy: string;
  createdAt: string;
}
