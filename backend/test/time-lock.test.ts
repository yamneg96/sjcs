import mongoose from "mongoose";
import User from "../src/modules/users/user.model";
import Mark from "../src/modules/results/mark.model";
import Assessment from "../src/modules/results/assessment.model";
import Publishing from "../src/modules/results/publishing.model";
import Section from "../src/modules/sections/section.model";
import { MarkService } from "../src/modules/results/mark.service";
import { PublishingService } from "../src/modules/results/publishing.service";
import { runWithContext } from "../src/shared/context/request-context";
import { UserRole, IJWTPayload } from "../src/shared/types/auth.types";

/**
 * NON-NEGOTIABLE GATE (§49): the results time-lock.
 * Unpublished results must be unreadable by parent/student through ANY path
 * until releaseAt — the data is never serialized, not merely hidden in the UI.
 */

const ORG = new mongoose.Types.ObjectId().toString();
const TEACHER = new mongoose.Types.ObjectId().toString();
const DIRECTOR = new mongoose.Types.ObjectId().toString();

const asOrg = <T>(fn: () => Promise<T>) =>
  runWithContext({ requestId: "test", tenantId: ORG, userId: TEACHER }, fn);

const payload = (id: string, role: UserRole): IJWTPayload => ({
  id,
  email: "t@t.et",
  role,
  tenantId: ORG,
  grades: [9],
});

let studentId: string;
let parentId: string;
let yearId: string;
let term: string;

async function buildTermWithMarks(termName: string) {
  const section = await Section.create({
    tenantId: ORG,
    name: "A",
    grade: 9,
    academicYearId: yearId,
    capacity: 40,
  });

  const assessment = await asOrg(() =>
    Assessment.create({
      tenantId: ORG,
      academicYearId: yearId,
      term: termName,
      grade: 9,
      sectionId: section._id,
      subjectId: new mongoose.Types.ObjectId(),
      title: "Midterm",
      items: [{ name: "Exam", maxScore: 100 }],
      maxTotal: 100,
      teacherId: TEACHER,
    })
  );

  await Mark.create({
    tenantId: ORG,
    assessmentId: assessment._id,
    studentId,
    academicYearId: yearId,
    term: termName,
    grade: 9,
    sectionId: section._id,
    subjectId: assessment.subjectId,
    items: [{ name: "Exam", score: 88 }],
    total: 88,
    maxTotal: 100,
    status: "SUBMITTED",
    enteredBy: TEACHER,
  });
}

