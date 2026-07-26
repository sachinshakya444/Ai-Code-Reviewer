import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const colorConfig = {
  red: {
    border: "#fca5a5",
    title: "#dc2626",
    badgeBg: "#fee2e2",
    badgeText: "#991b1b",
    dot: "#ef4444",
    cardBg: "rgba(254, 242, 242, 0.9)",
    cardBgDark: "rgba(127, 29, 29, 0.3)",
    borderDark: "rgba(220, 38, 38, 0.3)",
    titleDark: "#fca5a5",
  },
  yellow: {
    border: "#fcd34d",
    title: "#d97706",
    badgeBg: "#fef3c7",
    badgeText: "#92400e",
    dot: "#f59e0b",
    cardBg: "rgba(254, 252, 232, 0.9)",
    cardBgDark: "rgba(120, 53, 15, 0.3)",
    borderDark: "rgba(202, 138, 4, 0.3)",
    titleDark: "#fefcf7",
  },
  orange: {
    border: "#fdba74",
    title: "#ea580c",
    badgeBg: "#ffedd5",
    badgeText: "#9a3412",
    dot: "#f97316",
    cardBg: "rgba(255, 247, 237, 0.9)",
    cardBgDark: "rgba(124, 45, 18, 0.3)",
    borderDark: "rgba(234, 88, 12, 0.3)",
    titleDark: "#fdba74",
  },
  purple: {
    border: "#c4b5fd",
    title: "#7c3aed",
    badgeBg: "#ede9fe",
    badgeText: "#5b21b6",
    dot: "#8b5cf6",
    cardBg: "rgba(245, 243, 255, 0.9)",
    cardBgDark: "rgba(76, 29, 149, 0.3)",
    borderDark: "rgba(124, 58, 237, 0.3)",
    titleDark: "#c4b5fd",
  },
  green: {
    border: "#86efac",
    title: "#16a34a",
    badgeBg: "#dcfce7",
    badgeText: "#166534",
    dot: "#22c55e",
    cardBg: "rgba(240, 253, 244, 0.9)",
    cardBgDark: "rgba(20, 83, 45, 0.3)",
    borderDark: "rgba(22, 163, 74, 0.3)",
    titleDark: "#86efac",
  },
};

function SeverityBadge({ severity }) {
  if (!severity) return null;
  const config = {
    high: { bg: "#fee2e2", color: "#991b1b", border: "#fca5a5" },
    medium: { bg: "#fef3c7", color: "#92400e", border: "#fcd34d" },
    low: { bg: "#f3f4f6", color: "#374151", border: "#d1d5db" },
  };
  const s = config[severity.toLowerCase()] || config.low;
  return (
    <span style={{
      fontSize: "10px",
      padding: "2px 8px",
      borderRadius: "9999px",
      fontWeight: "700",
      backgroundColor: s.bg,
      color: s.color,
      border: `1px solid ${s.border}`,
    }}>
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
        <span style={{ backgroundColor: config.dot, width: "6px", height: "6px", borderRadius: "50%", flexShrink: 0, marginTop: "6px" }} />
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{item}</p>
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
      <div className="flex items-center gap-2 flex-wrap mb-2">
        {item.file && (
          <span style={{
            fontSize: "11px",
            padding: "2px 8px",
            borderRadius: "6px",
            fontFamily: "monospace",
            fontWeight: "500",
            backgroundColor: "rgba(21, 128, 61, 0.1)",
            color: "var(--accent-primary)",
            border: "1px solid rgba(21, 128, 61, 0.2)",
          }}>
            {item.file.split("/").pop()}
          </span>
        )}
        {item.line && (
          <span style={{
            fontSize: "11px",
            padding: "2px 8px",
            borderRadius: "6px",
            fontFamily: "monospace",
            backgroundColor: "var(--border-color)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-input)",
          }}>
            Line {item.line}
          </span>
        )}
        {item.severity && <SeverityBadge severity={item.severity} />}
      </div>

      <p className="text-sm leading-relaxed mb-2" style={{ color: "var(--text-secondary)" }}>
        {item.description}
      </p>

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
                     style={{ background: "var(--bg-suggestion)", border: "1px solid var(--border-color)" }}>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
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
  // Dark mode detection
  const [isDark, setIsDark] = useState(
  document.documentElement.classList.contains("dark"));


  useEffect(() => {
  const observer = new MutationObserver(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}, []);


  if (!items || items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        style={{
          background: "var(--bg-card)",
          border: `1px solid ${config.border}`,
          borderRadius: "12px",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          boxShadow: "var(--card-shadow)",
        }}
      >
        <h3 style={{ fontWeight: "600", fontSize: "14px", color: config.title }}>{title}</h3>
        <span style={{
          fontSize: "12px",
          padding: "2px 8px",
          borderRadius: "9999px",
          backgroundColor: "var(--border-color)",
          color: "var(--text-muted)",
        }}>
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
      style={{
  backgroundColor: isDark ? config.cardBgDark : config.cardBg,
  border: `1px solid ${isDark ? config.borderDark : config.border}`,
  borderRadius: "12px",
  boxShadow: "var(--card-shadow)",
}}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px", textAlign: "left", background: "none", cursor: "pointer" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <h3 style={{ fontWeight: "600", color: isDark ? config.titleDark : config.title }}>{title}</h3>
          <span style={{
            fontSize: "12px",
            padding: "2px 8px",
            borderRadius: "9999px",
            fontWeight: "500",
            backgroundColor: config.badgeBg,
            color: config.badgeText,
          }}>
            {items.length} found
          </span>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ color: "var(--text-muted)", fontSize: "14px" }}
        >
          ▼
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ padding: "0 20px 16px", overflow: "hidden", listStyle: "none" }}
          >
            {items.map((item, index) => (
              <ReviewItem key={index} item={item} type={type} config={config} />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  );
}