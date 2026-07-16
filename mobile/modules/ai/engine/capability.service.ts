import * as Device from "expo-device";
import * as Network from "expo-network";
import { Platform } from "react-native";
import Constants from "expo-constants";
import { getFreeDiskBytes } from "../manager/storage-manager";

/**
 * Capability Service (§21) — the device profile (RAM, storage, ABI, app
 * version) used to filter the model catalog, and the live signals (online?)
 * the Capability Router needs per request.
 */

export interface DeviceProfile {
  deviceId: string;
  platform: "android" | "ios" | "web";
  osVersion?: string;
  appVersion: string;
  abi?: string;
  totalRAMGB?: number;
  storageFreeBytes: number;
}

export async function getDeviceProfile(): Promise<DeviceProfile> {
  const storageFreeBytes = await getFreeDiskBytes();
  const totalMemory = Device.totalMemory ?? undefined;

  return {
    deviceId: getStableDeviceId(),
    platform: Platform.OS === "ios" ? "ios" : Platform.OS === "web" ? "web" : "android",
    osVersion: Device.osVersion ?? undefined,
    appVersion: Constants.expoConfig?.version ?? "1.0.0",
    abi: Device.supportedCpuArchitectures?.[0],
    totalRAMGB: totalMemory ? Math.round(totalMemory / 1024 ** 3) : undefined,
    storageFreeBytes,
  };
}

let cachedDeviceId: string | null = null;

/** Stable per-install identifier (no PII), used for the device profile. */
function getStableDeviceId(): string {
  if (cachedDeviceId) return cachedDeviceId;
  const base =
    `${Device.modelId ?? Device.modelName ?? "device"}-${Device.osBuildId ?? "os"}`
      .replace(/[^a-zA-Z0-9-]/g, "")
      .slice(0, 48);
  cachedDeviceId = `${base}-${Platform.OS}`;
  return cachedDeviceId;
}

export async function isOnline(): Promise<boolean> {
  try {
    const state = await Network.getNetworkStateAsync();
    return !!state.isConnected && state.isInternetReachable !== false;
  } catch {
    return false;
  }
}
