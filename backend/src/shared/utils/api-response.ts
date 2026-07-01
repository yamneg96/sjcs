import { Response } from "express";
import { IApiResponse } from "../types/api.types";

export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200
): void {
  const response: IApiResponse<T> = {
    success: true,
    message,
    data,
  };
  res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 400,
  errors?: any
): void {
  const response: IApiResponse<null> = {
    success: false,
    message,
    errors,
  };
  res.status(statusCode).json(response);
}
