import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getUser, updateName } from "../controllers/ProfileController.js";

const profileRoutes = Router();

profileRoutes.get("/users/:id", verifyToken, getUser);
profileRoutes.post("/update-name", verifyToken, updateName);

export default profileRoutes;
