import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://ai-code-reviewer-backend-39f9.onrender.com";

function ScoreBadge({ score }) {
  function getColor() {
    if (score >= 8) return { bg: "bg-green-500/20", text: "text-green-400" };
    if (score >= 5) return { bg: "bg-yellow-500/20", text: "text-yellow-400" };
    return { bg: "bg-red-500/20", text: "text-red-400" };
  }
  const color = getColor();
  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${color.bg} ${color.text}`}>
      {score}/10
    </span>
  );
}

function TimeAgo({ date }) {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) return <span>{days}d ago</span>;
  if (hours > 0) return <span>{hours}h ago</span>;
  return <span>{minutes}m ago</span>;
}

export default function HistoryPage({ onSelectReview, onBack }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      const res = await axios.get(`${API_URL}/api/review/history`, {
        withCredentials: true,
      });

      if (!res.data.success) {
      setError("Please login to see history");
      return;
    }

      setReviews(res.data.data);
    } catch (err) {
        if(err.response?.status === 401) {
            setError("Please login with GitHub to see your review history");
        } else {
            setError("Failed to load review history");
        }
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-6 py-8"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="text-sm px-3 py-1.5 rounded-lg transition-all"
          style={{
            color: "var(--text-secondary)",
            border: "1px solid var(--border-color)",
          }}
        >
          ← Back
        </button>
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            Review History
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Your past PR reviews
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3"
               style={{ borderColor: "var(--accent-primary)", borderTopColor: "transparent" }} />
          <p style={{ color: "var(--text-muted)" }}>Loading history...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="glass-card rounded-xl p-5 text-center"
             style={{ borderColor: "rgba(220, 38, 38, 0.3)" }}>
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && reviews.length === 0 && (
        <div className="glass-card rounded-xl p-12 text-center">
          <div className="text-4xl mb-4">📭</div>
          <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
            No reviews yet
          </h3>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Review a PR to see it here
          </p>
          <button
            onClick={onBack}
            className="mt-4 text-sm px-4 py-2 rounded-lg text-white shimmer"
            style={{ background: "var(--accent-gradient)" }}
          >
            Review a PR →
          </button>
        </div>
      )}

      {/* Reviews List */}
      {!loading && reviews.length > 0 && (
        <div className="space-y-3">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelectReview(review.id)}
              className="glass-card rounded-xl p-5 cursor-pointer 
                         hover:border-opacity-50 transition-all duration-200"
              style={{ borderColor: "var(--border-color)" }}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-1 truncate"
                      style={{ color: "var(--text-primary)" }}>
                    {review.prTitle}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <code className="text-[11px] px-2 py-0.5 rounded"
                          style={{
                            background: "rgba(21, 128, 61, 0.1)",
                            color: "var(--accent-primary)"
                          }}>
                      {review.owner}/{review.repo}
                    </code>
                    <span className="text-[11px]"
                          style={{ color: "var(--text-muted)" }}>
                      #{review.pullNumber}
                    </span>
                    <span className="text-[11px]"
                          style={{ color: "var(--text-muted)" }}>
                      · {review.filesReviewed} files
                    </span>
                  </div>
                </div>

                {/* Right */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <ScoreBadge score={review.overallScore} />
                  <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    <TimeAgo date={review.createdAt} />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}