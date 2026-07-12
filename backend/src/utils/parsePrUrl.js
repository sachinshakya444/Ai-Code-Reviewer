/**
 * GitHub PR URL se owner, repo aur pull number extract karta hai
 * Example: https://github.com/facebook/react/pull/28701
 * Returns: { owner: "facebook", repo: "react", pullNumber: 28701 }
 */
export function parsePrUrl(url) {
  if (!url || typeof url !== "string") {
    throw new Error("Please provide a valid GitHub PR URL");
  }

  // URL trim karo — accidental spaces remove karo
  const trimmed = url.trim();

  // Regex pattern — GitHub PR URL ka exact format match karta hai
  const pattern =
    /^https?:\/\/github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)\/pull\/(\d+)/;

  const match = trimmed.match(pattern);

  if (!match) {
    throw new Error(
      "Invalid GitHub PR URL. Format should be: https://github.com/owner/repo/pull/123"
    );
  }

  return {
    owner: match[1],      // facebook
    repo: match[2],       // react
    pullNumber: parseInt(match[3], 10),  // 28701
  };
}