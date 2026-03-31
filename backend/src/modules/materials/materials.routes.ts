import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { getMaterials } from "./materials.controller";

const router = Router();

router.get("/", protect, getMaterials);

export default router;
