import Material, { IMaterial } from "./material.model";
import Subject from "../subjects/subject.model";
import { NotFoundError, BadRequestError } from "../../shared/errors/errors";

export class MaterialService {
  /**
   * Create a new lesson material
   */
  static async createMaterial(
    tenantId: string,
    createdBy: string,
    data: { title: string; subjectId: string; materialType: "pdf" | "video" | "markdown" | "link"; contentUrl?: string; textParsed?: string }
  ): Promise<IMaterial> {
    // 1. Verify subject exists inside this tenant
    const subject = await Subject.findOne({ _id: data.subjectId, tenantId });
    if (!subject) {
      throw new NotFoundError("Subject not found in organization context");
    }

    // 2. Create Material using the subject's grade
    const material = await Material.create({
      tenantId,
      createdBy: createdBy as any,
      title: data.title,
      subjectId: data.subjectId as any,
      materialType: data.materialType,
      contentUrl: data.contentUrl,
      textParsed: data.textParsed,
      grade: subject.grade, // Sync grade directly from parent subject
    });

    return material;
  }

  /**
   * List materials, filtered by subject, type, or allowed grades
   */
  static async listMaterials(
    tenantId: string,
    filters: { subjectId?: string; materialType?: string; allowedGrades?: number[] }
  ): Promise<IMaterial[]> {
    const query: any = { tenantId };

    if (filters.subjectId) {
      query.subjectId = filters.subjectId;
    }
    if (filters.materialType) {
      query.materialType = filters.materialType;
    }
    if (filters.allowedGrades && filters.allowedGrades.length > 0) {
      query.grade = { $in: filters.allowedGrades };
    }

    return Material.find(query).sort({ title: 1 }).populate("subjectId", "name grade").lean() as any;
  }

  /**
   * Fetch single material
   */
  static async getMaterial(tenantId: string, id: string): Promise<IMaterial> {
    const material = await Material.findOne({ _id: id, tenantId }).populate("subjectId", "name grade");
    if (!material) {
      throw new NotFoundError("Material not found");
    }
    return material;
  }

  /**
   * Update material
   */
  static async updateMaterial(tenantId: string, materialId: string, updateData: any): Promise<IMaterial> {
    const material = await Material.findOne({ _id: materialId, tenantId });
    if (!material) {
      throw new NotFoundError("Material not found");
    }

    if (updateData.title) material.title = updateData.title;
    if (updateData.materialType) material.materialType = updateData.materialType;
    if (updateData.contentUrl) material.contentUrl = updateData.contentUrl;
    if (updateData.textParsed !== undefined) material.textParsed = updateData.textParsed;

    await material.save();
    return material;
  }

  /**
   * Delete material
   */
  static async deleteMaterial(tenantId: string, materialId: string): Promise<void> {
    const result = await Material.deleteOne({ _id: materialId, tenantId });
    if (result.deletedCount === 0) {
      throw new NotFoundError("Material not found");
    }
  }
}
