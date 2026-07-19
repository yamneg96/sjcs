import mongoose, { Schema } from "mongoose";
import { IBaseDocument } from "../../shared/types/base.types";
import { UserRole } from "../../shared/types/auth.types";
import { baseSchemaPlugin } from "../../infrastructure/database/base-schema";

export interface IUser extends IBaseDocument {
  fullName: string;
  email?: string; // Optional (e.g. for students who login via studentId)
  studentId?: string; // School-specific ID (unique within tenant)
  passwordHash?: string; // Optional until setup-password completes
  role: UserRole;
  organizationId?: mongoose.Types.ObjectId; // References Organization
  grade?: number; // For Students and Individuals (9-12)
  grades?: number[]; // For Teachers to restrict accessible classroom grades
  sectionId?: mongoose.Types.ObjectId; // Student's assigned Section (set at enrollment)
  admissionNo?: string; // School admission number (set at enrollment)
  guardianIds?: mongoose.Types.ObjectId[]; // Student → linked parent/guardian Users
  status: "Active" | "Suspended" | "Pending";
  isVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

const userSchema = new Schema<IUser>(
  {
    tenantId: { type: String, required: true }, // "platform", "individual", or organizationId
    fullName: { type: String, required: true, trim: true },
    email: { 
      type: String, 
      lowercase: true, 
      trim: true,
      index: { unique: true, sparse: true } // Unique only if provided
    },
    studentId: { type: String, trim: true }, // For Org Students
    passwordHash: { type: String },
    role: { 
      type: String, 
      enum: Object.values(UserRole), 
      required: true 
    },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
    grade: { type: Number },
    grades: { type: [Number], default: [] },
    sectionId: { type: Schema.Types.ObjectId, ref: "Section" },
    admissionNo: { type: String, trim: true },
    guardianIds: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
    status: {
      type: String, 
      enum: ["Active", "Suspended", "Pending"], 
      default: "Pending" 
    },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  {
    timestamps: true,
  }
);

/**
 * studentId must be unique per tenant — but ONLY for users that actually have
 * one (students). A `sparse` compound index does NOT work here: it still
 * indexes a document when any key is present, so every staff/parent row (which
 * has tenantId but no studentId) collides on `studentId: null` and the second
 * one is rejected. A partial index scopes uniqueness to real studentIds.
 */
userSchema.index(
  { tenantId: 1, studentId: 1 },
  { unique: true, partialFilterExpression: { studentId: { $type: "string" } } }
);

userSchema.plugin(baseSchemaPlugin);

export default mongoose.model<IUser>("User", userSchema);
