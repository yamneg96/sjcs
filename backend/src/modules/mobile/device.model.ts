import mongoose, { Document, Schema } from "mongoose";

/**
 * Device capability profile — registered by the mobile app on startup.
 * Used to filter the model catalog per device (RAM / ABI / app version)
 * and for platform analytics on the local-vs-cloud AI mix.
 */

export interface IDevice extends Document {
  userId: mongoose.Types.ObjectId;
  deviceId: string; // stable client-generated identifier
  platform: "android" | "ios" | "web";
  osVersion?: string;
  appVersion?: string;
  abi?: string;
  totalRAMGB?: number;
  storageFreeBytes?: number;
  installedModels: { modelId: string; version: string }[];
  lastSeenAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const deviceSchema = new Schema<IDevice>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    deviceId: { type: String, required: true },
    platform: { type: String, enum: ["android", "ios", "web"], default: "android" },
    osVersion: { type: String },
    appVersion: { type: String },
    abi: { type: String },
    totalRAMGB: { type: Number },
    storageFreeBytes: { type: Number },
    installedModels: {
      type: [
        {
          modelId: { type: String, required: true },
          version: { type: String, required: true },
        },
      ],
      default: [],
    },
    lastSeenAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

deviceSchema.index({ userId: 1, deviceId: 1 }, { unique: true });

const Device = mongoose.model<IDevice>("Device", deviceSchema);

export default Device;
