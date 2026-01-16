"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "../../components/ProtectedRoute";
function DashboardContent() {
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleLogout() {
    localStorage.removeItem("access_token");
    router.replace("/login");
  }

  async function handleAnalyze() {
    setError("");
    setResult(null);

    if (!url.trim()) {
      setError("Please enter a valid website URL");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");

      const res = await fetch(
        `http://127.0.0.1:8000/analyze/?url=${encodeURIComponent(url)}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 401) {
        localStorage.removeItem("access_token");
        router.replace("/access-denied");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to analyze website");
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        maxWidth: "960px",
        margin: "0 auto",
        padding: "32px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <h1 style={{ margin: 0 }}>🔍 Website Analyzer</h1>

        <nav style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <Link href="/">🏠 Home</Link>
          <Link href="/history">📜 History</Link>

          <button
            onClick={handleLogout}
            style={{
              padding: "8px 14px",
              borderRadius: "8px",
              border: "1px solid #ef4444",
              background: "#fff",
              color: "#ef4444",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            🚪 Logout
          </button>
        </nav>
      </header>

      {/* Analyze Card */}
      <section
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "14px",
          padding: "24px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Analyze a Website</h2>

        <input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "16px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            marginBottom: "16px",
          }}
        />

        <button
          onClick={handleAnalyze}
          disabled={loading}
          style={{
            padding: "12px 22px",
            fontSize: "16px",
            borderRadius: "10px",
            cursor: loading ? "not-allowed" : "pointer",
            background: loading ? "#9ca3af" : "#2563eb",
            color: "#fff",
            border: "none",
            fontWeight: 600,
          }}
        >
          {loading ? "Analyzing website..." : "Analyze Website"}
        </button>

        {error && (
          <p style={{ color: "#dc2626", marginTop: "12px" }}>{error}</p>
        )}
      </section>

      {/* Result Card */}
      {result && (
        <section
          style={{
            marginTop: "32px",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "14px",
            padding: "24px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          }}
        >
          <h2>📊 Analysis Result</h2>

          <p>
            <strong>Company:</strong>{" "}
            {result.company_name || "Unknown"}
          </p>

          <p>
            <strong>Website:</strong>{" "}
            <a href={result.website} target="_blank" rel="noreferrer">
              {result.website}
            </a>
          </p>

          <p>
            <strong>Summary:</strong><br />
            {result.summary}
          </p>

          {result.emails?.length > 0 && (
            <p>
              <strong>Emails:</strong><br />
              {result.emails.join(", ")}
            </p>
          )}

          {result.phone_numbers?.length > 0 && (
            <p>
              <strong>Phone Numbers:</strong><br />
              {result.phone_numbers.join(", ")}
            </p>
          )}

          {result.socials?.length > 0 && (
            <div>
              <strong>Social Links:</strong>
              <ul>
                {result.socials.map((s: any, idx: number) => (
                  <li key={idx}>
                    {s.platform}:{" "}
                    <a href={s.url} target="_blank" rel="noreferrer">
                      {s.url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ marginTop: "16px" }}>
            <Link href="/history">📜 View saved history</Link>
          </div>
        </section>
      )}
    </main>
  );
}

/* 🔐 AUTH GUARD */
export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}