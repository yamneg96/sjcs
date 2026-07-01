import { Router } from "express";
import {
  createConversation,
  sendMessage,
  listConversations,
  getConversation,
  deleteConversation,
} from "./chat.controller";
import { protect } from "../../middleware/auth.middleware";

const router = Router();

router.use(protect);

router.post("/", createConversation);
router.post("/:conversationId/messages", sendMessage);
router.get("/", listConversations);
router.get("/:conversationId", getConversation);
router.delete("/:conversationId", deleteConversation);

export default router;
