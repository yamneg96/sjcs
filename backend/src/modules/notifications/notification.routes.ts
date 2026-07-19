import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { listNotifications, markRead, markAllRead } from "./notification.controller";

/**
 * Notification inbox — every route is scoped to the requesting user (§23).
 * Any authenticated role has an inbox (students, parents, staff).
 */
const router = Router();

router.use(protect);

router.get("/", listNotifications);
router.put("/read-all", markAllRead);
router.put("/:notificationId/read", markRead);

export default router;
