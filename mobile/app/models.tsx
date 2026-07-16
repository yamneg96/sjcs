import React from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAIModels, ModelListItem } from "@/hooks/use-ai-models";
import {
  ArrowLeftIcon,
  CpuIcon,
  DownloadIcon,
  Trash2Icon,
  PauseIcon,
  PlayIcon,
  XIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
  HardDriveIcon,
  WifiOffIcon,
} from "lucide-react-native";

/**
 * AI Models screen (§45) — catalog of device-eligible on-device models with
 * Play-Store-like install states, driven entirely by GET /mobile/models and
 * model-registry.json. Models are never hardcoded.
 */

function formatBytes(bytes: number): string {
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
  return `${Math.round(bytes / 1024 ** 2)} MB`;
}

function StatusChip({ item }: { item: ModelListItem }) {
  const status = item.progress?.status;

  if (status === "downloading" || status === "updating") {
    const pct = Math.round((item.progress?.progress ?? 0) * 100);
    return (
      <View className="bg-secondary/20 px-2 py-0.5 rounded-full">
        <Text className="text-[10px] font-bold text-secondary">
          {status === "updating" ? "Updating" : "Downloading"} {pct}%
        </Text>
      </View>
    );
  }
  if (status === "verifying" || status === "registering") {
    return (
      <View className="bg-secondary/20 px-2 py-0.5 rounded-full">
        <Text className="text-[10px] font-bold text-secondary">
          {status === "verifying" ? "Verifying…" : "Installing…"}
        </Text>
      </View>
    );
  }
  if (status === "error") {
    return (
      <View className="bg-destructive/15 px-2 py-0.5 rounded-full">
        <Text className="text-[10px] font-bold text-destructive">Failed</Text>
      </View>
    );
  }
  if (item.installed) {
    return (
      <View className={`px-2 py-0.5 rounded-full ${item.updateAvailable ? "bg-secondary/20" : "bg-chart-3/20"}`}>
        <Text className={`text-[10px] font-bold ${item.updateAvailable ? "text-secondary" : "text-foreground"}`}>
          {item.updateAvailable ? "Update available" : `Ready · v${item.installed.version}`}
        </Text>
      </View>
    );
  }
  if (item.catalog.status === "deprecated") {
    return (
      <View className="bg-muted px-2 py-0.5 rounded-full">
        <Text className="text-[10px] font-bold text-muted-foreground">Deprecated</Text>
      </View>
    );
  }
  return (
    <View className="bg-muted px-2 py-0.5 rounded-full">
      <Text className="text-[10px] font-bold text-muted-foreground">Not installed</Text>
    </View>
  );
}

