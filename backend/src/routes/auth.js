import express from "express";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// ── Passport GitHub Strategy Setup ──────────────────────────
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/github/callback",
      scope: ["user:email", "repo"],
    },
    async (accessToken, refreshToken, profile, done) => {
      // User object banao jo JWT mein store hoga
      const user = {
        githubId: profile.id,
        username: profile.username,
        displayName: profile.displayName || profile.username,
        avatar: profile.photos?.[0]?.value,
        email: profile.emails?.[0]?.value,
        accessToken, // GitHub API calls ke liye
      };
      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// ── Routes ──────────────────────────────────────────────────

/**
 * GET /api/auth/github
 * GitHub OAuth flow shuru karta hai
 */
router.get("/github", passport.authenticate("github"));

/**
 * GET /api/auth/github/callback
 * GitHub OAuth callback — JWT token banata hai aur frontend pe redirect karta hai
 */
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: `${process.env.FRONTEND_URL}?error=auth_failed` }),
  (req, res) => {
    // JWT token banao
    const token = jwt.sign(req.user, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Cookie mein store karo
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Frontend pe redirect karo
    res.redirect(`${process.env.FRONTEND_URL}?login=success`);
  }
);

/**
 * GET /api/auth/me
 * Current logged in user ki info deta hai
 */
router.get("/me", (req, res) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.json({ success: true, user: null });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      success: true,
      user: {
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

/**
 * POST /api/auth/logout
 * Cookie clear karta hai
 */
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully" });
});

export default router;