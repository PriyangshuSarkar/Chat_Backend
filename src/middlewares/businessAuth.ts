import type { NextFunction, Request, Response } from "express";
import { tryCatch } from "./tryCatch";
import { verify } from "jsonwebtoken";
import { prisma } from "../utils/dbConnect";

export const authMiddleware = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    // const authHeader = req.headers.authorization;
    const token = req.cookies.authToken;

    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized: No cookie provided!" });
    }

    const payload = verify(token, process.env.JWT_SECRET!) as {
      businessId: string;
    };

    const business = await prisma.business.findUniqueOrThrow({
      where: { id: payload.businessId, deletedAt: null },
    });

    if (!business) {
      return res.status(401).json({ error: "Unauthorized User!" });
    }

    req.business = business;
    next();
  }
);
