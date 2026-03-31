import mongoose from "mongoose";
import { env } from "../../config/env";
import Student from "./student.model";

const seedStudents = [
  {
    fullName: "Julian Mercer",
    grade: 10,
    studentId: "SJCS001",
    dateOfBirth: "2010-03-15",
  },
  {
    fullName: "Sophia Rodriguez",
    grade: 11,
    studentId: "SJCS002",
    dateOfBirth: "2009-07-22",
  },
  {
    fullName: "Marcus Thompson",
    grade: 9,
    studentId: "SJCS003",
    dateOfBirth: "2011-01-10",
  },
  {
    fullName: "Elena Vasquez",
    grade: 12,
    studentId: "SJCS004",
    dateOfBirth: "2008-11-05",
  },
  {
    fullName: "David Kim",
    grade: 10,
    studentId: "SJCS005",
    dateOfBirth: "2010-09-18",
  },
];

async function seed() {
  try {
    await mongoose.connect(env.MONGO_URI, { dbName: "sjcs" });
    console.log("Connected to MongoDB");

    await Student.deleteMany({});
    console.log("Cleared existing students");

    await Student.insertMany(seedStudents);
    console.log(`✅ Seeded ${seedStudents.length} students`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}

seed();
