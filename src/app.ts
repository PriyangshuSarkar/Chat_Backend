// src/server.ts
import express, { json, type Express } from "express";
import http from "http";
import { dbConnect, prisma } from "./utils/dbConnect";
import { Server } from "socket.io";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { chatSockets } from "./sockets/chatSocket";

export const app: Express = express();
export const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "*", // You can specify an array of allowed origins here
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

chatSockets();

app.use(morgan("dev"));
app.use(json());
app.use(cookieParser());

dbConnect();

const port = process.env.PORT;

server.listen(port, () => {
  console.log(`🚀 Server ready at http://127.0.0.1:${port}`);
});
