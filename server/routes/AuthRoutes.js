import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getMe, logout } from "../controllers/authController.js";

const authRoutes = Router();

authRoutes.get("/me", verifyToken, getMe);
authRoutes.get("/logout", logout);

export default authRoutes;
