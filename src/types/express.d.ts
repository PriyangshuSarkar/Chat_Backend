import type { Business, User } from "@prisma/client";
import express from "express";

declare global {
  namespace Express {
    export interface Request {
      user: User;
      business: Business;
    }
  }
}
