import { Router } from "express";
import {
  redirectToWcaID,
  WcaIDCallback,
} from "../controllers/WcaIDController.js";

const wcaIdRoutes = Router();

wcaIdRoutes.get("/auth", redirectToWcaID);
wcaIdRoutes.get("/callback", WcaIDCallback);

export default wcaIdRoutes;
