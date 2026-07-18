// import { GoogleGenAI } from "@google/genai";
// import dotenv from "dotenv";

// dotenv.config();

// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// /**
//  * PR files ko readable format mein convert karta hai
//  */
// function formatDiffForReview(files) {
//   return files
//     .map((file) => {
//       return `
// File: ${file.filename}
// Status: ${file.status}
// Changes: +${file.additions} additions, -${file.deletions} deletions
// Diff:
// ${file.patch || "No diff available"}
// ${"─".repeat(60)}`;
//     })
//     .join("\n");
// }

// /**
//  * Main function — PR data lo, Gemini se review lo
//  */
// export async function reviewPrWithGemini(prData) {
//   const { metadata, files } = prData;

//   if (!files || files.length === 0) {
//     throw new Error("No files to review in this PR");
//   }

//   const formattedDiff = formatDiffForReview(files);

//   const prompt = `
// You are an expert code reviewer. Review the following GitHub Pull Request and provide detailed feedback.

// PR Title: ${metadata.title}
// PR Description: ${metadata.description}
// Author: ${metadata.author}
// Files Changed: ${metadata.totalFilesChanged}
// Total Additions: ${metadata.additions}
// Total Deletions: ${metadata.deletions}

// CODE CHANGES:
// ${formattedDiff}

// Provide your review as a valid JSON object with this exact structure:
// {
//   "overall_score": <number 1-10>,
//   "summary": "<2-3 line overall summary of the PR>",
//   "bugs": [
//     {
//       "file": "<filename>",
//       "line": "<line number or range if known>",
//       "severity": "<high|medium|low>",
//       "description": "<what the bug is>",
//       "suggestion": "<how to fix it>"
//     }
//   ],
//   "edge_cases": [
//     {
//       "file": "<filename>",
//       "description": "<what edge case is missed>",
//       "suggestion": "<how to handle it>"
//     }
//   ],
//   "security": [
//     {
//       "file": "<filename>",
//       "severity": "<high|medium|low>",
//       "description": "<what the security issue is>",
//       "suggestion": "<how to fix it>"
//     }
//   ],
//   "optimizations": [
//     {
//       "file": "<filename>",
//       "description": "<what can be optimized>",
//       "suggestion": "<how to optimize it>"
//     }
//   ],
//   "positive_aspects": [
//     "<what was done well in this PR>"
//   ]
// }

// IMPORTANT: Return ONLY the JSON object, no markdown, no backticks, no explanation.
// `;

//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-3.5-flash",
//       contents: prompt,
//     });

//     const text = response.text;

//     // JSON clean karo agar backticks hain toh
//     const cleaned = text
//       .replace(/```json/g, "")
//       .replace(/```/g, "")
//       .trim();

//     const review = JSON.parse(cleaned);
//     return review;

//   } catch (err) {
//     if (err instanceof SyntaxError) {
//       throw new Error("Gemini returned invalid JSON. Please try again.");
//     }
//     throw new Error(`Gemini API error: ${err.message}`);
//   }
// }






// 🚧 TESTING MODE — Gemini integration commented out
// Real integration ke liye uncomment karo aur mock data remove karo

export async function reviewPrWithGemini(prData) {
  
  // Fake delay — real API jaisa feel de
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Mock review data
  return {
    overall_score: 7,
    summary:
      "This PR introduces meaningful changes with good code structure. A few edge cases and minor security considerations should be addressed before merging.",
    bugs: [
      {
        file: "src/utils/parser.js",
        line: "42",
        severity: "high",
        description: "Potential null pointer exception when input is undefined",
        suggestion:
          "Add null check before accessing properties: if (!input) return null;",
      },
      {
        file: "src/api/handler.js",
        line: "87-92",
        severity: "medium",
        description: "Async function missing await keyword causing race condition",
        suggestion: "Add await before the async call on line 88",
      },
    ],
    edge_cases: [
      {
        file: "src/utils/parser.js",
        description: "Empty string input not handled — will cause unexpected behavior",
        suggestion: "Add early return for empty string: if (input.trim() === '') return [];",
      },
      {
        file: "src/api/handler.js",
        description: "Network timeout scenario not considered",
        suggestion: "Add timeout handling with Promise.race() or AbortController",
      },
    ],
    security: [
      {
        file: "src/api/handler.js",
        severity: "high",
        description: "User input directly interpolated into SQL query — SQL injection risk",
        suggestion: "Use parameterized queries or prepared statements instead",
      },
    ],
    optimizations: [
      {
        file: "src/utils/parser.js",
        description: "Array being filtered twice unnecessarily in a loop",
        suggestion: "Combine both filter conditions into a single .filter() call",
      },
      {
        file: "src/components/List.jsx",
        description: "Component re-renders on every parent update due to missing memo",
        suggestion: "Wrap component with React.memo() to prevent unnecessary re-renders",
      },
    ],
    positive_aspects: [
      "Clean and consistent code formatting throughout the PR",
      "Good separation of concerns between components and utilities",
      "Comprehensive variable naming makes code self-documenting",
      "Error boundaries properly implemented in React components",
    ],
  };
}
