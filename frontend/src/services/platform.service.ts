import api from "./axios";
import type { ApiResponse } from "@/types/api.types";

/** Platform-wide KPIs (super-admin only, cross-tenant). */
export interface IPlatformStats {
  organizations: number;
  activeOrgs: number;
  students: number;
  teachers: number;
  parents: number;
  admissions: number;
  pendingAdmissions: number;
  aiSpendUSD: number;
  aiBudgetUSD: number;
}

export interface IPlatformOrganization {
  _id: string;
  name: string;
  slug: string;
  isVerified: boolean;
  suspendedAt?: string;
  plan: string;
  status: string;
  aiUsage: number;
  aiLimit: number;
  studentCount: number;
  staffCount: number;
  createdAt: string;
}

export interface ICatalogModel {
  _id: string;
  modelId: string;
  displayName: string;
  engine: string;
  task: string;
  sizeBytes: number;
  quantization: string;
  minimumRAMGB: number;
  languages: string[];
  version: string;
  status: "canary" | "stable" | "deprecated";
}

export const platformService = {
  stats: () => api.get<ApiResponse<IPlatformStats>>("/platform/stats"),
  organizations: () => api.get<ApiResponse<IPlatformOrganization[]>>("/platform/organizations"),
  setSuspended: (orgId: string, suspended: boolean) =>
    api.put<ApiResponse<unknown>>(`/platform/organizations/${orgId}/suspension`, { suspended }),
  models: () => api.get<ApiResponse<ICatalogModel[]>>("/platform/models"),
  setModelStatus: (modelId: string, status: ICatalogModel["status"]) =>
    api.put<ApiResponse<ICatalogModel>>(`/platform/models/${modelId}/status`, { status }),
};
