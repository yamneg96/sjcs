import mongoose from "mongoose";
import Assessment, { IAssessment } from "./assessment.model";
import Section, { ISection } from "../sections/section.model";
import { TenantRepository } from "../../infrastructure/database/tenant-repository";
import { BadRequestError, NotFoundError } from "../../shared/errors/errors";
import { CreateAssessmentInput } from "./results.validation";

const assessments = new TenantRepository<IAssessment>(Assessment);
const sections = new TenantRepository<ISection>(Section);

const oid = (id: string) => new mongoose.Types.ObjectId(id) as unknown as mongoose.Types.ObjectId;

export class AssessmentService {
  static async create(teacherId: string, data: CreateAssessmentInput): Promise<IAssessment> {
    // Section must exist in tenant and match the assessment grade.
    const section = await sections.findById(data.sectionId);
    if (!section) throw new BadRequestError("Section not found");
    if (section.grade !== data.grade) {
      throw new BadRequestError("Section grade does not match the assessment grade");
    }

    const maxTotal = data.items.reduce((sum, i) => sum + i.maxScore, 0);

    return assessments.create({
      academicYearId: oid(data.academicYearId),
      term: data.term,
      grade: data.grade,
      sectionId: oid(data.sectionId),
      subjectId: oid(data.subjectId),
      title: data.title,
      items: data.items,
      maxTotal,
      teacherId: oid(teacherId),
      createdBy: teacherId as unknown as IAssessment["createdBy"],
    });
  }

  static list(filters: {
    academicYearId?: string;
    term?: string;
    sectionId?: string;
    subjectId?: string;
  }): Promise<IAssessment[]> {
    const filter: mongoose.FilterQuery<IAssessment> = {};
    if (filters.academicYearId) filter.academicYearId = oid(filters.academicYearId);
    if (filters.term) filter.term = filters.term;
    if (filters.sectionId) filter.sectionId = oid(filters.sectionId);
    if (filters.subjectId) filter.subjectId = oid(filters.subjectId);
    return assessments.find(filter, { sort: { createdAt: -1 }, lean: true });
  }

  static async get(id: string): Promise<IAssessment> {
    const assessment = await assessments.findById(id);
    if (!assessment) throw new NotFoundError("Assessment not found");
    return assessment;
  }
}
