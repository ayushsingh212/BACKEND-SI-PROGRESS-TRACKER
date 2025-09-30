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


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

export default app;
