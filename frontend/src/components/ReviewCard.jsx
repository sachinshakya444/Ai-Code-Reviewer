import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const colorConfig = {
  red: {
    border: "border-red-500/30",
    bg: "bg-red-500/5",
    badge: "bg-red-500/20 text-red-400",
    dot: "bg-red-400",
    glow: "hover:shadow-red-500/10",
    title: "text-red-400",
  },
  yellow: {
    border: "border-yellow-500/30",
    bg: "bg-yellow-500/5",
    badge: "bg-yellow-500/20 text-yellow-400",
    dot: "bg-yellow-400",
    glow: "hover:shadow-yellow-500/10",
    title: "text-yellow-400",
  },
  orange: {
    border: "border-orange-500/30",
    bg: "bg-orange-500/5",
    badge: "bg-orange-500/20 text-orange-400",
    dot: "bg-orange-400",
    glow: "hover:shadow-orange-500/10",
    title: "text-orange-400",
  },
  purple: {
    border: "border-purple-500/30",
    bg: "bg-purple-500/5",
    badge: "bg-purple-500/20 text-purple-400",
    dot: "bg-purple-400",
    glow: "hover:shadow-purple-500/10",
    title: "text-purple-400",
  },
  green: {
    border: "border-green-500/30",
    bg: "bg-green-500/5",
    badge: "bg-green-500/20 text-green-400",
    dot: "bg-green-400",
    glow: "hover:shadow-green-500/10",
    title: "text-green-400",
  },
};

function SeverityBadge({ severity }) {
  if (!severity) return null;
  const colors = {
    high: "bg-red-500/20 text-red-300 border border-red-500/30",
    medium: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
    low: "bg-gray-500/20 text-gray-300 border border-gray-500/30",
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${colors[severity] || colors.low}`}>
      {severity.toUpperCase()}
    </span>
  );
}

function ReviewItem({ item, type, config }) {
  const [showSuggestion, setShowSuggestion] = useState(false);

  if (type === "positive") {
    return (
      <motion.li
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-start gap-3 py-3 border-b last:border-0"
        style={{ borderColor: "var(--border-color)" }}
      >
        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot}`} />
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {item}
        </p>
      </motion.li>
    );
  }

  return (
    <motion.li
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="py-4 border-b last:border-0"
      style={{ borderColor: "var(--border-color)" }}
    >
      {/* File + Line + Severity */}
      <div className="flex items-center gap-2 flex-wrap mb-2">
        {item.file && (
          <code className="text-[11px] bg-blue-500/10 text-blue-400
                           border border-blue-500/20 px-2 py-0.5 rounded-md">
            {item.file.split("/").pop()}
          </code>
        )}
        {item.line && (
          <code className="text-[11px] px-2 py-0.5 rounded-md"
                style={{ background: "var(--border-color)", color: "var(--text-muted)" }}>
            Line {item.line}
          </code>
        )}
        {item.severity && <SeverityBadge severity={item.severity} />}
      </div>

      {/* Description */}
      <p className="text-sm leading-relaxed mb-2"
         style={{ color: "var(--text-secondary)" }}>
        {item.description}
      </p>

      {/* Suggestion Toggle */}
      {item.suggestion && (
        <div>
          <button
            onClick={() => setShowSuggestion(!showSuggestion)}
            className="flex items-center gap-1.5 text-xs transition-colors mt-1"
            style={{ color: "var(--text-muted)" }}
          >
            <span>💡</span>
            <span>{showSuggestion ? "Hide" : "Show"} Suggestion</span>
            <span>{showSuggestion ? "▲" : "▼"}</span>
          </button>

          <AnimatePresence>
            {showSuggestion && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 rounded-lg px-3 py-2.5"
                     style={{
                       background: "var(--bg-suggestion)",
                       border: "1px solid var(--border-color)"
                     }}>
                  <p className="text-sm leading-relaxed"
                     style={{ color: "var(--text-secondary)" }}>
                    {item.suggestion}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.li>
  );
}

export default function ReviewCard({ title, color, items, type, delay = 0 }) {
  const [isOpen, setIsOpen] = useState(true);
  const config = colorConfig[color];

  if (!items || items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className={`glass-card border ${config.border} rounded-xl p-4 
                    flex items-center gap-3`}
      >
        <h3 className={`font-semibold text-sm ${config.title}`}>{title}</h3>
        <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "var(--border-color)", color: "var(--text-muted)" }}>
          None found ✓
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`glass-card border ${config.border} ${config.bg} rounded-xl 
                  shadow-lg ${config.glow} hover:shadow-xl transition-shadow duration-300`}
    >
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <div className="flex items-center gap-3">
          <h3 className={`font-semibold ${config.title}`}>{title}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.badge}`}>
            {items.length} found
          </span>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          ▼
        </motion.span>
      </button>

      {/* Items */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-5 pb-4 overflow-hidden"
          >
            {items.map((item, index) => (
              <ReviewItem
                key={index}
                item={item}
                type={type}
                config={config}
              />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  );
}