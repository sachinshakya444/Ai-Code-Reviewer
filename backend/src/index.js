import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import githubRoutes from "./routes/github.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

// Rate limiter — 30 requests per 10 minutes per IP
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  message: { error: "Too many requests, please try again later." },
});
app.use("/api", limiter);

// ── Routes ──────────────────────────────────────────────
app.use("/api/github", githubRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "AI Code Reviewer is running 🚀" });
});
app.use(notFoundHandler);

// ── Error Handler ───────────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});