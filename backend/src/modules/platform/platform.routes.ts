import { Router } from "express";
import { protect, authorize } from "../../middleware/auth.middleware";
import { UserRole } from "../../shared/types/auth.types";
import {
  getPlatformStats,
  listOrganizations,
  setOrganizationSuspended,
  listModels,
  setModelStatus,
} from "./platform.controller";

/**
 * Platform (super-admin) routes — the audited cross-tenant surface (§12.2).
 * EVERY route here is SUPER_ADMIN-only; the service layer deliberately
 * bypasses tenant scoping, so this guard is the only thing standing between a
 * normal org user and the whole platform's data.
 */
const router = Router();

router.use(protect);
router.use(authorize(UserRole.SUPER_ADMIN));

router.get("/stats", getPlatformStats);
router.get("/organizations", listOrganizations);
router.put("/organizations/:orgId/suspension", setOrganizationSuspended);

// Model catalog management (ADR-003: adding/replacing a model is a data op).
router.get("/models", listModels);
router.put("/models/:modelId/status", setModelStatus);

export default router;
