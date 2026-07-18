import { useState } from "react";
import PRInput from "./components/PRInput";
import ReviewCard from "./components/ReviewCard";
import ScoreDisplay from "./components/ScoreDisplay";
import Loader from "./components/Loader";
import axios from "axios";

const API_URL = "http://localhost:5000";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [reviewData, setReviewData] = useState(null);
  const [error, setError] = useState(null);

  async function handleReview(prUrl) {
    setLoading(true);
    setError(null);
    setReviewData(null);

    try {
      const response = await axios.post(`${API_URL}/api/review`, { prUrl });
      setReviewData(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <span className="text-2xl">🔍</span>
          <div>
            <h1 className="text-xl font-bold text-white">AI Code Reviewer</h1>
            <p className="text-gray-400 text-sm">Powered by Gemini AI</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* PR Input */}
        <PRInput onSubmit={handleReview} loading={loading} />

        {/* Error */}
        {error && (
          <div className="mt-6 bg-red-900/30 border border-red-700 text-red-400 px-5 py-4 rounded-xl">
            ❌ {error}
          </div>
        )}

        {/* Loader */}
        {loading && <Loader />}

        {/* Review Results */}
        {reviewData && !loading && (
          <div className="mt-8 space-y-6">
            {/* PR Info */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h2 className="text-lg font-semibold text-white mb-1">
                {reviewData.pr.title}
              </h2>
              <p className="text-gray-400 text-sm">
                by <span className="text-blue-400">@{reviewData.pr.author}</span>
                {" · "}
                {reviewData.pr.totalFilesReviewed} files reviewed
                {reviewData.pr.skippedFiles > 0 && (
                  <span className="text-yellow-500">
                    {" "}· {reviewData.pr.skippedFiles} files skipped (too large)
                  </span>
                )}
              </p>
            </div>

            {/* Score */}
            <ScoreDisplay score={reviewData.review.overall_score} summary={reviewData.review.summary} />

            {/* Review Cards */}
            <ReviewCard
              title="🐛 Bugs"
              color="red"
              items={reviewData.review.bugs}
              type="bugs"
            />
            <ReviewCard
              title="⚠️ Edge Cases"
              color="yellow"
              items={reviewData.review.edge_cases}
              type="edge_cases"
            />
            <ReviewCard
              title="🔒 Security Issues"
              color="orange"
              items={reviewData.review.security}
              type="security"
            />
            <ReviewCard
              title="⚡ Optimizations"
              color="blue"
              items={reviewData.review.optimizations}
              type="optimizations"
            />
            <ReviewCard
              title="✅ Positive Aspects"
              color="green"
              items={reviewData.review.positive_aspects}
              type="positive"
            />
          </div>
        )}
      </main>
    </div>
  );
}