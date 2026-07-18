export default function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-3 py-2 rounded-lg 
                 glass-card hover:border-opacity-50 transition-all duration-200"
    >
      <span className="text-sm">{isDark ? "🌙" : "🌿"}</span>
      <div className="relative w-10 h-5 rounded-full transition-all"
           style={{ background: "var(--border-color)" }}>
        <div
          className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300"
          style={{
            background: "var(--accent-gradient)",
            left: isDark ? "1.25rem" : "0.125rem",
          }}
        />
      </div>
      <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
        {isDark ? "Dark" : "Light"}
      </span>
    </button>
  );
}