import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { materialsService } from "@/services/materials.service";
import type { CreateMaterialPayload } from "@/types/api.types";

export function useMaterials(filters?: { subjectId?: string; materialType?: string }) {
  return useQuery({
    queryKey: ["materials", filters],
    queryFn: () => materialsService.list(filters).then(r => r.data.data),
  });
}

export function useCreateMaterial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMaterialPayload) => materialsService.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["materials"] }); },
  });
}

export function useDeleteMaterial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (materialId: string) => materialsService.delete(materialId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["materials"] }); },
  });
}

export function useUploadFile() {
  return useMutation({
    mutationFn: (file: File) => materialsService.uploadFile(file),
  });
}
