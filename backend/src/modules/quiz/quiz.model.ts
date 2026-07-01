import mongoose, { Document, Schema } from "mongoose";

export interface IQuiz extends Document {
  tenantId: string; // SaaS Tenant Isolation
  studentId: string;
  topic: string;
  questions: {
    question: string;
    options: string[];
    answer: string;
    userAnswer?: string;
  }[];
  score: number;
  total: number;
  createdAt: Date;
}

const quizSchema = new Schema<IQuiz>(
  {
    tenantId: { type: String, required: true },
    studentId: { type: String, required: true, index: true },
    topic: { type: String, required: true },
    questions: [
      {
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        answer: { type: String, required: true },
        userAnswer: { type: String },
      },
    ],
    score: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Add index to accelerate lookup within tenants
quizSchema.index({ tenantId: 1, studentId: 1 });

export default mongoose.model<IQuiz>("Quiz", quizSchema);
