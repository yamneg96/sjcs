import { Router } from "express";
import { verifyStudent, setupPassword, login } from "./auth.controller";

const router = Router();

router.post("/verify-student", verifyStudent);
router.post("/setup-password", setupPassword);
router.post("/login", login);

export default router;
