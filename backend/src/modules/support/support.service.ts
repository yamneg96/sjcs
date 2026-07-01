import mongoose from "mongoose";
import SupportTicket, { ISupportTicket } from "./support.model";
import Material, { IMaterial } from "../materials/material.model";
import { AIGateway } from "../ai/ai.gateway";
import { NotFoundError } from "../../shared/errors/errors";

export class SupportService {
  /**
   * Creates a ticket and invokes the AI Gateway to generate an automated helpful response.
   */
  static async createTicket(
    tenantId: string,
    userId: string,
    subject: string,
    description: string
  ): Promise<ISupportTicket> {
    // 1. Isolation-safe contextual search on tenant materials to find any helper docs
    let context = "";
    try {
      const docs = await Material.find({
        tenantId,
        $text: { $search: `${subject} ${description}` },
      }).limit(3).lean() as unknown as IMaterial[];

      if (docs.length > 0) {
        context = docs.map((d) => `[Source Document: ${d.title}]: ${d.textParsed || ""}`).join("\n\n");
      }
    } catch (err) {
      // Fallback silently
    }

    // 2. Build prompt for AI agent support helper
    const prompt = `You are a helpful customer support representative for a multi-tenant platform workspace.
We received the following support request from a workspace user:
Subject: ${subject}
Description: ${description}

${context ? `Use the following workspace documents to help answer this query:\n${context}\n` : ""}
Formulate a helpful, polite response. If you cannot solve the issue based on the workspace documents, instruct the user that a support operator will review the ticket shortly.
Do not make up information. Keep it professional.`;

    const systemInstruction = "You are a professional customer support helpdesk companion.";

    let aiResponse = "";
    try {
      const response = await AIGateway.generateCompletion(prompt, {
        tenantId,
        provider: "gemini", // use gemini-1.5-flash
        systemInstruction,
      });
      aiResponse = response.text;
    } catch (error) {
      console.warn("AI Agent failed to resolve initial support response:", error);
      aiResponse = "A support representative is reviewing your ticket and will follow up shortly.";
    }

    // 3. Save ticket
    const ticket = await SupportTicket.create({
      tenantId,
      userId,
      subject,
      description,
      status: "open",
      aiResponse,
    });

    return ticket;
  }

  /**
   * Retrieve tickets isolated by role/tenant permissions
   */
  static async getTickets(tenantId: string, userId: string, isAdmin: boolean): Promise<ISupportTicket[]> {
    const filter: mongoose.FilterQuery<ISupportTicket> = { tenantId };
    if (!isAdmin) {
      filter.userId = userId;
    }
    const docs = await SupportTicket.find(filter).sort({ createdAt: -1 }).lean();
    return docs as unknown as ISupportTicket[];
  }

  /**
   * Close support ticket
   */
  static async closeTicket(tenantId: string, ticketId: string): Promise<ISupportTicket> {
    const ticket = await SupportTicket.findOneAndUpdate(
      { _id: ticketId, tenantId },
      { status: "closed" },
      { new: true }
    );
    if (!ticket) throw new NotFoundError("Support ticket not found");
    return ticket;
  }
}
