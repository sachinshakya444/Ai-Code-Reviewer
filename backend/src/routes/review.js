import express from "express";
import { parsePrUrl } from "../utils/parsePrUrl.js";
import { getFullPrData } from "../services/githubService.js";
import { reviewPrWithGemini } from "../services/geminiService.js";
import { saveReview } from "../services/dbService.js";
import { optionalAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * POST /api/review
 * Body: { prUrl: "https://github.com/owner/repo/pull/123" }
 * Returns: PR metadata + AI review
 */
router.post("/", optionalAuth, async (req, res, next) => {
  try {
    const { prUrl } = req.body;

    // Step 1: URL validate karo
    if (!prUrl) {
      return res.status(400).json({
        success: false,
        error: "prUrl is required",
      });
    }

    console.log(`🔍 Fetching PR: ${prUrl}`);

    // Step 2: URL parse karo
    const { owner, repo, pullNumber } = parsePrUrl(prUrl);

    // Step 3: GitHub se PR data fetch karo
    const prData = await getFullPrData(owner, repo, pullNumber);

    console.log(`✅ PR fetched — ${prData.totalFilesReviewed} files found`);
    console.log(`🤖 Sending to Gemini for review...`);

    // Step 4: Gemini se review lo
    const review = await reviewPrWithGemini(prData);

    console.log(`✅ Review complete — Score: ${review.overall_score}/10`);

    console.log("👤 User from token:", req.user);
    // Step 5: DB mein save karo — sirf logged in users ke liye
    let savedReview = null;
    if (req.user?.id) {
      try {
        savedReview = await saveReview(
          req.user.id,
          {
            url: prUrl,
            title: prData.metadata.title,
            author: prData.metadata.author,
            repo,
            owner,
            pullNumber,
            totalFilesReviewed: prData.totalFilesReviewed,
            additions: prData.metadata.additions,
            deletions: prData.metadata.deletions,
          },
          review
        );
        console.log(`💾 Review saved to DB — ID: ${savedReview.id}`);
      } catch (dbErr) {
        // DB error se main flow affect na ho
        console.error("DB save error:", dbErr.message);
      }
    }

    // Step 6: Response bhejo
    res.status(200).json({
      success: true,
      data: {
        reviewId: savedReview?.id || null,
        pr: {
          owner,
          repo,
          pullNumber,
          url: prUrl,
          ...prData.metadata,
          totalFilesReviewed: prData.totalFilesReviewed,
          skippedFiles: prData.skippedFiles,
        },
        files: prData.files,
        review,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/review/history
 * Logged in user ki saari reviews
 */
router.get("/history", optionalAuth, async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        error: "Please login to see review history",
      });
    }

    const { getUserReviews } = await import("../services/dbService.js");
    const reviews = await getUserReviews(req.user.id);

    res.json({ success: true, data: reviews });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/review/:id
 * Single review fetch karo
 */
router.get("/:id", optionalAuth, async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        error: "Please login to view this review",
      });
    }

    const { getReviewById } = await import("../services/dbService.js");
    const review = await getReviewById(req.params.id, req.user.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: "Review not found",
      });
    }

    res.json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
});

export default router;