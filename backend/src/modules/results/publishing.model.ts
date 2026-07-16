import mongoose, { Schema } from "mongoose";
import { IBaseDocument } from "../../shared/types/base.types";
import { baseSchemaPlugin } from "../../infrastructure/database/base-schema";

/**
 * Publishing (§17.2, §33) — a controlled, time-locked release of results for a
 * scope (year, term, grades). This is the trust-critical object: results for a
 * scope are readable by students/parents ONLY when a Publishing covering them
 * is PUBLISHED and `releaseAt` has passed. The state machine is:
 *
 *   DRAFT → APPROVED → SCHEDULED → PUBLISHED → ARCHIVED
 *
 * The scheduler sweep flips SCHEDULED → PUBLISHED atomically at releaseAt; the
 * embargo is enforced server-side (unpublished data is never serialized).
 */
export type PublishingStatus = "DRAFT" | "APPROVED" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";

export interface IPublishingStatusEntry {
  status: PublishingStatus;
  at: Date;
  actorId?: mongoose.Types.ObjectId;
}

export interface IPublishing extends IBaseDocument {
  academicYearId: mongoose.Types.ObjectId;
  term: string;
  grades: number[];
  releaseAt?: Date;
  status: PublishingStatus;
  statusHistory: IPublishingStatusEntry[];
  approvedBy?: mongoose.Types.ObjectId;
  scheduledBy?: mongoose.Types.ObjectId;
  publishedAt?: Date;
}

const statusEntrySchema = new Schema<IPublishingStatusEntry>(
  {
    status: { type: String, required: true },
    at: { type: Date, default: Date.now },
    actorId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { _id: false }
);

const publishingSchema = new Schema<IPublishing>(
  {
    tenantId: { type: String, required: true },
    academicYearId: { type: Schema.Types.ObjectId, ref: "AcademicYear", required: true },
    term: { type: String, required: true },
    grades: { type: [Number], default: [] },
    releaseAt: { type: Date },
    status: {
      type: String,
      enum: ["DRAFT", "APPROVED", "SCHEDULED", "PUBLISHED", "ARCHIVED"],
      default: "DRAFT",
    },
    statusHistory: { type: [statusEntrySchema], default: [] },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    scheduledBy: { type: Schema.Types.ObjectId, ref: "User" },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

// Scheduler sweep hot path: find SCHEDULED publishings whose releaseAt has passed.
publishingSchema.index({ status: 1, releaseAt: 1 });
publishingSchema.index({ tenantId: 1, academicYearId: 1, term: 1, status: 1 });

publishingSchema.plugin(baseSchemaPlugin);

export default mongoose.model<IPublishing>("Publishing", publishingSchema);
