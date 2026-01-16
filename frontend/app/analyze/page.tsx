"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ResultCard from "../../components/ResultCard";
export default function AnalyzePage() {
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleLogout() {
    localStorage.removeItem("access_token");
    router.push("/login");
  }

  async function handleAnalyze() {
    setError("");
    setResult(null);

    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    if (!url.trim()) {
      setError("Please enter a valid website URL");
      return;
    }

    setLoading(true);

    try {
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
        router.push("/login");
        return;
      }

      if (!res.ok) throw new Error("Failed to analyze website");

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
        fontFamily: "system-ui, sans-serif",
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
        <h1 style={{ margin: 0 }}>🔍 Analyze Website</h1>

        <nav style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <Link href="/">Home</Link>
          <Link href="/history">History</Link>
          <button
            onClick={handleLogout}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            🚪 Logout
          </button>
        </nav>
      </header>

      {/* Analyze Card */}
      <section
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "24px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Enter Website URL</h2>

        <input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: "16px",
          }}
        />

        <button
          onClick={handleAnalyze}
          disabled={loading}
          style={{
            padding: "12px 20px",
            fontSize: "16px",
            borderRadius: "8px",
            background: loading ? "#9ca3af" : "#2563eb",
            color: "#fff",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Analyzing website..." : "Analyze Website"}
        </button>

        {error && (
          <p style={{ color: "red", marginTop: "12px" }}>{error}</p>
        )}
      </section>

      {/* Result Section */}
      {result && (
        <section style={{ marginTop: "32px" }}>
          <ResultCard data={result} />

          <div style={{ marginTop: "16px" }}>
            <Link href="/history">📜 View saved history</Link>
          </div>
        </section>
      )}
    </main>
  );
}