import mongoose, { Schema } from "mongoose";
import { IBaseDocument } from "../../shared/types/base.types";

export interface IOrganization extends IBaseDocument {
  name: string;
  slug: string;
  logoUrl?: string;
  branding?: {
    primaryColor?: string;
    secondaryColor?: string;
  };
  aiConfig?: {
    allowedModels: string[];
    monthlyUsageLimit: number; // in USD or credits
    currentMonthlyUsage: number;
  };
  subscription?: {
    plan: "Free" | "Starter" | "Growth" | "Enterprise";
    status: "Active" | "Suspended" | "PastDue" | "Trialing";
    expiresAt?: Date;
  };
  isVerified: boolean;
  suspendedAt?: Date;
}

const organizationSchema = new Schema<IOrganization>(
  {
    tenantId: { type: String, required: true }, // For custom safety checks, same as _id
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    logoUrl: { type: String },
    branding: {
      primaryColor: { type: String, default: "#1976D2" },
      secondaryColor: { type: String, default: "#9C27B0" },
    },
    aiConfig: {
      allowedModels: { type: [String], default: ["bonsai", "gemma"] },
      monthlyUsageLimit: { type: Number, default: 50.00 }, // $50 default limit
      currentMonthlyUsage: { type: Number, default: 0 },
    },
    subscription: {
      plan: { type: String, enum: ["Free", "Starter", "Growth", "Enterprise"], default: "Free" },
      status: { type: String, enum: ["Active", "Suspended", "PastDue", "Trialing"], default: "Trialing" },
      expiresAt: { type: Date },
    },
    isVerified: { type: Boolean, default: false },
    suspendedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Auto-populate tenantId with organization objectId before validation
organizationSchema.pre("validate", function (next) {
  if (this.isNew) {
    this.tenantId = this._id.toString();
  }
  next();
});

export default mongoose.model<IOrganization>("Organization", organizationSchema);
