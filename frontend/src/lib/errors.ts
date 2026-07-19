/**
 * Narrows an unknown thrown value into a displayable message.
 *
 * The axios interceptor (services/axios.ts) attaches `extractedMessage` — the
 * server's `{ success:false, message }` envelope text — to rejected errors.
 * Prefer that, then fall back to the raw Error message.
 */
export function getErrorMessage(
  err: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (typeof err === "object" && err !== null && "extractedMessage" in err) {
    const extracted = (err as { extractedMessage?: unknown }).extractedMessage;
    if (typeof extracted === "string" && extracted) return extracted;
  }
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === "string" && err) return err;
  return fallback;
}
