import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { organizationsService } from "@/services/organizations.service";
import type { UpdateOrgPayload } from "@/types/api.types";

export function useMyOrganization() {
  return useQuery({
    queryKey: ["organization", "me"],
    queryFn: () => organizationsService.getMyOrg().then(r => r.data.data),
    retry: 1,
  });
}

export function useUpdateOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateOrgPayload) => organizationsService.updateMyOrg(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["organization"] }); },
  });
}
