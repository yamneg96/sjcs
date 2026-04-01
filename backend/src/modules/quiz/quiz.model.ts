import mongoose, { Document, Schema } from "mongoose";

export interface IQuiz extends Document {
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

export default mongoose.model<IQuiz>("Quiz", quizSchema);
