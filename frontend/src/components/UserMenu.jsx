import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://ai-code-reviewer-backend-39f9.onrender.com";

export default function UserMenu({ onUserChange }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const res = await axios.get(`${API_URL}/api/auth/me`, {
        withCredentials: true,
      });
      setUser(res.data.user);
      onUserChange?.(res.data.user);
    } catch (err) {
      setUser(null);
      onUserChange?.(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await axios.post(`${API_URL}/api/auth/logout`, {}, {
        withCredentials: true,
      });
      setUser(null);
      onUserChange?.(null);
    } catch (err) {
      console.error("Logout failed");
    }
  }

  function handleLogin() {
    window.location.href = `${API_URL}/api/auth/github`;
  }

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full animate-pulse"
           style={{ background: "var(--border-color)" }} />
    );
  }

  if (!user) {
    return (
      <button
        onClick={handleLogin}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm
                   font-medium text-white transition-all duration-200 shimmer"
        style={{ background: "var(--accent-gradient)" }}
      >
        <span>🐙</span>
        Login with GitHub
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <img
        src={user.avatar}
        alt={user.username}
        className="w-8 h-8 rounded-full border-2"
        style={{ borderColor: "var(--accent-primary)" }}
      />
      <span className="text-sm font-medium hidden sm:block"
            style={{ color: "var(--text-primary)" }}>
        @{user.username}
      </span>
      <button
        onClick={handleLogout}
        className="text-xs px-3 py-1.5 rounded-lg transition-all duration-200"
        style={{
          color: "var(--text-muted)",
          border: "1px solid var(--border-color)",
        }}
      >
        Logout
      </button>
    </div>
  );
}