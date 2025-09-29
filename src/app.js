import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import allRoutes from "./routes/index.js";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true, 
}));

app.use(express.json({ limit: "1mb" }));

app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use(cookieParser());

app.use("/api", allRoutes);

export default app;
