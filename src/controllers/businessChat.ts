// src/controllers/chatController.ts
import type { Request, Response } from "express";
import { prisma } from "../utils/dbConnect";
import { tryCatch } from "../middlewares/tryCatch";

// Create or join a chat session
export const createOrJoinChat = tryCatch(
  async (req: Request, res: Response) => {
    const { userId } = req.body;

    const existingChat = await prisma.chat.findFirst({
      where: {
        businessId: req.business.id,
        userId,
      },
    });

    let chat;
    if (existingChat) {
      chat = existingChat;
    } else {
      chat = await prisma.chat.create({
        data: {
          businessId: req.business.id,
          userId,
        },
      });
    }

    res.json(chat);
  }
);

// Fetch chat
export const getChat = tryCatch(async (req: Request, res: Response) => {
  const businessId = req.business.id;
  const chats = await prisma.chat.findMany({
    where: { businessId },
    include: { Messages: { orderBy: { createdAt: "desc" }, take: 1 } },
  });
  res.json(chats);
});

// Send a message
export const sendMessage = tryCatch(async (req: Request, res: Response) => {
  const { chatId, content, senderType } = req.body;
  const message = await prisma.message.create({
    data: {
      chatId,
      content,
      senderType,
    },
  });

  res.json(message);
});

// Get message
export const getMessages = tryCatch(async (req: Request, res: Response) => {
  const { chatId } = req.params;
  const { page = "1", limit = "50" } = req.query;
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
  const messages = await prisma.message.findMany({
    where: { chatId },
    orderBy: { createdAt: "desc" },
    skip,
    take: parseInt(limit as string),
  });
  res.json(messages);
});

// Set message marked as read
export const markAsRead = tryCatch(async (req: Request, res: Response) => {
  const { messageId } = req.params;
  const message = await prisma.message.update({
    where: { id: messageId },
    data: { readAt: new Date() },
  });
  res.json(message);
});
