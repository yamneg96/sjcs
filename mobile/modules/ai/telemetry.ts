import AsyncStorage from "@react-native-async-storage/async-storage";
import { LearningEventInput, syncLearningEvents } from "@/api/ai";
import { isOnline } from "./engine/capability.service";

/**
 * Learning-event telemetry with an offline queue (§46). Every activity
 * (chat turn, quiz result, routing decision, …) is recorded locally with a
 * client-generated UUID and flushed to POST /mobile/sync/learning-events in
 * idempotent batches when connectivity allows. Server dedupes by
 * clientEventId, so retries are always safe.
 */

const QUEUE_KEY = "lumora.learning-events.queue";
const MAX_QUEUE = 500;
const BATCH_SIZE = 100;

function makeEventId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

async function readQueue(): Promise<LearningEventInput[]> {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    return raw ? (JSON.parse(raw) as LearningEventInput[]) : [];
  } catch {
    return [];
  }
}

async function writeQueue(queue: LearningEventInput[]): Promise<void> {
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue.slice(-MAX_QUEUE)));
}

/** Records an event and opportunistically flushes the queue. Never throws. */
export async function recordLearningEvent(
  event: Omit<LearningEventInput, "clientEventId" | "occurredAt">
): Promise<void> {
  try {
    const queue = await readQueue();
    queue.push({
      ...event,
      clientEventId: makeEventId(),
      occurredAt: new Date().toISOString(),
    });
    await writeQueue(queue);
    void flushLearningEvents();
  } catch (err) {
    console.warn("[Lumora AI] Failed to record learning event.", err);
  }
}

let flushing = false;

/** Flushes queued events in batches. Safe to call anytime (no-op offline). */
export async function flushLearningEvents(): Promise<void> {
  if (flushing) return;
  flushing = true;
  try {
    if (!(await isOnline())) return;
    let queue = await readQueue();
    while (queue.length > 0) {
      const batch = queue.slice(0, BATCH_SIZE);
      await syncLearningEvents(batch);
      queue = queue.slice(batch.length);
      await writeQueue(queue);
    }
  } catch {
    // Stay queued; next flush retries. Idempotent server-side.
  } finally {
    flushing = false;
  }
}
