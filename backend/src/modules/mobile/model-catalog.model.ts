import mongoose, { Document, Schema } from "mongoose";

/**
 * Model Catalog — the platform-scoped source of truth for GET /api/mobile/models.
 *
 * Per ADR-003, models are managed artifacts, never code constants. A catalog
 * entry describes one downloadable on-device model (ExecuTorch `.pte` bundle):
 * where it lives (R2/object storage URL), how big it is, what device it needs,
 * and how the client verifies integrity. Publishing / deprecating a model is a
 * data operation on this collection — no app release required.
 */

export type ModelEngine = "executorch";
export type ModelTask = "chat" | "embedding" | "asr" | "vision";
export type ModelCatalogStatus = "canary" | "stable" | "deprecated";

export interface IModelCatalogEntry extends Document {
  modelId: string; // catalog identifier, e.g. "chat-2b" — NOT an architectural dependency
  displayName: string;
  description?: string;
  engine: ModelEngine;
  task: ModelTask;
  capabilities: string[]; // e.g. ["chat", "quiz", "summary", "flashcards", "translation"]
  sizeBytes: number;
  quantization: string; // e.g. "4bit"
  minimumRAMGB: number;
  languages: string[];
  downloadUrl: string; // R2 public/CDN URL of the model artifact (.pte)
  tokenizerUrl?: string; // companion artifact (tokenizer.json)
  tokenizerConfigUrl?: string; // companion artifact (tokenizer_config.json)
  checksum: string; // "md5:<hex>" or "sha256:<hex>" — verified on-device before REGISTERING
  version: string;
  status: ModelCatalogStatus;
  compat: {
    minAppVersion: string;
    abis: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const modelCatalogSchema = new Schema<IModelCatalogEntry>(
  {
    modelId: { type: String, required: true, trim: true },
    displayName: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    engine: { type: String, enum: ["executorch"], default: "executorch" },
    task: {
      type: String,
      enum: ["chat", "embedding", "asr", "vision"],
      required: true,
    },
    capabilities: { type: [String], default: [] },
    sizeBytes: { type: Number, required: true },
    quantization: { type: String, default: "4bit" },
    minimumRAMGB: { type: Number, default: 6 },
    languages: { type: [String], default: ["English", "Amharic"] },
    downloadUrl: { type: String, required: true },
    tokenizerUrl: { type: String },
    tokenizerConfigUrl: { type: String },
    checksum: { type: String, required: true },
    version: { type: String, required: true },
    status: {
      type: String,
      enum: ["canary", "stable", "deprecated"],
      default: "stable",
      index: true,
    },
    compat: {
      minAppVersion: { type: String, default: "1.0.0" },
      abis: { type: [String], default: ["arm64-v8a"] },
    },
  },
  { timestamps: true }
);

// One catalog row per (modelId, version)
modelCatalogSchema.index({ modelId: 1, version: 1 }, { unique: true });

const ModelCatalogEntry = mongoose.model<IModelCatalogEntry>(
  "ModelCatalogEntry",
  modelCatalogSchema
);

export default ModelCatalogEntry;
