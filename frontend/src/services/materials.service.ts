import api from "./axios";
import type {
  ApiResponse,
  IMaterial,
  CreateMaterialPayload,
  UploadResponse,
} from "@/types/api.types";

export const materialsService = {
  list: (filters?: { subjectId?: string; materialType?: string }) =>
    api.get<ApiResponse<IMaterial[]>>("/materials", { params: filters }),

  getById: (id: string) =>
    api.get<ApiResponse<IMaterial>>(`/materials/${id}`),

  create: (data: CreateMaterialPayload) =>
    api.post<ApiResponse<IMaterial>>("/materials", data),

  update: (materialId: string, data: Partial<CreateMaterialPayload>) =>
    api.put<ApiResponse<IMaterial>>(`/materials/${materialId}`, data),

  delete: (materialId: string) =>
    api.delete<ApiResponse<null>>(`/materials/${materialId}`),

  // Upload file to R2 public bucket via storage endpoint
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post<ApiResponse<UploadResponse>>("/storage/upload/public", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
