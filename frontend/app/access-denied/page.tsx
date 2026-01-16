"use client";

import Link from "next/link";

export default function AccessDeniedPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: "460px",
          width: "100%",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "36px",
          textAlign: "center",
          boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
          border: "1px solid #e5e7eb",
        }}
      >
        {/* Icon */}
        <div
          style={{
            fontSize: "56px",
            marginBottom: "16px",
          }}
        >
          🚫
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 700,
            marginBottom: "10px",
            color: "#111827",
          }}
        >
          Access Denied
        </h1>

        {/* Message */}
        <p
          style={{
            fontSize: "15px",
            color: "#4b5563",
            marginBottom: "28px",
            lineHeight: 1.6,
          }}
        >
          You don’t have permission to access this page.
          <br />
          Please login with valid credentials to continue.
        </p>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link href="/login">
            <button
              style={{
                padding: "12px 20px",
                borderRadius: "10px",
                border: "none",
                background: "#2563eb",
                color: "#ffffff",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "15px",
              }}
            >
              🔐 Go to Login
            </button>
          </Link>

          <Link href="/">
            <button
              style={{
                padding: "12px 20px",
                borderRadius: "10px",
                border: "1px solid #d1d5db",
                background: "#ffffff",
                color: "#374151",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "15px",
              }}
            >
              🏠 Home
            </button>
          </Link>
        </div>

        {/* Footer hint */}
        <p
          style={{
            marginTop: "28px",
            fontSize: "12px",
            color: "#9ca3af",
          }}
        >
          Internal Website Intelligence Tool
        </p>
      </div>
    </main>
  );
}