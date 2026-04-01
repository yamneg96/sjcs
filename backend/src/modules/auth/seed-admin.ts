import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Admin from "./admin.model";
import { env } from "../../config/env";

export const initAdmin = async () => {
  try {
    const email = "yamlaknegash96@gmail.com";
    const existingAdmin = await Admin.findOne({ email });
    
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash("12348765", 10);
      await Admin.create({
        email,
        passwordHash,
        role: "admin",
      });
      console.log("Admin seeded successfully.");
    }
  } catch (err) {
    console.error("Error seeding admin", err);
  }
};
