import { Router } from "express";
import { getMaterials, uploadMaterialController } from "./materials.controller";
import { protect } from "../../middleware/auth.middleware";
import multer from "multer";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", protect, getMaterials);
router.post("/upload", protect, upload.single("file"), uploadMaterialController);

export default router;
