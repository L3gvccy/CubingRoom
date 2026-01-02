import { Router } from "express";
import {
  redirectToWcaID,
  redirectToWcaIDLink,
  WcaIDCallback,
  WcaIDLinkCallback,
} from "../controllers/WcaIDController.js";

const wcaIdRoutes = Router();

wcaIdRoutes.get("/auth", redirectToWcaID);
wcaIdRoutes.get("/callback", WcaIDCallback);
wcaIdRoutes.get("/link", redirectToWcaIDLink);
wcaIdRoutes.get("/link-callback", WcaIDLinkCallback);

export default wcaIdRoutes;
