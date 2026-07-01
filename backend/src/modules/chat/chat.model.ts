import mongoose, { Schema } from "mongoose";
import { IBaseDocument } from "../../shared/types/base.types";

export interface IMessage {
  role: "user" | "assistant" | "system";
  content: string;
  tokensUsed?: number;
  createdAt: Date;
}

export interface IConversation extends IBaseDocument {
  userId: mongoose.Types.ObjectId;
  subjectId?: mongoose.Types.ObjectId; // Optional subject mapping
  title: string;
  grade: number; // Student/Individual grade captured at creation
  messages: IMessage[];
  isArchived: boolean;
}

const messageSchema = new Schema<IMessage>({
  role: { type: String, enum: ["user", "assistant", "system"], required: true },
  content: { type: String, required: true },
  tokensUsed: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const conversationSchema = new Schema<IConversation>(
  {
    tenantId: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject" },
    title: { type: String, required: true, default: "New Session" },
    grade: { type: Number, required: true },
    messages: [messageSchema],
    isArchived: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Optimize indexes for student and tenant retrieval
conversationSchema.index({ tenantId: 1, userId: 1, isArchived: 1 });
conversationSchema.index({ subjectId: 1 });

export default mongoose.model<IConversation>("Conversation", conversationSchema);
