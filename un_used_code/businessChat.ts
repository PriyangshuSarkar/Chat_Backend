// src/routes/chatRoutes.ts
import { Router } from "express";
import {
  createOrJoinChat,
  getChat,
  getMessages,
  markAsRead,
  sendMessage,
} from "../controllers/businessChat";

const businessChatRoutes = Router();

businessChatRoutes.get("/chat", getChat);

businessChatRoutes.post("/chat/:userId", businessChatRoutes, createOrJoinChat);

businessChatRoutes.post("/message", businessChatRoutes, sendMessage);

businessChatRoutes.get("/message/:chatId", businessChatRoutes, getMessages);

businessChatRoutes.put(
  "/message/:messageId/read",
  businessChatRoutes,
  markAsRead
);

export default businessChatRoutes;
