import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

export function useAdminLogin() {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: (res) => {
      const { token, student } = res.data.data;
      setAuth(token, student);
    },
  });
}

export function useStudentLogin() {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: ({ fullName, grade, password }: { fullName: string; grade: number; password: string }) =>
      authService.studentLogin(fullName, grade, password),
    onSuccess: (res) => {
      const { token, student } = res.data.data;
      setAuth(token, student);
    },
  });
}

export function useVerifyStudent() {
  return useMutation({
    mutationFn: ({ fullName, grade }: { fullName: string; grade: number }) =>
      authService.verifyStudent(fullName, grade),
  });
}

export function useSetupPassword() {
  return useMutation({
    mutationFn: ({ studentId, password }: { studentId: string; password: string }) =>
      authService.setupPassword(studentId, password),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: ({ email }: { email: string }) =>
      authService.forgotPassword(email),
  });
}
