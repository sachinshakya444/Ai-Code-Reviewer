import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ScoreDisplay({ score, summary, pr }) {
  const [displayScore, setDisplayScore] = useState(0);

  // Score counter animation — 0 se actual score tak
  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = score / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [score]);

  function getScoreColor(score) {
    if (score >= 8) return "from-green-400 to-emerald-500";
    if (score >= 5) return "from-yellow-400 to-orange-500";
    return "from-red-400 to-rose-500";
  }

  function getScoreLabel(score) {
    if (score >= 8) return { text: "Excellent PR! 🎉", color: "text-green-400" };
    if (score >= 6) return { text: "Good PR 👍", color: "text-yellow-400" };
    if (score >= 4) return { text: "Needs Improvement ⚠️", color: "text-orange-400" };
    return { text: "Major Issues Found ❌", color: "text-red-400" };
  }

  const label = getScoreLabel(score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-xl p-6"
    >
      <div className="flex items-start gap-6">

        {/* Left — PR Info */}
        <div className="flex-1 min-w-0">
          {/* PR Title */}
          <h2 className="text-lg font-bold leading-tight mb-2 truncate"
          style={{ color: "var(--text-primary)" }}>
            {pr.title}
          </h2>

          {/* Author + Branch */}
          <div className="flex items-center gap-3 flex-wrap mb-4">
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
              by{" "}
              
                <span className="text-blue-400">@{pr.author}</span>
            </span>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="px-2 py-0.5 rounded text-xs"
      style={{ 
        background: "rgba(21, 128, 61, 0.1)", 
        color: "var(--accent-primary)" 
      }}>
                {pr.sourceBranch}
              </span>
              <span style={{ color: "var(--text-muted)" }}>→</span>
              <span className="px-2 py-0.5 rounded text-xs"
      style={{ 
        background: "rgba(77, 124, 15, 0.1)", 
        color: "var(--accent-secondary)" 
      }}>
                {pr.targetBranch}
              </span>
            </div>
          </div>

          {/* Summary */}
          <p className="text-sm leading-relaxed"
          style={{ color: "var(--text-secondary)" }}>
            {summary}
          </p>
        </div>

        {/* Divider */}
        <div className="w-px h-24 bg-white/5 flex-shrink-0" />

        // Replace karo
        <div className="w-px h-24 flex-shrink-0"
            style={{ background: "var(--border-color)" }} />


        {/* Right — Score */}
        <div className="flex-shrink-0 text-center w-32">
          <div className={`text-6xl font-black bg-gradient-to-br ${getScoreColor(score)} 
                          bg-clip-text text-transparent`}>
            {displayScore}
          </div>
          <div className="text-xs mt-1"
     style={{ color: "var(--text-muted)" }}>out of 10</div>
          <div className={`text-xs font-medium mt-2 ${label.color}`}>
            {label.text}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-5">
        <div className="w-full rounded-full h-1.5"
     style={{ background: "var(--border-color)" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score * 10}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-1 rounded-full"
style={{ background: "var(--accent-gradient)" }}
          />
        </div>
      </div>
    </motion.div>
  );
}