describe("results time-lock (embargo)", () => {
  beforeEach(async () => {
    await Promise.all([
      User.deleteMany({}),
      Mark.deleteMany({}),
      Assessment.deleteMany({}),
      Publishing.deleteMany({}),
      Section.deleteMany({}),
    ]);

    yearId = new mongoose.Types.ObjectId().toString();
    term = "Term 1";

    const parent = await User.create({
      tenantId: ORG,
      fullName: "Parent One",
      email: `p-${Date.now()}@t.et`,
      role: UserRole.PARENT,
      status: "Active",
    });
    parentId = parent._id.toString();

    const student = await User.create({
      tenantId: ORG,
      fullName: "Student One",
      role: UserRole.STUDENT,
      grade: 9,
      studentId: `S9-${Date.now()}`,
      guardianIds: [parent._id],
      status: "Active",
    });
    studentId = student._id.toString();

    await buildTermWithMarks(term);
  });

  const readAsStudent = () =>
    runWithContext({ requestId: "t", tenantId: ORG, userId: studentId }, () =>
      MarkService.getResultsFor(payload(studentId, UserRole.STUDENT), studentId, {
        academicYearId: yearId,
        term,
      })
    );

  it("blocks reads when no publishing exists", async () => {
    await expect(readAsStudent()).rejects.toThrow();
  });

  it("blocks reads while the publishing is only SCHEDULED (releaseAt in future)", async () => {
    const pub = await asOrg(() =>
      PublishingService.create(DIRECTOR, { academicYearId: yearId, term, grades: [9] })
    );
    await asOrg(() => PublishingService.approve(pub._id.toString(), DIRECTOR));
    await asOrg(() =>
      PublishingService.schedule(pub._id.toString(), DIRECTOR, new Date(Date.now() + 3_600_000))
    );

    await expect(readAsStudent()).rejects.toThrow();
  });

  it("releases results once the sweep publishes at releaseAt", async () => {
    const pub = await asOrg(() =>
      PublishingService.create(DIRECTOR, { academicYearId: yearId, term, grades: [9] })
    );
    await asOrg(() => PublishingService.approve(pub._id.toString(), DIRECTOR));
    await asOrg(() =>
      PublishingService.schedule(pub._id.toString(), DIRECTOR, new Date(Date.now() - 1000))
    );

    const flipped = await PublishingService.runReleaseSweep();
    expect(flipped).toBe(1);

    const res = await readAsStudent();
    expect(res.results).toHaveLength(1);
    expect(res.results[0].total).toBe(88);
  });

  it("does not publish a scheduled release before its releaseAt", async () => {
    const pub = await asOrg(() =>
      PublishingService.create(DIRECTOR, { academicYearId: yearId, term, grades: [9] })
    );
    await asOrg(() => PublishingService.approve(pub._id.toString(), DIRECTOR));
    await asOrg(() =>
      PublishingService.schedule(pub._id.toString(), DIRECTOR, new Date(Date.now() + 3_600_000))
    );

    expect(await PublishingService.runReleaseSweep()).toBe(0);
    const after = await Publishing.findById(pub._id);
    expect(after?.status).toBe("SCHEDULED");
  });

  it("is idempotent: a second sweep does not re-publish", async () => {
    const pub = await asOrg(() =>
      PublishingService.create(DIRECTOR, { academicYearId: yearId, term, grades: [9] })
    );
    await asOrg(() => PublishingService.approve(pub._id.toString(), DIRECTOR));
    await asOrg(() =>
      PublishingService.schedule(pub._id.toString(), DIRECTOR, new Date(Date.now() - 1000))
    );

    expect(await PublishingService.runReleaseSweep()).toBe(1);
    expect(await PublishingService.runReleaseSweep()).toBe(0);
  });

  it("only releases the grades named in the publishing scope", async () => {
    const pub = await asOrg(() =>
      // Publishing covers grade 10 only — our student is grade 9.
      PublishingService.create(DIRECTOR, { academicYearId: yearId, term, grades: [10] })
    );
    await asOrg(() => PublishingService.approve(pub._id.toString(), DIRECTOR));
    await asOrg(() =>
      PublishingService.schedule(pub._id.toString(), DIRECTOR, new Date(Date.now() - 1000))
    );
    await PublishingService.runReleaseSweep();

    await expect(readAsStudent()).rejects.toThrow();
  });

  it("lets a guardian read, but blocks a non-guardian parent", async () => {
    const pub = await asOrg(() =>
      PublishingService.create(DIRECTOR, { academicYearId: yearId, term, grades: [9] })
    );
    await asOrg(() => PublishingService.approve(pub._id.toString(), DIRECTOR));
    await asOrg(() =>
      PublishingService.schedule(pub._id.toString(), DIRECTOR, new Date(Date.now() - 1000))
    );
    await PublishingService.runReleaseSweep();

    const asGuardian = await runWithContext({ requestId: "t", tenantId: ORG, userId: parentId }, () =>
      MarkService.getResultsFor(payload(parentId, UserRole.PARENT), studentId, {
        academicYearId: yearId,
        term,
      })
    );
    expect(asGuardian.results).toHaveLength(1);

    const stranger = new mongoose.Types.ObjectId().toString();
    await expect(
      runWithContext({ requestId: "t", tenantId: ORG, userId: stranger }, () =>
        MarkService.getResultsFor(payload(stranger, UserRole.PARENT), studentId, {
          academicYearId: yearId,
          term,
        })
      )
    ).rejects.toThrow();
  });
});
