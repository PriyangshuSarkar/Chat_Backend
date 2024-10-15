// src/server.ts
import express, { json, type Express } from "express";
import http from "http";
import { dbConnect, prisma } from "./utils/dbConnect";
import { Server } from "socket.io";
import morgan from "morgan";
import { errorHandler } from "./middlewares/errorHandler";
import routers from "./routes";
import cookieParser from "cookie-parser";

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

app.use(morgan("dev"));
app.use(json());
app.use(cookieParser());
app.use("/api", routers);

dbConnect();

app.use(errorHandler);

const port = process.env.PORT;

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
