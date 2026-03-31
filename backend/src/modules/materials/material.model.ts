import mongoose, { Document, Schema } from "mongoose";

export interface IMaterial extends Document {
  title: string;
  subject: string;
  grade: number;
  type: "ebook" | "worksheet" | "exam";
  fileUrl: string;
  description?: string;
  createdAt: Date;
}

const materialSchema = new Schema<IMaterial>(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    grade: { type: Number, required: true },
    type: {
      type: String,
      enum: ["ebook", "worksheet", "exam"],
      required: true,
    },
    fileUrl: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IMaterial>("Material", materialSchema);
