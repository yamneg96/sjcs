import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { platformService, type ICatalogModel } from "@/services/platform.service";

export function usePlatformStats() {
  return useQuery({
    queryKey: ["platform", "stats"],
    queryFn: () => platformService.stats().then((r) => r.data.data),
  });
}

export function usePlatformOrganizations() {
  return useQuery({
    queryKey: ["platform", "organizations"],
    queryFn: () => platformService.organizations().then((r) => r.data.data),
  });
}

export function useSetOrgSuspended() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orgId, suspended }: { orgId: string; suspended: boolean }) =>
      platformService.setSuspended(orgId, suspended).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["platform"] });
    },
  });
}

export function useCatalogModels() {
  return useQuery({
    queryKey: ["platform", "models"],
    queryFn: () => platformService.models().then((r) => r.data.data),
  });
}

export function useSetModelStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ modelId, status }: { modelId: string; status: ICatalogModel["status"] }) =>
      platformService.setModelStatus(modelId, status).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["platform", "models"] }),
  });
}
