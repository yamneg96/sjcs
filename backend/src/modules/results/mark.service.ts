import mongoose from "mongoose";
import Mark, { IMark, IMarkItem } from "./mark.model";
import MarkAudit from "./mark-audit.model";
import Assessment, { IAssessment } from "./assessment.model";
import Publishing, { IPublishing } from "./publishing.model";
import User, { IUser } from "../users/user.model";
import { TenantRepository } from "../../infrastructure/database/tenant-repository";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../shared/errors/errors";
import { UserRole, IJWTPayload } from "../../shared/types/auth.types";
import { EnterMarkInput } from "./results.validation";

const marks = new TenantRepository<IMark>(Mark);
const assessments = new TenantRepository<IAssessment>(Assessment);
const publishings = new TenantRepository<IPublishing>(Publishing);
const users = new TenantRepository<IUser>(User);

const oid = (id: string) => new mongoose.Types.ObjectId(id) as unknown as mongoose.Types.ObjectId;
const sumScores = (items: { score: number }[]) => items.reduce((s, i) => s + i.score, 0);

export class MarkService {
  /**
   * Upserts a single student's mark for an assessment. Only DRAFT marks are
   * editable; a SUBMITTED mark can only change through the appeal/countersign
   * flow (§47.2 grade integrity).
   */
  static async enterMark(
    assessmentId: string,
    enteredBy: string,
    data: EnterMarkInput
  ): Promise<IMark> {
    const assessment = await assessments.findById(assessmentId);
    if (!assessment) throw new NotFoundError("Assessment not found");

    // Validate item names + score ceilings against the assessment definition.
    const maxByName = new Map(assessment.items.map((i) => [i.name, i.maxScore]));
    for (const item of data.items) {
      const max = maxByName.get(item.name);
      if (max === undefined) throw new BadRequestError(`Unknown item '${item.name}'`);
      if (item.score > max) throw new BadRequestError(`'${item.name}' exceeds max ${max}`);
    }

    const existing = await marks.findOne({
      assessmentId: assessment._id,
      studentId: oid(data.studentId),
    });
    if (existing && existing.status === "SUBMITTED") {
      throw new BadRequestError(
        "Mark already submitted — changes require an appeal and director countersign"
      );
    }

    const items: IMarkItem[] = data.items;
    const total = sumScores(items);

    if (existing) {
      existing.items = items;
      existing.total = total;
      existing.enteredBy = oid(enteredBy);
      await existing.save();
      return existing;
    }

    return marks.create({
      assessmentId: assessment._id,
      studentId: oid(data.studentId),
      academicYearId: assessment.academicYearId,
      term: assessment.term,
      grade: assessment.grade,
      sectionId: assessment.sectionId,
      subjectId: assessment.subjectId,
      items,
      total,
      maxTotal: assessment.maxTotal,
      status: "DRAFT",
      enteredBy: oid(enteredBy),
      createdBy: enteredBy as unknown as IMark["createdBy"],
    });
  }

  /** Locks all of an assessment's marks (DRAFT → SUBMITTED). */
  static async submitAssessment(assessmentId: string): Promise<{ submitted: number }> {
    const assessment = await assessments.findById(assessmentId);
    if (!assessment) throw new NotFoundError("Assessment not found");

    const submitted = await marks.updateMany(
      { assessmentId: assessment._id, status: "DRAFT" },
      { $set: { status: "SUBMITTED", submittedAt: new Date() } }
    );
    return { submitted };
  }

  /** Staff view: all marks for an assessment (not time-locked; for mark entry). */
  static listAssessmentMarks(assessmentId: string): Promise<IMark[]> {
    return marks.find({ assessmentId: oid(assessmentId) }, { lean: true });
  }

  /**
   * TIME-LOCKED results read (§33) — the trust-critical path. Returns a
   * student's results for (year, term) ONLY if a Publishing covering their
   * grade is PUBLISHED and `releaseAt` has passed. Otherwise it throws and no
   * mark data is serialized. Enforces student=self / parent=own-child access.
   */
  static async getResultsFor(
    requester: IJWTPayload,
    targetStudentId: string,
    query: { academicYearId: string; term: string }
  ): Promise<{ releasedAt: Date; results: IMark[] }> {
    const student = await users.findById(targetStudentId);
    if (!student || student.role !== UserRole.STUDENT) {
      throw new NotFoundError("Student not found");
    }

    // Authorization: students read only their own; parents only their children.
    if (requester.role === UserRole.STUDENT) {
      if (requester.id !== targetStudentId) {
        throw new ForbiddenError("You can only view your own results");
      }
    } else if (requester.role === UserRole.PARENT) {
      const isGuardian = (student.guardianIds || []).some(
        (g) => g.toString() === requester.id
      );
      if (!isGuardian) throw new ForbiddenError("Not a guardian of this student");
    } else {
      throw new ForbiddenError("This endpoint is for students and parents");
    }

    // The embargo: a covering Publishing must be PUBLISHED and released.
    const now = new Date();
    const publishing = await publishings.findOne({
      academicYearId: oid(query.academicYearId),
      term: query.term,
      status: "PUBLISHED",
      releaseAt: { $lte: now },
      grades: student.grade,
    });
    if (!publishing) {
      // RESULT_NOT_PUBLISHED — data is simply not returned (§33).
      throw new ForbiddenError("Results for this term are not published yet");
    }

    const results = await marks.find(
      {
        studentId: student._id,
        academicYearId: oid(query.academicYearId),
        term: query.term,
        status: "SUBMITTED",
      },
      { lean: true }
    );

    return { releasedAt: publishing.releaseAt as Date, results };
  }

  /**
   * Applies an audited mark change (two-person rule). Called only from appeal
   * resolution: `actorId` proposed the change, `countersignId` (director)
   * approved it. Writes an immutable MarkAudit alongside the update.
   */
  static async applyMarkChange(
    markId: string,
    newItems: IMarkItem[],
    actorId: string,
    countersignId: string,
    reason: string
  ): Promise<IMark> {
    const mark = await marks.findById(markId);
    if (!mark) throw new NotFoundError("Mark not found");

    const before = {
      items: mark.items.map((i) => ({ name: i.name, score: i.score })),
      total: mark.total,
    };

    mark.items = newItems;
    mark.total = sumScores(newItems);
    await mark.save();

    const after = {
      items: newItems.map((i) => ({ name: i.name, score: i.score })),
      total: mark.total,
    };

    await MarkAudit.create({
      tenantId: mark.tenantId,
      markId: mark._id,
      studentId: mark.studentId,
      before,
      after,
      reason,
      actorId: oid(actorId),
      countersignId: oid(countersignId),
    });

    return mark;
  }
}
