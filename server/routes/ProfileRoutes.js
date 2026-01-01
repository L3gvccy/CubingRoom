import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getUser } from "../controllers/ProfileController.js";

const profileRoutes = Router();

profileRoutes.put("/users/:id", verifyToken, getUser);

export default profileRoutes;
