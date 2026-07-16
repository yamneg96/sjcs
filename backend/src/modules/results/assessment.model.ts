import mongoose, { Schema } from "mongoose";
import { IBaseDocument } from "../../shared/types/base.types";
import { baseSchemaPlugin } from "../../infrastructure/database/base-schema";

/**
 * Assessment (§17.2) — a gradeable component for a (year, term, grade, section,
 * subject): e.g. "Term 1 Midterm — Grade 9A Biology". Defines the items being
 * scored and their max scores; a Mark records one student's scores against it.
 */
export interface IAssessmentItem {
  name: string; // e.g. "Test 1", "Assignment", "Exam"
  maxScore: number;
}

export interface IAssessment extends IBaseDocument {
  academicYearId: mongoose.Types.ObjectId;
  term: string; // e.g. "Term 1"
  grade: number;
  sectionId: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId;
  title: string;
  items: IAssessmentItem[];
  maxTotal: number; // sum of item maxScores
  teacherId: mongoose.Types.ObjectId; // owning teacher
}

const assessmentItemSchema = new Schema<IAssessmentItem>(
  {
    name: { type: String, required: true, trim: true },
    maxScore: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const assessmentSchema = new Schema<IAssessment>(
  {
    tenantId: { type: String, required: true },
    academicYearId: { type: Schema.Types.ObjectId, ref: "AcademicYear", required: true },
    term: { type: String, required: true, trim: true },
    grade: { type: Number, required: true, min: 1, max: 12 },
    sectionId: { type: Schema.Types.ObjectId, ref: "Section", required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    title: { type: String, required: true, trim: true },
    items: { type: [assessmentItemSchema], default: [] },
    maxTotal: { type: Number, required: true, min: 1 },
    teacherId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

assessmentSchema.index({ tenantId: 1, academicYearId: 1, term: 1, sectionId: 1, subjectId: 1 });

assessmentSchema.plugin(baseSchemaPlugin);

export default mongoose.model<IAssessment>("Assessment", assessmentSchema);
