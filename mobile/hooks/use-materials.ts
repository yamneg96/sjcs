import { useQuery } from "@tanstack/react-query";
import { listMaterials, getMaterial, ListMaterialsFilters } from "../api/materials";

export function useMaterials(filters: ListMaterialsFilters = {}) {
  return useQuery({
    queryKey: ["materials", filters],
    queryFn: () => listMaterials(filters),
  });
}

export function useMaterialDetails(id: string) {
  return useQuery({
    queryKey: ["materials", id],
    queryFn: () => getMaterial(id),
    enabled: !!id,
  });
}
