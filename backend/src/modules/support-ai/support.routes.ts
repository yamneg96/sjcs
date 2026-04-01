import { Router } from "express";
import { handleSupportAI } from "./support.controller";

const router = Router();

router.post("/ask", handleSupportAI);

export default router;