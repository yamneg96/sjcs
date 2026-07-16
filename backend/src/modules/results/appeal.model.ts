import mongoose, { Schema } from "mongoose";
import { IBaseDocument } from "../../shared/types/base.types";
import { baseSchemaPlugin } from "../../infrastructure/database/base-schema";

/**
 * Appeal (§34) — a parent/student request to review a specific mark. A mark
 * change proposed on an appeal requires a DIRECTOR countersign (two-person
 * rule) before it takes effect and appends a MarkAudit. Outcomes: UPHELD
 * (mark changed), EXPLAINED (unchanged), WITHDRAWN.
 */
export type AppealStatus = "OPEN" | "UPHELD" | "EXPLAINED" | "WITHDRAWN";

export interface IAppealMessage {
  authorId: mongoose.Types.ObjectId;
  body: string;
  at: Date;
}

export interface IAppeal extends IBaseDocument {
  markId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  requesterId: mongoose.Types.ObjectId; // parent or student
  reason: string;
  thread: IAppealMessage[];
  status: AppealStatus;
  /** Teacher's proposed new item scores, pending director countersign. */
  proposedItems?: { name: string; score: number }[];
  proposedBy?: mongoose.Types.ObjectId; // teacher who proposed the change
  resolvedBy?: mongoose.Types.ObjectId;
  resolvedAt?: Date;
}

const messageSchema = new Schema<IAppealMessage>(
  {
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    body: { type: String, required: true },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const appealSchema = new Schema<IAppeal>(
  {
    tenantId: { type: String, required: true },
    markId: { type: Schema.Types.ObjectId, ref: "Mark", required: true },
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    requesterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reason: { type: String, required: true },
    thread: { type: [messageSchema], default: [] },
    status: { type: String, enum: ["OPEN", "UPHELD", "EXPLAINED", "WITHDRAWN"], default: "OPEN" },
    proposedItems: { type: [{ name: String, score: Number }], default: undefined },
    proposedBy: { type: Schema.Types.ObjectId, ref: "User" },
    resolvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

// One open appeal per mark (enforced in service); listing by status.
appealSchema.index({ tenantId: 1, markId: 1, status: 1 });

appealSchema.plugin(baseSchemaPlugin);

export default mongoose.model<IAppeal>("Appeal", appealSchema);
