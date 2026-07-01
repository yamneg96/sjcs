import { Response } from "express";
import { MaterialService } from "./material.service";
import { sendSuccess } from "../../shared/utils/api-response";
import { asyncHandler } from "../../shared/utils/async-handler";
import { createMaterialSchema, updateMaterialSchema } from "./material.validation";
import { BadRequestError } from "../../shared/errors/errors";
import { AuthRequest } from "../../shared/types/auth.types";

export const createMaterial = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  const userId = req.user?.id;
  if (!tenantId || !userId) throw new BadRequestError("Auth context required");

  const parsed = createMaterialSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(parsed.error.errors[0].message);
  }

  const material = await MaterialService.createMaterial(tenantId, userId, parsed.data);
  sendSuccess(res, material, "Lesson material created successfully", 201);
});

export const listMaterials = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  if (!tenantId) throw new BadRequestError("Auth context required");

  const { subjectId, materialType } = req.query;
  const allowedGrades = req.user?.grades || [];

  const materials = await MaterialService.listMaterials(tenantId, {
    subjectId: subjectId as string,
    materialType: materialType as string,
    allowedGrades,
  });

  sendSuccess(res, materials, "Lesson materials list retrieved");
});

export const getMaterial = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  const { id } = req.params;
  if (!tenantId) throw new BadRequestError("Auth context required");

  const material = await MaterialService.getMaterial(tenantId, id as string);
  sendSuccess(res, material, "Lesson material retrieved");
});

export const updateMaterial = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  const { materialId } = req.params;
  if (!tenantId) throw new BadRequestError("Auth context required");

  const parsed = updateMaterialSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(parsed.error.errors[0].message);
  }

  const material = await MaterialService.updateMaterial(tenantId, materialId as string, parsed.data);
  sendSuccess(res, material, "Lesson material updated successfully");
});

export const deleteMaterial = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  const { materialId } = req.params;
  if (!tenantId) throw new BadRequestError("Auth context required");

  await MaterialService.deleteMaterial(tenantId, materialId as string);
  sendSuccess(res, null, "Lesson material deleted successfully");
});
