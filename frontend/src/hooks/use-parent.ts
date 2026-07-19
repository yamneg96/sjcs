import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { membersService } from "@/services/members.service";
import { resultsService } from "@/services/results.service";
import { academicService } from "@/services/academic.service";

/** The organization's current academic year (readable by any org member). */
export function useCurrentAcademicYear() {
  return useQuery({
    queryKey: ["academic-year", "current"],
    queryFn: () => academicService.getCurrent().then((r) => r.data.data),
  });
}

/** The signed-in parent's children (§32). */
export function useMyChildren() {
  return useQuery({
    queryKey: ["my-children"],
    queryFn: () => membersService.myChildren().then((r) => r.data.data),
  });
}

/**
 * A child's results for a term. The backend enforces the release embargo, so a
 * 403 here is the expected "not published yet" state rather than a failure —
 * callers should render the honest waiting copy, not an error.
 */
export function useChildResults(studentId?: string, academicYearId?: string, term?: string) {
  const query = useQuery({
    queryKey: ["child-results", studentId, academicYearId, term],
    queryFn: () =>
      resultsService
        .getStudentResults(studentId as string, academicYearId as string, term as string)
        .then((r) => r.data.data),
    enabled: !!studentId && !!academicYearId && !!term,
    retry: false, // a 403 embargo must not be retried
  });

  const status = (query.error as AxiosError | null)?.response?.status;
  return { ...query, notPublished: status === 403 };
}

export function useCreateAppeal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ markId, reason }: { markId: string; reason: string }) =>
      resultsService.createAppeal(markId, reason).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["child-results"] }),
  });
}
