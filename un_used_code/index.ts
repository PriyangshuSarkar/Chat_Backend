import { Router } from "express";
import userChatRoutes from "./userChat";

const routers = Router();

routers.use(userChatRoutes);

export default routers;
