import mongoose, { Schema } from "mongoose";
import { IBaseDocument } from "../../shared/types/base.types";
import { baseSchemaPlugin } from "../../infrastructure/database/base-schema";

/**
 * Academic year (§14 academic structure) — the term container a school runs
 * its sections, enrollment, and results under. Exactly one year is `isCurrent`
 * per tenant at a time; rollover closes the previous year (writes locked,
 * results stay readable) and opens the next.
 */
export type AcademicYearStatus = "Active" | "Closed";

export interface IAcademicYear extends IBaseDocument {
  name: string; // e.g. "2024/2025"
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
  status: AcademicYearStatus;
}

const academicYearSchema = new Schema<IAcademicYear>(
  {
    tenantId: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isCurrent: { type: Boolean, default: false },
    status: { type: String, enum: ["Active", "Closed"], default: "Active" },
  },
  { timestamps: true }
);

// One record per (tenant, name); fast lookup of the current year.
academicYearSchema.index({ tenantId: 1, name: 1 }, { unique: true });
academicYearSchema.index({ tenantId: 1, isCurrent: 1 });

academicYearSchema.plugin(baseSchemaPlugin);

export default mongoose.model<IAcademicYear>("AcademicYear", academicYearSchema);
