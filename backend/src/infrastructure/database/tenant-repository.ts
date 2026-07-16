import { Document, FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import { BaseRepository } from "./base-repository";
import { getTenantId } from "../../shared/context/request-context";
import { InternalServerError } from "../../shared/errors/errors";

/**
 * Tenant-scoped repository (§12.2, ADR-004) — automatically injects the active
 * request's `tenantId` into every read, write, and delete. Handlers never
 * hand-write an org filter, so forgetting one (a cross-tenant leak — threat #1
 * in §47.1) is impossible by construction.
 *
 * Fail-closed: if there is no tenant in context (e.g. a job or a misconfigured
 * route), operations throw rather than silently querying across all tenants.
 * Platform-scoped access must use a BaseRepository explicitly, never this.
 */
export class TenantRepository<T extends Document> extends BaseRepository<T> {
  private tenant(): string {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new InternalServerError("Tenant context missing for a tenant-scoped query");
    }
    return tenantId;
  }

  private scoped(filter: FilterQuery<T> = {}): FilterQuery<T> {
    return { ...filter, tenantId: this.tenant() } as FilterQuery<T>;
  }

  override create(data: Partial<T>): Promise<T> {
    return super.create({ ...data, tenantId: this.tenant() } as Partial<T>);
  }

  override findById(id: string): Promise<T | null> {
    return this.model.findOne(this.scoped({ _id: id } as FilterQuery<T>)).exec();
  }

  override findOne(filter: FilterQuery<T>): Promise<T | null> {
    return super.findOne(this.scoped(filter));
  }

  override find(filter: FilterQuery<T> = {}, options: QueryOptions = {}): Promise<T[]> {
    return super.find(this.scoped(filter), options);
  }

  override updateOne(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<T | null> {
    return super.updateOne(this.scoped(filter), update);
  }

  override updateMany(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<number> {
    return super.updateMany(this.scoped(filter), update);
  }

  override deleteOne(filter: FilterQuery<T>): Promise<boolean> {
    return super.deleteOne(this.scoped(filter));
  }

  override count(filter: FilterQuery<T> = {}): Promise<number> {
    return super.count(this.scoped(filter));
  }

  override exists(filter: FilterQuery<T>): Promise<boolean> {
    return super.exists(this.scoped(filter));
  }
}
