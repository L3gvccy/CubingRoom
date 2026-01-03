import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cron from "node-cron";
import authRoutes from "./routes/AuthRoutes.js";
import wcaIdRoutes from "./routes/WcaIDRoutes.js";
import profileRoutes from "./routes/ProfileRoutes.js";
import testRoutes from "./routes/TestRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const dbUrl = process.env.DB_URL;

app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["POST", "GET", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/wca", wcaIdRoutes);
app.use("/api/profile", profileRoutes);

app.use("/api/test", testRoutes);

// cron.schedule("*/1 * * * *", scheduledTask, { scheduled: true });

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("MongoDB is ready!");
  })
  .catch((error) => {
    console.log(`Error while connecting to MongoDB:\n ${error}`);
  });
