import dotenv from "dotenv";
import mongoose from "mongoose";

/**
 * Test bootstrap. Suites run against a dedicated `<DB_NAME>_test` database so
 * they can never clobber dev/seed data, and serially (maxWorkers: 1) because
 * they share that database.
 *
 * dotenv is loaded here explicitly: suites that don't happen to import the env
 * config in their module graph would otherwise start with no MONGO_URI.
 */
dotenv.config();
process.env.DB_NAME = `${process.env.DB_NAME || "lumora"}_test`;

beforeAll(async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI is required to run the test suites");
  await mongoose.connect(uri, { dbName: process.env.DB_NAME });
});

afterAll(async () => {
  // Leave the test database empty so runs are independent.
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  }
});
