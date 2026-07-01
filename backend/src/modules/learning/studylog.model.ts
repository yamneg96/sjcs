import mongoose, { Document, Schema } from "mongoose";

export interface IStudyLog extends Document {
  tenantId: string; // SaaS Tenant Isolation
  studentId: string;
  question: string;
  answer: string;
  subject: string;
  gradeAccessed: number;
  createdAt: Date;
}

const studyLogSchema = new Schema<IStudyLog>(
  {
    tenantId: { type: String, required: true },
    studentId: { type: String, required: true, index: true },
    question: { type: String, required: true },
    answer: { type: String, default: "" },
    subject: { type: String, default: "general" },
    gradeAccessed: { type: Number, required: true },
  },
  { timestamps: true }
);

// Add index to accelerate lookups by tenant and student
studyLogSchema.index({ tenantId: 1, studentId: 1 });

export default mongoose.model<IStudyLog>("StudyLog", studyLogSchema);
