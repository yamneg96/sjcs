import { Router } from "express";
import { createTicket, getTickets, closeTicket } from "./support.controller";
import { protect } from "../../middleware/auth.middleware";

const router = Router();

// All support endpoints require authentication
router.use(protect);

router.post("/", createTicket);
router.get("/", getTickets);
router.patch("/:ticketId/close", closeTicket);

export default router;
