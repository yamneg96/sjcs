import mongoose, { Document, Schema } from "mongoose";

/**
 * Real persistence backing POST /api/lis/session/start|end — previously these
 * were fake echo endpoints (no DB writes), silently discarding every
 * student's study-session duration even though mobile's Study tab calls them
 * live today.
 */
export interface IStudySession extends Document {
  tenantId: string;
  studentId: string;
  subject: string;
  startedAt: Date;
  endedAt?: Date;
  durationSeconds?: number;
  createdAt: Date;
  updatedAt: Date;
}

const studySessionSchema = new Schema<IStudySession>(
  {
    tenantId: { type: String, required: true },
    studentId: { type: String, required: true, index: true },
    subject: { type: String, default: "general" },
    startedAt: { type: Date, required: true },
    endedAt: { type: Date },
    durationSeconds: { type: Number },
  },
  { timestamps: true }
);

studySessionSchema.index({ tenantId: 1, studentId: 1 });

export default mongoose.model<IStudySession>("StudySession", studySessionSchema);
