import { Response } from "express";
import { AuthRequest, UserRole } from "../../shared/types/auth.types";
import { SupportService } from "./support.service";
import { sendSuccess } from "../../shared/utils/api-response";
import { asyncHandler } from "../../shared/utils/async-handler";
import { BadRequestError } from "../../shared/errors/errors";

export const createTicket = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  const userId = req.user?.id;

  if (!tenantId || !userId) {
    throw new BadRequestError("Auth context required");
  }

  const { subject, description } = req.body;
  if (!subject || !description) {
    throw new BadRequestError("Subject and Description are required");
  }

  const ticket = await SupportService.createTicket(
    tenantId,
    userId as string,
    subject,
    description
  );

  sendSuccess(res, ticket, "Support ticket registered successfully", 201);
});

export const getTickets = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  const userId = req.user?.id;

  if (!tenantId || !userId) {
    throw new BadRequestError("Auth context required");
  }

  // User is considered admin if role is 'admin' or 'owner' or 'super-admin'
  const isAdmin =
    req.user?.role === UserRole.ORG_ADMIN ||
    req.user?.role === UserRole.ORG_OWNER ||
    req.user?.role === UserRole.SUPER_ADMIN;

  const tickets = await SupportService.getTickets(tenantId, userId as string, isAdmin);
  sendSuccess(res, tickets, "Support tickets list retrieved");
});

export const closeTicket = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  if (!tenantId) {
    throw new BadRequestError("Auth context required");
  }

  const { ticketId } = req.params;

  const result = await SupportService.closeTicket(tenantId, ticketId as string);
  sendSuccess(res, result, "Support ticket closed successfully");
});
