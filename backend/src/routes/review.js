import express from "express";
import { parsePrUrl } from "../utils/parsePrUrl.js";
import { getFullPrData } from "../services/githubService.js";
import { reviewPrWithGemini } from "../services/geminiService.js";

const router = express.Router();

/**
 * POST /api/review
 * Body: { prUrl: "https://github.com/owner/repo/pull/123" }
 * Returns: PR metadata + AI review
 */
router.post("/", async (req, res, next) => {
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

    // Step 5: Sab kuch ek saath bhejo
    res.status(200).json({
      success: true,
      data: {
        pr: {
          owner,
          repo,
          pullNumber,
          url: prUrl,
          ...prData.metadata,
          totalFilesReviewed: prData.totalFilesReviewed,
          skippedFiles: prData.skippedFiles,
        },
        review,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;