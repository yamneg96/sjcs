import { Request, Response, NextFunction } from "express";
import { AppError } from "../shared/errors/AppError";
import { sendError } from "../shared/utils/api-response";
import { env } from "../config/env";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = "Internal server error";
  let errors: any = undefined;

  // AppError - Operational and known errors
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  // Mongoose CastError (e.g. invalid ObjectId)
  else if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for path: ${err.path}`;
  }
  // Mongoose Duplicate Key Error
  else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `Duplicate value for ${field}. Please use another value.`;
  }
  // Mongoose Validation Error
  else if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Database validation failed";
    errors = Object.values(err.errors || {}).map((e: any) => ({
      field: e.path,
      message: e.message,
    }));
  }
  // Zod Validation Error
  else if (err.name === "ZodError" || err.errors) {
    statusCode = 400;
    message = "Request validation failed";
    errors = err.errors;
  }
  // JWT Errors
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid auth token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Auth token expired";
  }

  // Log non-operational errors
  if (env.NODE_ENV === "development" || !(err instanceof AppError)) {
    console.error("💥 SYSTEM ERROR:", err);
  }

  sendError(
    res,
    message,
    statusCode,
    env.NODE_ENV === "development" ? { stack: err.stack, errors } : errors
  );
};
