import express from "express";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { upsertUser } from "../services/dbService.js";

dotenv.config();

const router = express.Router();

// ── Passport GitHub Strategy Setup ──────────────────────────
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "https://ai-code-reviewer-backend-39f9.onrender.com/api/auth/github/callback",
      scope: ["user:email", "repo"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // User DB mein save karo
        const dbUser = await upsertUser({
          githubId: profile.id,
          username: profile.username,
          displayName: profile.displayName || profile.username,
          avatar: profile.photos?.[0]?.value,
          email: profile.emails?.[0]?.value,
        });

        const user = {
          id: dbUser.id, // DB id — reviews ke liye zaruri
          githubId: profile.id,
          username: profile.username,
          displayName: profile.displayName || profile.username,
          avatar: profile.photos?.[0]?.value,
          email: profile.emails?.[0]?.value,
          accessToken,
        };
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// ── Routes ──────────────────────────────────────────────────

router.get("/github", passport.authenticate("github"));

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: `${process.env.FRONTEND_URL}?error=auth_failed`,
  }),
  (req, res) => {
    console.log("👤 User object before JWT:", req.user);
    const token = jwt.sign(req.user, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  
});

    res.redirect(`${process.env.FRONTEND_URL}?login=success`);
  }
);

router.get("/me", (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.json({ success: true, user: null });

    const user = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        email: user.email,
      },
    });
  } catch (err) {
    res.json({ success: true, user: null });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully" });
});

export default router;