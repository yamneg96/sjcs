import { env } from "../../config/env";
import { getContext } from "../context/request-context";

/**
 * Zero-dependency structured logger (§51: structured logs with request id +
 * org id). Emits pretty lines in development and single-line JSON in
 * production. Every entry is auto-tagged with the active request context
 * (requestId, tenantId, userId) when logging inside a request.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

const LEVEL_ORDER: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };
const MIN_LEVEL: number = env.NODE_ENV === "production" ? LEVEL_ORDER.info : LEVEL_ORDER.debug;

function emit(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  if (LEVEL_ORDER[level] < MIN_LEVEL) return;

  const ctx = getContext();
  const base = {
    level,
    time: new Date().toISOString(),
    message,
    ...(ctx?.requestId ? { requestId: ctx.requestId } : {}),
    ...(ctx?.tenantId ? { tenantId: ctx.tenantId } : {}),
    ...(ctx?.userId ? { userId: ctx.userId } : {}),
    ...(meta ?? {}),
  };

  if (env.NODE_ENV === "production") {
    // Single-line JSON for log aggregators
    console[level === "debug" ? "log" : level](JSON.stringify(base));
    return;
  }

  // Pretty for local dev
  const tag = ctx?.requestId ? ` [${ctx.requestId}${ctx.tenantId ? `/${ctx.tenantId}` : ""}]` : "";
  const metaStr = meta && Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
  console[level === "debug" ? "log" : level](
    `${base.time} ${level.toUpperCase()}${tag} ${message}${metaStr}`
  );
}

export const logger = {
  debug: (message: string, meta?: Record<string, unknown>) => emit("debug", message, meta),
  info: (message: string, meta?: Record<string, unknown>) => emit("info", message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => emit("warn", message, meta),
  error: (message: string, meta?: Record<string, unknown>) => emit("error", message, meta),
};
