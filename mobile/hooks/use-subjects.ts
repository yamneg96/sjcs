import { useQuery } from "@tanstack/react-query";
import { fetchSubjects } from "@/api/subjects";

export function useSubjects(grade?: number) {
  return useQuery({
    queryKey: ["subjects", grade],
    queryFn: () => fetchSubjects(grade).then((r) => r.data),
  });
}
