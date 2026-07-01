import mongoose from "mongoose";
import Subject, { ISubject } from "./subject.model";
import Material from "../materials/material.model";
import { generateSlug } from "../../shared/utils/slug";
import { ConflictError, NotFoundError, BadRequestError } from "../../shared/errors/errors";

export interface IUpdateSubjectDTO {
  name?: string;
  grade?: number;
  description?: string;
}

export class SubjectService {
  /**
   * Create a new subject inside a tenant
   */
  static async createSubject(
    tenantId: string,
    createdBy: string,
    data: { name: string; grade: number; description?: string }
  ): Promise<ISubject> {
    const slug = generateSlug(data.name);

    // Verify unique slug per tenant + grade
    const existing = await Subject.findOne({ tenantId, grade: data.grade, slug });
    if (existing) {
      throw new ConflictError(`Subject '${data.name}' already exists for grade ${data.grade}`);
    }

    const subject = await Subject.create({
      tenantId,
      createdBy: new mongoose.Types.ObjectId(createdBy) as unknown as mongoose.Schema.Types.ObjectId,
      name: data.name,
      slug,
      grade: data.grade,
      description: data.description,
    });

    return subject;
  }

  /**
   * List all subjects for a tenant, optionally filtered by student accessible grades
   */
  static async listSubjects(tenantId: string, allowedGrades?: number[]): Promise<ISubject[]> {
    const filter: mongoose.FilterQuery<ISubject> = { tenantId };

    if (allowedGrades && allowedGrades.length > 0) {
      filter.grade = { $in: allowedGrades };
    }

    return Subject.find(filter).sort({ grade: 1, name: 1 }).lean() as unknown as ISubject[];
  }

  /**
   * Get single subject details
   */
  static async getSubject(tenantId: string, idOrSlug: string): Promise<ISubject> {
    const filter = idOrSlug.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: idOrSlug, tenantId }
      : { slug: idOrSlug, tenantId };

    const subject = await Subject.findOne(filter);
    if (!subject) {
      throw new NotFoundError("Subject not found");
    }
    return subject;
  }

  /**
   * Update subject info
   */
  static async updateSubject(
    tenantId: string,
    subjectId: string,
    updateData: IUpdateSubjectDTO
  ): Promise<ISubject> {
    const subject = await Subject.findOne({ _id: subjectId, tenantId });
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

    // Check if new grade + slug produces conflict
    if (updateData.name || updateData.grade) {
      const conflict = await Subject.findOne({
        tenantId,
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
  static async deleteSubject(tenantId: string, subjectId: string): Promise<void> {
    const subject = await Subject.findOne({ _id: subjectId, tenantId });
    if (!subject) {
      throw new NotFoundError("Subject not found");
    }

    // Check if there are materials references
    const materialsCount = await Material.countDocuments({ tenantId, subjectId });
    if (materialsCount > 0) {
      throw new BadRequestError("Cannot delete subject with active lessons/materials attached");
    }

    await Subject.deleteOne({ _id: subjectId, tenantId });
  }
}
