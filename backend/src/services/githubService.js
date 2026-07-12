import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";

dotenv.config();

// Octokit instance banao — GitHub token se authenticate karo
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

/**
 * PR ki basic info fetch karta hai
 * Title, author, branch, total files changed etc.
 */
export async function getPrMetadata(owner, repo, pullNumber) {
  try {
    const { data } = await octokit.pulls.get({
      owner,
      repo,
      pull_number: pullNumber,
    });

    return {
      title: data.title,
      description: data.body || "No description provided",
      author: data.user.login,
      authorAvatar: data.user.avatar_url,
      sourceBranch: data.head.ref,   // jis branch se PR aaya
      targetBranch: data.base.ref,   // jis branch mein merge hoga
      state: data.state,             // open / closed / merged
      totalFilesChanged: data.changed_files,
      additions: data.additions,     // kitni lines add hui
      deletions: data.deletions,     // kitni lines remove hui
      createdAt: data.created_at,
      prUrl: data.html_url,
    };
  } catch (err) {
    // GitHub ka error clearly batao
    if (err.status === 404) {
      throw new Error("PR not found. Check the URL or make sure the repo is public.");
    }
    if (err.status === 401) {
      throw new Error("GitHub token invalid or expired.");
    }
    throw new Error(`GitHub API error: ${err.message}`);
  }
}

/**
 * PR mein jo files change hui hain unka diff fetch karta hai
 * Yahi code Claude ko bhejenge review ke liye
 */
export async function getPrFiles(owner, repo, pullNumber) {
  try {
    // GitHub ek baar mein max 300 files deta hai — pagination handle karo
    const files = await octokit.paginate(octokit.pulls.listFiles, {
      owner,
      repo,
      pull_number: pullNumber,
      per_page: 100,
    });

    // Sirf important info lo — poora raw response nahi chahiye
    return files.map((file) => ({
      filename: file.filename,
      status: file.status,        // added / modified / removed / renamed
      additions: file.additions,
      deletions: file.deletions,
      patch: file.patch || null,  // actual code diff — yahi important hai
    }));
  } catch (err) {
    if (err.status === 404) {
      throw new Error("PR files not found.");
    }
    throw new Error(`Failed to fetch PR files: ${err.message}`);
  }
}

/**
 * Ek hi function mein metadata + files dono fetch karta hai
 * Route se yahi call karenge
 */
export async function getFullPrData(owner, repo, pullNumber) {
  // Dono calls parallel mein chalao — time bachao
  const [metadata, files] = await Promise.all([
    getPrMetadata(owner, repo, pullNumber),
    getPrFiles(owner, repo, pullNumber),
  ]);

  // Bahut badi files skip karo — Claude ka context limit hai
  const filteredFiles = files.filter(
    (file) => file.patch && file.patch.length < 10000
  );

  return {
    metadata,
    files: filteredFiles,
    totalFilesReviewed: filteredFiles.length,
    skippedFiles: files.length - filteredFiles.length,
  };
}