import mongoose, { Schema } from "mongoose";
import { IBaseDocument } from "../../shared/types/base.types";
import { baseSchemaPlugin } from "../../infrastructure/database/base-schema";

/**
 * Section (§14 academic structure) — a class group within a grade for an
 * academic year (e.g. "9A"). Students are assigned to a section at
 * registration; results and mark entry are scoped per section+subject.
 */
export interface ISection extends IBaseDocument {
  name: string; // e.g. "A", "B", "Blue"
  grade: number; // 9-12
  academicYearId: mongoose.Types.ObjectId;
  capacity: number;
  classTeacherId?: mongoose.Types.ObjectId;
}

const sectionSchema = new Schema<ISection>(
  {
    tenantId: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    grade: { type: Number, required: true, min: 1, max: 12 },
    academicYearId: { type: Schema.Types.ObjectId, ref: "AcademicYear", required: true },
    capacity: { type: Number, default: 40, min: 1 },
    classTeacherId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// One section name per (tenant, year, grade); fast listing by year+grade.
sectionSchema.index(
  { tenantId: 1, academicYearId: 1, grade: 1, name: 1 },
  { unique: true }
);

sectionSchema.plugin(baseSchemaPlugin);

export default mongoose.model<ISection>("Section", sectionSchema);
