import { useState } from "react";

// Har category ka color alag hoga
const colorMap = {
  red: {
    border: "border-red-800",
    bg: "bg-red-900/10",
    badge: "bg-red-900/50 text-red-400",
    dot: "bg-red-400",
  },
  yellow: {
    border: "border-yellow-800",
    bg: "bg-yellow-900/10",
    badge: "bg-yellow-900/50 text-yellow-400",
    dot: "bg-yellow-400",
  },
  orange: {
    border: "border-orange-800",
    bg: "bg-orange-900/10",
    badge: "bg-orange-900/50 text-orange-400",
    dot: "bg-orange-400",
  },
  blue: {
    border: "border-blue-800",
    bg: "bg-blue-900/10",
    badge: "bg-blue-900/50 text-blue-400",
    dot: "bg-blue-400",
  },
  green: {
    border: "border-green-800",
    bg: "bg-green-900/10",
    badge: "bg-green-900/50 text-green-400",
    dot: "bg-green-400",
  },
};

// Severity badge — High / Medium / Low
function SeverityBadge({ severity }) {
  if (!severity) return null;
  const colors = {
    high: "bg-red-900/60 text-red-300",
    medium: "bg-yellow-900/60 text-yellow-300",
    low: "bg-gray-700 text-gray-300",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[severity] || colors.low}`}>
      {severity.toUpperCase()}
    </span>
  );
}

// Single item card
function ReviewItem({ item, type, colors }) {
  // Positive aspects sirf string hote hain
  if (type === "positive") {
    return (
      <li className="flex items-start gap-3 py-3 border-b border-gray-800 last:border-0">
        <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${colors.dot}`} />
        <p className="text-gray-300 text-sm">{item}</p>
      </li>
    );
  }

  return (
    <li className="py-4 border-b border-gray-800 last:border-0">
      {/* File + Severity */}
      <div className="flex items-center gap-2 flex-wrap mb-2">
        {item.file && (
          <code className="text-xs bg-gray-800 text-blue-300 px-2 py-0.5 rounded">
            {item.file}
          </code>
        )}
        {item.line && (
          <code className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">
            Line {item.line}
          </code>
        )}
        {item.severity && <SeverityBadge severity={item.severity} />}
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-2">{item.description}</p>

      {/* Suggestion */}
      {item.suggestion && (
        <div className="bg-gray-800/60 rounded-lg px-3 py-2 mt-2">
          <p className="text-xs text-gray-500 mb-1">💡 Suggestion</p>
          <p className="text-gray-300 text-sm">{item.suggestion}</p>
        </div>
      )}
    </li>
  );
}

export default function ReviewCard({ title, color, items, type }) {
  const [isOpen, setIsOpen] = useState(true);
  const colors = colorMap[color];

  // Agar koi items nahi hain
  if (!items || items.length === 0) {
    return (
      <div className={`border ${colors.border} rounded-xl p-5 ${colors.bg}`}>
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-white">{title}</h3>
          <span className="text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full">
            None found
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`border ${colors.border} rounded-xl ${colors.bg}`}>
      
      {/* Header — click karo toh collapse/expand */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-white">{title}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors.badge}`}>
            {items.length} found
          </span>
        </div>
        <span className="text-gray-400 text-lg">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {/* Items List */}
      {isOpen && (
        <ul className="px-5 pb-4">
          {items.map((item, index) => (
            <ReviewItem
              key={index}
              item={item}
              type={type}
              colors={colors}
            />
          ))}
        </ul>
      )}

    </div>
  );
}