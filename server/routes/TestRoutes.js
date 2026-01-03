import { Router } from "express";
import { generateScramble } from "../controllers/TestController.js";

const testRoutes = Router();

testRoutes.post("/gen-scr", generateScramble);

export default testRoutes;
