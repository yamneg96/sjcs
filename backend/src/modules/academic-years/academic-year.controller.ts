import { Response } from "express";
import { AuthRequest } from "../../shared/types/auth.types";
import { sendSuccess } from "../../shared/utils/api-response";
import { asyncHandler } from "../../shared/utils/async-handler";
import { BadRequestError } from "../../shared/errors/errors";
import { AcademicYearService } from "./academic-year.service";
import {
  createAcademicYearSchema,
  updateAcademicYearSchema,
} from "./academic-year.validation";

// Tenant scoping is enforced by the TenantRepository via request context.
export const createAcademicYear = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new BadRequestError("Auth context required");

  const parsed = createAcademicYearSchema.safeParse(req.body);
  if (!parsed.success) throw new BadRequestError(parsed.error.errors[0].message);

  const year = await AcademicYearService.create(userId, parsed.data);
  sendSuccess(res, year, "Academic year created", 201);
});

export const listAcademicYears = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const years = await AcademicYearService.list();
  sendSuccess(res, years, "Academic years retrieved");
});

export const getCurrentAcademicYear = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const year = await AcademicYearService.getCurrent();
  sendSuccess(res, year, "Current academic year");
});

export const updateAcademicYear = asyncHandler(async (req: AuthRequest, res: Response) => {
  const parsed = updateAcademicYearSchema.safeParse(req.body);
  if (!parsed.success) throw new BadRequestError(parsed.error.errors[0].message);

  const year = await AcademicYearService.update(req.params.yearId as string, parsed.data);
  sendSuccess(res, year, "Academic year updated");
});

export const setCurrentAcademicYear = asyncHandler(async (req: AuthRequest, res: Response) => {
  const year = await AcademicYearService.setCurrent(req.params.yearId as string);
  sendSuccess(res, year, "Current academic year updated");
});

export const closeAcademicYear = asyncHandler(async (req: AuthRequest, res: Response) => {
  const year = await AcademicYearService.close(req.params.yearId as string);
  sendSuccess(res, year, "Academic year closed");
});
