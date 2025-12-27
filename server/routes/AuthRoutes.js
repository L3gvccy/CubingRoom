import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getMe } from "../controllers/authController.js";

const authRoutes = Router();

authRoutes.get("/me", verifyToken, getMe);

export default authRoutes;
