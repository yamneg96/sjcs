import api from "./axios";
import type { ApiResponse, IOrganization, UpdateOrgPayload } from "@/types/api.types";

export const organizationsService = {
  getMyOrg: () =>
    api.get<ApiResponse<IOrganization>>("/organizations/me"),

  updateMyOrg: (data: UpdateOrgPayload) =>
    api.put<ApiResponse<IOrganization>>("/organizations/me", data),
};
