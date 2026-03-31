import mongoose, { Document, Schema } from "mongoose";

export interface IStudent extends Document {
  fullName: string;
  grade: number;
  studentId: string;
  dateOfBirth?: string;
  passwordHash?: string;
  isActivated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const studentSchema = new Schema<IStudent>(
  {
    fullName: { type: String, required: true },
    grade: { type: Number, required: true },
    studentId: { type: String, required: true, unique: true },
    dateOfBirth: { type: String },
    passwordHash: { type: String },
    isActivated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IStudent>("Student", studentSchema);
