import mongoose, { Document, Schema } from "mongoose";

export interface ISupportTicket extends Document {
  tenantId: string;
  userId: string;
  subject: string;
  description: string;
  status: "open" | "in-progress" | "closed";
  aiResponse?: string;
  createdAt: Date;
  updatedAt: Date;
}

const supportTicketSchema = new Schema<ISupportTicket>(
  {
    tenantId: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    subject: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["open", "in-progress", "closed"],
      default: "open",
    },
    aiResponse: { type: String },
  },
  { timestamps: true }
);

supportTicketSchema.index({ tenantId: 1, status: 1 });

export default mongoose.model<ISupportTicket>("SupportTicket", supportTicketSchema);
