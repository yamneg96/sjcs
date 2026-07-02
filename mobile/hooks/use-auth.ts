import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../store/auth.store";
import { loginStudent, verifyStudentFirstTime, setupPasswordFirstTime, StudentLoginPayload } from "../api/auth";

export function useStudentLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (payload: StudentLoginPayload) => {
      const response = await loginStudent(payload);
      if (response.success && response.data.token) {
        setAuth(response.data.token, response.data.user);
      }
      return response.data;
    },
  });
}

export function useVerifyFirstTime() {
  return useMutation({
    mutationFn: verifyStudentFirstTime,
  });
}

export function useSetupPassword() {
  return useMutation({
    mutationFn: setupPasswordFirstTime,
  });
}
