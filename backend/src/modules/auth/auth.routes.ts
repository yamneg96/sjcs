import { Router } from "express";
import {
  registerIndividual,
  registerOrganization,
  verifyEmail,
  login,
  refresh,
  logout,
  verifyStudentFirstTime,
  setupPasswordFirstTime,
  requestPasswordReset,
  resetPassword,
} from "./auth.controller";
import { authRateLimiter } from "../../middleware/rate-limit.middleware";

const router = Router();

// Apply auth rate limiter to all auth routes
router.use(authRateLimiter);

router.post("/register", registerIndividual);
router.post("/register-organization", registerOrganization);
router.get("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

// First-time student activation routes
router.post("/verify-student", verifyStudentFirstTime);
router.post("/setup-password", setupPasswordFirstTime);

// Password recovery routes
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", resetPassword);

export default router;
