import mongoose, { Schema } from "mongoose";
import { IBaseDocument } from "../../shared/types/base.types";
import { baseSchemaPlugin } from "../../infrastructure/database/base-schema";

export type AdmissionStatus =
  | "INQUIRY"
  | "PENDING_REVIEW"
  | "INTERVIEW_SCHEDULED"
  | "APPROVED"
  | "REJECTED"
  | "WAITLISTED";

export interface IAdmissionDocument {
  fileName: string;
  fileUrl: string;       // R2 URL (private bucket)
  fileType: string;      // e.g. "transcript", "birth_certificate", "id_card"
  mimeType: string;
  uploadedAt: Date;
}

export interface IAdmission extends IBaseDocument {
  // Parent details
  parentName: string;
  parentEmail: string;
  parentPhone: string;

  // Student details
  studentFirstName: string;
  studentLastName: string;
  studentDOB: Date;
  studentGender: "male" | "female";
  gradeAppliedFor: number;

  // Documents (private R2 bucket)
  documents: IAdmissionDocument[];

  // Workflow
  status: AdmissionStatus;
  interviewDate?: Date;
  interviewTime?: string;
  interviewNotes?: string;
  reviewerNotes?: string;
  reviewedBy?: mongoose.Types.ObjectId;

  // Previous school info
  previousSchool?: string;
  transferReason?: string;

  // Enrollment (set when an APPROVED applicant is converted into a student)
  enrolledStudentId?: mongoose.Types.ObjectId;
  enrolledAt?: Date;
}

const admissionDocumentSchema = new Schema<IAdmissionDocument>(
  {
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
    mimeType: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const admissionSchema = new Schema<IAdmission>(
  {
    tenantId: { type: String, required: true, index: true },

    // Parent
    parentName: { type: String, required: true, trim: true },
    parentEmail: { type: String, required: true, trim: true, lowercase: true },
    parentPhone: { type: String, required: true, trim: true },

    // Student
    studentFirstName: { type: String, required: true, trim: true },
    studentLastName: { type: String, required: true, trim: true },
    studentDOB: { type: Date, required: true },
    studentGender: { type: String, enum: ["male", "female"], required: true },
    gradeAppliedFor: { type: Number, required: true, min: 1, max: 12 },

    // Documents
    documents: { type: [admissionDocumentSchema], default: [] },

    // Workflow
    status: {
      type: String,
      enum: ["INQUIRY", "PENDING_REVIEW", "INTERVIEW_SCHEDULED", "APPROVED", "REJECTED", "WAITLISTED"],
      default: "INQUIRY",
    },
    interviewDate: { type: Date },
    interviewTime: { type: String },
    interviewNotes: { type: String },
    reviewerNotes: { type: String },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },

    // Previous school
    previousSchool: { type: String, trim: true },
    transferReason: { type: String, trim: true },

    // Enrollment
    enrolledStudentId: { type: Schema.Types.ObjectId, ref: "User" },
    enrolledAt: { type: Date },
  },
  { timestamps: true }
);

admissionSchema.index({ tenantId: 1, status: 1 });
admissionSchema.index({ tenantId: 1, parentEmail: 1 });

admissionSchema.plugin(baseSchemaPlugin);

export default mongoose.model<IAdmission>("Admission", admissionSchema);
