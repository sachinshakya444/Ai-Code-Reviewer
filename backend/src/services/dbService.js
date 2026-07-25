import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * User ko DB mein save karo ya update karo
 * GitHub OAuth ke baad call hoga
 */
export async function upsertUser(userData) {
  return await prisma.user.upsert({
    where: { githubId: userData.githubId },
    update: {
      username: userData.username,
      displayName: userData.displayName,
      avatar: userData.avatar,
      email: userData.email,
    },
    create: {
      githubId: userData.githubId,
      username: userData.username,
      displayName: userData.displayName,
      avatar: userData.avatar,
      email: userData.email,
    },
  });
}

/**
 * Review save karo DB mein
 */
export async function saveReview(userId, prData, review) {
  return await prisma.review.create({
    data: {
      userId,
      prUrl: prData.url,
      prTitle: prData.title,
      prAuthor: prData.author,
      repo: prData.repo,
      owner: prData.owner,
      pullNumber: prData.pullNumber,
      overallScore: review.overall_score,
      summary: review.summary,
      bugs: review.bugs,
      edgeCases: review.edge_cases,
      security: review.security,
      optimizations: review.optimizations,
      positiveAspects: review.positive_aspects,
      filesReviewed: prData.totalFilesReviewed || 0,
      additions: prData.additions || 0,
      deletions: prData.deletions || 0,
    },
  });
}

/**
 * User ki saari reviews fetch karo
 */
export async function getUserReviews(userId) {
  return await prisma.review.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      prTitle: true,
      prUrl: true,
      repo: true,
      owner: true,
      pullNumber: true,
      overallScore: true,
      filesReviewed: true,
      createdAt: true,
    },
  });
}

/**
 * Single review fetch karo by ID
 */
export async function getReviewById(reviewId, userId) {
  return await prisma.review.findFirst({
    where: {
      id: reviewId,
      userId, // Security — sirf apni review dekh sakta hai
    },
  });
}

export { prisma };