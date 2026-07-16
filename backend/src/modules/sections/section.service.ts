import mongoose from "mongoose";
import Section, { ISection } from "./section.model";
import AcademicYear, { IAcademicYear } from "../academic-years/academic-year.model";
import { TenantRepository } from "../../infrastructure/database/tenant-repository";
import { ConflictError, NotFoundError, BadRequestError } from "../../shared/errors/errors";
import { CreateSectionInput, UpdateSectionInput } from "./section.validation";

const sections = new TenantRepository<ISection>(Section);
const years = new TenantRepository<IAcademicYear>(AcademicYear);

const toObjectId = (id: string) =>
  new mongoose.Types.ObjectId(id) as unknown as mongoose.Types.ObjectId;

export class SectionService {
  static async create(createdBy: string, data: CreateSectionInput): Promise<ISection> {
    // The referenced academic year must exist in this tenant.
    const year = await years.findById(data.academicYearId);
    if (!year) throw new BadRequestError("Academic year not found");

    const clash = await sections.findOne({
      academicYearId: toObjectId(data.academicYearId),
      grade: data.grade,
      name: data.name,
    });
    if (clash) {
      throw new ConflictError(`Section ${data.grade}${data.name} already exists for this year`);
    }

    return sections.create({
      name: data.name,
      grade: data.grade,
      academicYearId: toObjectId(data.academicYearId),
      capacity: data.capacity ?? 40,
      classTeacherId: data.classTeacherId ? toObjectId(data.classTeacherId) : undefined,
      createdBy: createdBy as unknown as ISection["createdBy"],
    });
  }

  static list(filters: { academicYearId?: string; grade?: number }): Promise<ISection[]> {
    const filter: mongoose.FilterQuery<ISection> = {};
    if (filters.academicYearId) filter.academicYearId = toObjectId(filters.academicYearId);
    if (filters.grade) filter.grade = filters.grade;
    return sections.find(filter, { sort: { grade: 1, name: 1 }, lean: true });
  }

  static async get(id: string): Promise<ISection> {
    const section = await sections.findById(id);
    if (!section) throw new NotFoundError("Section not found");
    return section;
  }

  static async update(id: string, data: UpdateSectionInput): Promise<ISection> {
    const section = await sections.findById(id);
    if (!section) throw new NotFoundError("Section not found");

    if (data.name && data.name !== section.name) {
      const clash = await sections.findOne({
        academicYearId: section.academicYearId,
        grade: section.grade,
        name: data.name,
        _id: { $ne: section._id },
      });
      if (clash) throw new ConflictError(`Section ${section.grade}${data.name} already exists`);
      section.name = data.name;
    }
    if (data.capacity !== undefined) section.capacity = data.capacity;
    if (data.classTeacherId !== undefined) {
      section.classTeacherId = data.classTeacherId ? toObjectId(data.classTeacherId) : undefined;
    }

    await section.save();
    return section;
  }

  static async remove(id: string): Promise<void> {
    const section = await sections.findById(id);
    if (!section) throw new NotFoundError("Section not found");
    // Soft delete (base-schema plugin) — keeps historical enrollment/results intact.
    await section.softDelete?.();
  }
}
