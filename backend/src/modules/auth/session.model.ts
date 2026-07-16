import mongoose, { Document, Schema } from "mongoose";

/**
 * Refresh-token session (§13.2, §47.2). Each row is one rotating refresh token
 * in a "family". Rotation revokes the old row and creates a new one in the same
 * family; presenting an already-revoked token (token reuse) triggers revocation
 * of the whole family — the standard defense against stolen refresh tokens.
 *
 * Only the SHA-256 hash of the refresh token is stored, never the token itself.
 */
export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  tenantId: string;
  familyId: string; // rotation lineage
  refreshTokenHash: string; // sha256 of the active refresh token
  deviceId?: string; // device binding (mobile)
  userAgent?: string;
  ipAddress?: string;
  expiresAt: Date;
  revokedAt?: Date;
  reusedAt?: Date; // set when reuse of this token was detected
  lastUsedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tenantId: { type: String, required: true },
    familyId: { type: String, required: true, index: true },
    refreshTokenHash: { type: String, required: true, unique: true },
    deviceId: { type: String },
    userAgent: { type: String },
    ipAddress: { type: String },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date },
    reusedAt: { type: Date },
    lastUsedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Auto-purge expired sessions (TTL: remove once expiresAt passes).
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<ISession>("Session", sessionSchema);
