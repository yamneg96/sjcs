import mongoose, { Schema } from "mongoose";
import { IBaseDocument } from "../../shared/types/base.types";
import { baseSchemaPlugin } from "../../infrastructure/database/base-schema";

/**
 * Mark (§17.2) — one student's scores for one assessment. `status` gates edits:
 * DRAFT is editable by the teacher; SUBMITTED locks it (further changes require
 * the two-person appeal/countersign flow that appends a MarkAudit).
 *
 * IMPORTANT: a Mark is grade-bearing data. It is NEVER serialized to a
 * student/parent directly — only through the time-locked results read, which
 * requires a Published + released Publishing covering its (year, term, grade).
 */
export type MarkStatus = "DRAFT" | "SUBMITTED";

export interface IMarkItem {
  name: string;
  score: number;
}

export interface IMark extends IBaseDocument {
  assessmentId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  academicYearId: mongoose.Types.ObjectId;
  term: string;
  grade: number;
  sectionId: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId;
  items: IMarkItem[];
  total: number;
  maxTotal: number;
  status: MarkStatus;
  enteredBy: mongoose.Types.ObjectId;
  submittedAt?: Date;
}

const markItemSchema = new Schema<IMarkItem>(
  {
    name: { type: String, required: true },
    score: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const markSchema = new Schema<IMark>(
  {
    tenantId: { type: String, required: true },
    assessmentId: { type: Schema.Types.ObjectId, ref: "Assessment", required: true },
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    academicYearId: { type: Schema.Types.ObjectId, ref: "AcademicYear", required: true },
    term: { type: String, required: true },
    grade: { type: Number, required: true },
    sectionId: { type: Schema.Types.ObjectId, ref: "Section", required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    items: { type: [markItemSchema], default: [] },
    total: { type: Number, required: true, min: 0 },
    maxTotal: { type: Number, required: true, min: 1 },
    status: { type: String, enum: ["DRAFT", "SUBMITTED"], default: "DRAFT" },
    enteredBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    submittedAt: { type: Date },
  },
  { timestamps: true }
);

// One mark per (assessment, student); fast lookup for the time-locked read.
markSchema.index({ tenantId: 1, assessmentId: 1, studentId: 1 }, { unique: true });
markSchema.index({ tenantId: 1, studentId: 1, academicYearId: 1, term: 1 });

markSchema.plugin(baseSchemaPlugin);

export default mongoose.model<IMark>("Mark", markSchema);
