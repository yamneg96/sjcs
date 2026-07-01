import { Document } from "mongoose";

export interface IBaseDocument extends Document {
  tenantId: string; // "platform" for global data, or organizationId/tenantId
  createdAt: Date;
  updatedAt: Date;
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
