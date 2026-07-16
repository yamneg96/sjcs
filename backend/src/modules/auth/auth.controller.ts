import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { sendSuccess } from "../../shared/utils/api-response";
import { asyncHandler } from "../../shared/utils/async-handler";
import {
  registerIndividualSchema,
  registerOrganizationSchema,
  loginSchema,
  verifyStudentFirstTimeSchema,
  setupPasswordFirstTimeSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
  refreshSchema,
  logoutSchema,
} from "./auth.validation";
import { BadRequestError } from "../../shared/errors/errors";
import { ISessionMeta } from "./auth.service";

/** Extracts session metadata (device binding, user agent, IP) from a request. */
function sessionMeta(req: Request): ISessionMeta {
  return {
    deviceId: typeof req.body?.deviceId === "string" ? req.body.deviceId : undefined,
    userAgent: req.headers["user-agent"],
    ipAddress: req.ip,
  };
}

export const registerIndividual = asyncHandler(async (req: Request, res: Response) => {
  const parsed = registerIndividualSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(parsed.error.errors[0].message);
  }

  const individual = await AuthService.registerIndividual(parsed.data);
  sendSuccess(res, { id: individual._id, email: individual.email }, "Registration successful. Please verify email.", 201);
});

export const registerOrganization = asyncHandler(async (req: Request, res: Response) => {
  const parsed = registerOrganizationSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(parsed.error.errors[0].message);
  }

  const { organization, owner } = await AuthService.registerOrganization(parsed.data);
  sendSuccess(res, {
    org: { id: organization._id, name: organization.name, slug: organization.slug },
    owner: { id: owner._id, email: owner.email }
  }, "Organization registered. Please verify owner email.", 201);
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const token = req.query.token as string;
  if (!token) {
    throw new BadRequestError("Token is required");
  }

  const user = await AuthService.verifyEmail(token);
  sendSuccess(res, { id: user._id, email: user.email }, "Email verified successfully");
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(parsed.error.errors[0].message);
  }

  const result = await AuthService.login(parsed.data, sessionMeta(req));
  sendSuccess(res, result, "Logged in successfully");
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const parsed = refreshSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(parsed.error.errors[0].message);
  }

  const tokens = await AuthService.refreshTokens(parsed.data.refreshToken, sessionMeta(req));
  sendSuccess(res, tokens, "Token refreshed");
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const parsed = logoutSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(parsed.error.errors[0].message);
  }

  await AuthService.logout(parsed.data.refreshToken);
  sendSuccess(res, null, "Logged out successfully");
});

export const verifyStudentFirstTime = asyncHandler(async (req: Request, res: Response) => {
  const parsed = verifyStudentFirstTimeSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(parsed.error.errors[0].message);
  }

  const result = await AuthService.verifyStudentFirstTime(parsed.data);
  sendSuccess(res, result, "Identity verified successfully");
});

export const setupPasswordFirstTime = asyncHandler(async (req: Request, res: Response) => {
  const parsed = setupPasswordFirstTimeSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(parsed.error.errors[0].message);
  }

  await AuthService.setupPasswordFirstTime(parsed.data);
  sendSuccess(res, null, "Account activated successfully. You can now login.");
});

export const requestPasswordReset = asyncHandler(async (req: Request, res: Response) => {
  const parsed = requestPasswordResetSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(parsed.error.errors[0].message);
  }

  await AuthService.requestPasswordReset(parsed.data.email);
  sendSuccess(res, null, "If the email exists, a password reset link has been sent.");
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const parsed = resetPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(parsed.error.errors[0].message);
  }

  await AuthService.resetPassword(parsed.data);
  sendSuccess(res, null, "Password reset successfully");
});
