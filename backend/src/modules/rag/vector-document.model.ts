import mongoose, { Document, Schema } from "mongoose";

export interface IVectorDocument extends Document {
  content: string;
  embedding: number[];
  subject: string;
  grade: number;
  type: "public" | "learning";
  sourceFile?: string;
  createdAt: Date;
}

const vectorDocumentSchema = new Schema<IVectorDocument>(
  {
    content: { type: String, required: true },
    embedding: { type: [Number], required: true },
    subject: { type: String, required: true },
    grade: { type: Number, required: true },
    type: {
      type: String,
      enum: ["public", "learning"],
      required: true,
    },
    sourceFile: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IVectorDocument>(
  "VectorDocument",
  vectorDocumentSchema
);
