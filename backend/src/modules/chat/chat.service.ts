import mongoose from "mongoose";
import Conversation, { IConversation } from "./chat.model";
import Subject from "../subjects/subject.model";
import Material, { IMaterial } from "../materials/material.model";
import { AIGateway } from "../ai/ai.gateway";
import { NotFoundError } from "../../shared/errors/errors";

export class ChatService {
  /**
   * Determine whether a request is simple or complex.
   * Simple requests -> Llama-3.1-8b-instant (Groq) for quick token response.
   * Complex requests -> Gemini-1.5-flash for deeper processing.
   */
  private static routeQuery(prompt: string): { provider: "groq" | "gemini"; model: string } {
    const wordCount = prompt.trim().split(/\s+/).length;
    const isGreeting = /^(hello|hi|hey|greetings|good morning|hola)/i.test(prompt.trim());
    
    if (isGreeting || wordCount <= 12) {
      return { provider: "groq", model: "llama-3.1-8b-instant" };
    }
    
    return { provider: "gemini", model: "gemini-1.5-flash" };
  }

  /**
   * Simple MongoDB-based RAG retrieval.
   * Finds matching teacher materials within this tenant & subject.
   */
  private static async retrieveContext(tenantId: string, subjectId?: string, query?: string): Promise<string> {
    if (!subjectId || !query) return "";

    try {
      // Find matches in user's tenant & subject using text indexes
      const matches = await Material.find(
        { tenantId, subjectId, $text: { $search: query } },
        { score: { $meta: "textScore" } }
      )
        .sort({ score: { $meta: "textScore" } })
        .limit(3)
        .lean() as unknown as IMaterial[];

      if (matches.length === 0) return "";

      const contextItems = matches.map((m, idx) => `[Source ${idx + 1} - ${m.title}]: ${m.textParsed || ""}`);
      return `\nRELEVANT CLASSROOM MATERIALS CONTEXT:\n${contextItems.join("\n")}\n`;
    } catch (err) {
      console.warn("RAG text search skipped (No text index configured or empty search results)");
      // Fallback: simple regex search if text index fails or not ready
      const fallbackMatches = await Material.find({
        tenantId,
        subjectId,
        title: { $regex: query, $options: "i" }
      })
        .limit(2)
        .lean() as unknown as IMaterial[];
      
      if (fallbackMatches.length === 0) return "";
      const contextItems = fallbackMatches.map((m, idx) => `[Source ${idx + 1} - ${m.title}]: ${m.textParsed || ""}`);
      return `\nRELEVANT CLASSROOM MATERIALS CONTEXT:\n${contextItems.join("\n")}\n`;
    }
  }

  /**
   * Start a new chat conversation session
   */
  static async createConversation(
    tenantId: string,
    userId: string,
    data: { subjectId?: string; title?: string; grade: number }
  ): Promise<IConversation> {
    if (data.subjectId) {
      const subject = await Subject.findOne({ _id: data.subjectId, tenantId });
      if (!subject) {
        throw new NotFoundError("Subject not found in your organization context");
      }
    }

    const conversation = await Conversation.create({
      tenantId,
      userId: new mongoose.Types.ObjectId(userId) as unknown as mongoose.Schema.Types.ObjectId,
      subjectId: data.subjectId ? new mongoose.Types.ObjectId(data.subjectId) as unknown as mongoose.Schema.Types.ObjectId : undefined,
      title: data.title || "New Discussion Session",
      grade: data.grade,
      messages: [],
    });

    return conversation;
  }

  /**
   * Post message and trigger AI completion response (incorporating RAG context & dynamic routing)
   */
  static async sendMessage(
    tenantId: string,
    conversationId: string,
    userMessage: string
  ): Promise<{ response: string; conversation: IConversation }> {
    const conversation = await Conversation.findOne({ _id: conversationId, tenantId });
    if (!conversation) {
      throw new NotFoundError("Conversation session not found");
    }

    // 1. Save user's message
    conversation.messages.push({
      role: "user",
      content: userMessage,
      createdAt: new Date(),
    });

    // 2. Perform RAG context retrieval
    const ragContext = await this.retrieveContext(tenantId, conversation.subjectId?.toString(), userMessage);

    // 3. Make dynamic AI provider routing decision
    const routing = this.routeQuery(userMessage);

    const systemInstruction = 
      "You are Lumora tutor, a helpful and adaptive virtual teaching assistant. " +
      "Explain concepts step-by-step using clear language suitable for grade " + conversation.grade + " students. " +
      "Keep answers engaging and pedagogical. " +
      (ragContext ? "Use the provided context from the classroom lesson materials to formulate your reply where appropriate." : "");

    const finalPrompt = ragContext 
      ? `User question: ${userMessage}\n${ragContext}` 
      : userMessage;

    // 4. Invoke AI Gateway
    const aiResponse = await AIGateway.generateCompletion(finalPrompt, {
      provider: routing.provider,
      modelName: routing.model,
      systemInstruction,
      tenantId,
      isStudentFacing: true, // Socratic Rule enforcement
    });

    // 5. Append assistant reply and save session
    conversation.messages.push({
      role: "assistant",
      content: aiResponse.text,
      tokensUsed: aiResponse.usage.totalTokens,
      createdAt: new Date(),
    });

    // Update conversation title based on first query if it was default
    if (conversation.title === "New Session" || conversation.title === "New Discussion Session") {
      conversation.title = userMessage.length > 30 ? `${userMessage.substring(0, 30)}...` : userMessage;
    }

    await conversation.save();

    return {
      response: aiResponse.text,
      conversation,
    };
  }

  /**
   * List conversations
   */
  static async listConversations(tenantId: string, userId: string): Promise<IConversation[]> {
    const docs = await Conversation.find({ tenantId, userId, isArchived: false })
      .select("title subjectId grade createdAt updatedAt")
      .sort({ updatedAt: -1 })
      .populate("subjectId", "name grade")
      .lean();
    return docs as unknown as IConversation[];
  }

  /**
   * Get single conversation history
   */
  static async getConversation(tenantId: string, id: string): Promise<IConversation> {
    const conversation = await Conversation.findOne({ _id: id, tenantId }).populate("subjectId", "name grade");
    if (!conversation) {
      throw new NotFoundError("Conversation session not found");
    }
    return conversation;
  }

  /**
   * Delete / archive conservation
   */
  static async archiveConversation(tenantId: string, id: string): Promise<void> {
    const result = await Conversation.updateOne(
      { _id: id, tenantId },
      { $set: { isArchived: true } }
    );
    if (result.matchedCount === 0) {
      throw new NotFoundError("Conversation session not found");
    }
  }
}
