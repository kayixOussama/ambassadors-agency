import { useState } from "react";
import type { FormEvent } from "react";

const tokenStorageKey = "admin_token";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Login failed.");
      }

      localStorage.setItem(tokenStorageKey, data.token);
      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg-dark text-white flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-bg-card p-6"
      >
        <h1 className="text-xl font-semibold mb-4">Admin Login</h1>
        <label className="block text-sm text-text-muted mb-2">Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-lg bg-bg-dark border border-white/10 px-3 py-2 mb-4 outline-none focus:border-primary"
          required
        />

        <label className="block text-sm text-text-muted mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg bg-bg-dark border border-white/10 px-3 py-2 mb-4 outline-none focus:border-primary"
          required
        />

        {error ? <p className="text-red-400 text-sm mb-3">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary hover:bg-primary-light transition-colors px-4 py-2 font-medium disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
