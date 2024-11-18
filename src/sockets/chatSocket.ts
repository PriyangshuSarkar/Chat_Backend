import { ZodError } from "zod";
import { io } from "../app";
import {
  getMessages,
  joinChat,
  markAsRead,
  sendMessage,
} from "../controllers/chatController";
import { socketAuth } from "../middlewares/socketAuth";
import {
  GetMessagesType,
  JoinChatType,
  MarkAsReadType,
  SendMessageType,
} from "../types/chatType";

export const chatSockets = () => {
  io.use(async (socket, next) => {
    try {
      await socketAuth(socket, next);
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`${socket.data.type} connected:`, socket.data.author.id);

    try {
      if (
        socket.data &&
        socket.data.type &&
        socket.data.author &&
        socket.data.author.id
      ) {
        console.log(
          `${socket.data.type} connected successfully:`,
          socket.data.author.id
        );

        socket.emit("connection_status", {
          status: "success",
          message: "Connected successfully",
        });

        socket.on("disconnect", () => {
          console.log(`${socket.data.type} disconnected:`, socket.data.user.id);
        });

        socket.on("error", (error) => {
          console.error(
            `Error for ${socket.data.type}:`,
            socket.data.author.id,
            "Error:",
            error
          );
        });

        socket.on("join_chat", async (input: JoinChatType) => {
          try {
            const chat = await joinChat(socket, input);
            socket.join(chat.id);
            socket.emit("chat_joined", chat);
          } catch (error) {
            if (error instanceof ZodError) {
              socket.emit("error", {
                message: "Invalid input",
                details: error.errors,
              });
            } else {
              socket.emit("error", { message: error });
            }
          }
        });

        socket.on("send_message", async (input: SendMessageType) => {
          try {
            const message = await sendMessage(socket, input);
            socket.to(input.chatId).emit("new_message", message);
          } catch (error) {
            if (error instanceof ZodError) {
              socket.emit("error", {
                message: "Invalid input",
                details: error.errors,
              });
            } else {
              socket.emit("error", { message: error });
            }
          }
        });

        socket.on("get_messages", async (input: GetMessagesType) => {
          try {
            const messages = await getMessages(socket, input);
            socket.emit("messages", messages);
          } catch (error) {
            if (error instanceof ZodError) {
              socket.emit("error", {
                message: "Invalid input",
                details: error.errors,
              });
            } else {
              socket.emit("error", { message: error });
            }
          }
        });

        socket.on("mark_as_read", async (input: MarkAsReadType) => {
          try {
            const message = await markAsRead(socket, input);
            socket.emit("message_read", message);
          } catch (error) {
            if (error instanceof ZodError) {
              socket.emit("error", {
                message: "Invalid input",
                details: error.errors,
              });
            } else {
              socket.emit("error", { message: error });
            }
          }
        });
      } else {
        throw new Error("Invalid socket data");
      }
    } catch (error) {
      console.error("Error during connection setup:", error);
      socket.emit("connection_status", {
        status: "error",
        message: "Failed to establish connection",
      });
      socket.disconnect(true);
    }
  });

  io.on("connect_error", (error) => {
    console.error("Connection error:", error);
  });

  io.on("connect_timeout", (timeout) => {
    console.error("Connection timeout:", timeout);
  });
};
