import {
  CatalogModel,
  InstallProgress,
  InstalledModel,
  ModelLifecycleStatus,
} from "../types";
import {
  ensureModelDir,
  deleteModelVersion,
  deleteModelAllVersions,
  storagePaths,
  verifyChecksum,
  getFreeDiskBytes,
} from "./storage-manager";
import * as downloads from "./download-manager";
import {
  registerModel,
  unregisterModel,
  getInstalledModel,
  readRegistry,
} from "./registry";
import { unloadModel } from "../engine/inference";

/**
 * Model Manager (§23) — orchestrates the Play-Store-like lifecycle:
 *
 *   NOT_INSTALLED → DOWNLOADING → VERIFYING → REGISTERING → READY
 *   READY → UPDATING → READY | READY → REMOVED
 *
 * Crash safety: files are written first, the registry entry LAST. A checksum
 * mismatch deletes the artifact and never registers the model.
 */

type Listener = (progress: InstallProgress) => void;

const listeners = new Set<Listener>();
const progressByModel = new Map<string, InstallProgress>();

function emit(modelId: string, status: ModelLifecycleStatus, progress = 0, error?: string) {
  const state: InstallProgress = { modelId, status, progress, error };
  progressByModel.set(modelId, state);
  listeners.forEach((listener) => listener(state));
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getProgress(modelId: string): InstallProgress | undefined {
  return progressByModel.get(modelId);
}

export async function listInstalled(): Promise<InstalledModel[]> {
  return (await readRegistry()).installed;
}

/**
 * Installs (or updates to) the catalog entry's version. Safe to call for an
 * already-installed model: same version is a no-op, newer version runs the
 * UPDATING path with an atomic registry switch and old-version GC.
 */
export async function installModel(entry: CatalogModel): Promise<void> {
  if (entry.status === "deprecated") {
    throw new Error(`${entry.displayName} is deprecated — new installs are blocked.`);
  }
  if (downloads.isDownloading(entry.id)) return;

  const existing = await getInstalledModel(entry.id);
  if (existing && existing.version === entry.version) {
    emit(entry.id, "ready", 1);
    return;
  }
  const isUpdate = !!existing;

  const free = await getFreeDiskBytes();
  if (free > 0 && free < entry.sizeBytes * 1.2) {
    const needGB = (entry.sizeBytes / 1024 ** 3).toFixed(1);
    throw new Error(`Not enough storage. Free up ~${needGB} GB and try again.`);
  }

  try {
    // --- DOWNLOADING ---
    emit(entry.id, isUpdate ? "updating" : "downloading", 0);
    await ensureModelDir(entry.id, entry.version);
    const modelPath = storagePaths.modelFile(entry.id, entry.version);
    await downloads.download(entry.id, entry.downloadUrl, modelPath, (p) =>
      emit(entry.id, isUpdate ? "updating" : "downloading", p)
    );

    let tokenizerPath: string | undefined;
    if (entry.tokenizerUrl) {
      tokenizerPath = storagePaths.tokenizerFile(entry.id, entry.version);
      await downloads.download(`${entry.id}:tokenizer`, entry.tokenizerUrl, tokenizerPath, () => {});
    }
    let tokenizerConfigPath: string | undefined;
    if (entry.tokenizerConfigUrl) {
      tokenizerConfigPath = storagePaths.tokenizerConfigFile(entry.id, entry.version);
      await downloads.download(
        `${entry.id}:tokenizer-config`,
        entry.tokenizerConfigUrl,
        tokenizerConfigPath,
        () => {}
      );
    }

    // --- VERIFYING ---
    emit(entry.id, "verifying", 1);
    const valid = await verifyChecksum(modelPath, entry.checksum);
    if (!valid) {
      await deleteModelVersion(entry.id, entry.version);
      throw new Error("Checksum verification failed. The download was discarded — please retry.");
    }

    // --- REGISTERING (registry entry written last: crash-safe) ---
    emit(entry.id, "registering", 1);
    const previous = await registerModel({
      id: entry.id,
      version: entry.version,
      task: entry.task,
      capabilities: entry.capabilities,
      status: "ready",
      modelPath,
      tokenizerPath,
      tokenizerConfigPath,
      sizeBytes: entry.sizeBytes,
      installedAt: new Date().toISOString(),
    });

    // GC the replaced version after the atomic registry switch.
    if (previous && previous.version !== entry.version) {
      await unloadModel();
      await deleteModelVersion(entry.id, previous.version);
    }

    emit(entry.id, "ready", 1);
  } catch (err: any) {
    emit(entry.id, "error", 0, err?.message || "Installation failed");
    throw err;
  }
}

export async function pauseInstall(modelId: string): Promise<void> {
  await downloads.pause(modelId);
}

export async function resumeInstall(modelId: string): Promise<void> {
  await downloads.resume(modelId);
}

export async function cancelInstall(modelId: string): Promise<void> {
  await downloads.cancel(modelId);
  emit(modelId, "not_installed", 0);
}

/** Full removal: unregister first (so the app stops seeing it), then delete files. */
export async function removeModel(modelId: string): Promise<void> {
  await unloadModel();
  await unregisterModel(modelId);
  await deleteModelAllVersions(modelId);
  emit(modelId, "not_installed", 0);
}
