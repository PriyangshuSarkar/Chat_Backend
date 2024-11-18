import type { Socket } from "socket.io";
import { prisma } from "../utils/dbConnect";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils/cloudinary";
import {
  GetMessagesSchema,
  GetMessagesType,
  JoinChatSchema,
  JoinChatType,
  MarkAsReadSchema,
  MarkAsReadType,
  SendMessageSchema,
  SendMessageType,
} from "../types/chatType";

export const joinChat = async (socket: Socket, input: JoinChatType) => {
  const { id: userId, type: userType } = socket.data.user;
  const { partnerId } = JoinChatSchema.parse(input);
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

export const sendMessage = async (socket: Socket, input: SendMessageType) => {
  const senderType = socket.data.type === "USER" ? "USER" : "BUSINESS";
  const { chatId, content, file } = SendMessageSchema.parse(input);
  let fileUrl = null;
  let fileType = null;

  if (file) {
    try {
      // Upload file to Cloudinary
      fileUrl = (await uploadToCloudinary(file, "chat_attachments")) as string;
      fileType = file.mimetype.startsWith("image/") ? "IMAGE" : "FILE";
    } catch (error) {
      console.error("File upload failed:", error);
      throw new Error("File upload failed" + error);
    }
  }

  const message = await prisma.message.create({
    data: {
      chatId,
      content: content || "",
      senderType,
      fileUrl,
      fileType,
    },
  });

  if (!message) {
    if (fileUrl) {
      await deleteFromCloudinary(fileUrl).catch(console.error);
    }
    throw new Error("Message could not be created!");
  }

  return message;
};

export const getMessages = async (socket: Socket, input: GetMessagesType) => {
  const { chatId, page, limit } = GetMessagesSchema.parse(getMessages);
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

export const markAsRead = async (socket: Socket, input: MarkAsReadType) => {
  const { messageId } = MarkAsReadSchema.parse(input);
  const message = await prisma.message.update({
    where: { id: messageId },
    data: { readAt: new Date() },
  });
  if (!message) {
    throw new Error("Message could not be found!");
  }
  return message;
};
