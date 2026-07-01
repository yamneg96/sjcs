export interface IApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any;
}

export enum ApiErrorCode {
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  BAD_REQUEST = "BAD_REQUEST",
  NOT_FOUND = "NOT_FOUND",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  CONFLICT = "CONFLICT",
}