function ModelCard({
  item,
  actions,
}: {
  item: ModelListItem;
  actions: ReturnType<typeof useAIModels>;
}) {
  const { catalog, installed, progress, updateAvailable } = item;
  const busy =
    progress &&
    ["downloading", "updating", "verifying", "registering"].includes(progress.status);

  const handleInstall = () => {
    actions.install(catalog).catch((err: Error) => {
      Alert.alert("Installation failed", err.message);
    });
  };

  const handleRemove = () => {
    Alert.alert(
      "Remove model?",
      `This frees ${formatBytes(catalog.sizeBytes)}. Offline AI for its features will stop working until you download it again.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", style: "destructive", onPress: () => void actions.remove(catalog.id) },
      ]
    );
  };

  return (
    <View className="bg-card border border-border/40 rounded-2xl p-4 shadow-sm mb-3">
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-row items-center gap-3 flex-1">
          <View className="bg-primary/10 p-2.5 rounded-xl">
            <CpuIcon className="text-primary size-5" />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-bold text-foreground">{catalog.displayName}</Text>
            <Text className="text-[11px] text-muted-foreground">
              {formatBytes(catalog.sizeBytes)} · {catalog.quantization} · needs {catalog.minimumRAMGB} GB RAM
            </Text>
          </View>
        </View>
        <StatusChip item={item} />
      </View>

      {catalog.description ? (
        <Text className="text-xs text-muted-foreground mb-2">{catalog.description}</Text>
      ) : null}

      <View className="flex-row flex-wrap gap-1.5 mb-3">
        {catalog.languages.map((lang) => (
          <View key={lang} className="bg-accent px-2 py-0.5 rounded-full">
            <Text className="text-[10px] text-accent-foreground font-medium">{lang}</Text>
          </View>
        ))}
        {catalog.capabilities.map((cap) => (
          <View key={cap} className="bg-secondary/10 px-2 py-0.5 rounded-full">
            <Text className="text-[10px] text-secondary font-medium capitalize">{cap}</Text>
          </View>
        ))}
      </View>

      {/* Progress bar while downloading */}
      {busy && (
        <View className="h-1.5 bg-muted rounded-full mb-3 overflow-hidden">
          <View
            className="h-full bg-secondary rounded-full"
            style={{ width: `${Math.round((progress?.progress ?? 0) * 100)}%` }}
          />
        </View>
      )}

      {progress?.status === "error" && progress.error ? (
        <View className="flex-row items-center gap-1.5 mb-3">
          <AlertTriangleIcon className="text-destructive size-3.5" />
          <Text className="text-[11px] text-destructive flex-1">{progress.error}</Text>
        </View>
      ) : null}

      {!catalog.eligible && !installed ? (
        <View className="flex-row items-center gap-1.5 mb-1">
          <AlertTriangleIcon className="text-muted-foreground size-3.5" />
          <Text className="text-[11px] text-muted-foreground flex-1">
            {catalog.ineligibleReasons.join(" · ")}
          </Text>
        </View>
      ) : busy ? (
        <View className="flex-row gap-2">
          <Button
            variant="outline"
            className="flex-1 h-10 rounded-xl flex-row items-center justify-center gap-1.5"
            onPress={() => void actions.pause(catalog.id)}
          >
            <PauseIcon className="text-foreground size-3.5" />
            <Text className="text-xs font-semibold">Pause</Text>
          </Button>
          <Button
            variant="outline"
            className="flex-1 h-10 rounded-xl flex-row items-center justify-center gap-1.5"
            onPress={() => void actions.resume(catalog.id)}
          >
            <PlayIcon className="text-foreground size-3.5" />
            <Text className="text-xs font-semibold">Resume</Text>
          </Button>
          <Button
            variant="destructive"
            className="h-10 w-10 rounded-xl items-center justify-center"
            onPress={() => void actions.cancel(catalog.id)}
          >
            <XIcon size={14} color="#fff" />
          </Button>
        </View>
      ) : installed ? (
        <View className="flex-row gap-2">
          {updateAvailable && catalog.eligible && (
            <Button
              className="flex-1 h-10 rounded-xl bg-secondary flex-row items-center justify-center gap-1.5"
              onPress={handleInstall}
            >
              <DownloadIcon size={14} color="#fff" />
              <Text className="text-xs font-semibold text-secondary-foreground">
                Update to v{catalog.version}
              </Text>
            </Button>
          )}
          <Button
            variant="outline"
            className="flex-1 h-10 rounded-xl flex-row items-center justify-center gap-1.5"
            onPress={handleRemove}
          >
            <Trash2Icon className="text-destructive size-3.5" />
            <Text className="text-xs font-semibold text-destructive">
              Remove ({formatBytes(catalog.sizeBytes)})
            </Text>
          </Button>
        </View>
      ) : (
        <Button
          className="h-11 rounded-xl bg-primary flex-row items-center justify-center gap-2"
          onPress={handleInstall}
          disabled={catalog.status === "deprecated"}
        >
          <DownloadIcon size={15} color="#fff" />
          <Text className="text-sm font-semibold text-primary-foreground">
            Download · {formatBytes(catalog.sizeBytes)}
          </Text>
        </Button>
      )}
    </View>
  );
}

export default function AIModelsScreen() {
  const aiModels = useAIModels();
  const { models, profile, isLoading, error, refetch } = aiModels;

  const readyCount = models.filter((m) => m.installed).length;

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="pt-14 pb-4 px-4 bg-card border-b border-border/40 flex-row items-center gap-3">
        <Button variant="ghost" size="icon" onPress={() => router.back()}>
          <ArrowLeftIcon className="text-foreground size-5" />
        </Button>
        <View className="flex-1">
          <Text className="text-lg font-bold text-foreground">AI Models</Text>
          <Text className="text-[11px] text-muted-foreground">
            Download once on Wi-Fi · study offline forever
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      >
        {/* Device capability summary */}
        {profile && (
          <View className="bg-card border border-border/40 rounded-2xl p-4 mb-4 flex-row items-center gap-3">
            <View className="bg-secondary/15 p-2.5 rounded-xl">
              <HardDriveIcon className="text-secondary size-5" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-bold text-foreground">
                This device{profile.totalRAMGB ? ` · ${profile.totalRAMGB} GB RAM` : ""}
              </Text>
              <Text className="text-[11px] text-muted-foreground">
                {formatBytes(profile.storageFreeBytes)} free ·{" "}
                {readyCount > 0
                  ? `${readyCount} model${readyCount > 1 ? "s" : ""} ready for offline AI`
                  : "No on-device model yet — AI runs via cloud"}
              </Text>
            </View>
            {readyCount > 0 && <CheckCircle2Icon className="text-chart-3 size-5" />}
          </View>
        )}

        {error ? (
          <View className="bg-card border border-dashed border-border p-6 rounded-2xl items-center">
            <WifiOffIcon className="text-muted-foreground mb-2 size-8" />
            <Text className="text-sm text-center text-muted-foreground mb-3">
              Couldn&apos;t load the model catalog. You need a connection to discover models —
              already-installed models keep working offline.
            </Text>
            <Button variant="outline" className="rounded-xl" onPress={() => refetch()}>
              <Text className="text-xs font-semibold">Retry</Text>
            </Button>
          </View>
        ) : isLoading ? (
          <View className="items-center py-12">
            <ActivityIndicator />
          </View>
        ) : models.length === 0 ? (
          <View className="bg-card border border-dashed border-border p-6 rounded-2xl items-center">
            <CpuIcon className="text-muted-foreground mb-2 size-8" />
            <Text className="text-sm text-center text-muted-foreground">
              No models are available for this device yet.
            </Text>
          </View>
        ) : (
          models.map((item) => (
            <ModelCard key={item.catalog.id} item={item} actions={aiModels} />
          ))
        )}

        <Text className="text-[11px] text-muted-foreground text-center mt-4 px-6">
          Models are verified with checksums before install and update automatically in the
          background. Removing a model never deletes your notes, quizzes or progress.
        </Text>
      </ScrollView>
    </View>
  );
}
