import { Response } from "express";
import { AuthRequest } from "../../shared/types/auth.types";
import { sendSuccess } from "../../shared/utils/api-response";
import { asyncHandler } from "../../shared/utils/async-handler";
import Notification from "./notification.model";

/**
 * Notification inbox (§23). Learner/parent-owned: every query is keyed by the
 * requesting user's id, so there is no way to read someone else's inbox.
 */

export const listNotifications = asyncHandler(async (req: AuthRequest, res: Response) => {
  const limit = Math.min(parseInt((req.query.limit as string) || "30", 10), 100);
  const unreadOnly = req.query.unread === "true";

  const filter: Record<string, unknown> = { userId: req.user!.id };
  if (unreadOnly) filter.readAt = { $exists: false };

  const [notifications, unreadCount] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).limit(limit).lean(),
    Notification.countDocuments({ userId: req.user!.id, readAt: { $exists: false } }),
  ]);

  sendSuccess(res, { notifications, unreadCount }, "Notifications retrieved");
});

export const markRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  // Scoped by userId as well as id — you can only mark your own as read.
  await Notification.updateOne(
    { _id: req.params.notificationId, userId: req.user!.id, readAt: { $exists: false } },
    { $set: { readAt: new Date() } }
  );
  sendSuccess(res, null, "Marked as read");
});

export const markAllRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await Notification.updateMany(
    { userId: req.user!.id, readAt: { $exists: false } },
    { $set: { readAt: new Date() } }
  );
  sendSuccess(res, { marked: result.modifiedCount }, "All marked as read");
});
