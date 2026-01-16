"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Social = {
  platform: string;
  url: string;
};

type HistoryItem = {
  id: number;
  website: string;
  data: {
    company_name?: string;
    summary?: string;
    emails?: string[];
    phone_numbers?: string[];
    socials?: Social[];
    sources?: string[];
  };
  created_at: string;
};

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function handleLogout() {
    document.cookie = "access_token=; Max-Age=0; path=/";
    localStorage.removeItem("access_token");
    router.replace("/login");
  }

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }

    fetch("http://127.0.0.1:8000/history/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch history");
        return res.json();
      })
      .then(setHistory)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [router]);

  function toggleExpand(id: number) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <main style={{ padding: "32px", maxWidth: "900px", margin: "0 auto" }}>
      {/* Header / Navigation */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <nav>
          <a href="/" style={{ marginRight: "16px" }}>🏠 Home</a>
          <a href="/dashboard" style={{ marginRight: "16px" }}>📊 Analyze</a>
          <a href="/history">📜 History</a>
        </nav>

        {/* 🔥 LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 14px",
            borderRadius: "8px",
            border: "1px solid #ef4444",
            background: "#fff",
            color: "#ef4444",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          🚪 Logout
        </button>
      </header>

      <h1 style={{ marginBottom: "6px" }}>Analysis History</h1>
      <p style={{ color: "#555", marginBottom: "24px" }}>
        Previously analyzed websites stored in database
      </p>

      {loading && <p>Loading history...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && history.length === 0 && <p>No history found.</p>}

      {history.map((item) => {
        const isOpen = expandedId === item.id;
        const data = item.data || {};

        const companyName =
          data.company_name ||
          item.website.replace(/^https?:\/\//, "").split("/")[0];

        return (
          <div
            key={item.id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "16px",
              background: "#fff",
              boxShadow: isOpen
                ? "0 8px 20px rgba(0,0,0,0.08)"
                : "0 2px 6px rgba(0,0,0,0.04)",
              transition: "all 0.25s ease",
            }}
          >
            {/* Accordion Header */}
            <div
              onClick={() => toggleExpand(item.id)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <div>
                <h3 style={{ margin: 0 }}>{companyName}</h3>
                <small style={{ color: "#777" }}>
                  {new Date(item.created_at).toLocaleString()}
                </small>
              </div>

              <span style={{ fontSize: "20px" }}>
                {isOpen ? "▲" : "▼"}
              </span>
            </div>

            {/* Accordion Body */}
            <div
              style={{
                maxHeight: isOpen ? "1000px" : "0",
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? "translateY(0)" : "translateY(-6px)",
                overflow: "hidden",
                transition:
                "max-height 0.4s ease, opacity 0.25s ease, transform 0.25s ease",
               }}
            >
              {isOpen && (
                <div style={{ marginTop: "16px", lineHeight: 1.6 }}>
                  <p>
                    <strong>Website:</strong>{" "}
                    <a href={item.website} target="_blank" rel="noreferrer">
                      {item.website}
                    </a>
                  </p>

                  {data.summary && (
                    <p>
                      <strong>Summary:</strong><br />
                      {data.summary}
                    </p>
                  )}

                  {data.emails?.length && (
                    <p>
                      <strong>Emails:</strong><br />
                      {data.emails.join(", ")}
                    </p>
                  )}

                  {data.phone_numbers?.length && (
                    <p>
                      <strong>Phone Numbers:</strong><br />
                      {data.phone_numbers.join(", ")}
                    </p>
                  )}

                  {data.socials?.length && (
                    <div>
                      <strong>Social Links:</strong>
                      <ul>
                        {data.socials.map((s, idx) => (
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

                  {data.sources?.length && (
                    <div>
                      <strong>Sources:</strong>
                      <ul>
                        {data.sources.map((src, idx) => (
                          <li key={idx}>
                            <a href={src} target="_blank" rel="noreferrer">
                              {src}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </main>
  );
}