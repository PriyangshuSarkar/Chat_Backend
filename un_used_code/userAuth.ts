// import type { NextFunction, Request, Response } from "express";
// import { tryCatch } from "./tryCatch";
// import { verify } from "jsonwebtoken";
// import { prisma } from "../utils/dbConnect";

// export const authMiddleware = tryCatch(
//   async (req: Request, res: Response, next: NextFunction) => {
//     // const authHeader = req.headers.authorization;
//     const token = req.cookies.authToken;

//     if (!token) {
//       return res
//         .status(401)
//         .json({ error: "Unauthorized: No cookie provided!" });
//     }

//     const payload = verify(token, process.env.JWT_SECRET!) as {
//       userId: string;
//     };

//     const user = await prisma.user.findUniqueOrThrow({
//       where: { id: payload.userId, deletedAt: null },
//     });

//     if (!user) {
//       return res.status(401).json({ error: "Unauthorized User!" });
//     }

//     req.user = user;
//     next();
//   }
// );
