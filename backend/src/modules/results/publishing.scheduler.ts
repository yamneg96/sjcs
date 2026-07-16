import { PublishingService } from "./publishing.service";
import { logger } from "../../shared/utils/logger";

/**
 * In-process release scheduler (§33, §50). Periodically flips due SCHEDULED
 * publishings to PUBLISHED. For a single-instance deployment this is
 * sufficient; a multi-instance deployment should move this to a leader-elected
 * BullMQ job (the sweep itself is already idempotent, so duplicate runs are
 * safe).
 */
const SWEEP_INTERVAL_MS = 30_000;
let timer: NodeJS.Timeout | null = null;

export function startPublishingScheduler(): void {
  if (timer) return;
  timer = setInterval(async () => {
    try {
      const count = await PublishingService.runReleaseSweep();
      if (count > 0) logger.info("Publishing release sweep flipped results live", { count });
    } catch (err) {
      logger.error("Publishing release sweep failed", {
        message: (err as Error).message,
      });
    }
  }, SWEEP_INTERVAL_MS);

  // Don't keep the event loop alive solely for the sweep.
  timer.unref?.();
  logger.info("Publishing scheduler started", { intervalMs: SWEEP_INTERVAL_MS });
}

export function stopPublishingScheduler(): void {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}
