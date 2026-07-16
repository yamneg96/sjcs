import mongoose, { Document, Schema } from "mongoose";

/**
 * Learning events — learner-owned activity stream (quiz results, chat topics,
 * lesson reads, flashcard reviews, OCR captures, voice sessions, AI routing
 * telemetry). Keyed by userId, NOT organizationId: the learning graph follows
 * the student across schools (§17.1 of the architecture).
 *
 * Events arrive batched from the mobile offline queue; `clientEventId` makes
 * the sync idempotent — replaying a batch never duplicates events.
 */

export type LearningEventKind =
  | "chat"
  | "quiz_result"
  | "lesson_read"
  | "flashcard_review"
  | "ocr_capture"
  | "voice_session"
  | "ai_route";

export interface ILearningEvent extends Document {
  userId: mongoose.Types.ObjectId;
  clientEventId: string; // client-generated UUID for idempotent sync
  kind: LearningEventKind;
  subject?: string;
  topic?: string;
  payload?: Record<string, unknown>;
  occurredAt: Date;
  createdAt: Date;
}

const learningEventSchema = new Schema<ILearningEvent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    clientEventId: { type: String, required: true },
    kind: {
      type: String,
      enum: [
        "chat",
        "quiz_result",
        "lesson_read",
        "flashcard_review",
        "ocr_capture",
        "voice_session",
        "ai_route",
      ],
      required: true,
    },
    subject: { type: String },
    topic: { type: String },
    payload: { type: Schema.Types.Mixed },
    occurredAt: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

learningEventSchema.index({ userId: 1, occurredAt: -1 });
learningEventSchema.index({ userId: 1, clientEventId: 1 }, { unique: true });

const LearningEvent = mongoose.model<ILearningEvent>(
  "LearningEvent",
  learningEventSchema
);

export default LearningEvent;
