import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchModelCatalog, registerDevice } from "@/api/ai";
import {
  getDeviceProfile,
  DeviceProfile,
} from "@/modules/ai/engine/capability.service";
import * as modelManager from "@/modules/ai/manager/model-manager";
import {
  CatalogModel,
  InstallProgress,
  InstalledModel,
} from "@/modules/ai/types";

/**
 * State + actions for the AI Models screen (§45). Everything shown is driven
 * by the model catalog (server) and model-registry.json (device) — no hidden
 * model state.
 */

export interface ModelListItem {
  catalog: CatalogModel;
  installed?: InstalledModel;
  progress?: InstallProgress;
  updateAvailable: boolean;
}

export function useAIModels() {
  const [profile, setProfile] = useState<DeviceProfile | null>(null);
  const [installed, setInstalled] = useState<InstalledModel[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, InstallProgress>>({});

  const refreshInstalled = useCallback(async () => {
    setInstalled(await modelManager.listInstalled());
  }, []);

  // Device profile + installed registry on mount; subscribe to lifecycle events.
  useEffect(() => {
    let mounted = true;
    (async () => {
      const deviceProfile = await getDeviceProfile();
      if (!mounted) return;
      setProfile(deviceProfile);
      await refreshInstalled();
    })();

    const unsubscribe = modelManager.subscribe((progress) => {
      setProgressMap((prev) => ({ ...prev, [progress.modelId]: progress }));
      if (progress.status === "ready" || progress.status === "not_installed") {
        void refreshInstalled();
      }
    });
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [refreshInstalled]);

  const catalogQuery = useQuery({
    queryKey: ["mobile-model-catalog", profile?.deviceId],
    queryFn: () => fetchModelCatalog(profile ?? undefined),
    enabled: !!profile,
  });

  // Register the device profile (capability analytics + catalog filtering).
  useEffect(() => {
    if (!profile) return;
    registerDevice(
      profile,
      installed.map((m) => ({ modelId: m.id, version: m.version }))
    ).catch(() => {
      /* best-effort */
    });
  }, [profile, installed]);

  const models: ModelListItem[] = (catalogQuery.data?.data?.models ?? []).map(
    (catalog) => {
      const installedModel = installed.find((m) => m.id === catalog.id);
      return {
        catalog,
        installed: installedModel,
        progress: progressMap[catalog.id],
        updateAvailable: !!installedModel && installedModel.version !== catalog.version,
      };
    }
  );

  return {
    profile,
    models,
    isLoading: catalogQuery.isLoading || !profile,
    error: catalogQuery.error as Error | null,
    refetch: catalogQuery.refetch,
    install: (catalog: CatalogModel) => modelManager.installModel(catalog),
    pause: (modelId: string) => modelManager.pauseInstall(modelId),
    resume: (modelId: string) => modelManager.resumeInstall(modelId),
    cancel: (modelId: string) => modelManager.cancelInstall(modelId),
    remove: (modelId: string) => modelManager.removeModel(modelId),
  };
}
