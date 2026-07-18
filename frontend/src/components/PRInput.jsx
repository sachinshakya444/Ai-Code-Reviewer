import { useState } from "react";

export default function PRInput({ onSubmit, loading }) {
  const [url, setUrl] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!url.trim()) return;
    onSubmit(url.trim());
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-2">
        Enter GitHub PR URL
      </h2>
      <p className="text-gray-400 text-sm mb-5">
        Paste any public GitHub Pull Request URL to get an AI-powered code review
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://github.com/owner/repo/pull/123"
          disabled={loading}
          className="flex-1 bg-gray-800 border border-gray-700 text-white 
                     placeholder-gray-500 rounded-lg px-4 py-3 text-sm
                     focus:outline-none focus:border-blue-500 focus:ring-1 
                     focus:ring-blue-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 
                     disabled:cursor-not-allowed text-white font-medium 
                     px-6 py-3 rounded-lg text-sm transition-colors"
        >
          {loading ? "Reviewing..." : "Review PR"}
        </button>
      </form>

      {/* Example URLs */}
      <div className="mt-4">
        <p className="text-gray-500 text-xs mb-2">Try an example:</p>
        <button
          onClick={() => setUrl("https://github.com/expressjs/express/pull/3819")}
          disabled={loading}
          className="text-blue-400 hover:text-blue-300 text-xs underline 
                     underline-offset-2 disabled:opacity-50"
        >
          expressjs/express/pull/3819
        </button>
      </div>
    </div>
  );
}