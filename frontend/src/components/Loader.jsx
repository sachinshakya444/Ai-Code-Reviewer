export default function Loader() {
  return (
    <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-10 flex flex-col items-center gap-4">
      
      {/* Spinning Circle */}
      <div className="w-12 h-12 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin" />

      {/* Text */}
      <div className="text-center">
        <p className="text-white font-medium">Analyzing your PR...</p>
        <p className="text-gray-400 text-sm mt-1">
          Gemini AI is reviewing the code diff. This may take 10-20 seconds.
        </p>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-2 w-full max-w-xs mt-2">
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <span className="text-green-400">✓</span>
          <span>PR fetched from GitHub</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <span className="text-green-400">✓</span>
          <span>Code diff extracted</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-blue-400 animate-pulse">
          <span>⟳</span>
          <span>AI reviewing code...</span>
        </div>
      </div>

    </div>
  );
}