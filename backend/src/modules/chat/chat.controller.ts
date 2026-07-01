import { Response } from "express";
import { ChatService } from "./chat.service";
import { sendSuccess } from "../../shared/utils/api-response";
import { asyncHandler } from "../../shared/utils/async-handler";
import { createConversationSchema, sendMessageSchema } from "./chat.validation";
import { BadRequestError } from "../../shared/errors/errors";
import { AuthRequest } from "../../shared/types/auth.types";

export const createConversation = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  const userId = req.user?.id;
  if (!tenantId || !userId) throw new BadRequestError("Auth context required");

  const parsed = createConversationSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(parsed.error.errors[0].message);
  }

  // Auto-fill student's grade if not specified
  const grade = parsed.data.grade || (req.user?.grades && req.user.grades[0]) || 9;

  const conversation = await ChatService.createConversation(tenantId, userId, {
    ...parsed.data,
    grade,
  });

  sendSuccess(res, conversation, "Chat session started successfully", 201);
});

export const sendMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  const { conversationId } = req.params;
  if (!tenantId) throw new BadRequestError("Auth context required");

  const parsed = sendMessageSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(parsed.error.errors[0].message);
  }

  const result = await ChatService.sendMessage(tenantId, conversationId as string, parsed.data.message);
  sendSuccess(res, result, "Message replied successfully");
});

export const listConversations = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  const userId = req.user?.id;
  if (!tenantId || !userId) throw new BadRequestError("Auth context required");

  const list = await ChatService.listConversations(tenantId, userId);
  sendSuccess(res, list, "Conversations list retrieved");
});

export const getConversation = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  const { conversationId } = req.params;
  if (!tenantId) throw new BadRequestError("Auth context required");

  const conversation = await ChatService.getConversation(tenantId, conversationId as string);
  sendSuccess(res, conversation, "Conversation log retrieved");
});

export const deleteConversation = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  const { conversationId } = req.params;
  if (!tenantId) throw new BadRequestError("Auth context required");

  await ChatService.archiveConversation(tenantId, conversationId as string);
  sendSuccess(res, null, "Conversation archived successfully");
});
