import mongoose, { Document, Schema } from "mongoose";

/**
 * In-app notification (§23). Learner/parent-owned and keyed by `userId` — a
 * notification follows the person, not the tenant, so it survives a transfer
 * (same rule as learning events, §17.1). `tenantId` is kept for context//
 * filtering only, never as the access key.
 */
export type NotificationKind =
  | "results_published"
  | "appeal_update"
  | "admission_update"
  | "announcement";

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  tenantId?: string;
  kind: NotificationKind;
  title: string;
  body: string;
  /** Deep-link target for the app, e.g. "/portal" or "/(tabs)/exams". */
  link?: string;
  data?: Record<string, unknown>;
  readAt?: Date;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tenantId: { type: String },
    kind: {
      type: String,
      enum: ["results_published", "appeal_update", "admission_update", "announcement"],
      required: true,
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    link: { type: String },
    data: { type: Schema.Types.Mixed },
    readAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Inbox query: a user's notifications, newest first, unread first.
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, readAt: 1 });

export default mongoose.model<INotification>("Notification", notificationSchema);
