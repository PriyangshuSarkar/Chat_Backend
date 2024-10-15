import { io } from "../app";
import { prisma } from "./dbConnect";

// Socket.io connection
io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("joinChat", async ({ userId, businessId }) => {
    const existingChat = await prisma.chat.findFirst({
      where: {
        userId,
        businessId,
      },
    });

    let chat;
    if (existingChat) {
      chat = existingChat;
    } else {
      chat = await prisma.chat.create({
        data: {
          userId,
          businessId,
        },
      });
    }

    socket.join(chat.id);
    socket.emit("chatJoined", chat);
  });

  socket.on("sendMessage", async ({ chatId, content, senderType }) => {
    const message = await prisma.message.create({
      data: {
        chatId,
        content,
        senderType,
      },
    });

    io.to(chatId).emit("newMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
