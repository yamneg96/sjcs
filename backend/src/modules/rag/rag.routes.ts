import { Router } from "express";
import { askPublicAI } from "./rag.controller";

const router = Router();

router.post("/public", askPublicAI);

export default router;
