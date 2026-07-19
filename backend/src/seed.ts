import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { env } from "./config/env";
import { UserRole } from "./shared/types/auth.types";

import Organization from "./modules/organizations/organization.model";
import User from "./modules/users/user.model";
import Session from "./modules/auth/session.model";
import AcademicYear from "./modules/academic-years/academic-year.model";
import Section from "./modules/sections/section.model";
import Subject from "./modules/subjects/subject.model";
import Material from "./modules/materials/material.model";
import Admission from "./modules/admissions/admission.model";
import Assessment from "./modules/results/assessment.model";
import Mark from "./modules/results/mark.model";
import MarkAudit from "./modules/results/mark-audit.model";
import Publishing from "./modules/results/publishing.model";
import Appeal from "./modules/results/appeal.model";
import LearningEvent from "./modules/learning/learning-event.model";
import StudyLog from "./modules/learning/studylog.model";
import StudySession from "./modules/lis/study-session.model";
import Quiz from "./modules/quiz/quiz.model";
import Device from "./modules/mobile/device.model";
import ModelCatalogEntry from "./modules/mobile/model-catalog.model";
import { ensureModelCatalogSeeded } from "./modules/mobile/catalog.seed";

/**
 * Lumora platform seed — builds one complete, realistic demo tenant that
 * exercises every module: org + academic structure, all seven roles,
 * admissions across the pipeline, enrolled students with guardians, marks,
 * and BOTH publishing states so the time-lock (§33) is demonstrable:
 *
 *   • Term 1 → PUBLISHED and released  → parents/students CAN read results
 *   • Term 2 → SCHEDULED in the future → embargoed (403) until releaseAt
 *
 * Run with:  npm run seed          (pass --keep to skip the wipe)
 */

const PASSWORD = "Passw0rd!";
const ORG_SLUG = "sjcs"; // must match the frontend's public ORG_SLUG

const rand = () => crypto.randomBytes(3).toString("hex").toUpperCase();

/**
 * Every collection this seed owns. Typed as `Model<any>` because the list is
 * heterogeneous: each model has a distinct document type, and the union of
 * their `deleteMany` overloads is not callable without a common type.
 */
const COLLECTIONS: mongoose.Model<any>[] = [
  Appeal,
  MarkAudit,
  Mark,
  Assessment,
  Publishing,
  Section,
  AcademicYear,
  Material,
  Subject,
  Admission,
  LearningEvent,
  StudyLog,
  StudySession,
  Quiz,
  Device,
  Session,
  User,
  Organization,
  ModelCatalogEntry,
];

async function wipe() {
  console.log("🧹 Clearing collections…");
  for (const model of COLLECTIONS) {
    await model.deleteMany({});
  }
  console.log("✅ Cleared");
}

