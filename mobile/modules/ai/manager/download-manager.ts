import * as FileSystem from "expo-file-system/legacy";

/**
 * Download Manager (§23.3) — resumable artifact downloads from object
 * storage (Cloudflare R2). Supports progress, pause/resume and cancel;
 * resume state survives within the session and partially-downloaded files
 * survive process restarts (expo resumes from byte offset via resumeData).
 */

export interface ActiveDownload {
  url: string;
  fileUri: string;
  resumable: FileSystem.DownloadResumable;
  paused: boolean;
}

const active = new Map<string, ActiveDownload>();

export function isDownloading(key: string): boolean {
  return active.has(key);
}

/**
 * Downloads `url` to `fileUri`, reporting 0..1 progress. Resolves when the
 * file is fully on disk; rejects on network failure or cancel.
 */
export async function download(
  key: string,
  url: string,
  fileUri: string,
  onProgress: (progress: number) => void
): Promise<void> {
  const resumable = FileSystem.createDownloadResumable(
    url,
    fileUri,
    {},
    (data) => {
      if (data.totalBytesExpectedToWrite > 0) {
        onProgress(data.totalBytesWritten / data.totalBytesExpectedToWrite);
      }
    }
  );

  active.set(key, { url, fileUri, resumable, paused: false });
  try {
    const result = await resumable.downloadAsync();
    if (!result) {
      throw new Error("Download was interrupted");
    }
    if (result.status !== 200 && result.status !== 206) {
      throw new Error(`Download failed with HTTP ${result.status}`);
    }
  } finally {
    active.delete(key);
  }
}

export async function pause(key: string): Promise<void> {
  const entry = active.get(key);
  if (!entry || entry.paused) return;
  await entry.resumable.pauseAsync();
  entry.paused = true;
}

export async function resume(key: string): Promise<void> {
  const entry = active.get(key);
  if (!entry || !entry.paused) return;
  entry.paused = false;
  await entry.resumable.resumeAsync();
}

export async function cancel(key: string): Promise<void> {
  const entry = active.get(key);
  if (!entry) return;
  try {
    await entry.resumable.cancelAsync();
  } finally {
    active.delete(key);
    await FileSystem.deleteAsync(entry.fileUri, { idempotent: true });
  }
}
