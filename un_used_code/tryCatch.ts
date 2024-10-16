import type { Socket } from "socket.io";

export const tryCatch = async (
  fn: (socket: Socket, ...args: any[]) => Promise<any>
) => {
  return async (socket: Socket, next: any, ...args: any[]) => {
    try {
      await fn(socket, ...args);
      next();
    } catch (error) {
      next(error);
    }
  };
};
