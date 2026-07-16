import mongoose, { Schema } from "mongoose";

/**
 * Mark audit (§17.1 immutable audit trail, §47.2 grade integrity) —
 * append-only record of every change to a grade-bearing Mark. Written in the
 * same operation as the mark change; carries the two-person actors (who
 * proposed, who countersigned). Never updated or deleted.
 */
export interface IMarkSnapshot {
  items: { name: string; score: number }[];
  total: number;
}

export interface IMarkAudit extends mongoose.Document {
  tenantId: string;
  markId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  before: IMarkSnapshot;
  after: IMarkSnapshot;
  reason: string;
  actorId: mongoose.Types.ObjectId; // who proposed / made the change
  countersignId?: mongoose.Types.ObjectId; // director who countersigned (two-person rule)
  createdAt: Date;
}

const snapshotSchema = new Schema<IMarkSnapshot>(
  {
    items: {
      type: [{ name: String, score: Number }],
      default: [],
    },
    total: { type: Number, required: true },
  },
  { _id: false }
);

const markAuditSchema = new Schema<IMarkAudit>(
  {
    tenantId: { type: String, required: true },
    markId: { type: Schema.Types.ObjectId, ref: "Mark", required: true, index: true },
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    before: { type: snapshotSchema, required: true },
    after: { type: snapshotSchema, required: true },
    reason: { type: String, required: true },
    actorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    countersignId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

markAuditSchema.index({ tenantId: 1, markId: 1, createdAt: -1 });

export default mongoose.model<IMarkAudit>("MarkAudit", markAuditSchema);
