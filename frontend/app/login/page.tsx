"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!API_URL) {
        throw new Error("API URL not configured");
      }

      // ✅ Trim inputs (important)
      const payload = {
        username: username.trim(),
        password: password.trim(),
      };

      // ✅ Clear old token before login
      localStorage.removeItem("access_token");

      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        throw new Error("Invalid username or password");
      }

      if (!res.ok) {
        throw new Error(`Login failed (${res.status})`);
      }

      const data = await res.json();

      if (!data?.access_token) {
        throw new Error("Access token missing in response");
      }

      // ✅ Store JWT (single source of truth)
      localStorage.setItem("access_token", data.access_token);

      // ✅ Redirect to protected area
      router.replace("/dashboard");
    } catch (err: any) {
      if (err.name === "TypeError") {
        setError("Unable to reach server. Please try again.");
      } else {
        setError(err.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f3f4f6",
        fontFamily: "system-ui, sans-serif",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#fff",
          borderRadius: "12px",
          padding: "32px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
          border: "1px solid #e5e7eb",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "24px", textAlign: "center" }}>
          <h1 style={{ marginBottom: "8px" }}>🔐 Internal Login</h1>
          <p style={{ color: "#555", fontSize: "14px" }}>
            Internal Website Intelligence Tool
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontWeight: 500 }}>Username</label>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontWeight: 500 }}>Password</label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123"
              required
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          {error && (
            <p style={{ color: "#dc2626", marginBottom: "16px", fontSize: "14px" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "16px",
              borderRadius: "8px",
              background: loading ? "#9ca3af" : "#2563eb",
              color: "#fff",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 600,
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}