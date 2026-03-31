import mongoose, { Document, Schema } from "mongoose";

export interface IStudyLog extends Document {
  studentId: string;
  question: string;
  answer: string;
  subject: string;
  gradeAccessed: number;
  createdAt: Date;
}

const studyLogSchema = new Schema<IStudyLog>(
  {
    studentId: { type: String, required: true, index: true },
    question: { type: String, required: true },
    answer: { type: String, default: "" },
    subject: { type: String, default: "general" },
    gradeAccessed: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IStudyLog>("StudyLog", studyLogSchema);
