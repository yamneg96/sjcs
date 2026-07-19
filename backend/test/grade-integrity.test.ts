import mongoose from "mongoose";
import Mark from "../src/modules/results/mark.model";
import MarkAudit from "../src/modules/results/mark-audit.model";
import Assessment from "../src/modules/results/assessment.model";
import Appeal from "../src/modules/results/appeal.model";
import { MarkService } from "../src/modules/results/mark.service";
import { AppealService } from "../src/modules/results/appeal.service";
import { runWithContext } from "../src/shared/context/request-context";
import { UserRole, IJWTPayload } from "../src/shared/types/auth.types";

/**
 * Grade integrity (§47.2): a submitted mark may only change through the
 * two-person appeal flow, and every change appends an immutable audit entry.
 */

const ORG = new mongoose.Types.ObjectId().toString();
const TEACHER = new mongoose.Types.ObjectId().toString();
const DIRECTOR = new mongoose.Types.ObjectId().toString();
const STUDENT = new mongoose.Types.ObjectId().toString();

const as = <T>(userId: string, fn: () => Promise<T>) =>
  runWithContext({ requestId: "test", tenantId: ORG, userId }, fn);

const payload = (id: string, role: UserRole): IJWTPayload => ({
  id,
  email: "x@t.et",
  role,
  tenantId: ORG,
  grades: [9],
});

let assessmentId: string;
let markId: string;

describe("grade integrity", () => {
  beforeEach(async () => {
    await Promise.all([
      Mark.deleteMany({}),
      MarkAudit.deleteMany({}),
      Assessment.deleteMany({}),
      Appeal.deleteMany({}),
    ]);

    const assessment = await as(TEACHER, () =>
      Assessment.create({
        tenantId: ORG,
        academicYearId: new mongoose.Types.ObjectId(),
        term: "Term 1",
        grade: 9,
        sectionId: new mongoose.Types.ObjectId(),
        subjectId: new mongoose.Types.ObjectId(),
        title: "Midterm",
        items: [
          { name: "Test", maxScore: 20 },
          { name: "Exam", maxScore: 80 },
        ],
        maxTotal: 100,
        teacherId: TEACHER,
      })
    );
    assessmentId = assessment._id.toString();

    const mark = await as(TEACHER, () =>
      MarkService.enterMark(assessmentId, TEACHER, {
        studentId: STUDENT,
        items: [
          { name: "Test", score: 18 },
          { name: "Exam", score: 70 },
        ],
      })
    );
    markId = mark._id.toString();
  });

  it("computes the total from item scores", async () => {
    const mark = await Mark.findById(markId);
    expect(mark?.total).toBe(88);
    expect(mark?.status).toBe("DRAFT");
  });

  it("rejects a score above the assessment item's max", async () => {
    await expect(
      as(TEACHER, () =>
        MarkService.enterMark(assessmentId, TEACHER, {
          studentId: new mongoose.Types.ObjectId().toString(),
          items: [{ name: "Test", score: 999 }],
        })
      )
    ).rejects.toThrow();
  });

  it("rejects an unknown item name", async () => {
    await expect(
      as(TEACHER, () =>
        MarkService.enterMark(assessmentId, TEACHER, {
          studentId: new mongoose.Types.ObjectId().toString(),
          items: [{ name: "NotAnItem", score: 5 }],
        })
      )
    ).rejects.toThrow();
  });

  it("locks a mark once submitted — direct edits are refused", async () => {
    await as(TEACHER, () => MarkService.submitAssessment(assessmentId));

    await expect(
      as(TEACHER, () =>
        MarkService.enterMark(assessmentId, TEACHER, {
          studentId: STUDENT,
          items: [
            { name: "Test", score: 20 },
            { name: "Exam", score: 80 },
          ],
        })
      )
    ).rejects.toThrow();
  });

  it("changes a mark only via appeal + countersign, writing one audit entry", async () => {
    await as(TEACHER, () => MarkService.submitAssessment(assessmentId));

    const appeal = await as(STUDENT, () =>
      AppealService.create(payload(STUDENT, UserRole.STUDENT), { markId, reason: "Please re-check" })
    );
    await as(TEACHER, () =>
      AppealService.propose(appeal._id.toString(), TEACHER, {
        proposedItems: [
          { name: "Test", score: 20 },
          { name: "Exam", score: 78 },
        ],
      })
    );
    await as(DIRECTOR, () =>
      AppealService.resolve(appeal._id.toString(), payload(DIRECTOR, UserRole.DIRECTOR), {
        outcome: "UPHELD",
        reason: "Verified",
      })
    );

    const mark = await Mark.findById(markId);
    expect(mark?.total).toBe(98);

    const audits = await MarkAudit.find({ markId });
    expect(audits).toHaveLength(1);
    expect(audits[0].before.total).toBe(88);
    expect(audits[0].after.total).toBe(98);
    // Two-person: proposer and countersigner are different people.
    expect(audits[0].actorId.toString()).toBe(TEACHER);
    expect(audits[0].countersignId?.toString()).toBe(DIRECTOR);
  });

  it("blocks self-countersign (the proposer cannot approve their own change)", async () => {
    await as(TEACHER, () => MarkService.submitAssessment(assessmentId));

    const appeal = await as(STUDENT, () =>
      AppealService.create(payload(STUDENT, UserRole.STUDENT), { markId, reason: "re-check" })
    );
    // The director proposes the change themselves…
    await as(DIRECTOR, () =>
      AppealService.propose(appeal._id.toString(), DIRECTOR, {
        proposedItems: [{ name: "Test", score: 20 }, { name: "Exam", score: 80 }],
      })
    );
    // …then tries to countersign it.
    await expect(
      as(DIRECTOR, () =>
        AppealService.resolve(appeal._id.toString(), payload(DIRECTOR, UserRole.DIRECTOR), {
          outcome: "UPHELD",
          reason: "self approve",
        })
      )
    ).rejects.toThrow();

    const mark = await Mark.findById(markId);
    expect(mark?.total).toBe(88); // unchanged
    expect(await MarkAudit.countDocuments({ markId })).toBe(0);
  });

  it("EXPLAINED outcome closes the appeal without touching the mark", async () => {
    await as(TEACHER, () => MarkService.submitAssessment(assessmentId));

    const appeal = await as(STUDENT, () =>
      AppealService.create(payload(STUDENT, UserRole.STUDENT), { markId, reason: "why?" })
    );
    await as(DIRECTOR, () =>
      AppealService.resolve(appeal._id.toString(), payload(DIRECTOR, UserRole.DIRECTOR), {
        outcome: "EXPLAINED",
        reason: "Marking was correct",
      })
    );

    const mark = await Mark.findById(markId);
    expect(mark?.total).toBe(88);
    expect(await MarkAudit.countDocuments({ markId })).toBe(0);
  });

  it("allows only one open appeal per mark", async () => {
    await as(TEACHER, () => MarkService.submitAssessment(assessmentId));
    await as(STUDENT, () =>
      AppealService.create(payload(STUDENT, UserRole.STUDENT), { markId, reason: "first" })
    );

    await expect(
      as(STUDENT, () =>
        AppealService.create(payload(STUDENT, UserRole.STUDENT), { markId, reason: "second" })
      )
    ).rejects.toThrow();
  });

  it("prevents a student appealing someone else's mark", async () => {
    await as(TEACHER, () => MarkService.submitAssessment(assessmentId));
    const other = new mongoose.Types.ObjectId().toString();

    await expect(
      as(other, () =>
        AppealService.create(payload(other, UserRole.STUDENT), { markId, reason: "not mine" })
      )
    ).rejects.toThrow();
  });
});
