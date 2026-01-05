import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import {
  getAllContests,
  getContest,
} from "../controllers/ContestController.js";

const contestRoutes = Router();

contestRoutes.get("/get-all-contests", verifyToken, getAllContests);
contestRoutes.get("/get-contest/:contestId", verifyToken, getContest);

export default contestRoutes;
