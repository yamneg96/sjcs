import { Response } from "express";
import { AuthRequest } from "../../shared/types/auth.types";
import { sendSuccess } from "../../shared/utils/api-response";
import { BadRequestError } from "../../shared/errors/errors";
import ModelCatalogEntry from "./model-catalog.model";
import Device from "./device.model";
import LearningEvent from "../learning/learning-event.model";
import { AIGateway } from "../ai/ai.gateway";
import { ensureModelCatalogSeeded } from "./catalog.seed";
import {
  registerDeviceSchema,
  aiCompleteSchema,
  syncLearningEventsSchema,
} from "./mobile.validation";

/** "1.2.3" >= "1.2.0" — lenient semver compare for app-version gating */
function versionGte(version: string, minimum: string): boolean {
  const a = version.split(".").map((n) => parseInt(n, 10) || 0);
  const b = minimum.split(".").map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < 3; i++) {
    const diff = (a[i] || 0) - (b[i] || 0);
    if (diff !== 0) return diff > 0;
  }
  return true;
}

/**
 * GET /api/mobile/models
 * The model catalog, filtered/annotated for the requesting device.
 * Device profile arrives via query (?ramGB=&abi=&storageFreeBytes=) and the
 * x-app-version header. Models are never hardcoded in the app — this endpoint
 * is the only discovery path (§23.4).
 */
export async function getModels(req: AuthRequest, res: Response): Promise<void> {
  await ensureModelCatalogSeeded();

  const appVersion = (req.headers["x-app-version"] as string) || "1.0.0";
  const ramGB = req.query.ramGB ? Number(req.query.ramGB) : undefined;
  const abi = (req.query.abi as string) || undefined;
  const storageFreeBytes = req.query.storageFreeBytes
    ? Number(req.query.storageFreeBytes)
    : undefined;

  const entries = await ModelCatalogEntry.find({}).sort({ modelId: 1, version: -1 });

  const models = entries.map((entry) => {
    const reasons: string[] = [];
    if (!versionGte(appVersion, entry.compat.minAppVersion)) {
      reasons.push(`Requires app version ${entry.compat.minAppVersion}+`);
    }
    if (ramGB !== undefined && ramGB > 0 && ramGB < entry.minimumRAMGB) {
      reasons.push(`Requires ${entry.minimumRAMGB} GB RAM`);
    }
    if (abi && entry.compat.abis.length > 0 && !entry.compat.abis.includes(abi)) {
      reasons.push(`Not built for ${abi}`);
    }
    if (
      storageFreeBytes !== undefined &&
      storageFreeBytes > 0 &&
      storageFreeBytes < entry.sizeBytes * 1.2
    ) {
      reasons.push("Not enough free storage");
    }
    if (entry.status === "deprecated") {
      reasons.push("Deprecated — new installs blocked");
    }

    return {
      id: entry.modelId,
      displayName: entry.displayName,
      description: entry.description,
      engine: entry.engine,
      task: entry.task,
      capabilities: entry.capabilities,
      sizeBytes: entry.sizeBytes,
      quantization: entry.quantization,
      minimumRAMGB: entry.minimumRAMGB,
      languages: entry.languages,
      downloadUrl: entry.downloadUrl,
      tokenizerUrl: entry.tokenizerUrl,
      tokenizerConfigUrl: entry.tokenizerConfigUrl,
      checksum: entry.checksum,
      version: entry.version,
      status: entry.status,
      compat: entry.compat,
      eligible: reasons.length === 0,
      ineligibleReasons: reasons,
    };
  });

  sendSuccess(res, { models }, "Model catalog");
}

/**
 * POST /api/mobile/devices
 * Registers/refreshes the device capability profile (§16.4).
 */
export async function registerDevice(req: AuthRequest, res: Response): Promise<void> {
  const parsed = registerDeviceSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(parsed.error.issues[0]?.message || "Invalid device profile");
  }
  const input = parsed.data;

  const device = await Device.findOneAndUpdate(
    { userId: req.user!.id, deviceId: input.deviceId },
    { $set: { ...input, userId: req.user!.id, lastSeenAt: new Date() } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  sendSuccess(res, { device }, "Device profile registered");
}

/**
 * POST /api/mobile/ai/complete
 * The cloud path of the mobile Capability Router (§21.1). Every request is
 * wrapped by the Educational Pipeline on the way in (context → instruction)
 * and the Educational Formatter on the way out. Callers never pick a provider
 * — the AI Gateway orchestrates that.
 */
export async function aiComplete(req: AuthRequest, res: Response): Promise<void> {
  const parsed = aiCompleteSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(parsed.error.issues[0]?.message || "Invalid AI request");
  }
  const { task, prompt, eduContext, temperature, maxTokens } = parsed.data;

  // Single educational gate: pipeline (in) + moderation + formatter (out).
  const result = await AIGateway.completeEducational({
    task,
    prompt,
    eduContext,
    temperature,
    maxTokens,
    tenantId: req.user!.tenantId,
    isStudentFacing: task === "chat",
  });

  sendSuccess(
    res,
    {
      text: result.text,
      task,
      route: "cloud",
      provider: result.provider,
      model: result.model,
      usage: result.usage,
    },
    "AI completion"
  );
}

/**
 * POST /api/mobile/sync/learning-events
 * Batched, idempotent flush of the device's offline learning-event queue
 * (§46). Duplicate clientEventIds are silently skipped so retries are safe.
 */
export async function syncLearningEvents(req: AuthRequest, res: Response): Promise<void> {
  const parsed = syncLearningEventsSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(parsed.error.issues[0]?.message || "Invalid events batch");
  }

  const docs = parsed.data.events.map((event) => ({
    userId: req.user!.id,
    clientEventId: event.clientEventId,
    kind: event.kind,
    subject: event.subject,
    topic: event.topic,
    payload: event.payload,
    occurredAt: event.occurredAt ? new Date(event.occurredAt) : new Date(),
  }));

  let inserted = 0;
  try {
    const result = await LearningEvent.insertMany(docs, { ordered: false });
    inserted = result.length;
  } catch (err: any) {
    // E11000 duplicate keys are expected on retries — count what landed.
    if (err?.code === 11000 || err?.writeErrors) {
      inserted = err.insertedDocs?.length ?? err.result?.nInserted ?? 0;
    } else {
      throw err;
    }
  }

  sendSuccess(
    res,
    { received: docs.length, inserted, skipped: docs.length - inserted },
    "Learning events synced"
  );
}
