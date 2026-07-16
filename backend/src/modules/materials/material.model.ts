import mongoose, { Schema } from "mongoose";
import { IBaseDocument } from "../../shared/types/base.types";
import { baseSchemaPlugin } from "../../infrastructure/database/base-schema";

export interface IMaterial extends IBaseDocument {
  title: string;
  subjectId: mongoose.Types.ObjectId;
  materialType: "pdf" | "video" | "markdown" | "link";
  contentUrl?: string; // Cloudinary URL, YouTube link, website URL
  textParsed?: string; // Parsed transcription or text content for AI query lookup RAG
  createdBy: mongoose.Types.ObjectId;
  grade: number;
}

const materialSchema = new Schema<IMaterial>(
  {
    tenantId: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    materialType: { 
      type: String, 
      enum: ["pdf", "video", "markdown", "link"], 
      required: true 
    },
    contentUrl: { type: String },
    textParsed: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    grade: { type: Number, required: true, min: 9, max: 12 },
  },
  {
    timestamps: true,
  }
);

// Add index to accelerate RAG text searches
materialSchema.index({ tenantId: 1, subjectId: 1, grade: 1 });
materialSchema.index({ textParsed: "text" }); // Text index for keyword lookup

materialSchema.plugin(baseSchemaPlugin);

export default mongoose.model<IMaterial>("Material", materialSchema);
