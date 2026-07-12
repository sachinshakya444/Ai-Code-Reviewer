import express from "express";
import { parsePrUrl } from "../utils/parsePrUrl.js";
import { getFullPrData } from "../services/githubService.js";

const router = express.Router();

/**
 * POST /api/github/pr
 * Body: { prUrl: "https://github.com/owner/repo/pull/123" }
 * Returns: PR metadata + changed files + diffs
 */
router.post("/pr", async (req, res, next) => {
  try {
    const { prUrl } = req.body;

    // Step 1: URL validate karo
    if (!prUrl) {
      return res.status(400).json({
        success: false,
        error: "prUrl is required in request body",
      });
    }

    // Step 2: URL parse karo — owner, repo, pullNumber nikalo
    const { owner, repo, pullNumber } = parsePrUrl(prUrl);

    // Step 3: GitHub se full PR data fetch karo
    const prData = await getFullPrData(owner, repo, pullNumber);

    // Step 4: Success response bhejo
    res.status(200).json({
      success: true,
      data: {
        owner,
        repo,
        pullNumber,
        ...prData,
      },
    });
  } catch (err) {
    // Error handler middleware ko pass karo
    next(err);
  }
});

/**
 * GET /api/github/pr/validate
 * Query: ?url=https://github.com/owner/repo/pull/123
 * Sirf URL validate karta hai — actual data fetch nahi karta
 * Frontend real-time validation ke liye use karega
 */
router.get("/pr/validate", (req, res) => {
  try {
    const { url } = req.query;
    const parsed = parsePrUrl(url);

    res.json({
      success: true,
      valid: true,
      parsed, // { owner, repo, pullNumber }
    });
  } catch (err) {
    res.json({
      success: false,
      valid: false,
      error: err.message,
    });
  }
});

export default router;