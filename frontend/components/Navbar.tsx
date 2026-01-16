"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  function logout() {
    localStorage.removeItem("access_token");
    router.push("/login");
  }

  const navItem = (href: string, label: string, icon: string) => {
    const isActive = pathname === href;

    return (
      <Link
        href={href}
        style={{
          position: "relative",
          padding: "6px 2px",
          fontWeight: 500,
          color: isActive ? "#2563eb" : "#374151",
          textDecoration: "none",
        }}
      >
        {icon} {label}

        {/* Animated underline */}
        <span
          style={{
            position: "absolute",
            left: 0,
            bottom: "-6px",
            height: "2px",
            width: isActive ? "100%" : "0%",
            backgroundColor: "#2563eb",
            transition: "width 0.3s ease",
          }}
        />
      </Link>
    );
  };

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        gap: "28px",
        padding: "16px 32px",
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Brand */}
      <Link
        href="/"
        style={{
          fontWeight: 700,
          fontSize: "18px",
          color: "#111827",
          textDecoration: "none",
        }}
      >
        🧠 WebIntel
      </Link>

      {/* Nav Links */}
      {navItem("/dashboard", "Analyze", "🔍")}
      {navItem("/history", "History", "📜")}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Logout */}
      <button
        onClick={logout}
        style={{
          padding: "8px 16px",
          borderRadius: "10px",
          border: "1px solid #ef4444",
          background: "#fff",
          color: "#ef4444",
          cursor: "pointer",
          fontWeight: 600,
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "#fee2e2")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "#fff")
        }
      >
        🚪 Logout
      </button>
    </nav>
  );
}