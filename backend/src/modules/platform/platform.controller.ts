import { Response } from "express";
import { z } from "zod";
import { AuthRequest } from "../../shared/types/auth.types";
import { sendSuccess } from "../../shared/utils/api-response";
import { asyncHandler } from "../../shared/utils/async-handler";
import { BadRequestError } from "../../shared/errors/errors";
import { PlatformService } from "./platform.service";

const suspendSchema = z.object({ suspended: z.boolean() });
const modelStatusSchema = z.object({
  status: z.enum(["canary", "stable", "deprecated"]),
});

export const getPlatformStats = asyncHandler(async (_req: AuthRequest, res: Response) => {
  sendSuccess(res, await PlatformService.getStats(), "Platform stats");
});

export const listOrganizations = asyncHandler(async (_req: AuthRequest, res: Response) => {
  sendSuccess(res, await PlatformService.listOrganizations(), "Organizations retrieved");
});

export const setOrganizationSuspended = asyncHandler(async (req: AuthRequest, res: Response) => {
  const parsed = suspendSchema.safeParse(req.body);
  if (!parsed.success) throw new BadRequestError(parsed.error.errors[0].message);

  const org = await PlatformService.setOrganizationSuspended(
    req.params.orgId as string,
    parsed.data.suspended,
    req.user!.id
  );
  sendSuccess(res, org, parsed.data.suspended ? "Organization suspended" : "Organization reactivated");
});

export const listModels = asyncHandler(async (_req: AuthRequest, res: Response) => {
  sendSuccess(res, await PlatformService.listModels(), "Model catalog retrieved");
});

export const setModelStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const parsed = modelStatusSchema.safeParse(req.body);
  if (!parsed.success) throw new BadRequestError(parsed.error.errors[0].message);

  const entry = await PlatformService.setModelStatus(
    req.params.modelId as string,
    parsed.data.status,
    req.user!.id
  );
  sendSuccess(res, entry, "Model status updated");
});
