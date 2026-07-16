import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";
import { runWithContext } from "./request-context";

/**
 * Establishes the per-request AsyncLocalStorage context (§12.2) as early as
 * possible in the middleware chain. A downstream auth middleware calls
 * `patchContext({ userId, tenantId, roles })` once the JWT is verified.
 *
 * Honors an inbound `x-request-id` (for tracing across services) or mints one,
 * and echoes it back on the response.
 */
export function requestContextMiddleware(req: Request, res: Response, next: NextFunction): void {
  const requestId = (req.headers["x-request-id"] as string) || randomUUID();
  res.setHeader("x-request-id", requestId);

  runWithContext({ requestId }, () => next());
}
