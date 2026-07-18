export default function ScoreDisplay({ score, summary }) {

  // Score ke hisaab se color decide karo
  function getScoreColor(score) {
    if (score >= 8) return "text-green-400";
    if (score >= 5) return "text-yellow-400";
    return "text-red-400";
  }

  function getScoreBg(score) {
    if (score >= 8) return "border-green-700 bg-green-900/20";
    if (score >= 5) return "border-yellow-700 bg-yellow-900/20";
    return "border-red-700 bg-red-900/20";
  }

  function getScoreLabel(score) {
    if (score >= 8) return "Excellent PR! 🎉";
    if (score >= 6) return "Good PR 👍";
    if (score >= 4) return "Needs Improvement ⚠️";
    return "Major Issues Found ❌";
  }

  return (
    <div className={`border rounded-xl p-6 ${getScoreBg(score)}`}>
      <div className="flex items-center gap-6">
        
        {/* Score Circle */}
        <div className="flex-shrink-0 text-center">
          <div className={`text-5xl font-bold ${getScoreColor(score)}`}>
            {score}
          </div>
          <div className="text-gray-400 text-xs mt-1">out of 10</div>
        </div>

        {/* Divider */}
        <div className="w-px h-16 bg-gray-700" />

        {/* Summary */}
        <div className="flex-1">
          <p className={`font-semibold text-sm mb-2 ${getScoreColor(score)}`}>
            {getScoreLabel(score)}
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            {summary}
          </p>
        </div>

      </div>

      {/* Score Bar */}
      <div className="mt-5">
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-700 ${
              score >= 8
                ? "bg-green-500"
                : score >= 5
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{ width: `${score * 10}%` }}
          />
        </div>
      </div>
    </div>
  );
}