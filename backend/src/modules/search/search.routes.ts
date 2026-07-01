import { Router } from "express";
import { searchAll } from "./search.controller";
import { protect } from "../../middleware/auth.middleware";

const router = Router();

// Cross-module search requires authentication
router.post("/query", protect, searchAll);
router.get("/query", protect, searchAll);

export default router;
