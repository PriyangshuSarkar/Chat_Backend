// import type { Socket } from "socket.io";

// export const tryCatchMiddleware = async (
//   fn: (socket: any, ...args: any[]) => Promise<any>
// ) => {
//   return async (socket: Socket, next: any, ...args: any[]) => {
//     try {
//       await fn(socket, ...args);
//       next();
//     } catch (error) {
//       next(error);
//     }
//   };
// };
