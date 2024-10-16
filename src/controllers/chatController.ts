import type { Socket } from "socket.io";
import { prisma } from "../utils/dbConnect";

export const joinChat = async (socket: Socket, partnerId: string) => {
  const { id: userId, type: userType } = socket.data.user;
  let chat;

  if (userType === "USER") {
    chat = await prisma.chat.findUnique({
      where: { userId_businessId: { userId, businessId: partnerId } },
    });

    if (!chat) {
      chat = await prisma.chat.create({
        data: { userId, businessId: partnerId },
      });
    }
  } else {
    chat = await prisma.chat.findUnique({
      where: { userId_businessId: { userId: partnerId, businessId: userId } },
    });

    if (!chat) {
      throw new Error("Chat not found");
    }
  }

  return chat;
};

export const sendMessage = async (
  socket: Socket,
  chatId: string,
  content: string
) => {
  const senderType = socket.data.type === "USER" ? "USER" : "BUSINESS";

  const message = await prisma.message.create({
    data: {
      chatId,
      content,
      senderType,
    },
  });

  if (!message) {
    throw new Error("Message could not be created!");
  }

  return message;
};

export const getMessages = async (
  socket: Socket,
  chatId: string,
  page: number,
  limit: number
) => {
  const skip = (page - 1) * limit;
  const messages = await prisma.message.findMany({
    where: { chatId },
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
  });
  if (!messages) {
    throw new Error("Could not get messages!");
  }

  return messages;
};

export const markAsRead = async (socket: Socket, messageId: string) => {
  const message = await prisma.message.update({
    where: { id: messageId },
    data: { readAt: new Date() },
  });
  if (!message) {
    throw new Error("Message could not be found!");
  }
  return message;
};
