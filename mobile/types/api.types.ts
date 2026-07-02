export enum UserRole {
  SUPER_ADMIN = "SuperAdmin",
  ORG_OWNER = "OrganizationOwner",
  ORG_ADMIN = "OrganizationAdmin",
  TEACHER = "Teacher",
  STUDENT = "Student",
  INDIVIDUAL = "Individual",
}

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
