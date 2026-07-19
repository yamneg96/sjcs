import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/auth.store";
import {
  login,
  logoutRequest,
  verifyStudentFirstTime,
  setupPasswordFirstTime,
  registerIndividual,
  LoginPayload,
} from "../api/auth";
import { MOBILE_SUPPORTED_ROLES } from "../types/api.types";

/** Self-signup for individual (non-school) learners. */
export function useRegisterIndividual() {
  return useMutation({
    mutationFn: registerIndividual,
  });
}

/**
 * Single login entry point for BOTH login shapes (school student, or email —
 * individual/staff/parent all share one endpoint per the backend's union
 * schema). Rejects roles the mobile app has no UI for (§7.1/§38: this app is
 * the student tutor only) rather than dropping them into a meaningless screen.
 */
export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const response = await login(payload);
      if (!response.success) {
        throw new Error(response.message || "Login failed");
      }

      const { token, refreshToken, user } = response.data;
      if (!MOBILE_SUPPORTED_ROLES.includes(user.role as (typeof MOBILE_SUPPORTED_ROLES)[number])) {
        throw new Error(
          "This is a staff or parent account. Please use the Lumora web portal instead of the mobile app."
        );
      }

      setAuth(token, user, refreshToken);
      return response.data;
    },
  });
}

/** @deprecated use `useLogin()` — kept as a typed alias for the student-only call sites. */
export const useStudentLogin = useLogin;

/**
 * Signs out: best-effort revokes the session server-side (§13.2), then always
 * clears local state regardless of whether the network call succeeds — a
 * flaky connection must never trap the user in a signed-in state they can't
 * escape.
 */
export function useLogout() {
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const clearAuth = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (refreshToken) {
        await logoutRequest(refreshToken).catch(() => {
          // Session may already be expired/revoked — local clear still proceeds.
        });
      }
    },
    onSettled: () => {
      clearAuth();
      queryClient.clear();
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
