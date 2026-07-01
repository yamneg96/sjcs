import mongoose from "mongoose";
import { env } from "./env";

export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI, {
      dbName: env.DB_NAME,
      connectTimeoutMS: 30000,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 1,
    });

    console.log(`✅ MongoDB connected to ${env.DB_NAME} database`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};