import { useState } from "react";
import { motion } from "framer-motion";

// File extension se icon decide karo
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

// Status color
function getStatusColor(status) {
  const colors = {
    added: "text-green-400",
    modified: "text-blue-400",
    removed: "text-red-400",
    renamed: "text-yellow-400",
  };
  return colors[status] || "text-gray-400";
}

function getStatusBadge(status) {
  const badges = {
    added: { label: "+", bg: "bg-green-500/20 text-green-400" },
    modified: { label: "M", bg: "bg-blue-500/20 text-blue-400" },
    removed: { label: "-", bg: "bg-red-500/20 text-red-400" },
    renamed: { label: "R", bg: "bg-yellow-500/20 text-yellow-400" },
  };
  return badges[status] || { label: "?", bg: "bg-gray-500/20 text-gray-400" };
}

export default function FileTree({ files, pr }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="space-y-3">

      {/* PR Stats Card */}
      <div className="glass-card rounded-xl p-4">
        <p className="text-xs text-white/40 uppercase tracking-wider mb-3">
          PR Metadata
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">Files Changed</span>
            <span className="text-white font-medium">{pr.totalFilesChanged}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">Reviewed</span>
            <span className="text-white font-medium">{pr.totalFilesReviewed}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">Additions</span>
            <span className="text-green-400 font-medium">+{pr.additions}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">Deletions</span>
            <span className="text-red-400 font-medium">-{pr.deletions}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">State</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium
              ${pr.state === "open"
                ? "bg-green-500/20 text-green-400"
                : "bg-purple-500/20 text-purple-400"}`}>
              {pr.state}
            </span>
          </div>
        </div>

        {/* Branch Info */}
        <div className="mt-3 pt-3 border-t border-white/5">
          <div className="flex items-center gap-2 text-xs text-white/50">
            <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
              {pr.sourceBranch}
            </span>
            <span>→</span>
            <span className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">
              {pr.targetBranch}
            </span>
          </div>
        </div>
      </div>

      {/* File Tree Card */}
      <div className="glass-card rounded-xl overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 
                     border-b border-white/5 hover:bg-white/3 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm">📁</span>
            <span className="text-xs font-medium text-white/70 uppercase tracking-wider">
              Changed Files
            </span>
          </div>
          <span className="text-white/30 text-xs">{isOpen ? "▲" : "▼"}</span>
        </button>

        {isOpen && (
          <div className="p-2 max-h-96 overflow-y-auto">
            {files.length === 0 ? (
              <p className="text-white/30 text-xs px-2 py-3 text-center">
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
                    className="flex items-center justify-between px-2 py-1.5 
                               rounded-lg hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm flex-shrink-0">
                        {getFileIcon(file.filename)}
                      </span>
                      <span className="text-xs text-white/70 truncate group-hover:text-white/90 transition-colors">
                        {file.filename.split("/").pop()}
                      </span>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0 ml-2 ${badge.bg}`}>
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