async function seed() {
  const hash = await bcrypt.hash(PASSWORD, 10);
  const now = new Date();

  // ── Organization ────────────────────────────────────────────
  const org = await Organization.create({
    name: "Saint Joseph Catholic School",
    slug: ORG_SLUG,
    isVerified: true,
    branding: { primaryColor: "#af101a", secondaryColor: "#005faf" },
    subscription: { plan: "Growth", status: "Active" },
    aiConfig: {
      allowedModels: ["bonsai", "gemma"],
      monthlyUsageLimit: 50,
      currentMonthlyUsage: 0,
    },
  });
  const tenantId = org._id.toString();
  console.log(`🏫 Organization: ${org.name} (slug: ${org.slug})`);

  // ── Platform super admin (tenant "platform", not org-scoped) ─
  await User.create({
    tenantId: "platform",
    fullName: "Lumora Super Admin",
    email: "super@lumora.et",
    passwordHash: hash,
    role: UserRole.SUPER_ADMIN,
    status: "Active",
    isVerified: true,
  });

  // ── Org staff ───────────────────────────────────────────────
  const staff = (fullName: string, email: string, role: UserRole, extra = {}) =>
    User.create({
      tenantId,
      organizationId: org._id,
      fullName,
      email,
      passwordHash: hash,
      role,
      status: "Active",
      isVerified: true,
      ...extra,
    });

  const owner = await staff("Abebe Kebede", "owner@sjcs.et", UserRole.ORG_OWNER);
  const director = await staff("Director Girma", "director@sjcs.et", UserRole.DIRECTOR);
  const registrar = await staff("Registrar Sara", "registrar@sjcs.et", UserRole.REGISTRAR);
  const teacher = await staff("W/ro Selam", "teacher@sjcs.et", UserRole.TEACHER, { grades: [9, 10] });
  const teacher2 = await staff("Ato Dawit", "teacher2@sjcs.et", UserRole.TEACHER, { grades: [9, 10, 11] });
  console.log("👥 Staff: owner, director, registrar, 2 teachers");

  // ── Academic structure ──────────────────────────────────────
  const year = await AcademicYear.create({
    tenantId,
    name: "2025/2026",
    startDate: new Date("2025-09-01"),
    endDate: new Date("2026-06-30"),
    isCurrent: true,
    status: "Active",
    createdBy: owner._id,
  });

  const [sec9A, , sec10A] = await Section.create([
    { tenantId, name: "A", grade: 9, academicYearId: year._id, capacity: 40, classTeacherId: teacher._id, createdBy: owner._id },
    { tenantId, name: "B", grade: 9, academicYearId: year._id, capacity: 40, createdBy: owner._id },
    { tenantId, name: "A", grade: 10, academicYearId: year._id, capacity: 35, classTeacherId: teacher2._id, createdBy: owner._id },
  ]);
  console.log("📅 Academic year 2025/2026 (current) + sections 9A, 9B, 10A");

  // ── Subjects + a RAG-able material ──────────────────────────
  const subjects = await Subject.create(
    [
      { name: "Biology", grade: 9 },
      { name: "Mathematics", grade: 9 },
      { name: "Physics", grade: 10 },
    ].map((s) => ({
      tenantId,
      name: s.name,
      slug: s.name.toLowerCase(),
      grade: s.grade,
      createdBy: teacher._id,
    }))
  );
  const biology = subjects[0];

  await Material.create({
    tenantId,
    title: "Biology Ch.4 — Photosynthesis",
    subjectId: biology._id,
    materialType: "markdown",
    grade: 9,
    textParsed:
      "Photosynthesis converts light energy into chemical energy. Chlorophyll in the chloroplasts absorbs light; water is split and carbon dioxide is fixed into glucose, releasing oxygen.",
    createdBy: teacher._id,
  });
  console.log("📚 Subjects: Biology, Mathematics, Physics (+1 material)");

  // ── Parents + enrolled students (guardian-linked) ───────────
  const makeFamily = async (
    parentName: string,
    parentEmail: string,
    childName: string,
    grade: number,
    sectionId: mongoose.Types.ObjectId
  ) => {
    const parent = await User.create({
      tenantId,
      organizationId: org._id,
      fullName: parentName,
      email: parentEmail,
      passwordHash: hash,
      role: UserRole.PARENT,
      status: "Active",
      isVerified: true,
    });
    const student = await User.create({
      tenantId,
      organizationId: org._id,
      fullName: childName,
      passwordHash: hash,
      role: UserRole.STUDENT,
      grade,
      sectionId,
      studentId: `S${grade}-${rand()}`,
      admissionNo: `ADM-2025-${rand()}`,
      guardianIds: [parent._id],
      status: "Active",
      isVerified: true,
    });
    return { parent, student };
  };

  const fam1 = await makeFamily("Ato Bekele", "parent@sjcs.et", "Hanan Bekele", 9, sec9A._id);
  const fam2 = await makeFamily("W/ro Tigist", "parent2@sjcs.et", "Yonas Tigist", 9, sec9A._id);
  await makeFamily("Ato Girma", "parent3@sjcs.et", "Meron Girma", 10, sec10A._id);
  const g9Students = [fam1.student, fam2.student];
  console.log("👨‍👩‍👧 3 parents + 3 enrolled students (guardian-linked)");

  // ── Admissions across the pipeline ──────────────────────────
  const base = {
    tenantId,
    parentPhone: "0911223344",
    studentDOB: new Date("2011-04-12"),
    documents: [],
  };
  await Admission.create([
    { ...base, parentName: "Ato Tesfaye", parentEmail: "applicant1@example.com", studentFirstName: "Nahom", studentLastName: "Tesfaye", studentGender: "male", gradeAppliedFor: 9, status: "PENDING_REVIEW" },
    { ...base, parentName: "W/ro Almaz", parentEmail: "applicant2@example.com", studentFirstName: "Sara", studentLastName: "Almaz", studentGender: "female", gradeAppliedFor: 9, status: "INTERVIEW_SCHEDULED", interviewDate: new Date(Date.now() + 5 * 864e5), interviewTime: "10:00", reviewedBy: registrar._id },
    { ...base, parentName: "Ato Mulugeta", parentEmail: "applicant3@example.com", studentFirstName: "Kalkidan", studentLastName: "Mulugeta", studentGender: "female", gradeAppliedFor: 10, status: "APPROVED", reviewedBy: director._id },
    { ...base, parentName: "W/ro Hirut", parentEmail: "applicant4@example.com", studentFirstName: "Dawit", studentLastName: "Hirut", studentGender: "male", gradeAppliedFor: 9, status: "WAITLISTED", reviewedBy: registrar._id },
  ]);
  console.log("📝 4 admissions (pending / interview / approved-ready-to-enroll / waitlisted)");

  // ── Assessments + submitted marks (Grade 9 Biology) ─────────
  const buildAssessment = async (term: string, title: string) => {
    const assessment = await Assessment.create({
      tenantId,
      academicYearId: year._id,
      term,
      grade: 9,
      sectionId: sec9A._id,
      subjectId: biology._id,
      title,
      items: [
        { name: "Test", maxScore: 20 },
        { name: "Exam", maxScore: 80 },
      ],
      maxTotal: 100,
      teacherId: teacher._id,
      createdBy: teacher._id,
    });

    for (const [i, student] of g9Students.entries()) {
      const test = 14 + i * 3;
      const exam = 58 + i * 9;
      await Mark.create({
        tenantId,
        assessmentId: assessment._id,
        studentId: student._id,
        academicYearId: year._id,
        term,
        grade: 9,
        sectionId: sec9A._id,
        subjectId: biology._id,
        items: [
          { name: "Test", score: test },
          { name: "Exam", score: exam },
        ],
        total: test + exam,
        maxTotal: 100,
        status: "SUBMITTED",
        submittedAt: now,
        enteredBy: teacher._id,
        createdBy: teacher._id,
      });
    }
  };

  await buildAssessment("Term 1", "Term 1 Midterm — Biology");
  await buildAssessment("Term 2", "Term 2 Midterm — Biology");
  console.log(`🧮 Assessments + submitted marks for ${g9Students.length} Grade 9 students (Term 1 & 2)`);

  // ── Publishings: one LIVE, one EMBARGOED (demonstrates §33) ──
  const released = new Date(Date.now() - 864e5); // yesterday
  await Publishing.create({
    tenantId,
    academicYearId: year._id,
    term: "Term 1",
    grades: [9, 10],
    releaseAt: released,
    status: "PUBLISHED",
    publishedAt: released,
    statusHistory: [
      { status: "DRAFT", at: released, actorId: director._id },
      { status: "APPROVED", at: released, actorId: director._id },
      { status: "SCHEDULED", at: released, actorId: director._id },
      { status: "PUBLISHED", at: released },
    ],
    approvedBy: director._id,
    scheduledBy: director._id,
    createdBy: director._id,
  });

  await Publishing.create({
    tenantId,
    academicYearId: year._id,
    term: "Term 2",
    grades: [9, 10],
    releaseAt: new Date(Date.now() + 7 * 864e5), // next week
    status: "SCHEDULED",
    statusHistory: [
      { status: "DRAFT", at: now, actorId: director._id },
      { status: "APPROVED", at: now, actorId: director._id },
      { status: "SCHEDULED", at: now, actorId: director._id },
    ],
    approvedBy: director._id,
    scheduledBy: director._id,
    createdBy: director._id,
  });
  console.log("🔐 Publishings: Term 1 PUBLISHED (readable) · Term 2 SCHEDULED (embargoed until next week)");

  // ── Mobile model catalog ────────────────────────────────────
  await ensureModelCatalogSeeded();

  return { student: fam1.student };
}

async function main() {
  const keep = process.argv.includes("--keep");
  await mongoose.connect(env.MONGO_URI, { dbName: env.DB_NAME });
  console.log(`🔌 Connected to "${env.DB_NAME}"`);

  if (!keep) await wipe();
  const { student } = await seed();

  console.log(`
──────────────────────────────────────────────
✅ Seed complete — password for all accounts: ${PASSWORD}

  Super admin   super@lumora.et
  Org owner     owner@sjcs.et
  Director      director@sjcs.et
  Registrar     registrar@sjcs.et
  Teacher       teacher@sjcs.et
  Parent        parent@sjcs.et   → /portal (Term 1 live, Term 2 embargoed)

  Students sign in with org slug + full name + grade (no email):
    "${ORG_SLUG}" · "${student.fullName}" · grade ${student.grade}
──────────────────────────────────────────────`);

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
