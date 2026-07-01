import { Router } from "express";
import {
  getMyOrganization,
  updateMyOrganization,
  updateAIConfig,
  updateSubscription,
} from "./organization.controller";
import { protect, authorize } from "../../middleware/auth.middleware";
import { UserRole } from "../../shared/types/auth.types";

const router = Router();

// Org Workspace Settings
router.get("/me", protect, getMyOrganization);
router.put("/me", protect, authorize(UserRole.ORG_OWNER, UserRole.ORG_ADMIN), updateMyOrganization);

// SuperAdmin operations
router.put("/:orgId/ai-config", protect, authorize(UserRole.SUPER_ADMIN), updateAIConfig);
router.put("/:orgId/subscription", protect, authorize(UserRole.SUPER_ADMIN), updateSubscription);

export default router;
