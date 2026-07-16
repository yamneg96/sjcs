import AcademicYear, { IAcademicYear } from "./academic-year.model";
import { TenantRepository } from "../../infrastructure/database/tenant-repository";
import { ConflictError, NotFoundError } from "../../shared/errors/errors";
import { CreateAcademicYearInput, UpdateAcademicYearInput } from "./academic-year.validation";

/**
 * Academic-year management. Uses TenantRepository (§12.2) so tenant scoping is
 * automatic — no method hand-writes a tenantId filter.
 */
const years = new TenantRepository<IAcademicYear>(AcademicYear);

export class AcademicYearService {
  static async create(createdBy: string, data: CreateAcademicYearInput): Promise<IAcademicYear> {
    const existing = await years.findOne({ name: data.name });
    if (existing) {
      throw new ConflictError(`Academic year '${data.name}' already exists`);
    }

    // The first year created (or an explicit isCurrent) becomes current.
    const total = await years.count();
    const makeCurrent = data.isCurrent ?? total === 0;
    if (makeCurrent) {
      await years.updateMany({ isCurrent: true }, { isCurrent: false });
    }

    return years.create({
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      isCurrent: makeCurrent,
      status: "Active",
      createdBy: createdBy as unknown as IAcademicYear["createdBy"],
    });
  }

  static list(): Promise<IAcademicYear[]> {
    return years.find({}, { sort: { startDate: -1 }, lean: true });
  }

  static async getCurrent(): Promise<IAcademicYear | null> {
    return years.findOne({ isCurrent: true, status: "Active" });
  }

  static async get(id: string): Promise<IAcademicYear> {
    const year = await years.findById(id);
    if (!year) throw new NotFoundError("Academic year not found");
    return year;
  }

  static async update(id: string, data: UpdateAcademicYearInput): Promise<IAcademicYear> {
    const year = await years.findById(id);
    if (!year) throw new NotFoundError("Academic year not found");

    if (data.name && data.name !== year.name) {
      const clash = await years.findOne({ name: data.name });
      if (clash) throw new ConflictError(`Academic year '${data.name}' already exists`);
      year.name = data.name;
    }
    if (data.startDate) year.startDate = data.startDate;
    if (data.endDate) year.endDate = data.endDate;
    if (year.endDate <= year.startDate) {
      throw new ConflictError("endDate must be after startDate");
    }

    await year.save();
    return year;
  }

  /** Makes one year the single current year (rollover target). */
  static async setCurrent(id: string): Promise<IAcademicYear> {
    const year = await years.findById(id);
    if (!year) throw new NotFoundError("Academic year not found");

    await years.updateMany({ isCurrent: true }, { isCurrent: false });
    year.isCurrent = true;
    year.status = "Active";
    await year.save();
    return year;
  }

  /** Closes a year (locks writes; results remain readable/appealable). */
  static async close(id: string): Promise<IAcademicYear> {
    const year = await years.findById(id);
    if (!year) throw new NotFoundError("Academic year not found");
    year.status = "Closed";
    year.isCurrent = false;
    await year.save();
    return year;
  }
}
