import Link from "next/link";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "48px 24px",
      }}
    >
      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
        }}
      >
        {/* HERO */}
        <section style={{ textAlign: "center", marginBottom: "56px" }}>
          <h1
            style={{
              fontSize: "40px",
              fontWeight: 800,
              marginBottom: "16px",
              color: "#111827",
            }}
          >
            Internal Website Intelligence Tool
          </h1>

          <p
            style={{
              fontSize: "18px",
              color: "#4b5563",
              maxWidth: "720px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            A secure internal AI-powered platform to analyze company websites,
            extract verified contact intelligence, and generate structured
            business insights — all stored with full historical traceability.
          </p>
        </section>

        {/* FEATURES */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
            marginBottom: "56px",
          }}
        >
          {[
            {
              title: "Secure Access",
              desc: "Authentication-protected internal usage. No public exposure.",
              icon: "🔐",
            },
            {
              title: "Website Intelligence",
              desc: "Scrapes websites and extracts emails, phones, and social links.",
              icon: "🌐",
            },
            {
              title: "AI-Powered Structuring",
              desc: "LLM-generated company summaries and structured JSON output.",
              icon: "🤖",
            },
            {
              title: "Historical Traceability",
              desc: "Every analysis is stored and can be reviewed anytime.",
              icon: "📜",
            },
          ].map((f, idx) => (
            <div
              key={idx}
              style={{
                background: "#ffffff",
                padding: "24px",
                borderRadius: "14px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
              }}
            >
              <h3 style={{ marginBottom: "8px", fontSize: "18px" }}>
                {f.icon} {f.title}
              </h3>
              <p style={{ color: "#555", fontSize: "14px", lineHeight: 1.5 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </section>

        {/* ACTIONS */}
        <section
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <Link href="/login">
            <button
              style={{
                padding: "14px 22px",
                fontSize: "16px",
                borderRadius: "10px",
                border: "none",
                background: "#2563eb",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              🔐 Login
            </button>
          </Link>

          <Link href="/dashboard">
            <button
              style={{
                padding: "14px 22px",
                fontSize: "16px",
                borderRadius: "10px",
                border: "1px solid #2563eb",
                background: "#fff",
                color: "#2563eb",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              📊 Analyze Website
            </button>
          </Link>

          <Link href="/history">
            <button
              style={{
                padding: "14px 22px",
                fontSize: "16px",
                borderRadius: "10px",
                border: "1px solid #d1d5db",
                background: "#f9fafb",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              📜 View History
            </button>
          </Link>
        </section>

        {/* FOOTER */}
        <footer
          style={{
            marginTop: "64px",
            textAlign: "center",
            fontSize: "13px",
            color: "#6b7280",
          }}
        >
          Built as an internal intelligence system using FastAPI, SQLAlchemy,
          Next.js, and LLMs.
        </footer>
      </div>
    </main>
  );
}