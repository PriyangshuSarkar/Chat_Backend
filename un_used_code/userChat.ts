// src/routes/chatRoutes.ts
import { Router } from "express";
import {
  createOrJoinChat,
  getChat,
  getMessages,
  markAsRead,
  sendMessage,
} from "../controllers/userChat";

const userChatRoutes = Router();

userChatRoutes.get("/chat", getChat);

userChatRoutes.post("/chat/:businessId", userChatRoutes, createOrJoinChat);

userChatRoutes.post("/message", userChatRoutes, sendMessage);

userChatRoutes.get("/message/:chatId", userChatRoutes, getMessages);

userChatRoutes.put("/message/:messageId/read", userChatRoutes, markAsRead);

export default userChatRoutes;
