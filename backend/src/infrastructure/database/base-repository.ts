import { Document, FilterQuery, Model, QueryOptions, UpdateQuery } from "mongoose";

/**
 * Generic Mongoose data-access wrapper (§16.2 infrastructure/database). Modules
 * depend on a repository instance rather than calling models directly, which
 * gives a single place to add cross-cutting behavior (soft-delete, auditing,
 * tenant scoping — see TenantRepository).
 */
export class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  find(filter: FilterQuery<T> = {}, options: QueryOptions = {}): Promise<T[]> {
    return this.model.find(filter, null, options).exec();
  }

  updateOne(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<T | null> {
    return this.model.findOneAndUpdate(filter, update, { new: true }).exec();
  }

  updateMany(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<number> {
    return this.model
      .updateMany(filter, update)
      .exec()
      .then((res) => res.modifiedCount);
  }

  deleteOne(filter: FilterQuery<T>): Promise<boolean> {
    return this.model
      .deleteOne(filter)
      .exec()
      .then((res) => res.deletedCount > 0);
  }

  count(filter: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }

  exists(filter: FilterQuery<T>): Promise<boolean> {
    return this.model
      .exists(filter)
      .then((doc) => doc !== null);
  }
}
