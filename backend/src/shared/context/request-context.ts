import { AsyncLocalStorage } from "async_hooks";

/**
 * Per-request context propagated via AsyncLocalStorage (§12.2). Populated once
 * by the context middleware and read anywhere downstream — the structured
 * logger tags every line with it, and (going forward) the TenantRepository
 * reads `tenantId` from here so handlers never hand-write an org filter.
 */
export interface RequestContext {
  requestId: string;
  userId?: string;
  tenantId?: string;
  roles?: string[];
}

const storage = new AsyncLocalStorage<RequestContext>();

/** Runs `fn` with the given context bound for the duration of the async chain. */
export function runWithContext<T>(context: RequestContext, fn: () => T): T {
  return storage.run(context, fn);
}

/** Returns the active request context, or undefined outside a request (jobs, startup). */
export function getContext(): RequestContext | undefined {
  return storage.getStore();
}

/** Convenience: the active tenant id, or undefined. */
export function getTenantId(): string | undefined {
  return storage.getStore()?.tenantId;
}

/** Merges fields into the active context (e.g. userId/tenantId after auth resolves). */
export function patchContext(patch: Partial<RequestContext>): void {
  const current = storage.getStore();
  if (current) Object.assign(current, patch);
}
