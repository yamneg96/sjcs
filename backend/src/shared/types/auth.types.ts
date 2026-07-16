import { Request } from "express";

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

export interface IJWTPayload {
  id: string;
  email: string;
  role: UserRole;
  tenantId: string; // organizationId, or "individual", or "platform"
  grades?: number[]; // Accessible grade levels for access restriction
  deviceId?: string; // device binding on mobile (§13.2)
}

export interface AuthRequest extends Request {
  user?: IJWTPayload;
}
