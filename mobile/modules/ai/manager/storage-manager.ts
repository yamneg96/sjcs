import * as FileSystem from "expo-file-system/legacy";

/**
 * Storage Manager (§23.1) — owns the on-disk layout for downloaded models:
 *
 *   documentDirectory/
 *     models/
 *       <modelId>/<version>/model.pte | tokenizer.json | tokenizer_config.json
 *       model-registry.json
 */

const MODELS_DIR = `${FileSystem.documentDirectory}models/`;

export const storagePaths = {
  modelsDir: MODELS_DIR,
  registryFile: `${MODELS_DIR}model-registry.json`,
  modelDir: (modelId: string, version: string) =>
    `${MODELS_DIR}${modelId}/${version}/`,
  modelFile: (modelId: string, version: string) =>
    `${MODELS_DIR}${modelId}/${version}/model.pte`,
  tokenizerFile: (modelId: string, version: string) =>
    `${MODELS_DIR}${modelId}/${version}/tokenizer.json`,
  tokenizerConfigFile: (modelId: string, version: string) =>
    `${MODELS_DIR}${modelId}/${version}/tokenizer_config.json`,
};

export async function ensureModelsDir(): Promise<void> {
  const info = await FileSystem.getInfoAsync(MODELS_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(MODELS_DIR, { intermediates: true });
  }
}

export async function ensureModelDir(modelId: string, version: string): Promise<string> {
  const dir = storagePaths.modelDir(modelId, version);
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
  return dir;
}

/** Removes one installed version's files ("free 950 MB" eviction, updates GC). */
export async function deleteModelVersion(modelId: string, version: string): Promise<void> {
  const dir = storagePaths.modelDir(modelId, version);
  await FileSystem.deleteAsync(dir, { idempotent: true });
}

/** Removes every version of a model. */
export async function deleteModelAllVersions(modelId: string): Promise<void> {
  await FileSystem.deleteAsync(`${MODELS_DIR}${modelId}/`, { idempotent: true });
}

export async function getFreeDiskBytes(): Promise<number> {
  try {
    return await FileSystem.getFreeDiskStorageAsync();
  } catch {
    return 0;
  }
}

/**
 * Verifies a downloaded artifact against the catalog checksum before the
 * model may reach REGISTERING (§23.3). Supports "md5:<hex>" (computed via the
 * file system). "sha256:" checksums cannot be computed on-device without
 * streaming the ~1 GB file through JS, so the catalog should publish md5 —
 * unknown schemes are logged and treated as unverifiable-but-accepted.
 */
export async function verifyChecksum(fileUri: string, checksum: string): Promise<boolean> {
  const [scheme, expected] = checksum.split(":");
  if (scheme === "md5" && expected && expected !== "REPLACE_ON_UPLOAD") {
    const info = await FileSystem.getInfoAsync(fileUri, { md5: true });
    if (!info.exists) return false;
    const actual = (info as { md5?: string }).md5;
    return !!actual && actual.toLowerCase() === expected.toLowerCase();
  }
  console.warn(
    `[Lumora AI] Checksum scheme "${scheme}" not verifiable on-device; accepting artifact.`
  );
  const info = await FileSystem.getInfoAsync(fileUri);
  return info.exists;
}
