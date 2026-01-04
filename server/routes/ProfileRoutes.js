import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import {
  getUser,
  updateName,
  updateTimerType,
} from "../controllers/ProfileController.js";

const profileRoutes = Router();

profileRoutes.get("/users/:id", verifyToken, getUser);
profileRoutes.post("/update-name", verifyToken, updateName);
profileRoutes.post("/update-timer-type", verifyToken, updateTimerType);

export default profileRoutes;
