import { useState , useEffect} from "react";
import PRInput from "./components/PRInput";
import ReviewCard from "./components/ReviewCard";
import ScoreDisplay from "./components/ScoreDisplay";
import FileTree from "./components/FileTree";
import Loader from "./components/Loader";
import ThemeToggle from "./components/ThemeToggle";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = "http://localhost:5000";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [reviewData, setReviewData] = useState(null);
  const [error, setError] = useState(null);
  const [isDark, setIsDark] = useState(false);

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
      const response = await axios.post(`${API_URL}/api/review`, { prUrl });
      setReviewData(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="relative min-h-screen">

        {/* Gradient Orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        {/* Content */}
        <div className="relative z-10">

          {/* Header */}
          <header className="glass-card border-b border-white/8 px-6 py-4 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm">
                  🔍
                </div>
                <div>
                  <h1 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                  AI Code Reviewer
                </h1>
                <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                  Powered by Gemini AI
                </p>
                </div>
              </div>
              <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
            </div>
          </header>

          {/* Main Layout */}
          <div className="max-w-5xl mx-auto px-8 py-8">

            {/* PR Input — always on top */}
            <PRInput onSubmit={handleReview} loading={loading} />

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 glass-card border-red-500/30 bg-red-500/5 text-red-400 px-5 py-4 rounded-xl"
                >
                  ❌ {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loader */}
            {loading && <Loader />}

            {/* Results — Two Column Layout */}
            <AnimatePresence>
              {reviewData && !loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 flex gap-6 items-start"
                >
                  {/* Left Sidebar — File Tree */}
                  <div className="w-72 flex-shrink-0 sticky top-24">
                    <FileTree
                      files={reviewData.files || []}
                      pr={reviewData.pr}
                    />
                  </div>

                  {/* Right Main Area */}
                  <div className="flex-1 space-y-4">

                    {/* PR Info + Score */}
                    <ScoreDisplay
                      score={reviewData.review.overall_score}
                      summary={reviewData.review.summary}
                      pr={reviewData.pr}
                    />

                    {/* Review Cards */}
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
          </div>
        </div>
      </div>
    </div>
  );
}