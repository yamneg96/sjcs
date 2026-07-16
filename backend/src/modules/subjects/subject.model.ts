import mongoose, { Schema } from "mongoose";
import { IBaseDocument } from "../../shared/types/base.types";
import { baseSchemaPlugin } from "../../infrastructure/database/base-schema";

export interface ISubject extends IBaseDocument {
  name: string;
  slug: string;
  grade: number; // 9, 10, 11, 12
  description?: string;
  createdBy: mongoose.Types.ObjectId;
}

const subjectSchema = new Schema<ISubject>(
  {
    tenantId: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true },
    grade: { type: Number, required: true, min: 9, max: 12 },
    description: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure uniqueness of subjects per tenant + grade + slug
subjectSchema.index({ tenantId: 1, grade: 1, slug: 1 }, { unique: true });

subjectSchema.plugin(baseSchemaPlugin);

export default mongoose.model<ISubject>("Subject", subjectSchema);
