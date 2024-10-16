import { verify } from "jsonwebtoken";
import { prisma } from "../utils/dbConnect";
import type { Socket } from "socket.io";

export const socketAuth = async (socket: Socket, next: any) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error: Token not provided"));
  }

  const JWT_SECRET = process.env.JWT_SECRET!;

  try {
    const decoded = verify(token, JWT_SECRET) as {
      userId?: string;
      businessId?: string;
    };

    let author = null;
    let type = "";

    if (decoded.userId) {
      author = await prisma.user.findUnique({ where: { id: decoded.userId } });
      type = "USER";
    } else if (decoded.businessId) {
      author = await prisma.business.findUnique({
        where: { id: decoded.businessId },
      });
      type = "BUSINESS";
    }

    if (!author) {
      return next(
        new Error("Authentication error: User or Business not found")
      );
    }

    socket.data.author = author;
    socket.data.type = type;
    next();
  } catch (error) {
    next(new Error("Authentication error: Invalid token"));
  }
};
