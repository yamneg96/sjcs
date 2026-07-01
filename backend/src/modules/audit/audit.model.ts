import mongoose, { Document, Schema } from "mongoose";

export interface IAuditLog extends Document {
  tenantId: string;
  userId: string;
  action: string; // e.g. "auth.login", "user.create", "material.upload"
  description: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    tenantId: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    action: { type: String, required: true, index: true },
    description: { type: String, required: true },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

auditLogSchema.index({ tenantId: 1, action: 1 });

export default mongoose.model<IAuditLog>("AuditLog", auditLogSchema);
