import { Schema } from "mongoose";

/**
 * Base-schema plugin (§17 database strategy) — adds the standard cross-cutting
 * fields and behavior every business collection should carry:
 *
 *   - createdBy / updatedBy  → actor attribution (audit trail)
 *   - deletedAt              → soft delete (records are hidden, never destroyed)
 *
 * Soft-deleted documents are transparently excluded from reads. Pass
 * `.setOptions({ withDeleted: true })` on a query to include them (e.g. admin
 * restore/export flows).
 *
 * Versioning: Mongoose maintains `__v` automatically; enable
 * `optimisticConcurrency: true` in a model's schema options for grade-bearing
 * / money collections that need conflict detection on concurrent writes.
 *
 * Apply with `schema.plugin(baseSchemaPlugin)`.
 */
export function baseSchemaPlugin(schema: Schema): void {
  // Only add fields a model hasn't already defined itself (e.g. a model may
  // declare createdBy as `required` — don't clobber that).
  if (!schema.path("createdBy")) {
    schema.add({ createdBy: { type: Schema.Types.ObjectId, ref: "User" } });
  }
  if (!schema.path("updatedBy")) {
    schema.add({ updatedBy: { type: Schema.Types.ObjectId, ref: "User" } });
  }
  if (!schema.path("deletedAt")) {
    schema.add({ deletedAt: { type: Date, default: null, index: true } });
  }

  // Exclude soft-deleted documents from reads unless explicitly requested.
  const readHooks = ["find", "findOne", "findOneAndUpdate", "countDocuments"] as const;
  for (const hook of readHooks) {
    schema.pre(hook, function (next) {
      // `this` is a Mongoose Query here.
      const query = this as unknown as {
        getOptions: () => Record<string, unknown>;
        getFilter: () => Record<string, unknown>;
        where: (path: string) => { equals: (v: unknown) => void };
      };
      if (!query.getOptions().withDeleted) {
        const filter = query.getFilter();
        if (filter.deletedAt === undefined) {
          query.where("deletedAt").equals(null);
        }
      }
      next();
    });
  }

  /** Soft-delete this document (hide it, keep it). */
  schema.methods.softDelete = async function (actorId?: string) {
    this.deletedAt = new Date();
    if (actorId) this.updatedBy = actorId;
    return this.save();
  };
}
