import { Router } from "express";
import {
  createMaterial,
  listMaterials,
  getMaterial,
  updateMaterial,
  deleteMaterial,
} from "./material.controller";
import { protect, authorize } from "../../middleware/auth.middleware";
import { UserRole } from "../../shared/types/auth.types";

const router = Router();

router.use(protect);

// Creators: OrgOwner, OrgAdmin, and Teacher can deploy materials/lessons
router.post("/", authorize(UserRole.ORG_OWNER, UserRole.ORG_ADMIN, UserRole.TEACHER), createMaterial);
router.get("/", listMaterials);
router.get("/:id", getMaterial);
router.put("/:materialId", authorize(UserRole.ORG_OWNER, UserRole.ORG_ADMIN, UserRole.TEACHER), updateMaterial);
router.delete("/:materialId", authorize(UserRole.ORG_OWNER, UserRole.ORG_ADMIN, UserRole.TEACHER), deleteMaterial);

export default router;
