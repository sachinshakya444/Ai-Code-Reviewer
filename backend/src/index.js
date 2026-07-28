import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import githubRoutes from "./routes/github.js";
import reviewRoutes from "./routes/review.js";
import authRoutes from "./routes/auth.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. ADD THIS LINE: Trust proxy is required for secure cookies on Render
app.set("trust proxy", 1);

// ── Middleware ──────────────────────────────────────────────

// 2. UPDATE YOUR CORS CONFIGURATION
app.use(cors({
  origin: "https://ai-code-reviewer-tau-five.vercel.app", // Put your exact Vercel URL here
  credentials: true, // Cookies allow karo[cite: 3]
}));

app.use(express.json()); //[cite: 3]
app.use(cookieParser()); //[cite: 3]

// Session — Passport ke liye zaruri hai[cite: 3]
app.use(session({
  secret: process.env.SESSION_SECRET, //[cite: 3]
  resave: false, //[cite: 3]
  saveUninitialized: false, //[cite: 3]
  cookie: {
    secure: process.env.NODE_ENV === "production", //[cite: 3]
    maxAge: 7 * 24 * 60 * 60 * 1000, //[cite: 3]
  },
}));

// Passport initialize
app.use(passport.initialize());
app.use(passport.session());

// Rate limiter
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  message: { error: "Too many requests, please try again later." },
});
app.use("/api", limiter);

// ── Routes ──────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/github", githubRoutes);
app.use("/api/review", reviewRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "AI Code Reviewer is running 🚀" });
});

// ── Error Handlers ──────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});