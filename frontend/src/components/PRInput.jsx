import { useState } from "react";
import { motion } from "framer-motion";

export default function PRInput({ onSubmit, loading }) {
  const [url, setUrl] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!url.trim()) return;
    onSubmit(url.trim());
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-2xl p-8 text-center"
    >
      {/* Top Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
           style={{
             background: "rgba(21, 128, 61, 0.1)",
             border: "1px solid rgba(21, 128, 61, 0.2)",
           }}>
        <span className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "var(--accent-primary)" }} />
        <span className="text-xs font-medium"
              style={{ color: "var(--accent-primary)" }}>
          AI-Powered Code Review
        </span>
      </div>

      {/* Heading */}
      <h2 className="text-2xl font-bold mb-2"
          style={{ color: "var(--text-primary)" }}>
        Review any GitHub PR
      </h2>
      <p className="text-sm mb-8"
         style={{ color: "var(--text-secondary)" }}>
        Paste a pull request URL and get instant AI feedback on bugs,
        security, edge cases and optimizations
      </p>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="flex gap-3 p-1.5 rounded-xl border transition-all duration-300"
             style={{
               borderColor: isFocused ? "var(--accent-primary)" : "var(--border-color)",
               background: isFocused ? "rgba(21, 128, 61, 0.03)" : "var(--bg-input)",
               boxShadow: isFocused ? "0 0 0 3px rgba(21, 128, 61, 0.1)" : "none",
             }}>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="https://github.com/owner/repo/pull/123"
            disabled={loading}
            className="flex-1 bg-transparent text-sm focus:outline-none disabled:opacity-50"
            style={{
              color: "var(--text-primary)",
              paddingLeft: "0.75rem",
              paddingRight: "0.75rem",
              paddingTop: "0.625rem",
              paddingBottom: "0.625rem",
            }}
          />
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="shimmer disabled:opacity-40 disabled:cursor-not-allowed
                       text-white font-medium px-6 py-2.5 rounded-lg text-sm
                       transition-all duration-200 whitespace-nowrap"
            style={{ background: "var(--accent-gradient)" }}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30
                                 border-t-white rounded-full animate-spin" />
                Reviewing...
              </span>
            ) : (
              "Review PR →"
            )}
          </button>
        </div>

        {/* Example Links */}
        <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>Try:</span>
          {[
            { label: "react/react #36995", url: "https://github.com/react/react/pull/36995" },
            { label: "expressjs/express #3819", url: "https://github.com/expressjs/express/pull/3819" },
          ].map((example) => (
            <button
              key={example.url}
              type="button"
              onClick={() => setUrl(example.url)}
              disabled={loading}
              className="text-xs underline underline-offset-2 transition-colors disabled:opacity-30"
              style={{ color: "var(--accent-primary)" }}
            >
              {example.label}
            </button>
          ))}
        </div>
      </form>
    </motion.div>
  );
}