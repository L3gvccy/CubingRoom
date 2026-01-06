import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import {
  getMe,
  login,
  logout,
  register,
} from "../controllers/AuthController.js";

const authRoutes = Router();

authRoutes.get("/me", verifyToken, getMe);
authRoutes.post("/login", login);
authRoutes.post("/register", register);
authRoutes.get("/logout", logout);

export default authRoutes;
