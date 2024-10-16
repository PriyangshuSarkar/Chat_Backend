import { io } from "../app";
import {
  getMessages,
  joinChat,
  markAsRead,
  sendMessage,
} from "../controllers/chatController";
import { socketAuth } from "../middlewares/socketAuth";

export const chatSockets = () => {
  io.use(async (socket, next) => {
    await socketAuth(socket, next);
  });

  io.on("connection", (socket) => {
    console.log(`${socket.data.type} connected:`, socket.data.author.id);

    socket.on("join_chat", async (partnerId: string) => {
      try {
        const chat = await joinChat(socket, partnerId);
        socket.join(chat.id);
        socket.emit("chat_joined", chat);
      } catch (error) {
        socket.emit("error", { message: error });
      }
    });

    socket.on("send_message", async (chatId: string, content: string) => {
      try {
        const message = await sendMessage(socket, chatId, content);
        socket.to(chatId).emit("new_message", message);
      } catch (error) {
        socket.emit("error", { message: error });
      }
    });

    socket.on(
      "get_messages",
      async (chatId: string, page: number, limit: number) => {
        try {
          const messages = await getMessages(socket, chatId, page, limit);
          socket.emit("messages", messages);
        } catch (error) {
          socket.emit("error", { message: error });
        }
      }
    );

    socket.on("mark_as_read", async (messageId: string) => {
      try {
        const message = await markAsRead(socket, messageId);
        socket.emit("message_read", message);
      } catch (error) {
        socket.emit("error", { message: error });
      }
    });

    socket.on("disconnect", () => {
      console.log(`${socket.data.type} disconnected:`, socket.data.user.id);
    });
  });
};
