import { api } from "./axios";
import { ApiResponse, IMaterial } from "../types/api.types";

export interface ListMaterialsFilters {
  subjectId?: string;
  materialType?: string;
}

export async function listMaterials(filters: ListMaterialsFilters = {}) {
  const params = new URLSearchParams();
  if (filters.subjectId) params.append("subjectId", filters.subjectId);
  if (filters.materialType) params.append("materialType", filters.materialType);

  const url = `/materials${params.toString() ? `?${params.toString()}` : ""}`;
  const response = await api.get<ApiResponse<IMaterial[]>>(url);
  return response.data;
}

export async function getMaterial(id: string) {
  const response = await api.get<ApiResponse<IMaterial>>(`/materials/${id}`);
  return response.data;
}
