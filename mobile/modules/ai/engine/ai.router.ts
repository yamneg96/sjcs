import { AITask, AIRoute, InstalledModel } from "../types";
import { getReadyModelForTask } from "../manager/registry";
import { isLocalRuntimeSupported } from "./inference";
import { isOnline } from "./capability.service";
import { recordLearningEvent } from "../telemetry";

/**
 * Capability Router (§21.1) — decides per request:
 *
 *   request(task) → is a READY local model registered for the task and the
 *   runtime available? → local (ExecuTorch)
 *   else online? → cloud (AI Gateway via POST /mobile/ai/complete)
 *   else → honest offline fallback
 *
 * Every decision is observable: {task, route, reason} is logged into the
 * learning-event stream (privacy-scoped) and surfaced in the UI's
 * transparency panel.
 */

export interface RouteDecision {
  route: AIRoute;
  reason: string;
  localModel?: InstalledModel;
  /** True when a READY local model exists even if it wasn't chosen. */
  hasLocalModel: boolean;
}

export async function routeRequest(task: AITask): Promise<RouteDecision> {
  const localModel = await getReadyModelForTask(task);
  const runtimeOk = isLocalRuntimeSupported();

  let decision: RouteDecision;

  if (localModel && runtimeOk) {
    decision = {
      route: "local",
      reason: `On-device model ready for '${task}'`,
      localModel,
      hasLocalModel: true,
    };
  } else if (await isOnline()) {
    decision = {
      route: "cloud",
      reason: localModel
        ? "Local runtime unavailable in this build — using cloud AI"
        : `No on-device model installed for '${task}' — using cloud AI`,
      hasLocalModel: !!localModel,
    };
  } else {
    decision = {
      route: "fallback",
      reason: localModel
        ? "Offline and local runtime unavailable"
        : "Offline with no on-device model installed",
      hasLocalModel: !!localModel,
    };
  }

  void recordLearningEvent({
    kind: "ai_route",
    payload: { task, route: decision.route, reason: decision.reason },
  });

  return decision;
}
