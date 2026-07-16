import mongoose from "mongoose";
import Subject, { ISubject } from "./subject.model";
import Material, { IMaterial } from "../materials/material.model";
import { generateSlug } from "../../shared/utils/slug";
import { ConflictError, NotFoundError, BadRequestError } from "../../shared/errors/errors";
import { TenantRepository } from "../../infrastructure/database/tenant-repository";

export interface IUpdateSubjectDTO {
  name?: string;
  grade?: number;
  description?: string;
}

/**
 * Reference implementation of the TenantRepository pattern (§12.2, ADR-004):
 * the repository injects the active tenant from request context, so no method
 * here hand-writes a `tenantId` filter — cross-tenant access is impossible by
 * construction. Service methods no longer take a tenantId argument.
 */
const subjects = new TenantRepository<ISubject>(Subject);
const materials = new TenantRepository<IMaterial>(Material);

export class SubjectService {
  /**
   * Create a new subject inside the active tenant
   */
  static async createSubject(
    createdBy: string,
    data: { name: string; grade: number; description?: string }
  ): Promise<ISubject> {
    const slug = generateSlug(data.name);

    // Verify unique slug per tenant + grade (tenant auto-scoped by the repo)
    const existing = await subjects.findOne({ grade: data.grade, slug });
    if (existing) {
      throw new ConflictError(`Subject '${data.name}' already exists for grade ${data.grade}`);
    }

    return subjects.create({
      createdBy: new mongoose.Types.ObjectId(createdBy) as unknown as mongoose.Types.ObjectId,
      name: data.name,
      slug,
      grade: data.grade,
      description: data.description,
    } as Partial<ISubject>);
  }

  /**
   * List all subjects for the active tenant, optionally filtered by grades
   */
  static async listSubjects(allowedGrades?: number[]): Promise<ISubject[]> {
    const filter: mongoose.FilterQuery<ISubject> = {};

    if (allowedGrades && allowedGrades.length > 0) {
      filter.grade = { $in: allowedGrades };
    }

    return subjects.find(filter, { sort: { grade: 1, name: 1 }, lean: true });
  }

  /**
   * Get single subject details (by id or slug)
   */
  static async getSubject(idOrSlug: string): Promise<ISubject> {
    const filter = idOrSlug.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: idOrSlug }
      : { slug: idOrSlug };

    const subject = await subjects.findOne(filter);
    if (!subject) {
      throw new NotFoundError("Subject not found");
    }
    return subject;
  }

  /**
   * Update subject info
   */
  static async updateSubject(
    subjectId: string,
    updateData: IUpdateSubjectDTO
  ): Promise<ISubject> {
    const subject = await subjects.findOne({ _id: subjectId });
    if (!subject) {
      throw new NotFoundError("Subject not found");
    }

    if (updateData.name) {
      subject.name = updateData.name;
      subject.slug = generateSlug(updateData.name);
    }
    if (updateData.grade) {
      subject.grade = updateData.grade;
    }
    if (updateData.description !== undefined) {
      subject.description = updateData.description;
    }

    // Check if new grade + slug produces conflict within the tenant
    if (updateData.name || updateData.grade) {
      const conflict = await subjects.findOne({
        grade: subject.grade,
        slug: subject.slug,
        _id: { $ne: subjectId },
      });
      if (conflict) {
        throw new ConflictError(`Subject with same name already exists for grade ${subject.grade}`);
      }
    }

    await subject.save();
    return subject;
  }

  /**
   * Delete subject (only if no materials attached)
   */
  static async deleteSubject(subjectId: string): Promise<void> {
    const subject = await subjects.findOne({ _id: subjectId });
    if (!subject) {
      throw new NotFoundError("Subject not found");
    }

    // Check for attached materials (also tenant-scoped by construction)
    const materialsCount = await materials.count({ subjectId });
    if (materialsCount > 0) {
      throw new BadRequestError("Cannot delete subject with active lessons/materials attached");
    }

    await subjects.deleteOne({ _id: subjectId });
  }
}
