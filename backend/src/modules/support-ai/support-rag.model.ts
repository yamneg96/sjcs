import mongoose from "mongoose";

const supportDocSchema = new mongoose.Schema({
  content: String,
  embedding: [Number],
  category: String, // admissions, payments, rules
});

export const SupportDoc = mongoose.model("SupportDoc", supportDocSchema);