import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function getFileIcon(filename) {
  const ext = filename.split(".").pop().toLowerCase();
  const icons = {
    js: "🟨", jsx: "⚛️", ts: "🔷", tsx: "⚛️",
    py: "🐍", rb: "💎", go: "🐹", rs: "🦀",
    css: "🎨", scss: "🎨", html: "🌐",
    json: "📋", md: "📝", yml: "⚙️", yaml: "⚙️",
    env: "🔒", gitignore: "🙈", lock: "🔒",
  };
  return icons[ext] || "📄";
}

function getStatusBadge(status) {
  const badges = {
    added: { label: "+", bg: { backgroundColor: "rgba(21,128,61,0.15)", color: "#15803d" } },
    modified: { label: "M", bg: { backgroundColor: "rgba(37,99,235,0.15)", color: "#1d4ed8" } },
    removed: { label: "-", bg: { backgroundColor: "rgba(220,38,38,0.15)", color: "#b91c1c" } },
    renamed: { label: "R", bg: { backgroundColor: "rgba(202,138,4,0.15)", color: "#92400e" } },
  };
  return badges[status] || { label: "?", bg: { backgroundColor: "rgba(107,114,128,0.15)", color: "#374151" } };
}

export default function FileTree({ files, pr }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isDark, setIsDark] = useState(
  document.documentElement.classList.contains("dark")
);

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
  return (
    <div className="space-y-3">

      {/* PR Stats Card */}
      <div className="glass-card rounded-xl p-4"
     style={{ backgroundColor: isDark ? "rgba(30, 58, 138, 0.3)" : "rgba(219, 234, 254, 0.9)" }}> 
        <p className="text-xs uppercase tracking-wider mb-3"
           style={{ color: "var(--text-muted)" }}>
          PR Metadata
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: "var(--text-secondary)" }}>Files Changed</span>
            <span style={{ color: "var(--text-primary)" }} className="font-medium">
              {pr.totalFilesChanged}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: "var(--text-secondary)" }}>Reviewed</span>
            <span style={{ color: "var(--text-primary)" }} className="font-medium">
              {pr.totalFilesReviewed}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: "var(--text-secondary)" }}>Additions</span>
            <span className="text-green-600 font-medium">+{pr.additions}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: "var(--text-secondary)" }}>Deletions</span>
            <span className="text-red-500 font-medium">-{pr.deletions}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: "var(--text-secondary)" }}>State</span>
            <span style={{
              fontSize: "12px",
              padding: "2px 8px",
              borderRadius: "9999px",
              fontWeight: "500",
              backgroundColor: pr.state === "open" ? "rgba(21,128,61,0.15)" : "rgba(124,58,237,0.15)",
              color: pr.state === "open" ? "#15803d" : "#7c3aed",
            }}>
              {pr.state}
            </span>
          </div>
        </div>

        {/* Branch Info */}
        <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--border-color)" }}>
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span style={{
              backgroundColor: "rgba(21,128,61,0.15)",
              color: "var(--accent-primary)",
              padding: "2px 8px",
              borderRadius: "4px",
            }}>
              {pr.sourceBranch}
            </span>
            <span style={{ color: "var(--text-muted)" }}>→</span>
            <span style={{
              backgroundColor: "rgba(77,124,15,0.15)",
              color: "var(--accent-secondary)",
              padding: "2px 8px",
              borderRadius: "4px",
            }}>
              {pr.targetBranch}
            </span>
          </div>
        </div>
      </div>

      {/* File Tree Card */}
      <div className="glass-card rounded-xl overflow-hidden"
     style={{ backgroundColor: isDark ? "rgba(6, 78, 59, 0.3)" : "rgba(236, 253, 245, 0.9)" }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 transition-colors"
          style={{ borderBottom: `1px solid var(--border-color)` }}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm">📁</span>
            <span className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: "var(--text-secondary)" }}>
              Changed Files
            </span>
          </div>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {isOpen ? "▲" : "▼"}
          </span>
        </button>

        {isOpen && (
          <div className="p-2 max-h-96 overflow-y-auto">
            {files.length === 0 ? (
              <p className="text-xs px-2 py-3 text-center"
                 style={{ color: "var(--text-muted)" }}>
                No files available
              </p>
            ) : (
              files.map((file, index) => {
                const badge = getStatusBadge(file.status);
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between px-2 py-1.5 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm flex-shrink-0">
                        {getFileIcon(file.filename)}
                      </span>
                      <span className="text-xs truncate"
                            style={{ color: "var(--text-secondary)" }}>
                        {file.filename.split("/").pop()}
                      </span>
                    </div>
                    <span style={{
                      ...badge.bg,
                      fontSize: "10px",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontWeight: "500",
                      flexShrink: 0,
                      marginLeft: "8px",
                    }}>
                      {badge.label}
                    </span>
                  </motion.div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}