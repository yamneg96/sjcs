import { Document, Types } from "mongoose";

export interface IBaseDocument extends Document {
  tenantId: string; // "platform" for global data, or organizationId/tenantId
  createdAt: Date;
  updatedAt: Date;
  // Provided by baseSchemaPlugin (infrastructure/database/base-schema.ts)
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  deletedAt?: Date | null;
  /** Soft-delete this document (set by baseSchemaPlugin). */
  softDelete?: (actorId?: string) => Promise<this>;
}

export interface IPaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface IPaginatedResult<T> {
  results: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}
