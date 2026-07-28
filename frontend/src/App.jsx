import { useState, useEffect } from "react";
import PRInput from "./components/PRInput";
import ReviewCard from "./components/ReviewCard";
import ScoreDisplay from "./components/ScoreDisplay";
import FileTree from "./components/FileTree";
import Loader from "./components/Loader";
import ThemeToggle from "./components/ThemeToggle";
import UserMenu from "./components/UserMenu";
import HistoryPage from "./pages/HistoryPage";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = "https://ai-code-reviewer-backend-39f9.onrender.com";


export default function App() {
  const [loading, setLoading] = useState(false);
  const [reviewData, setReviewData] = useState(null);
  const [error, setError] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [page, setPage] = useState("home"); // "home" | "history"
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);


  async function handleReview(prUrl) {
    setLoading(true);
    setError(null);
    setReviewData(null);

    try {
      const response = await axios.post(
        `${API_URL}/api/review`,
        { prUrl },
        { withCredentials: true }
      );
      setReviewData(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectReview(reviewId) {
    try {
      const res = await axios.get(`${API_URL}/api/review/${reviewId}`, {
        withCredentials: true,
      });
      const data = res.data.data;

      // History se review load karo same format mein
      setReviewData({
        pr: {
          title: data.prTitle,
          author: data.prAuthor,
          url: data.prUrl,
          repo: data.repo,
          owner: data.owner,
          pullNumber: data.pullNumber,
          totalFilesReviewed: data.filesReviewed,
          additions: data.additions,
          deletions: data.deletions,
          sourceBranch: "N/A",
          targetBranch: "N/A",
          state: "closed",
          totalFilesChanged: data.filesReviewed,
          skippedFiles: 0,
        },
        files: [],
        review: {
          overall_score: data.overallScore,
          summary: data.summary,
          bugs: data.bugs,
          edge_cases: data.edgeCases,
          security: data.security,
          optimizations: data.optimizations,
          positive_aspects: data.positiveAspects,
        },
      });
      setPage("home");
    } catch (err) {
      console.error("Failed to load review:", err);
    }
  }

  return (
    <div className="relative min-h-screen">
      {/* Gradient Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Content */}
      <div className="relative z-10">

        {/* Header */}
        <header className="glass-card border-b sticky top-0 z-50 px-6 py-4"
                style={{ borderColor: "var(--header-border)", background: "var(--header-bg)" }}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                   style={{ background: "var(--accent-gradient)" }}>
                🔍
              </div>
              <div>
                <h1 className="text-base font-bold"
                    style={{ color: "var(--text-primary)" }}>
                  AI Code Reviewer
                </h1>
                <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                  Powered by Gemini AI
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* History Button — sirf logged in users ke liye */}
              {user && (
                <button
                  onClick={() => setPage(page === "history" ? "home" : "history")}
                  className="text-sm px-3 py-1.5 rounded-lg transition-all"
                  style={{
                    color: page === "history" ? "var(--accent-primary)" : "var(--text-secondary)",
                    border: "1px solid var(--border-color)",
                    background: page === "history" ? "rgba(21,128,61,0.1)" : "transparent"
                  }}
                >
                  📋 History
                </button>
              )}
              <UserMenu onUserChange={setUser} />
              <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
            </div>
          </div>
        </header>

        {/* Pages */}
        <AnimatePresence mode="wait">
          {page === "history" ? (
            <HistoryPage
              key="history"
              onSelectReview={handleSelectReview}
              onBack={() => setPage("home")}
            />
          ) : (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-6 py-8"
            >
              {/* PR Input */}
              <PRInput onSubmit={handleReview} loading={loading} />

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 glass-card px-5 py-4 rounded-xl"
                    style={{ borderColor: "rgba(220,38,38,0.3)", background: "rgba(220,38,38,0.05)" }}
                  >
                    <p className="text-red-400">❌ {error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Loader */}
              {loading && <Loader />}

              {/* Results */}
              <AnimatePresence>
                {reviewData && !loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 flex gap-6 items-start"
                  >
                    {/* Left Sidebar */}
                    <div className="w-72 flex-shrink-0 sticky top-24">
                      <FileTree
                        files={reviewData.files || []}
                        pr={reviewData.pr}
                      />
                    </div>

                    {/* Right Main */}
                    <div className="flex-1 space-y-4">
                      <ScoreDisplay
                        score={reviewData.review.overall_score}
                        summary={reviewData.review.summary}
                        pr={reviewData.pr}
                      />
                      <ReviewCard title="🐛 Bugs" color="red"
                        items={reviewData.review.bugs} type="bugs" delay={0.1} />
                      <ReviewCard title="⚠️ Edge Cases" color="yellow"
                        items={reviewData.review.edge_cases} type="edge_cases" delay={0.2} />
                      <ReviewCard title="🔒 Security Issues" color="orange"
                        items={reviewData.review.security} type="security" delay={0.3} />
                      <ReviewCard title="⚡ Optimizations" color="purple"
                        items={reviewData.review.optimizations} type="optimizations" delay={0.4} />
                      <ReviewCard title="✅ Positive Aspects" color="green"
                        items={reviewData.review.positive_aspects} type="positive" delay={0.5} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}