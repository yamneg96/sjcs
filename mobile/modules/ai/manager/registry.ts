import * as FileSystem from "expo-file-system/legacy";
import { InstalledModel, ModelRegistryFile } from "../types";
import { storagePaths, ensureModelsDir } from "./storage-manager";

/**
 * Local AI Registry (§23.2) — `model-registry.json` is the single local
 * truth. A model absent from the registry does not exist to the app, which
 * makes installs crash-safe: the registry entry is always written LAST, and
 * rewritten atomically (write-temp-then-rename).
 */

const EMPTY: ModelRegistryFile = { installed: [] };

export async function readRegistry(): Promise<ModelRegistryFile> {
  try {
    const info = await FileSystem.getInfoAsync(storagePaths.registryFile);
    if (!info.exists) return { ...EMPTY, installed: [] };
    const raw = await FileSystem.readAsStringAsync(storagePaths.registryFile);
    const parsed = JSON.parse(raw) as ModelRegistryFile;
    if (!Array.isArray(parsed.installed)) return { ...EMPTY, installed: [] };
    return parsed;
  } catch (err) {
    console.warn("[Lumora AI] Corrupt model registry, resetting.", err);
    return { ...EMPTY, installed: [] };
  }
}

export async function writeRegistry(registry: ModelRegistryFile): Promise<void> {
  await ensureModelsDir();
  const tmp = `${storagePaths.registryFile}.tmp`;
  await FileSystem.writeAsStringAsync(tmp, JSON.stringify(registry, null, 2));
  await FileSystem.deleteAsync(storagePaths.registryFile, { idempotent: true });
  await FileSystem.moveAsync({ from: tmp, to: storagePaths.registryFile });
}

/** Registers (or atomically replaces, for updates) an installed model. */
export async function registerModel(model: InstalledModel): Promise<InstalledModel | undefined> {
  const registry = await readRegistry();
  const previous = registry.installed.find((m) => m.id === model.id);
  registry.installed = [
    ...registry.installed.filter((m) => m.id !== model.id),
    model,
  ];
  await writeRegistry(registry);
  return previous;
}

export async function unregisterModel(modelId: string): Promise<void> {
  const registry = await readRegistry();
  registry.installed = registry.installed.filter((m) => m.id !== modelId);
  await writeRegistry(registry);
}

export async function getInstalledModel(modelId: string): Promise<InstalledModel | undefined> {
  const registry = await readRegistry();
  return registry.installed.find((m) => m.id === modelId);
}

/**
 * Capability lookup used by the router: a READY model whose capability set
 * covers the task. Feature code never branches on model ids (ADR-003).
 */
export async function getReadyModelForTask(task: string): Promise<InstalledModel | undefined> {
  const registry = await readRegistry();
  return registry.installed.find(
    (m) => m.status === "ready" && (m.capabilities.includes(task) || m.task === task)
  );
}
