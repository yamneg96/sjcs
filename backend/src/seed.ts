import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { env } from "./config/env";
import User, { IUser } from "./modules/users/user.model";
import Quiz from "./modules/quiz/quiz.model";
import StudyLog from "./modules/learning/studylog.model";
import Organization from "./modules/organizations/organization.model";
import Student from "./modules/students/student.model";
import { UserRole } from "./shared/types/auth.types";

/**
 * --------------------------------------------------
 * 1. Factory: Reset & Clean Collections
 * --------------------------------------------------
 */
async function clearDatabase() {
  console.log("Emptying database tables...");
  await Promise.all([
    User.deleteMany({}),
    Organization.deleteMany({}),
    Quiz.deleteMany({}),
    StudyLog.deleteMany({}),
    Student.deleteMany({}),
  ]);
  console.log("✅ Database cleared cleanly.");
}

/**
 * --------------------------------------------------
 * 2. Factory: Users (Admin, Teacher, Student)
 * --------------------------------------------------
 */
async function seedUsers(tenantId: string, orgId: mongoose.Types.ObjectId): Promise<{
  owner: IUser;
  teacher: IUser;
  student: IUser;
}> {
  console.log("Seeding users...");
  const passwordHash = await bcrypt.hash("password123", 10);

  // 1. Create Organization Owner (Admin)
  const owner = await User.create({
    tenantId,
    organizationId: orgId,
    fullName: "Principal Raymond",
    email: "owner@sjcs.edu",
    passwordHash,
    role: UserRole.ORG_OWNER,
    studentId: "OWNER-" + new mongoose.Types.ObjectId().toString(),
    status: "Active",
    isVerified: true,
  });

  // 2. Create Teacher
  const teacher = await User.create({
    tenantId,
    organizationId: orgId,
    fullName: "Sister Mary Claire",
    email: "teacher@sjcs.edu",
    passwordHash,
    role: UserRole.TEACHER,
    studentId: "TEACHER-" + new mongoose.Types.ObjectId().toString(),
    grades: [9, 10, 11, 12],
    status: "Active",
    isVerified: true,
  });

  // 3. Create Student
  const student = await User.create({
    tenantId,
    organizationId: orgId,
    fullName: "Julian Mercer",
    studentId: "SJCS001",
    grade: 10,
    passwordHash,
    role: UserRole.STUDENT,
    status: "Active",
    isVerified: true,
  });

  console.log("✅ Seeded Owner (owner@sjcs.edu), Teacher (teacher@sjcs.edu), Student (Julian Mercer SJCS001).");
  return { owner, teacher, student };
}

/**
 * --------------------------------------------------
 * 3. Factory: Exams (Quiz)
 * --------------------------------------------------
 */
async function seedExams(tenantId: string, studentId: string) {
  console.log("Seeding mock exams/quizzes...");
  await Quiz.create([
    {
      tenantId,
      studentId,
      topic: "Intro to Theology",
      questions: [
        {
          question: "Who wrote the Summa Theologiae?",
          options: ["St. Augustine", "St. Thomas Aquinas", "St. Francis", "St. Benedict"],
          answer: "St. Thomas Aquinas",
          userAnswer: "St. Thomas Aquinas",
        },
        {
          question: "What is the primary language of the early translation Vulgate?",
          options: ["Greek", "Hebrew", "Latin", "Aramaic"],
          answer: "Latin",
          userAnswer: "Latin",
        }
      ],
      score: 2,
      total: 2,
    },
    {
      tenantId,
      studentId,
      topic: "Algebra Basic Quadratics",
      questions: [
        {
          question: "Solve for x: x^2 - 9 = 0",
          options: ["x = 3", "x = -3", "x = ±3", "x = 9"],
          answer: "x = ±3",
          userAnswer: "x = 3", // wrong answer
        }
      ],
      score: 0,
      total: 1,
    }
  ]);
  console.log("✅ Seeded two quiz records.");
}

/**
 * --------------------------------------------------
 * 4. Factory: Records (StudyLog)
 * --------------------------------------------------
 */
async function seedRecords(tenantId: string, studentId: string) {
  console.log("Seeding student study logs...");
  await StudyLog.create([
    {
      tenantId,
      studentId,
      question: "Explain the definition of sacramental grace.",
      answer: "Sacramental grace is the grace of the Holy Spirit, given by Christ and proper to each sacrament.",
      subject: "Theology",
      gradeAccessed: 10,
    },
    {
      tenantId,
      studentId,
      question: "What is the result when multiplying two binomials?",
      answer: "FOIL method is typically applied, resulting in a quadratic expression if of degree one.",
      subject: "Mathematics",
      gradeAccessed: 10,
    }
  ]);
  console.log("✅ Seeded two study log records.");
}

/**
 * --------------------------------------------------
 * 5. Execution Orchestration
 * --------------------------------------------------
 */
async function runSeed() {
  try {
    console.log("Beginning seed process...");
    await mongoose.connect(env.MONGO_URI, { dbName: env.DB_NAME });
    console.log("✅ Connected to MongoDB.");

    await clearDatabase();

    // Resetting/creating the organization
    const org = await Organization.create({
      name: "Saint Joseph Catholic School",
      slug: "sjcs",
    });
    console.log(`✅ Seeded Organization: ${org.name} (${org.slug})`);

    const tenantId = org._id.toString();

    const { student } = await seedUsers(tenantId, org._id);
    await seedExams(tenantId, student._id.toString());
    await seedRecords(tenantId, student._id.toString());

    console.log("\n⭐️ Seeding completed successfully! ⭐️\n");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Exception occurred during database seeding:", err);
    process.exit(1);
  }
}

runSeed();
